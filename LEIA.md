# animevocê

Você conta a ideia, o Claude anima. Esta pasta é o que o Claude usa pra transformar um pedido escrito em vídeo
animado pronto: ele escreve o roteiro, cuida da voz, desenha e anima as cenas, confere e entrega o arquivo.

## Como pedir um vídeo

Abra o Claude nesta pasta e escreva o que você quer, do seu jeito. Exemplos:

- *Faz um vídeo de 1 minuto sobre como o avião voa, no estilo Quadro de giz.*
- *Quero contar a história da invenção do relógio em 45 segundos. Escolhe um estilo que combine.*
- *Me mostra os estilos que você tem.*
- *Na cena 3, mostra o motor mais de perto.*
- *Refaz esse vídeo no formato deitado, pro YouTube.*

O Claude faz no máximo três perguntas (assunto, estilo e voz), mostra o roteiro pra você aprovar e depois entrega o
vídeo na pasta **`prontos/`**. Cada ajuste vira uma versão nova (`-v2`, `-v3`...), e a anterior continua lá.

## A voz

| Caminho | Custo | Como é |
|---|---|---|
| Sem narração | nada | a legenda conta a história; é o padrão |
| A sua voz | nada | você grava no celular lendo o roteiro, com uma pausa curta entre as frases, e manda o áudio |
| Voz de IA | créditos na kie.ai | você cria a conta, põe a chave no arquivo `.env` e o Claude gera a narração |

Pra voz de IA, crie um arquivo chamado `.env` nesta pasta com uma linha: `KIE_API_KEY=sua-chave`.
Esse arquivo fica só no seu computador.

## Os estilos

O catálogo está em [`estilos/INDICE.md`](estilos/INDICE.md). Cada estilo tem um exemplo que conta a mesma história
curta, pra você comparar. Peça *"me mostra o estilo X"* e o Claude tira as fotos dele.

- **2D:** desenho plano.
- **3D leve:** tem profundidade e sai direto do motor. Funciona em qualquer lugar.
- **3D completo:** usa o Blender, que é gratuito. Só funciona no computador (veja `blender/GUIA.md`).

## No computador e na nuvem

- **No computador** (app do Claude ou VS Code): mais rápido, e o 3D completo funciona.
- **Na nuvem** (claude.ai/code ou a aba Code do app no celular): não precisa de computador. O render demora um pouco
  mais, o 3D completo não funciona, e a cada sessão nova o Claude reinstala o motor sozinho (de 1 a 4 minutos).

## O que você precisa

- O Claude num plano pago (o Pro já serve). A assinatura é separada e não vem com o animevocê.
- No computador: o Node.js 20 ou mais novo, que o Claude instala pra você com a sua licença, e uns 3 GB livres.

## Sobre o motor

O animevocê monta os vídeos com o [Remotion](https://www.remotion.dev). Ele é gratuito pra pessoas e pra empresas
de até 3 funcionários; empresas maiores precisam da licença deles (remotion.dev/license).

As fontes são baixadas do Google Fonts na hora do render, então é preciso estar com internet.
