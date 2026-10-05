// Zentrale Produktdaten – Preise, Texte und technische Details sind fiktiv (Prototyp).
import type { ImageMetadata } from 'astro';
import imgStandard from '../assets/images/press-standard.png';
import imgRustic from '../assets/images/press-rustic.png';
import imgPro from '../assets/images/press-pro.png';
// Standbilder der 3D-Modelle (npm run posters) – Platzhalter im 3D-Viewport, bis das Modell geladen ist
import renderStandard from '../assets/renders/press-standard.png';
import renderRustic from '../assets/renders/press-rustic.png';
import renderPro from '../assets/renders/press-pro.png';

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  name: string;
  shortName: string;
  sku: string;
  price: number;
  /** Streichpreis (optional) */
  compareAt?: number;
  tagline: string;
  category: string;
  summary: string;
  description: string[];
  highlights: { title: string; text: string }[];
  specs: Spec[];
  inBox: string[];
  model: string;
  image: ImageMetadata;
  imageAlt: string;
  render: ImageMetadata;
  /** Kamera-Startwinkel für den 3D-Viewer */
  orbit: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export const products: Product[] = [
  {
    slug: 'standard',
    name: 'PRESS Standard',
    shortName: 'Standard',
    sku: 'MP-STD-01',
    price: 129,
    tagline: 'Der Klassiker für jeden Morgen.',
    category: 'Hebel-Zitruspresse',
    summary:
      'Hebelpresse aus gebürstetem Edelstahl mit Sichtfenster und Tropfstopp – presst Orangen, Grapefruits und Zitronen in Sekunden.',
    description: [
      'Die PRESS Standard ist unsere Antwort auf die Frage, wie viel Technik frischer Saft wirklich braucht: einen soliden Hebel, eine präzise geführte Pressglocke und einen Presskegel, der jede Frucht bis zum letzten Tropfen ausnutzt.',
      'Durch das Sichtfenster siehst du jederzeit, wie viel Saft im Auffangbehälter ist. Der integrierte Tropfstopp hält die Arbeitsfläche sauber, sobald das Glas weg ist.',
    ],
    highlights: [
      { title: 'Bis zu 30 % mehr Saft', text: 'Die Hebelübersetzung erzeugt gleichmäßigen Druck – ganz ohne Kraftaufwand.' },
      { title: 'Sichtfenster & Tropfstopp', text: 'Füllstand immer im Blick, kein Nachtropfen auf die Arbeitsplatte.' },
      { title: 'Spülmaschinenfest', text: 'Presskegel, Sieb und Auffangschale lassen sich mit einem Handgriff abnehmen.' },
    ],
    specs: [
      { label: 'Bauart', value: 'Manuelle Hebelpresse' },
      { label: 'Geeignet für', value: 'Orangen, Grapefruits, Zitronen, Limetten, Granatäpfel' },
      { label: 'Material', value: 'Edelstahl 18/10, BPA-freier Kunststoff, Soft-Touch-Griff' },
      { label: 'Maße (H × B × T)', value: '35,4 × 16,4 × 20,6 cm' },
      { label: 'Gewicht', value: '3,2 kg' },
      { label: 'Auffangvolumen', value: '450 ml' },
      { label: 'Fruchtdurchmesser', value: 'bis 11 cm' },
      { label: 'Reinigung', value: 'Abnehmbare Teile spülmaschinenfest' },
      { label: 'Garantie', value: '5 Jahre' },
    ],
    inBox: ['PRESS Standard', 'Presskegel mit Sieb', 'Auffangschale', 'Kurzanleitung'],
    model: '/models/press_standard.glb',
    image: imgStandard,
    render: renderStandard,
    imageAlt: 'PRESS Standard aus Edelstahl presst eine Orange in eine Glaskaraffe',
    orbit: '35deg 75deg 105%',
    metaTitle: 'PRESS Standard – Hebel-Zitruspresse aus Edelstahl | MeinePRESSe',
    metaDescription:
      'PRESS Standard: manuelle Hebel-Zitruspresse aus Edelstahl mit Sichtfenster und Tropfstopp. Bis zu 30 % mehr Saft. Jetzt in 3D ansehen – 129 €, versandkostenfrei.',
    keywords: ['Zitruspresse', 'Hebelpresse', 'Orangenpresse Edelstahl', 'Saftpresse manuell'],
  },
  {
    slug: 'rustic',
    name: 'PRESS Rustic',
    shortName: 'Rustic',
    sku: 'MP-RUS-01',
    price: 249,
    tagline: 'Gusseisen. Gebaut für Generationen.',
    category: 'Gusseisen-Hebelpresse',
    summary:
      'Massive Hebelpresse aus Gusseisen im Manufaktur-Look – stark genug für Granatäpfel, standfest und ein Blickfang in jeder Küche.',
    description: [
      'Die PRESS Rustic ist aus schwerem Gusseisen gegossen und von Hand nachbearbeitet. Ihr Gewicht ist Absicht: Sie steht bombenfest, während der lange Hebel die Kraft sechsfach auf die Pressglocke überträgt.',
      'Jede Rustic trägt eine leicht unterschiedliche Patina – Spuren eines Fertigungsprozesses, der eher an eine Werkstatt als an eine Fabrik erinnert. Ersatzteile garantieren wir dir ein Leben lang.',
    ],
    highlights: [
      { title: '6-fache Hebelkraft', text: 'Der lange Hebel macht selbst Granatäpfel und dickschalige Grapefruits zum Kinderspiel.' },
      { title: 'Massives Gusseisen', text: '8,4 kg Standfestigkeit – nichts wackelt, nichts verrutscht.' },
      { title: 'Ersatzteile ein Leben lang', text: 'Bolzen, Glocke, Kegel: Alles ist einzeln austauschbar.' },
    ],
    specs: [
      { label: 'Bauart', value: 'Manuelle Hebelpresse' },
      { label: 'Geeignet für', value: 'Orangen, Grapefruits, Zitronen, Limetten, Granatäpfel' },
      { label: 'Material', value: 'Gusseisen, lebensmittelechte Pulverbeschichtung' },
      { label: 'Maße (H × B × T)', value: '35,4 × 15,1 × 20,0 cm' },
      { label: 'Gewicht', value: '8,4 kg' },
      { label: 'Hebelübersetzung', value: '6 : 1' },
      { label: 'Fruchtdurchmesser', value: 'bis 12 cm' },
      { label: 'Reinigung', value: 'Kegel und Schale abnehmbar, Handwäsche' },
      { label: 'Garantie', value: '10 Jahre, Ersatzteile lebenslang' },
    ],
    inBox: ['PRESS Rustic', 'Presskegel & Auffangschale', 'Pflegeöl (50 ml)', 'Pflegeanleitung'],
    model: '/models/press_rustic.glb',
    image: imgRustic,
    render: renderRustic,
    imageAlt: 'PRESS Rustic aus Gusseisen presst einen Granatapfel, daneben frische Granatäpfel',
    orbit: '35deg 75deg 105%',
    metaTitle: 'PRESS Rustic – Gusseisen-Saftpresse mit Hebel | MeinePRESSe',
    metaDescription:
      'PRESS Rustic: massive Gusseisen-Hebelpresse mit 6-facher Hebelkraft. Standfest, langlebig, Ersatzteile ein Leben lang. In 3D ansehen – 249 €, versandkostenfrei.',
    keywords: ['Gusseisen Saftpresse', 'Hebelpresse Gusseisen', 'Zitruspresse Retro', 'Orangenpresse'],
  },
  {
    slug: 'pro',
    name: 'PRESS Pro',
    shortName: 'Pro',
    sku: 'MP-PRO-01',
    price: 449,
    compareAt: 499,
    tagline: 'Slow Juicer für alles, was Saft hat.',
    category: 'Elektrischer Slow Juicer',
    summary:
      'Elektrische Schneckenpresse mit 45 U/min – presst Obst, Gemüse, Blattgrün und Nüsse schonend und nährstofferhaltend.',
    description: [
      'Die PRESS Pro arbeitet nach dem Kaltpress-Prinzip: Eine langsam rotierende Pressschnecke zerdrückt die Zutaten gegen ein feines Edelstahlsieb, statt sie zu zerschlagen. So bleibt der Saft kühl, schäumt kaum und behält Vitamine und Aroma.',
      'Der breite Einfüllschacht nimmt ganze Äpfel auf, der Drehregler bietet Vorwärts-, Stopp- und Rücklauf. Das Gehäuse aus Tritan und gebürstetem Stahl ist leise, robust und in Minuten gereinigt.',
    ],
    highlights: [
      { title: 'Kaltgepresst bei 45 U/min', text: 'Weniger Wärme, weniger Oxidation – mehr Geschmack und Nährstoffe.' },
      { title: 'Obst, Gemüse & Grünes', text: 'Von Apfel und Litschi über Karotte bis Weizengras und Mandelmilch.' },
      { title: 'Flüsterleise', text: 'Unter 55 dB – leiser als ein normales Gespräch.' },
    ],
    specs: [
      { label: 'Bauart', value: 'Elektrischer Slow Juicer (vertikale Pressschnecke)' },
      { label: 'Geeignet für', value: 'Obst, Gemüse, Blattgrün, Kräuter, Nüsse' },
      { label: 'Motorleistung', value: '200 W, bürstenloser DC-Motor' },
      { label: 'Drehzahl', value: '45 U/min' },
      { label: 'Einfüllschacht', value: 'Ø 8 cm (ganze Äpfel)' },
      { label: 'Saftbehälter', value: '1,0 l' },
      { label: 'Lautstärke', value: '< 55 dB' },
      { label: 'Material', value: 'Tritan (BPA-frei), gebürsteter Edelstahl, Edelstahlsieb' },
      { label: 'Maße (H × B × T)', value: '34,6 × 16,1 × 17,0 cm' },
      { label: 'Gewicht', value: '4,9 kg' },
      { label: 'Stromversorgung', value: '220–240 V, 50/60 Hz' },
      { label: 'Garantie', value: '10 Jahre auf den Motor, 3 Jahre auf das Gerät' },
    ],
    inBox: ['PRESS Pro', 'Saft- und Tresterbehälter', 'Feinsieb & Grobsieb', 'Stopfer', 'Reinigungsbürste', 'Rezeptheft'],
    model: '/models/press_pro.glb',
    image: imgPro,
    render: renderPro,
    imageAlt: 'Slow Juicer PRESS Pro mit Litschis im Einfüllschacht und frischem Saft in der Karaffe',
    orbit: '35deg 75deg 105%',
    metaTitle: 'PRESS Pro – Elektrischer Slow Juicer (45 U/min) | MeinePRESSe',
    metaDescription:
      'PRESS Pro: leiser Slow Juicer mit 45 U/min für Obst, Gemüse und Blattgrün. Kaltgepresst, nährstoffschonend, 10 Jahre Motorgarantie. In 3D ansehen – 449 €.',
    keywords: ['Slow Juicer', 'Entsafter elektrisch', 'Kaltpresse', 'Saftpresse elektrisch'],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug)!;

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

/** Für die Vergleichstabelle auf der Startseite */
export const comparison: { label: string; values: Record<string, string> }[] = [
  { label: 'Bauart', values: { standard: 'Hebel, manuell', rustic: 'Hebel, manuell', pro: 'Elektrisch, Schnecke' } },
  { label: 'Geeignet für', values: { standard: 'Zitrusfrüchte', rustic: 'Zitrusfrüchte', pro: 'Obst, Gemüse, Grünes' } },
  { label: 'Material', values: { standard: 'Edelstahl', rustic: 'Gusseisen', pro: 'Tritan & Edelstahl' } },
  { label: 'Gewicht', values: { standard: '3,2 kg', rustic: '8,4 kg', pro: '4,9 kg' } },
  { label: 'Garantie', values: { standard: '5 Jahre', rustic: '10 Jahre', pro: '10 Jahre Motor' } },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: 'Welche Saftpresse passt zu mir?',
    a: 'Für frischen Orangen- oder Grapefruitsaft am Morgen reicht eine Hebelpresse: die PRESS Standard als moderne Edelstahl-Variante oder die PRESS Rustic aus massivem Gusseisen. Wenn du auch Äpfel, Karotten, Ingwer oder Blattgrün entsaften willst, ist der Slow Juicer PRESS Pro die richtige Wahl.',
  },
  {
    q: 'Was ist der Unterschied zwischen Hebelpresse und Slow Juicer?',
    a: 'Eine Hebelpresse drückt halbierte Zitrusfrüchte mit Hebelkraft auf einen Presskegel – ganz ohne Strom. Ein Slow Juicer zerdrückt Obst und Gemüse mit einer langsam drehenden Schnecke gegen ein Sieb und trennt so Saft und Trester.',
  },
  {
    q: 'Wie lange dauert der Versand?',
    a: 'Alle Pressen sind ab Lager verfügbar und werden innerhalb von 1–3 Werktagen versandkostenfrei innerhalb Deutschlands geliefert.',
  },
  {
    q: 'Kann ich die Presse zurückgeben?',
    a: 'Ja. Du kannst jede Presse 30 Tage lang zu Hause testen und kostenlos zurückschicken, wenn sie dich nicht überzeugt.',
  },
  {
    q: 'Sind die Teile spülmaschinenfest?',
    a: 'Bei PRESS Standard und PRESS Pro sind alle abnehmbaren Teile spülmaschinenfest. Die gusseiserne PRESS Rustic reinigst du am besten von Hand und pflegst sie gelegentlich mit dem beiliegenden Öl.',
  },
];
