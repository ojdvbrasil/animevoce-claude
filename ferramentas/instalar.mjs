// Instala o animevocê dentro desta pasta. Nada se espalha pelo computador.
//
//   node ferramentas/instalar.mjs            instala o que faltar e confere
//   node ferramentas/instalar.mjs --conferir só confere se está tudo no lugar
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// este arquivo não usa o comum.mjs de propósito: ele roda antes de tudo estar instalado
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NA_NUVEM = process.env.CLAUDE_CODE_REMOTE === 'true';
const soConferir = process.argv.includes('--conferir');
const tmp = path.join(RAIZ, '.tmp');
fs.mkdirSync(tmp, {recursive: true});

const rodar = (cmd, args, mostrar = true) =>
  spawnSync(cmd, args, {
    cwd: RAIZ,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    stdio: mostrar ? 'inherit' : 'pipe',
    env: {...process.env, TEMP: tmp, TMP: tmp, TMPDIR: tmp, npm_config_cache: path.join(tmp, 'npm-cache'), npm_config_fund: 'false', npm_config_audit: 'false'},
  });
const parar = (msg) => {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
};
const passo = (n, texto) => console.log(`\n${n}. ${texto}`);

// 1. o Node
const maior = Number(process.versions.node.split('.')[0]);
if (maior < 20) parar(`O Node.js desta máquina é o ${process.versions.node}. O animevocê precisa do 20 ou mais novo.`);

// 2. as peças do motor
const temMotor = fs.existsSync(path.join(RAIZ, 'node_modules', 'remotion')) && fs.existsSync(path.join(RAIZ, 'node_modules', '@remotion', 'renderer'));
if (!temMotor) {
  if (soConferir) parar('O motor ainda não foi instalado. Rode: node ferramentas/instalar.mjs');
  passo(1, 'Baixando as peças do motor (leva de 1 a 4 minutos)...');
  const r = rodar('npm', ['ci']);
  if (r.status !== 0) parar('Não consegui baixar as peças do motor. Confira a internet e rode de novo.');
} else passo(1, 'As peças do motor já estão aqui.');

// 3. o navegador que desenha os quadros
const chromeDaMaquina = process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH);
if (chromeDaMaquina) passo(2, 'O navegador do render já vem nesta máquina.');
else {
  passo(2, 'Conferindo o navegador do render...');
  const r = rodar('npx', ['remotion', 'browser', 'ensure']);
  if (r.status !== 0) parar('Não consegui baixar o navegador do render. Confira a internet e rode de novo.');
}

// 4. as pastas de trabalho
for (const d of ['videos', 'prontos', 'public']) fs.mkdirSync(path.join(RAIZ, d), {recursive: true});

// 5. a prova: o motor enxerga os estilos e os vídeos
passo(3, 'Conferindo o motor...');
const {registrarEstilos, registrarVideos} = await import('./comum.mjs');
const estilos = registrarEstilos();
const videos = registrarVideos();
const args = ['remotion', 'compositions', 'src/index.ts', '-q'];
if (chromeDaMaquina) args.push('--browser-executable', process.env.CHROME_PATH);
const r = rodar('npx', args, false);
if (r.status !== 0) parar(`O motor não abriu:\n${(r.stderr || r.stdout || '').trim().split('\n').slice(-10).join('\n')}`);

// o Blender é opcional: só os estilos de 3D completo usam
const blender = spawnSync(process.platform === 'win32' ? 'where' : 'which', ['blender'], {encoding: 'utf8'});
const temBlender = blender.status === 0 && blender.stdout.trim().length > 0;

fs.rmSync(path.join(tmp, 'npm-cache'), {recursive: true, force: true});
console.log(`
✓ animevocê pronto${NA_NUVEM ? ' (na nuvem)' : ''}.
  ${estilos.length} estilos, ${videos.length} vídeo(s) na pasta.
  3D completo (Blender): ${temBlender ? 'disponível' : NA_NUVEM ? 'não funciona na nuvem, só no computador' : 'não instalado (opcional; os outros estilos funcionam sem ele)'}
`);
