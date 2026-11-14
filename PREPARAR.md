# Preparar o animevocê

**Pra você, que comprou:** não precisa baixar nem copiar nada à mão. A frase que você recebeu faz o Claude ler esta
página e instalar tudo sozinho. Leva de 5 a 15 minutos, conforme a internet, e é uma vez só.

---

## Pro assistente: o que fazer

Quem pediu isto não é programador. Fale em português simples, um passo por vez, dizendo o que vai fazer antes de
fazer. Peça licença antes de instalar qualquer programa no computador. Se algo falhar, explique em uma frase e tente
o caminho alternativo; não mostre erro técnico.

Primeiro descubra onde você está:
- **A pasta atual já tem `ferramentas/instalar.mjs`?** Então o animevocê já está aqui (a pessoa criou o repositório
  dela a partir do modelo, que é o caminho da nuvem). Pule pro passo 3.
- **Não tem?** Siga do passo 1.

### 1. O programa de base
O animevocê só precisa do **Node.js 20 ou mais novo**. Confira com `node --version`. Se faltar, com a licença da
pessoa:
- **Windows:** `winget install -e --id OpenJS.NodeJS.LTS`
- **macOS:** `brew install node` (sem o Homebrew, baixe o instalador em nodejs.org)
- **Linux:** o gerenciador da distribuição, ou nodejs.org

Depois de instalar, o terminal atual pode não enxergar o Node. Se for o caso, peça pra pessoa fechar e abrir o
Claude de novo na mesma pasta e repetir a frase; você continua daqui.

Confira também que há pelo menos **3 GB livres** no disco da pasta. Se não houver, avise e pare.

### 2. Baixar o animevocê pra esta pasta
O endereço do pacote sai do endereço desta página: troque o final `/blob/main/PREPARAR.md` por
`/archive/refs/heads/main.zip`. Baixe o zip e extraia **nesta pasta**, de modo que o `CLAUDE.md` e a pasta
`ferramentas/` fiquem na raiz dela (o zip traz uma pasta dentro: suba o conteúdo um nível e apague a pasta vazia).
Apague o zip no fim. Não precisa de git nem de conta no GitHub.

Se a pasta atual não estiver vazia, não misture: crie uma subpasta `animevoce`, instale nela e diga à pessoa pra
abrir o Claude nessa subpasta da próxima vez.

Se o download for recusado (acontece na nuvem, que só baixa do repositório da própria pessoa), explique que na
nuvem o caminho é criar o repositório a partir do modelo, como a página de acesso ensina, e pare aqui.

### 3. Instalar
`node ferramentas/instalar.mjs`

Ele baixa as peças do motor e o navegador do render pra dentro da pasta, cria as pastas de trabalho e confere se o
motor abre. Nada se espalha pelo computador. No fim ele imprime quantos estilos estão disponíveis e se o 3D completo
(Blender) está à mão.

### 4. Provar que funciona
`node ferramentas/fotos.mjs exemplo-ciclo` tira uma folha de fotos do vídeo de exemplo. Abra a imagem
(`videos/exemplo-ciclo-da-agua/fotos/video-folha.jpg`) e confira que a lousa e os desenhos aparecem. Se aparecem,
está tudo pronto.

### 5. Na nuvem: guardar a instalação
Se você está na nuvem, faça commit e push do que mudou, pra o repositório da pessoa ficar pronto pras próximas
sessões. A pasta `node_modules/` não vai pro repositório: ela é refeita pelo `instalar.mjs` a cada sessão.

### 6. Avisar a pessoa
Diga, em poucas linhas:
- que o animevocê está pronto e em que pasta;
- que pra criar um vídeo basta pedir com as palavras dela, por exemplo:
  *"Faz um vídeo de 1 minuto sobre como o avião voa, no estilo Quadro de giz."*;
- que ela pode pedir pra ver os estilos (*"me mostra os estilos"*), e que o vídeo pronto chega na pasta `prontos/`;
- que a narração é opcional: sem voz, com a voz dela gravada no celular, ou com voz de IA paga.

Depois, leia o `CLAUDE.md` desta pasta: é ele que diz como fazer os vídeos.
