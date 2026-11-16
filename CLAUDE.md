# animevocê: instruções pro assistente

Esta pasta é o **animevocê**: a pessoa conta uma ideia e você entrega um vídeo animado pronto, em 2D ou 3D.
Você escreve o roteiro, cuida da voz, desenha e anima as cenas em código (Remotion), confere e renderiza.

**Quem está do outro lado não é técnico.** Fale em português simples, uma coisa por vez. Nunca mostre erro de
programa, nome de arquivo de código ou termo técnico sem necessidade. Diga o que está fazendo em uma linha, faça, e
mostre o resultado. Quando algo falhar, explique em uma frase e tente o caminho alternativo.

## Antes de tudo

1. Se a pasta `node_modules/` não existe, o motor não está instalado: rode `node ferramentas/instalar.mjs` (na nuvem
   isso acontece a cada sessão nova, é normal; leva de 1 a 4 minutos). Se nem a pasta `ferramentas/` existe, siga o
   `PREPARAR.md`.
2. Todo comando roda da raiz desta pasta. Tudo fica aqui dentro: nada é instalado nem gravado fora dela.
3. Se a pessoa pedir pra atualizar o animevocê, siga o `ATUALIZAR.md`.
4. Na nuvem (a variável `CLAUDE_CODE_REMOTE` vale `true`) leia também a seção "Na nuvem", no fim.

## O caminho de um vídeo

Do pedido ao arquivo pronto são seis passos. Não pule nenhum, e não peça aprovação a cada um: só pare pra perguntar
o que está marcado como pergunta.

### 1. Entender o pedido (no máximo três perguntas, de uma vez)
Você precisa de: **o assunto**, **o estilo** e **a voz**. Pergunte só o que a pessoa não disse.
- **Estilo:** se ela não escolheu, sugira dois ou três do `estilos/INDICE.md` que combinam com o assunto, dizendo a
  cara de cada um em uma frase. Na dúvida, escolha você e avise.
- **Voz:** três caminhos (detalhe em "A voz"): sem narração, a voz dela gravada, ou voz de IA paga.
  Se ela não disse nada, faça **sem narração** e avise que dá pra pôr voz depois.
- **Formato:** vertical (Reels, Shorts, TikTok) é o padrão. Horizontal é pra YouTube. Só pergunte se o pedido deixar
  dúvida.
- **Duração:** de 30 a 60 segundos é o padrão. Cada 10 segundos são umas 28 palavras de fala.

### 2. Roteiro
`node ferramentas/novo-video.mjs <nome-curto> --estilo <id> [--formato horizontal]` cria `videos/<data>-<nome>/roteiro.md`.
Preencha as três seções:
- **Ideia:** o que a pessoa que assiste vai entender ou sentir no fim.
- **Fala:** uma frase por linha. Regras na seção "Como escrever a fala".
- **Cenas:** a tabela que diz quais frases cada cena cobre (contando do 0) e o que a tela mostra.

Se o assunto tem fato, número, data ou nome, **confira antes de escrever** (busque na internet quando puder) e
nunca invente. Sem como conferir, diga isso à pessoa e escreva só o que é seguro.

Mostre o roteiro pra pessoa em texto corrido, sem a tabela, e pergunte se pode seguir. **Esta é a única aprovação
obrigatória antes do vídeo pronto.**

### 3. Voz
`node ferramentas/voz.mjs <nome>` (com o motor escolhido) escreve o `fala.json`: o tempo de cada frase e de cada
palavra. É ele que amarra as cenas e a legenda. Mudou a fala? Rode a voz de novo antes de mexer nas cenas.

### 4. Cenas
Escreva `videos/<pasta>/video.tsx`. Leia antes, nesta ordem:
- `src/estilos/<id>/ficha.md` (a cara do estilo e o que evitar) e `src/estilos/<id>/index.tsx` (as peças);
- `videos/exemplo-ciclo-da-agua/video.tsx`, o vídeo de exemplo, que mostra a montagem inteira.

O `video.tsx` exporta sempre três coisas: `fala` (o `fala.json`), `formato` e `Video` (um `<Filme>`).
Regras na seção "Como fazer as cenas".

### 5. Conferir (sempre, antes de renderizar)
1. `npx tsc --noEmit -p .` precisa passar sem erro.
2. `node ferramentas/fotos.mjs <nome>` tira uma folha com um quadro a cada 2 segundos. **Abra a imagem e olhe.**
   Passe a lista da seção "O que olhar nas fotos". Achou defeito? Corrija e tire as fotos de novo. Quadro que
   merece ver de perto: `node ferramentas/fotos.mjs <nome> 12.5 20` (em tamanho cheio).
3. Só renderize quando as fotos estiverem boas. Render é a parte demorada: não use ele pra testar.

### 6. Renderizar e entregar
`node ferramentas/render.mjs <nome>` grava `prontos/<pasta>-v1.mp4` (a próxima versão vira `-v2`, e assim por diante;
uma versão nunca apaga a outra). Diga à pessoa onde o vídeo está, em uma linha, e o que ela pode pedir agora:
trocar uma cena, mudar a fala, pôr voz, tentar outro estilo.

**Pedido de ajuste:** mexa só no que foi pedido, tire as fotos do trecho, renderize e entregue a versão nova.
Não refaça o vídeo inteiro por causa de uma cena.

## Como escrever a fala

- **A primeira frase é o gancho.** Um fato concreto que surpreende ou uma pergunta que a pessoa quer ver respondida.
  Nada de "você sabia que", "hoje vamos falar sobre" ou cumprimento.
- **Fala de gente.** Frase que uma pessoa diria em voz alta contando pra um amigo. Cada frase puxa a próxima.
  Nada de frase solta de efeito, lista de adjetivos ou tom de manual.
- **Uma ideia por frase**, de 6 a 16 palavras. Frase maior que isso, quebre em duas linhas.
- **Concreto.** Nome, número, comparação com coisa do dia a dia. "Pesa o mesmo que três elefantes" diz mais que
  "é muito pesado".
- **Tudo que entra serve à ideia.** Dado curioso que não ajuda a entender o assunto sai.
- **O fim fecha.** A última frase responde o gancho ou devolve a pessoa pro começo. Não termine pedindo like.
- **Nunca prometa** resultado, dinheiro, cura ou fama, e nunca invente fato, número, fala ou fonte.

## Como fazer as cenas

O kit está em `src/kit/` (importe tudo de `../../src/kit`). O que você mais usa:

| Peça | Pra quê |
|---|---|
| `Filme`, `cenasPorFrase` | monta o vídeo: `cenasPorFrase(fala, [[0, 1, CenaA], [2, 2, CenaB]])` liga cada cena às frases que ela cobre |
| `PropsCena` | o que a cena recebe: `t` (segundos desde que ela começou), `dur`, `tv` (segundo do vídeo) e `fala` |
| `ramp(t, a, b)` | vai de 0 a 1 entre os segundos `a` e `b`: é a base de toda animação |
| `quando(fala, 'palavra', frase)` | o segundo em que uma palavra é dita, pra coisa aparecer na hora certa |
| `Tela`, `useTela` | a tela de desenho (SVG) e o tamanho dela: `L`, `A`, `cx`, `cy` e a unidade `u` |
| `Traco`, `caminho`, `tremer`, `circulo`, `emFila` | o traço que se desenha e as formas |
| `Camera` | mover, aproximar e girar a cena |
| `Palco3D`, `Plano` | profundidade sem programa de 3D (camadas em perspectiva) |
| `balanco`, `acaso`, `chaves`, `janela` | vida (respiração, vento), acaso que se repete, valores por pontos no tempo |

Regras que valem em todo estilo:

1. **A tela mostra o que a frase diz.** Falou em chuva, chove. Se a pessoa assistir sem som, ela entende a história.
2. **A cena muda quando o assunto muda.** Uma cena não passa de uns 8 segundos sem acontecer algo novo nela.
3. **Sempre tem movimento.** Nada fica parado mais de 2 segundos: algo se desenha, cresce, anda ou respira.
   Coisa nova aparece na palavra que fala dela (use `quando`).
4. **O vídeo abre com imagem.** No segundo 0 já tem algo na tela. Nunca comece com tela vazia nem só com fundo.
5. **Tempo em segundos, sempre.** As cenas usam `t`, nunca número de quadro. Nada de `Math.random()` nem de
   `Date`: use `acaso(semente)`, senão cada quadro sai diferente e o vídeo pisca.
6. **Tamanho em proporção.** Posicione com `L`, `A` e `u` do `useTela()`, nunca com número solto de pixel, pra o
   mesmo vídeo funcionar em pé e deitado.
7. **Área segura.** Nada importante a menos de 6% das bordas. No vertical, a faixa de 62% a 82% da altura é da
   legenda: não ponha texto nem o assunto principal ali. O último quinto de baixo é coberto pelos botões das redes.
8. **Texto na tela:** curto (até 5 palavras), grande (nunca abaixo de 56 numa tela de 1080) e fica o tempo de ler:
   1 segundo mais 1 segundo a cada 3 palavras. Não repita na tela a frase inteira que a legenda já mostra; se a
   frase está escrita na cena, desligue a legenda naquele trecho (`semLegenda`).
9. **O estilo manda na cara.** Cor, traço, letra e transição vêm das peças e do `tema` do estilo. Não misture dois
   estilos no mesmo vídeo, e não troque as cores do estilo sem a pessoa pedir.
10. **Desenho novo segue o molde.** Objeto que o estilo não tem pronto você desenha do mesmo jeito que os desenhos
    prontos dele (leia como o `Sol` ou a `Nuvem` do estilo foram feitos). Simples e reconhecível vence detalhado.
11. **Nada de terceiros.** Não desenhe personagem, logotipo ou marca que já existe, nem pessoa real. Gente aparece
    como figura simples do estilo. Não use imagem, música ou vídeo baixado sem a pessoa ter fornecido.
12. **Trilha e efeito sonoro** só se a pessoa mandar o arquivo: coloque em `public/videos/<pasta>/` e passe no
    `trilha` do `Filme`. O animevocê não baixa nem gera música.

## O que olhar nas fotos

- O primeiro quadro tem imagem, não tela vazia.
- Cada foto mostra o que a frase daquele momento diz. Duas fotos seguidas iguais são sinal de cena parada.
- Nada cortado na borda, nada em cima da legenda, nenhum texto atravessando outro.
- Todo texto dá pra ler na miniatura. Se não dá na miniatura, não dá no celular.
- A legenda aparece inteira, com contraste, e não cobre o assunto.
- As cores são as do estilo. Nada estourado de branco nem escuro demais.
- A última foto fecha a história (não acaba no meio de um movimento).

## A voz

| Caminho | Como | Quando |
|---|---|---|
| **Sem narração** | `node ferramentas/voz.mjs <nome>` | o padrão. A legenda conta a história e o tempo sai do tempo de leitura |
| **A voz da pessoa** | `node ferramentas/voz.mjs <nome> --motor arquivo --audio <arquivo>` | ela grava no celular lendo a seção "Fala" e manda o áudio |
| **Voz de IA (paga)** | `node ferramentas/voz.mjs <nome> --motor kie [--voz Puck]` | ela tem conta na kie.ai e pôs a chave no arquivo `.env` |

- **A voz da pessoa:** peça pra ela gravar num lugar silencioso, com o celular perto da boca, lendo as frases na
  ordem e fazendo **uma pausa curta entre uma frase e outra** (é pela pausa que a ferramenta acha onde cada frase
  começa). Qualquer formato de áudio serve. Depois de rodar, confira na lista que a ferramenta imprime se o tempo
  de cada frase faz sentido; se uma frase ficou com tempo absurdo, peça uma gravação com as pausas mais marcadas.
- **Voz de IA:** a chave fica em `.env` (`KIE_API_KEY=...`), que nunca vai pro repositório. Cada geração gasta
  créditos da conta dela na kie.ai: avise antes de gerar e gere uma vez só por versão da fala. Nunca peça a chave
  pela conversa nem escreva ela em outro arquivo: diga onde colar.
- Nunca diga que a voz é de uma pessoa real, e não imite a voz de ninguém.

## 3D

- **3D leve** (marcado no `estilos/INDICE.md`): profundidade feita no próprio motor, com `Palco3D` e `Plano`.
  Funciona em qualquer lugar, inclusive na nuvem.
- **3D completo (Blender):** só no computador, com o Blender instalado. O passo a passo está em `blender/GUIA.md`.
  Na nuvem não funciona: ofereça um estilo de 3D leve no lugar.

## Onde fica cada coisa

```
CLAUDE.md, LEIA.md, PREPARAR.md   as instruções
estilos/INDICE.md                 o catálogo dos estilos
src/kit/                          o kit de animação (tempo, cenas, legenda, desenho, câmera)
src/estilos/<id>/                 cada estilo: ficha.md (a cara) e index.tsx (as peças e o exemplo)
ferramentas/                      novo-video, voz, fotos, render, estilos, instalar
videos/<data>-<nome>/             cada vídeo: roteiro.md, fala.json, video.tsx, fotos/
public/videos/<pasta>/            o áudio de cada vídeo (voz e trilha)
prontos/                          os vídeos finais
blender/                          o 3D completo
```

- Estilo novo ou ajuste de estilo: siga a skill `novo-estilo`. Depois rode `node ferramentas/estilos.mjs`.
- Os arquivos `src/*.gerado.ts` são escritos pelas ferramentas. Não edite à mão.
- Nunca apague vídeo, roteiro ou versão pronta sem a pessoa pedir.

## Na nuvem

Aqui você trabalha num computador da Anthropic, não no da pessoa, e ela costuma estar no celular.
- **A cada sessão nova** o computador começa limpo: rode `node ferramentas/instalar.mjs` antes de tudo.
- **Não tem placa de vídeo:** o render demora mais. Avise que leva alguns minutos e siga.
- **A voz da pessoa** chega como anexo na conversa. Salve o áudio na pasta do vídeo antes de rodar a voz.
- **A internet é restrita.** A voz de IA da kie.ai só funciona se o ambiente liberar o endereço `api.kie.ai`
  (Configurações do ambiente > Acesso à rede > Domínios permitidos). Se estiver bloqueado, explique isso em uma
  frase e ofereça a voz gravada ou o vídeo sem narração.
- **Entrega:** mande o vídeo pronto pra pessoa pela conversa, como arquivo. Depois grave o trabalho no repositório
  dela (commit e push de `videos/`, `public/videos/` e `prontos/`), pra nada se perder quando a sessão acabar.
  Diga em uma linha onde o vídeo ficou.
- **Blender não funciona aqui.** Ofereça um estilo de 3D leve.

## Se der errado

| O que aconteceu | O que fazer |
|---|---|
| "O motor ainda não foi instalado" ou falta `node_modules` | `node ferramentas/instalar.mjs` |
| As fotos ou o render dizem que o código não montou | rode `npx tsc --noEmit -p .`, corrija o erro que ele aponta e tente de novo |
| O vídeo pisca ou muda sozinho de um quadro pro outro | tem `Math.random()`, `Date` ou estado no código: troque por `acaso()` e por valores calculados de `t` |
| A legenda está fora de hora | a fala mudou depois da voz: rode a voz de novo |
| Uma letra não aparece ou sai com outra cara | a fonte do estilo não carregou: confira a internet e tire a foto de novo |
| O render parou no meio | rode de novo: ele recomeça sozinho. Na nuvem, se a sessão caiu, reinstale antes |
