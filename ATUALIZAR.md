# Atualizar o animevocê

A pessoa pediu pra atualizar (ex.: "Claude, atualize o animevocê"). A atualização traz os estilos novos, o kit, as
ferramentas e as instruções mais recentes. **Nunca toca** em `videos/`, `prontos/`, `public/videos/` nem no `.env`.
Estilo que a própria pessoa criou também continua lá.

1. Diga em uma linha: "Vou atualizar o animevocê. Seus vídeos ficam como estão."
2. Se a pasta `ferramentas/` não tem o arquivo `atualizar.mjs` (versão antiga), baixe ele antes:
   `https://raw.githubusercontent.com/ojdvbrasil/animevoce-claude/main/ferramentas/atualizar.mjs`
   e salve em `ferramentas/atualizar.mjs`.
3. Rode, da raiz da pasta: `node ferramentas/atualizar.mjs`. Leva de 1 a 4 minutos.
4. Rode `npx tsc --noEmit -p .` pra conferir que tudo montou.
5. Na nuvem: grave a atualização no repositório da pessoa (commit e push), pra ela valer nas próximas sessões.
6. Conte o resultado em uma linha, com quantos estilos ela tem agora, e ofereça mostrar os novos
   (`estilos/INDICE.md`).

Se o download falhar, diga em uma frase que a internet bloqueou e peça pra tentar de novo mais tarde. Na nuvem, o
endereço `codeload.github.com` precisa estar liberado no acesso à rede do ambiente.
