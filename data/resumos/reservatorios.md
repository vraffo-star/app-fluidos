# Noções gerais sobre reservatórios

> Ideia central: um reservatório é uma **esponja de pedra** cheia de óleo, gás e água sob pressão. Esta unidade explica **o que tem dentro**, **como sai** (mecanismos) e **como tirar mais** (métodos de recuperação).

---

## 1. Tipos de reservatório

1. **De óleo**
2. **De gás**: retrógrado, úmido e seco
3. **De óleo com capa de gás**

> 💡 A jazida é classificada pela **fase que predomina** e pelo **interesse econômico**. Mesmo com muito gás, se o interesse é o óleo, é **reservatório de óleo com capa de gás**. Se o gás domina em volume e em interesse, é **reservatório de gás**.

- **Gás associado**: vem junto com o óleo (dissolvido ou na capa).
- **Gás não associado**: de um reservatório de gás.
- Os reservatórios de gás (seco, úmido, retrógrado) são classificados pelo **comportamento do fluido nos equipamentos de superfície**.

### Diagrama de fases (sem medo)
- **Óleo subsaturado**: pressão **acima** da pressão de saturação (bolha). Todo o gás está dissolvido e o óleo é **monofásico**.
- **Óleo saturado**: pressão **na** pressão de bolha ou abaixo. Já existe **gás livre**.
- **Curva RS**: o caminho do fluido do **R**eservatório até a **S**uperfície (P e T caem).
- Acima do **ponto crítico** → **fluido supercrítico**. No **ponto triplo** coexistem sólido, líquido e gás.

### Gás retrógrado (o "esquisito")
Com a **temperatura constante**, a pressão vai caindo:
1. Atinge a **curva de orvalho** (ponto 1) → começa a **condensar líquido** no reservatório.
2. O líquido **aumenta até um máximo**.
3. Depois, com mais queda de pressão, **o líquido volta a virar vapor** até o ponto 2.

> 💡 Problema: o condensado (a parte mais valiosa) **fica preso nos poros** e ainda atrapalha o fluxo do gás.

---

## 2. Os fluidos e o grau API

Os fluidos do reservatório são **óleo, água e gás**.

**Óleo** = líquido no reservatório **e** na superfície, com viscosidade **≤ 10.000 cP**.

**°API = 141,5 / SG − 131,5** (SG = densidade relativa à água a 20/20 °C)

| Classe | °API | Densidade |
|---|---|---|
| **Leve** | ≥ 31 | ≤ 0,87 |
| **Médio** | 22 a 31 | 0,87 a 0,92 |
| **Pesado** | 10 a 21,9 | 0,92 a 1,00 |
| **Extrapesado** | < 10 | > 1,00 (afunda na água) |

> 💡 **Mais denso = API menor.** SG = 1,00 → exatamente **10° API**.

---

## 3. Propriedades da rocha

### Porosidade
**φ = V vazios / V total**
- **Absoluta**: todos os vazios.
- **Efetiva**: só os **conectados**, que é a que interessa para o **movimento dos fluidos**.
- Com a profundidade, a porosidade **cai**, e nos **folhelhos cai muito mais rápido** que nos arenitos.

### Compressibilidade
A porosidade depende do **grau de compactação**, que depende da **profundidade máxima** que a rocha já atingiu. Há compressibilidade da **matriz**, dos **poros** e **total**.
O **gás** se comprime e se expande muito mais que o líquido, por isso é uma ótima "mola" de energia.

### Saturação
**Sf = V fluido / V poros** → **So + Sw + Sg = 1**
Exemplo: So = 0,60 e Sw = 0,25 → **Sg = 0,15**.

### Permeabilidade
- **Absoluta**: um só fluido saturando 100% dos poros.
- **Efetiva**: um fluido na presença de outros.
- **Relativa** = efetiva / absoluta (0 a 1). Quando **Sw sobe**, **krw sobe e kro cai**.

**Lei de Darcy:** **q = k · A · Δp / (μ · L)**
→ dobrou a viscosidade, a vazão **cai pela metade**.

### Molhabilidade
É a **tendência de um fluido espalhar ou aderir** na superfície da rocha, medida pelo **ângulo de contato**.

> 💡 **Pegadinha de prova:** molhabilidade **não** é "quanta água tem na amostra" (isso é **saturação**).

**Bom reservatório = porosidade efetiva alta + permeabilidade alta.**

---

## 4. Termos que caem toda hora

| Sigla | O que é |
|---|---|
| **RGO** | Vazão de gás ÷ vazão de óleo |
| **RAO** | Vazão de água ÷ vazão de óleo |
| **Corte de água (BSW)** | Água ÷ (óleo + água) |
| **FR** | Fração do volume original que é recuperada |

> 💡 Exemplo: 300 m³/d de óleo + 100 m³/d de água → **RAO = 0,33** e **corte = 25%**.

### PVT: o que acontece quando o fluido sobe
- **Gás livre** → gás.
- **Óleo do reservatório** → **óleo + gás de solução**.
- **Água** → água + um pouco de gás de solução.

| Parâmetro | O que é | Comportamento com a pressão |
|---|---|---|
| **Bo** | Volume no reservatório ÷ volume na superfície (> 1) | Sobe até a Psat e depois cai |
| **Rs** | Gás dissolvido por volume de óleo | Sobe até a Psat e fica constante |
| **Bg** | Volume do gás no reservatório ÷ na superfície (~0,01) | Cai com a pressão |

Exemplo do curso: 2,60 m³ no reservatório viraram 2,00 m³ de óleo na superfície → **Bo = 1,30**. Condições-padrão: **1 atm e 20 °C**.

**Viscosidade:** cai muito quando a **temperatura sobe** (é a base dos métodos térmicos).

### IP e IPR
- **IP = q / (Pe − Pw)**. Exemplo: IP 5 × (200 − 160) = **200 m³/d**.
- A **IPR** é **reta acima da Psat** (monofásico) e **curva abaixo** (gás livre atrapalha).

### Razão de mobilidade
- Mobilidade: **λ = k / μ**.
- **M = (kw/μw) / (ko/μo)**.
- **M > 1** → ruim: a água "fura" o óleo (fingering). **M ≤ 1** → bom.
- **Polímero** aumenta μw → **reduz M** → varrido melhor.

---

## 5. Mecanismos de produção (a energia natural)

**Modelo de produção comercial:** licitação → prospectos → pioneiro → avaliação/delimitação → **declaração de comercialidade (vira RESERVA)** → plano de desenvolvimento → desenvolvimento da produção.

**Modelos:** petrofísica + geologia = **modelo estático** → + engenharia de reservatórios = **modelo dinâmico** → + economia = dimensionamento e **reservas**.

**Mecanismo básico:** **descompressão** → **expansão dos fluidos + contração dos poros** → **deslocamento** do óleo para o poço.

**Net-pay** = espessura da camada que tem hidrocarbonetos.

### Comparativo (decore esta tabela!)

| | **Gás em solução** | **Capa de gás** | **Influxo de água** |
|---|---|---|---|
| Pressão | Cai **rápido** | Cai **devagar** | Cai **suave** |
| RGO | Baixa → **dispara** → cai | Cresce devagar, **picos nos poços altos** | **Fica baixa** |
| Água | Pouca/nenhuma | Pouca/nenhuma | **Cresce nos poços baixos** |
| FR | **Baixo** | Alto | Alto |
| Poços | Elevação artificial **cedo** | Surgentes por mais tempo | Surgentes até a água ficar excessiva |
| Contato | — | **Gás-óleo desce** | **Óleo-água sobe** |

- **Combinado**: **mais de um mecanismo ao mesmo tempo** (ex.: capa + aquífero).
- **Segregação gravitacional**: o gás liberado sobe e forma uma **capa secundária**; isso retarda a RGO nos poços baixos e suaviza a queda de pressão.

> 💡 **Cone de água**: a água "sobe em cone" em volta do poço porque ali a pressão cai mais. **Fingering**: água em "dedos" pelas camadas mais permeáveis.

---

## 6. Métodos de aumento da recuperação

- **Para quê?** **Acelerar a produção e/ou aumentar o FR.**
- **Como?** **Injetando energia** (fluidos) e/ou **reduzindo resistências viscosas e capilares**.

| Fase | Quanto recupera |
|---|---|
| Primária | ~10–15% (geralmente < 30%) |
| Secundária | +15–35% (até ~50%) |
| Avançada/terciária | +5–10% (até ~60%) |

- **IOR** (recuperação avançada) = secundária + terciária.
- **EOR** (recuperação especial) = métodos especiais.
- Primária e secundária mexem no **fluido móvel**; a terciária ataca o **óleo "imóvel"** (preso por capilaridade ou muito viscoso).

### Convencionais
**Injeção de água** e **injeção de gás imiscível** (manutenção de pressão). A ideia é **imitar uma capa de gás ou um aquífero**.
- **Periférica**, no topo ou na base.
- **Em malha** (para reservatórios **extensos, pouco inclinados e finos**): linhas diretas, esconsas, **five-spot (d = a/2)**, seven-spot, nine-spot invertido.

**Princípios de um projeto de injeção:** injetar o **mínimo necessário**; o **gás injetado deve ficar** no reservatório; acompanhar **pressão e vazão** (cuidado com a **pressão de fraturamento**); considerar **falhas e estratificações**.

### Especiais

| Família | Exemplos | O que faz |
|---|---|---|
| **Térmicos** | Vapor (cíclico/contínuo), água quente, **combustão in situ (THAI)**, **SAGD**, eletromagnético | Reduz a **viscosidade** (óleo pesado) |
| **Miscíveis** | CO2, N2, hidrocarbonetos, GLP, **WAG** | Elimina a interface óleo/gás (forças capilares) |
| **Químicos** | **Polímeros**, **surfactantes**, álcalis | Polímero: controla a mobilidade. Surfactante: reduz a tensão interfacial |
| **Outros** | **MEOR** (bactérias), acústicos | MEOR: biopolímero bloqueia canais e desvia a água |

- **WAG**: alterna **água e gás**.
- **Gás enriquecido**: miscibilidade por **múltiplos contatos** (C2–C6 passam para o óleo).
- **Gás pobre a alta pressão**: **vaporização retrógrada** dos intermediários do óleo.
- **SAGD**: **2 poços horizontais**, vapor **em cima** e produtor **embaixo**.
- **THAI**: **injetor vertical de ar** + **produtor horizontal**; a combustão avança do "dedão" ao "calcanhar".
- **Surfactante**: o banco micelar vem **seguido de um banco de polímero** (controle de mobilidade).
- **MEOR**: curva das bactérias: inicial → exponencial → estabilização → morte.

### Como escolher (cai em prova!)
- A **razão de mobilidade** dá ideia da **eficiência de varrido** e ajuda a escolher o método.
- A **chave**: saber a **saturação de óleo residual após a injeção de água**, se o óleo ficou como **residual** (preso nos poros varridos) ou como **não varrido**.
- Recomendações: **estudo geológico → laboratório → simulação → projeto-piloto**.
- Vale mais a pena quando **ainda há muito óleo remanescente**.
- Exemplos: **capa de gás + óleo leve → injeção de gás**; **óleo pesado → vapor**.
- Eficiência média de **30–50%** (até ~60%). Dos 1.507 projetos citados, **78% são em arenitos**.

---

## 7. Reservas

- **Reserva**: volume que **é ou será recuperável** (viés **técnico-econômico**).
- **Recurso**: volume que **existe** na jazida, sem considerar acesso ou custo.
- "Reservas recuperáveis" é **pleonasmo**.
- **Reserva = soma da produção futura**, a partir de uma data, até o **limite econômico** (depende de **preço e custo**) ou **contratual**.
- Para a **empresa**, as reservas são o **ativo mais importante** (valor de mercado). Para o **país**, são um indicador da força da indústria.
- Fontes de informação: **sísmica** (oportunidades), **poços** (fluido, calibração), **testes** (produtividade, delimitação), **projetos** e **produção**.

**Números do curso:**
- Maiores reservas (2020): **Venezuela (~304)** e **Arábia Saudita (~298)** bilhões de bbl; Brasil em **16º (~11,9)**.
- Matriz mundial 2021: **petróleo ~31,5%**, carvão ~26,9%, gás ~22,8%.
- Brasil: **~45–47% de renováveis**.
- Mesmo campo: **concessão (Brasil) VPL ~578** × **partilha (Nigéria) VPL ~299** MM US$. O contrato muda tudo.

---

## Resumão de 30 segundos

- **API alto = óleo leve.** 10° API é a fronteira da água.
- **Porosidade efetiva** guarda; **permeabilidade** deixa passar; **Darcy**: q = kAΔp/μL.
- **Molhabilidade ≠ saturação.**
- **Gás em solução** = pior FR; **capa de gás** e **influxo de água** = FR alto.
- **M > 1 é ruim** → polímero ajuda.
- Recuperar mais = **injetar energia** ou **vencer viscosidade e capilaridade**.
- **Reserva** = o que ainda vai ser produzido **com lucro**.
