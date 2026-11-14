// O que as ferramentas dividem: os caminhos da pasta, como rodar um programa
// e como achar o vídeo que a pessoa pediu.
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const VIDEOS = path.join(RAIZ, 'videos');
export const PUBLICO = path.join(RAIZ, 'public');
export const PRONTOS = path.join(RAIZ, 'prontos');
export const NA_NUVEM = process.env.CLAUDE_CODE_REMOTE === 'true';

/** Para com uma mensagem simples, sem despejar erro técnico. */
export const parar = (msg) => {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
};

/** Roda um programa e devolve o que ele escreveu. `herdar` mostra a saída ao vivo. */
export const rodar = (cmd, args, {herdar = false, cwd = RAIZ, permitirErro = false} = {}) => {
  const r = spawnSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    stdio: herdar ? 'inherit' : 'pipe',
    maxBuffer: 64 * 1024 * 1024,
    env: {...process.env, TEMP: tmp(), TMP: tmp(), TMPDIR: tmp()},
  });
  if (r.status !== 0 && !permitirErro) {
    parar(`"${cmd} ${args.slice(0, 3).join(' ')}" falhou.\n${(r.stderr || r.stdout || '').trim().split('\n').slice(-12).join('\n')}`);
  }
  return {ok: r.status === 0, saida: `${r.stdout || ''}${r.stderr || ''}`};
};

/** Os temporários ficam dentro da pasta, nunca espalhados pelo computador. */
export const tmp = () => {
  const d = path.join(RAIZ, '.tmp');
  fs.mkdirSync(d, {recursive: true});
  return d;
};

// No Windows o npx é um arquivo .cmd, e o cmd parte o argumento em espaço, =, vírgula e ponto e vírgula.
// Com aspas ele chega inteiro. Nos outros sistemas não tem shell no meio, então vai como está.
const aspas = (s) => (process.platform === 'win32' && /[\s=,;&|<>^()]/.test(s) ? `"${s}"` : s);
export const npx = (args, opcoes) => rodar('npx', args.map(aspas), opcoes);
export const ffmpeg = (args, opcoes) => npx(['remotion', 'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', ...args], opcoes);

/** Quantos segundos tem um áudio ou vídeo. */
export const duracaoDe = (arquivo) => {
  const {saida} = npx(['remotion', 'ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arquivo]);
  const n = parseFloat(saida.trim().split('\n').pop());
  if (!Number.isFinite(n)) parar(`Não consegui medir a duração de ${path.basename(arquivo)}.`);
  return n;
};

/** Acha a pasta do vídeo pelo nome inteiro ou por um pedaço dele. */
export const acharVideo = (nome) => {
  if (!nome) parar('Diga qual vídeo. Ex.: node ferramentas/voz.mjs ciclo-da-agua');
  if (!fs.existsSync(VIDEOS)) parar('Ainda não existe nenhum vídeo. Crie um com: node ferramentas/novo-video.mjs <nome>');
  const todos = fs.readdirSync(VIDEOS).filter((d) => fs.statSync(path.join(VIDEOS, d)).isDirectory());
  const limpo = path.basename(nome.replace(/[\\/]+$/, ''));
  const achados = todos.filter((d) => d === limpo || d.includes(limpo));
  if (achados.length === 0) parar(`Não achei o vídeo "${nome}". Os que existem: ${todos.join(', ') || 'nenhum'}.`);
  if (achados.length > 1 && !achados.includes(limpo)) parar(`"${nome}" serve pra mais de um vídeo: ${achados.join(', ')}. Diga o nome inteiro.`);
  const pasta = achados.includes(limpo) ? limpo : achados[0];
  return {pasta, dir: path.join(VIDEOS, pasta), id: idDe(pasta)};
};

/** O nome da composição no Remotion: só letras, números e hífen. */
export const idDe = (pasta) => pasta.replace(/[^a-zA-Z0-9-]/g, '-');

/** Lê as opções da linha de comando: --chave valor ou --chave. */
export const opcoes = (argv = process.argv.slice(2)) => {
  const soltos = [];
  const op = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const k = argv[i].slice(2);
      const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      op[k] = v;
    } else soltos.push(argv[i]);
  }
  return {soltos, op};
};

/** Quantos processos o render pode usar sem travar o computador da pessoa. */
export const folego = () => Math.max(1, Math.min(4, Math.floor(os.cpus().length / 2)));

/** O Chrome que o render usa. Na nuvem já vem instalado; no computador o Remotion baixa o dele. */
export const chrome = () => (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH) ? ['--browser-executable', process.env.CHROME_PATH] : []);

/** Os estilos instalados: cada pasta de src/estilos/ com um index.tsx. */
export const listarEstilos = () => {
  const dir = path.join(RAIZ, 'src', 'estilos');
  return fs
    .readdirSync(dir)
    .filter((d) => fs.existsSync(path.join(dir, d, 'index.tsx')))
    .sort();
};

/** Refaz a lista de estilos que o motor enxerga (src/estilos.gerado.ts). */
export const registrarEstilos = () => {
  const ids = listarEstilos();
  const nome = (id) => `e_${id.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const linhas = [
    '// Arquivo gerado por ferramentas (não edite à mão): a lista dos estilos de src/estilos/.',
    ...ids.map((id) => `import * as ${nome(id)} from './estilos/${id}';`),
    '',
    'export const ESTILOS = [',
    ...ids.map((id) => `  {id: '${id}', tema: ${nome(id)}.tema, Exemplo: ${nome(id)}.Exemplo},`),
    '];',
    '',
  ];
  fs.writeFileSync(path.join(RAIZ, 'src', 'estilos.gerado.ts'), linhas.join('\n'));
  return ids;
};

/** Refaz a lista de vídeos que o motor enxerga (src/videos.gerado.ts). */
export const registrarVideos = () => {
  fs.mkdirSync(VIDEOS, {recursive: true});
  const pastas = fs
    .readdirSync(VIDEOS)
    .filter((d) => fs.existsSync(path.join(VIDEOS, d, 'video.tsx')) && fs.existsSync(path.join(VIDEOS, d, 'fala.json')))
    .sort();
  const linhas = [
    '// Arquivo gerado por ferramentas (não edite à mão): a lista dos vídeos da pasta videos/.',
    ...pastas.map((p, i) => `import * as v${i} from '../videos/${p}/video';`),
    "import type {VideoRegistrado} from './kit';",
    '',
    'export const VIDEOS: VideoRegistrado[] = [',
    ...pastas.map((p, i) => `  {id: '${idDe(p)}', pasta: '${p}', ...v${i}},`),
    '];',
    '',
  ];
  fs.writeFileSync(path.join(RAIZ, 'src', 'videos.gerado.ts'), linhas.join('\n'));
  return pastas;
};
