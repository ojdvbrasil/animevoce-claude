---
name: novo-estilo
description: Cria um estilo de animação novo no animevocê, ou ajusta um que já existe. Use quando a pessoa disser "cria um estilo", "quero um estilo com a minha cara", "faz um estilo parecido com esse", "muda as cores desse estilo" ou mandar uma referência visual pedindo um estilo novo.
---

# Criar ou ajustar um estilo

Um estilo é uma pasta em `src/estilos/<id>/` com dois arquivos:
- `ficha.md`: a cara do estilo em palavras (o que o catálogo mostra e o que você lê antes de fazer um vídeo nele);
- `index.tsx`: o tema, as peças, alguns desenhos prontos e o exemplo.

O molde é o estilo `giz`. Leia `src/estilos/giz/index.tsx` e `src/estilos/giz/ficha.md` inteiros antes de começar:
o estilo novo tem as mesmas quatro partes, na mesma ordem.

## 1. Entender a cara

Pergunte (uma vez só) o que a pessoa ainda não disse: pra que tipo de vídeo é, que sensação passa, e se ela tem
cores ou uma referência. Se ela mandou uma imagem ou um vídeo de referência, descreva em palavras o que faz aquilo
ter aquela cara (fundo, traço, cor, letra, movimento) e **recrie o princípio com desenho próprio**: nunca copie
personagem, logotipo, marca ou ilustração de outra pessoa.

Feche numa frase, antes de escrever código: *"Estilo X: fundo tal, traço tal, tais cores, letra tal, move assim."*

## 2. Escrever o estilo

Escolha um `id` curto, em minúsculas e sem acento (`papel-recortado`). Em `src/estilos/<id>/index.tsx`:

1. **`tema`** (tipo `Tema`): `id`, `nome`, as cores, a `legenda` e o `Fundo`. A legenda precisa dar leitura em cima
   de qualquer cena do estilo: confira o contraste e use `sombra` quando o fundo varia.
2. **As peças:** o jeito do estilo pôr coisa na tela. No mínimo, uma peça de forma ou traço, uma de texto e uma
   transição entre cenas. O que dá a cara (grão, contorno, recorte, brilho) mora aqui, não em cada vídeo.
3. **Os desenhos prontos:** `Sol`, `Nuvem`, `Chuva`, `Mar` e `Planta`, feitos com as peças. Eles são o molde de
   como se desenha qualquer coisa nova no estilo.
4. **`Exemplo`:** a história-padrão (o ciclo da água, cinco cenas) contada no estilo, com
   `<Filme tema={tema} fala={FALA_EXEMPLO} cenas={cenasPorFrase(FALA_EXEMPLO, [...])} />`.

Regras:
- Fontes pelo `@remotion/google-fonts/<Nome>` (com `subsets: ['latin', 'latin-ext']`, por causa dos acentos).
- Tamanho sempre em proporção (`L`, `A`, `u` do `useTela()`), pra funcionar em pé e deitado.
- Tempo em segundos (`t`). Nada de `Math.random()` nem `Date`: use `acaso(semente)`.
- Todo `id` de filtro, gradiente ou recorte SVG leva o id do estilo na frente (`giz-mancha`), pra um estilo não
  pegar o filtro do outro.
- Nada de imagem, vídeo ou som baixado: o estilo é feito de código.

Depois escreva a `ficha.md`, com os mesmos campos da ficha do `giz`: as três linhas do topo (`**Tipo:**`,
`**Cara:**`, `**Bom pra:**`), "Como é", "As peças", "Pra desenhar coisa nova" e "Evite".

## 3. Conferir

1. `node ferramentas/estilos.mjs` (põe o estilo no catálogo).
2. `npx tsc --noEmit -p .` sem erro.
3. `node ferramentas/fotos.mjs --estilo <id> --cada 1` e **olhe a folha**: as cinco cenas aparecem, cada uma mostra
   o que a frase diz, a legenda dá pra ler, nada cortado, o estilo tem cara própria (não parece o `giz` de outra
   cor).
4. Mostre a folha pra pessoa e ajuste o que ela pedir.

## Ajustar um estilo que existe

Mude só o que foi pedido, no `index.tsx` do estilo, e atualize a `ficha.md` se a cara mudou. Se a pessoa quer uma
variação e quer manter o original, copie a pasta com outro `id` e mexa na cópia. Confira como no passo 3.
