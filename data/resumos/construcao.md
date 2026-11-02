# Princípios da engenharia de construção de poços

> 💡 **Ideia central:** construir um poço é abrir um buraco muito fundo **sem deixar o buraco desabar** e **sem deixar o petróleo, o gás ou a água entrarem à força**. O fluido de perfuração é o principal "guarda" que mantém tudo equilibrado.

---

## 1. O que é "perfurar um poço"?

Imagine furar a terra com uma broca gigante que **gira** enquanto você **bombeia lama** por dentro dos tubos. A lama sai pela broca, esfria e limpa a broca, e **sobe pelo espaço entre o tubo e a parede**, trazendo os pedacinhos de rocha (os **cascalhos**).

- **Fluido de perfuração (lama):** mistura líquida ou gasosa que ajuda a remover os cascalhos.
- Além de limpar, ela **segura as pressões da formação** com o próprio peso. Isso se chama **pressão hidrostática**.

> 💡 O poço precisa ser perfurado **sem causar instabilidade nas rochas** (colapso ou fratura) e **sem permitir influxo** de fluidos da formação.

---

## 2. Pressões: o coração da engenharia de poços

| Pressão | O que é, sem complicar |
|---|---|
| **Hidrostática** | O "peso" da coluna de fluido empurrando para baixo. |
| **De poros** | A força com que o fluido **dentro da rocha** tenta sair. |
| **De fratura** | A pressão que **quebra** a rocha. |
| **De absorção** | A pressão em que a rocha **começa a engolir** o fluido. |
| **De circulação** | A pressão que a bomba faz para empurrar o fluido (atrito). |

### A fórmula que você mais vai usar

**Ph (psi) = 0,17 × ρ (lb/gal) × h (m)**

- ρ = peso da lama em lb/gal (ou "ppg").
- h = altura **vertical** da coluna de fluido. Em poço inclinado **não** use a profundidade medida.

**Exemplo:** lama de 11,5 lb/gal a 2.500 m → 0,17 × 11,5 × 2.500 ≈ **4.888 psi**.

> 💡 **Pegadinha clássica:** poço desviado com 2.300 m medidos e 1.800 m verticais? Use **1.800 m**.

### Classificação da pressão de poros (em psi/m)

- **Menor que 1,42** → anormalmente baixa.
- **Entre 1,42 e 1,53** → normal.
- **Maior que 1,53** → anormalmente alta.

### Janela operacional

É o espaço seguro para o peso da lama:

> **pressão de poros < peso da lama < pressão de fratura**

- Lama **leve demais** → o fluido da rocha entra no poço (**kick**). Se sair de controle, vira **blowout**.
- Lama **pesada demais** → a rocha **fratura** e você **perde fluido** (perda de circulação).

### Massa específica equivalente

É transformar uma pressão em "quantos lb/gal isso equivale":

**ρeq = P ÷ (0,17 × H)**

No teste de absorção: **ρeq = ρlama + Pabs ÷ (0,17 × Hsapata)**

**Exemplo:** lama 10,5, sapata a 1.200 m e 1.500 psi na cabeça → 10,5 + 7,35 = **17,85 lb/gal**.

### Efeito tubo em U

Se o fluido **dentro da coluna** é mais pesado que o do **anular**, o nível da coluna **desce** e empurra o do anular para cima.

### Circulando muda tudo

Com a bomba ligada, o atrito no anular **soma pressão no fundo**. É a "densidade equivalente de circulação". Em janela estreita, isso pode fraturar a rocha.

---

## 3. Como os poços são classificados

| Pelo quê? | Tipos |
|---|---|
| **Finalidade** | Exploratórios · Explotatórios · Especiais |
| **Trajetória** | Verticais · Direcionais · Multilaterais |
| **Localização** | Terrestres (onshore) · Marítimos (offshore) |
| **Profundidade** | Rasos (até 1.500 m) · Médios (1.500–2.500 m) · Profundos (acima de 2.500 m) |

**Lâmina d'água (LDA):** 0–300 m rasas · 300–1.500 m profundas · acima de 1.500 m ultraprofundas.

---

## 4. Tipos de sonda

- **Terrestres:** convencional, automática e **helitransportada** (lugares de difícil acesso). **DTM** = desmontagem, transporte e montagem.
- **Marítimas:** plataforma modulada, **auto-elevatória** (PA), **semissubmersível** (SS) e **navio-sonda** (NS).

### Quem trabalha na sonda?

Geólogo · Químico/engenheiro de fluidos · **Fiscal (company man)** · **Encarregado (tool pusher)** · Sondador · Torrista · Plataformista.

> 💡 **Escalas de embarque:** 7×7, 14×14, 21×21, 28×28, 7×14, 14×21 (dias embarcado × dias de folga). Turno: **12 h × 12 h**.

---

## 5. Os sistemas da sonda (cada um com sua função)

1. **Sustentação de cargas:** a torre aguenta o peso.
2. **Geração de energia:** motores diesel, turbinas a gás ou rede pública.
3. **Movimentação de carga:** içar e baixar a coluna.
4. **Rotação:** gira a broca.
   - **Mesa rotativa + kelly:** perfura de **tubo em tubo (~9 m)**.
   - **Top drive:** perfura de **seção em seção (~27 m)**. Também permite retirar a coluna girando e circulando.
   - **Motor de fundo:** gira só a broca, no fundo.
5. **Circulação:** **bombas triplex**, tanques de lama, peneiras.
6. **Segurança do poço:** **BOP**, **choke manifold**, linhas de **choke** e **kill**. Quando fecha o poço num kick, lê-se **SIDPP** (no tubo) e **SICP** (no anular).
7. **Monitoração:** painel do sondador, mud logging.
8. **Subsuperfície:** a coluna de perfuração.

> 💡 **Tanques de lama:** se o nível **sobe** sem bomba, é **kick**. Se **desce**, é **perda de circulação**.

### Controle de sólidos (tirar o cascalho da lama)

Peneira → desareiador → dessiltador / mud cleaner → centrífuga. Cada um tira sólidos de um tamanho menor.

---

## 6. A coluna de perfuração

De cima para baixo:

| Peça | Para que serve |
|---|---|
| **Tubos de perfuração (DP)** | Levam o fluido e transmitem a rotação. Têm *tool joints* (caixa e pino). |
| **Tubos pesados (HW)** | **Transição** entre DP e DC; menos torque, arraste e risco de prisão. |
| **Comandos (DC)** | Parede grossa. Dão **peso sobre a broca** e estabilidade. |
| **Estabilizadores** | Mantêm a coluna centralizada. |
| **Substitutos** | Içamento · Broca · Cruzamento (une roscas diferentes). |
| **Broca** | Corta a rocha. |

A parte de baixo se chama **BHA** (*Bottom Hole Assembly*).

**Ferramentas de manuseio:** **chave flutuante** (aperta e desaperta), **cunhas** (seguram a coluna na mesa), **colar de segurança** (evita que a coluna caia no poço).

### Manobras

- **Manobra:** retirar **e** descer a coluna.
- **Meia manobra:** só uma das duas.
- **Manobra curta:** retirada e descida **parciais**.

> 💡 Ao retirar a coluna, o nível cai. É preciso **completar o poço com fluido** para manter a pressão (senão pode entrar kick).

### Contas da coluna

- **Fator de flutuação:** **Ff = 1 − PL ÷ 65,5** (quanto mais pesada a lama, menor o peso aparente).
- **Peso da coluna no poço:** Pc = (PDC·hDC + PHW·hHW + PDP·hDP) × Ff
- **Peso máximo sobre a broca:** PSB = (PDC·hDC + PHW·hHW) × Ff × **Fs (0,80)**

**Exemplo do curso:** lama de 10,2 → Ff = 0,84 → coluna ≈ **79 t** e PSB ≈ **19,9 t**.

---

## 7. Contas de volume (volumetria) e de bomba

**Conversões:** 1 bbl = 159 L · 1 m³ = 6,29 bbl.

| O que | Fórmula |
|---|---|
| Capacidade interna (bbl/m) | **ID² × 0,0031871** |
| Capacidade anular (bbl/m) | **(D² − OD²) × 0,0031871** |
| Volume (bbl) | capacidade × altura (m) |
| Bomba triplex (bbl/stroke) | **qp = D² · L · Ep ÷ 411.765,7** |
| Vazão (bbl/min) | **Q = qp × SPM** |
| Surface-to-bit | **Vcoluna ÷ Q** |
| Bottoms-up | **Vanular ÷ Q** |

> 💡 **Bottoms-up** é o tempo que a lama leva para sair da broca e chegar à superfície. É quando o cascalho "chega".

---

## 8. Fases do poço e revestimentos

O poço é perfurado em **fases**, e cada uma termina com um **revestimento cimentado**.

| Fase | Revestimento | Para que serve |
|---|---|---|
| 1 | **Condutor** (30″, 20″, 13⅜″) | Pouca profundidade; segura sedimentos soltos. |
| 2 | **Superfície** (20″ a 9⅝″) | Protege água doce; **cimentado até a superfície**; base dos equipamentos de segurança. |
| 3 | **Intermediário** (13⅜″, 9⅝″, 7″) | Isola zonas de pressão, perda e desmoronamento; cimentado na parte de baixo. |
| 4–5 | **Produção / liner** (9⅝″, 7″, 5½″) | Permite produzir e isola intervalos. |

**Pares poço/revestimento:** 36/30 · 26/20 · 17½/13⅜ · 12¼/9⅝ · 8½/7.

O **número de fases** depende de: janela operacional, kicks, desmoronamento e perda de circulação.

> 💡 **Liner:** revestimento que **não chega à superfície**; fica pendurado perto da sapata anterior.

Tubos de revestimento têm cerca de **12 m**. Se não forem enchidos na descida, podem **flutuar ou colapsar** (por isso a **sapata/colar com auto fill**).

---

## 9. Cimentação

**Para que cimentar?** Isolar zonas permeáveis, dar estabilidade, proteger o revestimento contra fluidos agressivos e permitir fluxo controlado.

**Cimentação secundária:** **squeeze**, **tampões** e **recimentação**.

---

## 10. Problemas de perfuração

| Problema | Como reconhecer | Causa |
|---|---|---|
| **Desmoronamento** | Muito cascalho, pressão de bombeio e torque altos | Lama leve, perda de circulação, falta de inibição |
| **Acunhamento** | Aumento de pressão de bombeio, perda de circulação | Drag alto, descida após troca de broca |
| **Prisão diferencial** | Coluna **parada**; circulação **normal** | Reboco espesso, filtrado alto, forte sobrebalanço |
| **Enceramento da broca** | Taxa de penetração cai | Argila grudada na broca |
| **Perda de circulação** | Nível dos tanques cai | Pressão acima da fratura |
| **Kick** | Tanques ganham volume | Lama abaixo da pressão de poros |

**Pescaria:** retirar o **peixe** (qualquer coisa que ficou no poço).

**Poço direcional:** desvio **intencional**. **Não existe** poço 100% vertical; a **tortuosidade** vem de mudança de formação, mudança brusca de peso, coluna sem estabilizar etc.

**Perfilagem:** ferramentas descidas a cabo ou na coluna "leem" o poço. Perfis acústicos avaliam a cimentação.

---

## 11. Projeto do poço

O projeto traz: dados gerais, esquema do poço, roteiro de perfuração, programa de brocas, previsão de tempo e custo, projeto de **fluido**, de **revestimento e cimentação** e de **abandono**. Os **poços de correlação** (vizinhos) ajudam a planejar.

---

## 12. Integridade de poços

- **Resolução ANP nº 46/2016:** cria o **SGIP** (17 práticas de gestão) para todo o ciclo de vida: projeto, construção, produção, intervenção e abandono.
- **CSB (Conjunto Solidário de Barreiras):** conjunto de elementos que impede fluxo não intencional de fluidos.
  - **CSB primário:** o primeiro controle.
  - **CSB secundário:** o segundo.
- **O fluido de perfuração pode ser a barreira primária**, desde que haja **coluna hidrostática** (volume e extensão) e **densidade adequada**.
- O dado fundamental: a **janela operacional**.

**Abandono:** tampões de cimento na superfície, na sapata e na zona permeável (cerca de 30 m cada), com teste.

---

## Resumão de 30 segundos

- **Ph = 0,17 × ρ × h** (vertical!).
- Lama **entre** pressão de poros e de fratura: abaixo vem kick, acima vem perda.
- **Top drive** perfura de ~27 m em ~27 m; mesa rotativa, de ~9 m.
- **DC dão peso; HW fazem transição; DP circulam e giram.**
- **Ff = 1 − PL/65,5** · **PSB** usa só DC + HW · **Fs = 0,80**.
- Capacidades: **ID² × 0,0031871** (interna) e **(D² − OD²) × 0,0031871** (anular).
- Revestimentos: **condutor → superfície → intermediário → produção**.
- Prisão **diferencial**: coluna parada, circulação normal. **Desmoronamento**: muito cascalho e torque.
- **Fluido = barreira primária** (CSB) durante a perfuração.
