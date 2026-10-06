// Lädt <model-viewer> (inkl. three.js) erst, wenn ein 3D-Modell wirklich gebraucht wird.
let loader: Promise<unknown> | undefined;
const loadModelViewer = () =>
  (loader ??= import('@google/model-viewer').then(({ ModelViewerElement }) => {
    // Modelle sind Meshopt-komprimiert → Decoder vom eigenen Server
    ModelViewerElement.meshoptDecoderLocation = '/decoders/meshopt_decoder.js';
  }));

interface Model {
  label: string;
  src: string;
  alt: string;
  orbit?: string;
}

/** Dauer der Ausblende-Animation (muss zur CSS-Transition passen) */
const FADE_MS = 300;

const BASE_ATTRS: Record<string, string> = {
  'camera-controls': '',
  'touch-action': 'pan-y',
  'auto-rotate': '',
  'auto-rotate-delay': '2500',
  'rotation-per-second': '16deg',
  'interaction-prompt': 'none',
  'shadow-intensity': '1',
  'shadow-softness': '0.9',
  exposure: '1.1',
  'tone-mapping': 'neutral',
  'environment-image': 'neutral',
  'min-camera-orbit': 'auto 20deg 0.35m',
  'max-camera-orbit': 'auto 95deg 1.4m',
  ar: '',
  'ar-modes': 'webxr scene-viewer quick-look',
};

const hasWebGL = (() => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
})();

type ModelViewer = HTMLElement & {
  jumpCameraToGoal(): void;
  resetTurntableRotation(theta?: number): void;
};

class Viewer {
  private mv?: ModelViewer;
  private current = 0;
  /** Zählt Ladeaufträge hoch – veraltete (z. B. nach schnellem Tab-Wechsel) werden verworfen */
  private request = 0;
  /** src, die gerade geladen wird */
  private inFlight?: string;
  /** Modell, dessen letzter Ladeversuch fehlgeschlagen ist */
  private failed?: string;
  private stage: HTMLElement;
  private ring: HTMLElement;
  private msg: HTMLElement;

  constructor(private host: HTMLElement, private models: Model[]) {
    this.stage = host.querySelector('.viewer-stage')!;
    this.ring = host.querySelector('.viewer-loader')!;
    this.msg = host.querySelector('.viewer-msg')!;
  }

  private setState(state: 'idle' | 'loading' | 'ready' | 'error' | 'unsupported') {
    this.host.dataset.state = state;
  }

  private setProgress(p: number) {
    this.host.style.setProperty('--progress', String(p));
    this.ring.setAttribute('aria-valuenow', String(Math.round(p * 100)));
  }

  private async ensureModelViewer() {
    if (this.mv) return this.mv;
    await loadModelViewer();
    const mv = document.createElement('model-viewer') as ModelViewer;
    for (const [k, v] of Object.entries(BASE_ATTRS)) mv.setAttribute(k, v);

    // Eigener Ladering statt der Standard-Fortschrittsleiste
    const noBar = document.createElement('div');
    noBar.slot = 'progress-bar';
    const ar = document.createElement('button');
    ar.slot = 'ar-button';
    ar.type = 'button';
    ar.className = 'btn btn-light viewer-ar';
    ar.textContent = 'In deinem Raum ansehen (AR)';
    mv.append(noBar, ar);

    mv.addEventListener('progress', (e) => this.setProgress((e as CustomEvent).detail.totalProgress));
    mv.addEventListener('load', () => {
      this.inFlight = undefined;
      if (this.loadedSrc() === this.models[this.current].src) this.reveal();
      else this.pump(); // inzwischen wurde ein anderes Modell gewählt
    });
    mv.addEventListener('error', () => {
      this.inFlight = undefined;
      this.failed = this.loadedSrc();
      if (this.failed !== this.models[this.current].src) return this.pump();
      this.msg.textContent = '3D-Modell konnte nicht geladen werden.';
      this.host.querySelector('.viewer-start-label')!.textContent = 'Erneut versuchen';
      this.setState('error');
    });

    // Kein Scroll-Hijacking: Mausrad scrollt die Seite, Zoom nur mit Strg/⌘ (Trackpad-Pinch sendet ctrlKey)
    this.host.addEventListener('wheel', (e) => !e.ctrlKey && !e.metaKey && e.stopPropagation(), { capture: true });

    this.stage.append(mv);
    this.mv = mv;
    return mv;
  }

  /** Blendet das aktuelle Modell aus, lädt das gewählte und blendet es nach dem Laden ein. */
  async show(index = this.current) {
    this.current = index;
    const req = ++this.request;
    const wasVisible = this.host.dataset.state === 'ready';

    this.setProgress(0);
    this.setState('loading');
    await this.ensureModelViewer();
    if (wasVisible) await new Promise((r) => setTimeout(r, FADE_MS));
    if (req !== this.request) return;
    this.pump();
  }

  /** Pfad des Modells im Viewer (ohne Cache-Buster) */
  private loadedSrc() {
    return this.mv?.getAttribute('src')?.split('?')[0];
  }

  /**
   * Startet den Ladevorgang für das gewählte Modell. Es läuft immer nur einer gleichzeitig –
   * wird währenddessen umgeschaltet, lädt der load-/error-Handler danach das neue Modell.
   */
  private pump() {
    const mv = this.mv!;
    const m = this.models[this.current];
    if (this.inFlight) return;
    if (this.loadedSrc() === m.src && this.failed !== m.src) return this.reveal(); // bereits geladen

    mv.setAttribute('alt', m.alt);
    mv.setAttribute('camera-orbit', m.orbit ?? '30deg 75deg auto');
    mv.setAttribute('camera-target', 'auto auto auto');
    // Nach einem Fehler mit Cache-Buster laden, sonst liefert der Loader-Cache den Fehler erneut
    const src = this.failed === m.src ? `${m.src}?retry=${Date.now()}` : m.src;
    this.failed = undefined;
    this.inFlight = src;
    mv.setAttribute('src', src);
  }

  private reveal() {
    const mv = this.mv!;
    mv.resetTurntableRotation(0);
    mv.jumpCameraToGoal();
    // Einen Frame warten, damit die Kamera steht, bevor das Modell einblendet
    requestAnimationFrame(() => {
      if (this.host.dataset.state === 'loading' && this.loadedSrc() === this.models[this.current].src) this.setState('ready');
    });
  }

  init() {
    if (!hasWebGL) {
      this.msg.textContent = 'Die 3D-Ansicht wird von diesem Browser nicht unterstützt.';
      this.setState('unsupported');
      return;
    }

    this.host.querySelectorAll('[data-viewer-start]').forEach((b) => b.addEventListener('click', () => this.show()));

    // Modellwechsel (3D-Showroom)
    const tabs = this.host.querySelectorAll<HTMLButtonElement>('[data-viewer-tab]');
    tabs.forEach((tab) =>
      tab.addEventListener('click', () => {
        const i = Number(tab.dataset.viewerTab);
        tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === tab)));
        if (this.host.dataset.state === 'idle') this.current = i;
        else if (i !== this.current || this.host.dataset.state === 'error') this.show(i);
      }),
    );

    // Automatisch laden, sobald der Viewer in die Nähe des sichtbaren Bereichs kommt –
    // im Datensparmodus erst per Klick
    if (navigator.connection?.saveData) {
      this.setState('idle');
      return;
    }
    this.setState('loading');
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        this.show();
      },
      { rootMargin: '200px' },
    );
    io.observe(this.host);
  }
}

export function initViewers() {
  for (const host of document.querySelectorAll<HTMLElement>('[data-viewer]:not([data-ready])')) {
    host.dataset.ready = '';
    new Viewer(host, JSON.parse(host.dataset.viewer!)).init();
  }
}

declare global {
  interface Navigator {
    connection?: { saveData?: boolean };
  }
}
