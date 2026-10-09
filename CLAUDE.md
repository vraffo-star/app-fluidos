# App Fluidos — PWA de estudo

App para estudar o curso de Fluidos de Perfuração, Completação e Estimulação no celular (Android).
Usuária: profissional fazendo o curso. Data final de uso: **06/12/2026**.

## Regras inegociáveis

- **PWA estática, sem build**: HTML + CSS + JavaScript puro (ES modules). Nada de React, Vite, npm ou bundler. Deve rodar servindo a pasta tal como está (GitHub Pages).
- **100% offline e independente de IA**: nenhuma chamada a APIs externas, nenhum CDN. Bibliotecas de terceiros (só se for imprescindível) ficam copiadas em `vendor/`.
- **Toda a interface em português do Brasil.**
- **Mobile first**: pensada para celular em pé, uma mão, alvos de toque ≥ 44px. Precisa ficar boa também em tela larga, mas o celular manda.
- **Os arquivos de `data/` são gerados fora deste projeto.** Não edite, não reformate e não invente conteúdo neles. A app só os lê. Se encontrar um erro num arquivo de dados, avise em vez de corrigir.
- O progresso fica só no celular (`localStorage`). Sem login, sem servidor, sem backup.
- **Sem notificações** e sem pedir permissões.
- Os PDFs do curso **nunca** entram neste repositório (o repo é público).

## Estrutura

```
index.html
manifest.webmanifest
sw.js
css/app.css
js/            (módulos: app.js, router.js, store.js, dados.js, telas/*.js ...)
icons/         (192, 512 e maskable)
vendor/        (só se precisar)
data/
  indice.json
  unidades/<id>.json
  resumos/<id>.md
```

## Formato dos dados (contrato — não mudar)

### `data/indice.json`
```json
{
  "versao": 3,
  "dataFim": "2026-12-06",
  "novasPorDia": 25,
  "unidades": [
    { "id": "geologia", "ordem": 1, "titulo": "Fundamentos da geologia aplicada à construção de poços",
      "curto": "Geologia", "cor": "#B5651D",
      "arquivo": "unidades/geologia.json", "resumo": "resumos/geologia.md" }
  ]
}
```
`versao` aumenta toda vez que o conteúdo muda; use-o para invalidar o cache dos dados.
`dataFim` é só um dado interno: **não mostrar** em nenhuma tela (sem contagem regressiva).

### `data/unidades/<id>.json`
```json
{
  "id": "geologia",
  "perguntas": [
    {
      "id": "geo-0001",
      "tipo": "multipla",
      "dificuldade": 2,
      "tema": "Rocha geradora",
      "enunciado": "Texto da pergunta",
      "afirmativas": ["I. ...", "II. ...", "III. ..."],
      "alternativas": ["A", "B", "C", "D", "E"],
      "correta": 3,
      "explicacao": "Por que a correta é a correta (e por que as outras não)."
    }
  ],
  "flashcards": [
    { "id": "geo-f001", "frente": "Pergunta/conceito", "verso": "Resposta" }
  ]
}
```
- `tipo`: `multipla` | `incorreta` (pede a alternativa errada) | `vf` (alternativas `["Verdadeiro","Falso"]`) | `combinacao` (traz `afirmativas` I, II, III… e alternativas tipo "Apenas I e III").
- `afirmativas` só existe em `combinacao`; mostre-as numa lista antes das alternativas.
- `dificuldade`: 1 = fácil, 2 = média, 3 = para pensar. Mostrar como selo discreto.
- `correta`: índice (base 0) em `alternativas`. **Não embaralhar as alternativas** (já vêm embaralhadas e às vezes a ordem importa).
- Ids são permanentes. Novas perguntas de uma unidade chegam sempre com ids novos; nada é renumerado.
- Os textos podem conter `**negrito**`. Renderize só negrito; o resto é texto puro (escape HTML).

### `data/resumos/<id>.md`
Markdown simples: `#`, `##`, `###`, parágrafos, listas (`-` e `1.`), **negrito**, *itálico*, tabelas simples, citações `>` (mostrar como caixa de destaque "💡"), e `---`. Escreva um renderizador mínimo próprio (sem biblioteca) que cubra exatamente isso.

## Funcionalidades

Navegação inferior fixa com 5 abas: **Início · Estudar · Revisar · Resumos · Mais**. Roteamento por hash (`#/inicio`, etc.).

### 1. Início
- Racha (dias seguidos estudando — um dia conta se respondeu pelo menos 1 pergunta) e maior racha.
- Cartão do dia: "X perguntas novas pendentes" + botão grande **Estudar**.
- Atalhos: Revisão (com o número de perguntas vencidas), Simulado, Flashcards.
- Resumo rápido: total respondidas, % de acerto.

### 2. Estudar — perguntas novas do dia
- **25 perguntas novas por dia, acumulativas.** O dia 1 é o primeiro dia em que a app foi aberta (guardar a data).
  `pendentes = 25 × (dias desde o dia 1 + 1) − total de perguntas novas já respondidas`, limitado ao que existe no banco.
- Uma pergunta nova **nunca se repete** nesta aba: só entram perguntas nunca respondidas.
- Sessões de até 25. A sessão é montada ao iniciar e **salva** (fechar a app e voltar retoma do mesmo ponto, com as mesmas perguntas).
- Montagem da sessão: misturar unidades (round-robin ponderado pelo número de perguntas não vistas de cada unidade) e dificuldades (alvo aproximado 30% fácil, 45% média, 25% para pensar, conforme disponibilidade); ordem final aleatória.
- Unidades novas que aparecerem no índice entram automaticamente na mistura.
- Tela da pergunta: unidade (com a cor) + tema + selo de dificuldade, enunciado, alternativas como botões grandes. Ao tocar: marca certo/errado na hora, mostra a correta e a **explicação**, botão **Próxima**. Botão de estrela para favoritar.
- Progresso da sessão (barra "7/25").
- Fim da sessão: acertos, tempo, lista das erradas com explicação.
- Se o banco acabar: mensagem "Você respondeu todas as perguntas disponíveis 🎉 — use Revisar e Simulado".

### 3. Revisar
Abas internas:
- **Revisão espaçada** (tipo Anki/Leitner): toda pergunta errada (na primeira vez ou depois) entra na caixa 1. Intervalos das caixas: 1, 3, 7, 14, 30 dias. Acertou → sobe de caixa; errou → volta para a caixa 1. Acertar na caixa 5 → sai da revisão. Mostra as vencidas hoje.
- **Simulado**: 20 perguntas, 30 minutos, cronômetro visível. Sorteia **só entre perguntas já vistas** (para não gastar as novas do dia); se houver menos de 20 vistas nas unidades escolhidas, usa as que houver. Resultado no fim com revisão de cada questão. Guardar histórico de notas dos simulados.
- **Histórico**: todas as perguntas já respondidas. Filtros: unidade, resultado (acertei / errei), favoritas, dificuldade, e busca por texto. Tocar abre a pergunta com a resposta dada, a correta e a explicação, com botão "Refazer".
- **Filtro por unidade** em todas as abas de Revisar (multi-seleção; padrão = todas).

### 4. Resumos
- Lista de unidades (cor + título). Abre o resumo renderizado, confortável de ler no celular: fonte ~17px, linha 1.6, largura máxima ~680px, títulos com âncora, tabelas com rolagem horizontal.
- Botão para aumentar/diminuir a fonte (guardar preferência).
- Ao fim do resumo: botões "Flashcards desta unidade" e "Revisar esta unidade".

### 5. Mais
- **Flashcards**: escolher unidade(s), embaralhar, tocar para virar, botões "Sabia" / "Não sabia" (as "Não sabia" voltam no fim da rodada).
- **Estatísticas**: % de acerto por unidade e por dificuldade, perguntas respondidas por dia (últimos 14 dias, barras em SVG/CSS sem biblioteca), racha, notas dos simulados.
- **Sobre**: versão dos dados, número de perguntas por unidade.
- **Zerar progresso** (com confirmação dupla feita na própria UI, sem `alert/confirm`).

## Armazenamento
- Tudo em `localStorage` numa única chave (`fluidos:v1`), com leitura/escrita dentro de try/catch e um módulo `store.js` como única porta de acesso.
- Chamar `navigator.storage.persist()` na primeira abertura, para o Android não apagar os dados.
- Guardar por pergunta: tentativas (data, escolha, acertou), primeira resposta, favorita, estado da revisão (caixa, próxima data). Datas como `YYYY-MM-DD` no fuso local.

## PWA e atualização
- `manifest.webmanifest` com nome "Fluidos — Estudo", nome curto "Fluidos", `display: standalone`, tema escuro, ícones 192/512/maskable (gerar ícones simples em SVG→PNG; pode ser uma gota estilizada).
- `sw.js`: casca da app em cache (cache-first, versionada); `data/` em network-first com fallback para cache, para que unidades novas cheguem sozinhas quando houver internet.
- Quando uma nova versão estiver disponível, mostrar um aviso discreto "Atualização disponível — tocar para recarregar".
- **Subir `VERSAO` em `sw.js` toda vez que mudar um arquivo da app** (não precisa para `data/`). Sem isso os celulares continuam com a versão antiga em cache.
- Todos os caminhos **relativos** (o site vai morar em `https://<usuario>.github.io/app-fluidos/`).

## Visual
- Personalidade: sóbrio e técnico, com cara de ferramenta de engenharia, sem parecer template. Fundo escuro grafite/petróleo por padrão, com tema claro automático pelo sistema (`prefers-color-scheme`).
- Cor de destaque âmbar; cada unidade tem sua cor (vem do índice).
- Feedback de acerto/erro claro (verde/vermelho), mas sem depender só de cor (ícone ✓/✗).
- Tipografia do sistema (sem fontes externas), números tabulares nos contadores.
- Animações curtas e discretas; respeitar `prefers-reduced-motion`.

## Testes
- Servir localmente com `npx serve .` (ou `python -m http.server`) e testar no navegador em modo celular.
- Antes de cada commit, validar que `data/indice.json` e todos os arquivos referenciados carregam sem erro.
- Para testar a lógica de dias, permitir simular a data com `?hoje=2026-10-20` na URL (só para teste).

## Publicação
- Repositório público `app-fluidos` no GitHub, GitHub Pages servindo a branch `main` (raiz).
- Commits pequenos e com mensagem em português.
