// Renderiza o vídeo inteiro e entrega em prontos/, numerando as versões:
// prontos/<video>-v1.mp4, -v2.mp4... Uma versão nunca apaga a anterior.
//
//   node ferramentas/render.mjs <video>
//   node ferramentas/render.mjs --estilo giz        o exemplo de um estilo (vai pra estilos/exemplos/)
import fs from 'node:fs';
import path from 'node:path';
import {NA_NUVEM, PRONTOS, RAIZ, acharVideo, chrome, duracaoDe, folego, listarEstilos, npx, opcoes, parar, registrarEstilos, registrarVideos} from './comum.mjs';

const {soltos, op} = opcoes();
registrarEstilos();
registrarVideos();

let id, destino;
if (op.estilo) {
  if (!listarEstilos().includes(op.estilo)) parar(`Não existe o estilo "${op.estilo}".`);
  id = `estilo-${op.estilo}`;
  const dir = path.join(RAIZ, 'estilos', 'exemplos');
  fs.mkdirSync(dir, {recursive: true});
  destino = path.join(dir, `${op.estilo}.mp4`);
} else {
  const v = acharVideo(soltos[0]);
  if (!fs.existsSync(path.join(v.dir, 'video.tsx'))) parar(`O vídeo ${v.pasta} ainda não tem o video.tsx (as cenas).`);
  id = v.id;
  fs.mkdirSync(PRONTOS, {recursive: true});
  let n = 1;
  while (fs.existsSync(path.join(PRONTOS, `${v.pasta}-v${n}.mp4`))) n++;
  destino = path.join(PRONTOS, `${v.pasta}-v${n}.mp4`);
}

console.log(`Renderizando ${id}${NA_NUVEM ? ' (na nuvem, sem placa de vídeo: demora mais)' : ''}...`);
npx(
  ['remotion', 'render', 'src/index.ts', id, destino, `--concurrency=${folego()}`, '--crf=20', '--audio-bitrate=192k', ...chrome()],
  {herdar: true}
);
if (!fs.existsSync(destino)) parar('O render terminou, mas o arquivo não apareceu. Rode de novo.');
const mb = fs.statSync(destino).size / 1024 / 1024;
console.log(`\n✓ ${path.relative(RAIZ, destino)}  (${duracaoDe(destino).toFixed(1)} s, ${mb.toFixed(1)} MB)`);
