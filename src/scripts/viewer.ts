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

function applyModel(mv: HTMLElement, m: Model) {
  mv.setAttribute('src', m.src);
  mv.setAttribute('alt', m.alt);
  mv.setAttribute('camera-orbit', m.orbit ?? '30deg 75deg auto');
  mv.setAttribute('camera-target', 'auto auto auto');
}

// getModel wird erst nach dem Laden ausgewertet – so gilt ein zwischenzeitlicher Tab-Wechsel
async function mount(host: HTMLElement, getModel: () => Model) {
  if (host.querySelector('model-viewer')) return;
  host.classList.add('is-loading');
  await loadModelViewer();

  const mv = document.createElement('model-viewer');
  for (const [k, v] of Object.entries(BASE_ATTRS)) mv.setAttribute(k, v);
  applyModel(mv, getModel());

  const ar = document.createElement('button');
  ar.slot = 'ar-button';
  ar.type = 'button';
  ar.className = 'btn btn-light viewer-ar';
  ar.textContent = 'In deinem Raum ansehen (AR)';
  mv.append(ar);

  // Das Produktfoto bleibt sichtbar, bis das Modell gerendert ist (bzw. bei Fehlern stehen)
  mv.addEventListener('load', () => {
    host.classList.remove('is-loading', 'is-error');
    host.classList.add('is-3d');
  });
  mv.addEventListener('error', () => {
    host.classList.remove('is-loading', 'is-3d');
    host.classList.add('is-error');
    mv.remove(); // „In 3D ansehen“ erlaubt einen neuen Versuch
  });
  // Kein Scroll-Hijacking: Mausrad scrollt die Seite, Zoom nur mit Strg/⌘ (Trackpad-Pinch sendet ctrlKey)
  host.addEventListener(
    'wheel',
    (e) => {
      if (!e.ctrlKey && !e.metaKey) e.stopPropagation();
    },
    { capture: true },
  );
  host.querySelector('.viewer-stage')!.append(mv);
}

// Ohne WebGL bleibt es beim Produktfoto
const hasWebGL = (() => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
})();

export function initViewers() {
  for (const host of document.querySelectorAll<HTMLElement>('[data-viewer]:not([data-ready])')) {
    host.dataset.ready = '';
    if (!hasWebGL) host.classList.add('no-3d');
    const models = JSON.parse(host.dataset.viewer!) as Model[];
    let current = 0;

    const start = () => hasWebGL && mount(host, () => models[current]);
    host.querySelector('[data-viewer-start]')?.addEventListener('click', start);

    // Modellwechsel (3D-Showroom auf der Startseite)
    const tabs = host.querySelectorAll<HTMLButtonElement>('[data-viewer-tab]');
    tabs.forEach((tab) =>
      tab.addEventListener('click', () => {
        current = Number(tab.dataset.viewerTab);
        tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === tab)));
        host.querySelectorAll<HTMLElement>('.viewer-poster').forEach((img) => {
          img.hidden = Number(img.dataset.index) !== current;
        });
        const mv = host.querySelector('model-viewer');
        if (mv) {
          host.classList.remove('is-3d', 'is-error');
          host.classList.add('is-loading');
          applyModel(mv, models[current]);
        }
      }),
    );

    // Produktseiten: auf Desktop automatisch laden, sobald sichtbar. Auf Touch-Geräten und im
    // Datensparmodus erst per Tipp – spart Datenvolumen (bis 1 MB) und hält die Seite reaktionsschnell.
    const autoload =
      hasWebGL && host.hasAttribute('data-autoload') && !navigator.connection?.saveData &&
      matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (autoload) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
          idle(() => start());
        }
      });
      io.observe(host);
    }
  }
}

declare global {
  interface Navigator {
    connection?: { saveData?: boolean };
  }
}
