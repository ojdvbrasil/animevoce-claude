// Traz a versão mais nova do animevocê (estilos, kit, ferramentas e instruções)
// sem tocar no que é da pessoa: videos/, prontos/, public/videos/ e .env.
//
//   node ferramentas/atualizar.mjs
import fs from 'node:fs';
import path from 'node:path';
import {RAIZ, parar, rodar, tmp} from './comum.mjs';

const PACOTE = 'https://codeload.github.com/ojdvbrasil/animevoce-claude/tar.gz/refs/heads/main';

// O que é do sistema e pode ser trocado. Todo o resto fica como está.
const DO_SISTEMA = [
  'CLAUDE.md', 'LEIA.md', 'PREPARAR.md', 'ATUALIZAR.md', 'AGENTS.md',
  'package.json', 'package-lock.json', 'remotion.config.ts', 'tsconfig.json', '.gitignore',
  'src/kit', 'src/estilos', 'src/index.ts', 'src/Raiz.tsx',
  'ferramentas', 'blender', 'estilos/INDICE.md', '.claude/skills',
  'videos/exemplo-ciclo-da-agua',
];

const contarEstilos = () =>
  fs.existsSync(path.join(RAIZ, 'src/estilos'))
    ? fs.readdirSync(path.join(RAIZ, 'src/estilos')).filter((d) => fs.existsSync(path.join(RAIZ, 'src/estilos', d, 'ficha.md'))).length
    : 0;

const antes = contarEstilos();
const lerPacote = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');
const pacoteAntes = lerPacote(path.join(RAIZ, 'package.json')) + lerPacote(path.join(RAIZ, 'package-lock.json'));

console.log('→ Baixando a versão nova do animevocê…');
const r = await fetch(PACOTE).catch(() => null);
if (!r || !r.ok) parar('Não consegui baixar a atualização. Confira a internet e tente de novo.');

const pasta = fs.mkdtempSync(path.join(tmp(), 'atualizar-'));
const arquivo = path.join(pasta, 'novo.tar.gz');
fs.writeFileSync(arquivo, Buffer.from(await r.arrayBuffer()));
rodar('tar', ['-xzf', 'novo.tar.gz'], {cwd: pasta});
const novo = fs.readdirSync(pasta).map((d) => path.join(pasta, d)).find((d) => fs.statSync(d).isDirectory());
if (!novo || !fs.existsSync(path.join(novo, 'src/kit'))) parar('A atualização veio incompleta. Tente de novo em alguns minutos.');

console.log('→ Trocando as partes do sistema (seus vídeos ficam intactos)…');
for (const item of DO_SISTEMA) {
  const de = path.join(novo, item);
  if (!fs.existsSync(de)) continue;
  // Pastas do sistema são somadas por cima: estilo que a própria pessoa criou continua lá.
  fs.cpSync(de, path.join(RAIZ, item), {recursive: true, force: true});
}
fs.rmSync(pasta, {recursive: true, force: true});

const pacoteDepois = lerPacote(path.join(RAIZ, 'package.json')) + lerPacote(path.join(RAIZ, 'package-lock.json'));
if (pacoteDepois !== pacoteAntes || !fs.existsSync(path.join(RAIZ, 'node_modules'))) {
  console.log('→ O motor mudou, instalando a parte nova…');
  rodar('node', ['ferramentas/instalar.mjs'], {herdar: true});
}
rodar('node', ['ferramentas/estilos.mjs'], {herdar: true});

const depois = contarEstilos();
console.log(`\n✓ animevocê atualizado. Estilos: ${antes} → ${depois}.`);
