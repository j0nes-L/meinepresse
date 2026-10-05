// Stellt den Meshopt-Decoder von three.js als klassisches Skript bereit (für komprimierte GLB-Modelle).
// <model-viewer> lädt ihn über ModelViewerElement.meshoptDecoderLocation – selbst gehostet statt CDN.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const src = readFileSync('node_modules/three/examples/jsm/libs/meshopt_decoder.module.js', 'utf8');
mkdirSync('public/decoders', { recursive: true });
writeFileSync('public/decoders/meshopt_decoder.js', src.replace(/^export \{ MeshoptDecoder \};\s*$/m, ''));
