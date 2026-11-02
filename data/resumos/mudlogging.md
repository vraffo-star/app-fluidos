# Basic Mud Logging

> 💡 **Ideia central:** o mud logging é o "olho e ouvido" do poço. Uma equipe numa unidade ao lado da sonda lê **sensores, gás e cascalhos** o tempo todo para descobrir **o que a broca está cortando** e **se o poço está em perigo** (kick, perda, washout).

---

## 1. O que o mud logging faz

- Descreve **amostras de calha**, amostras laterais e testemunhos.
- Identifica **anomalias de gás** e zonas de interesse.
- Monta o **perfil de acompanhamento geológico**.
- Monitora **parâmetros de perfuração** em tempo real.
- Detecta **kicks** e anomalias operacionais, evitando **tempo não produtivo**.
- Calcula **tempo de retorno (lag)** e **hidrostática**.
- Faz **cromatografia de gás** e vigia **gases nocivos** (H2S).

> 💡 Ele **não** cimenta, não dimensiona revestimento e não prepara o fluido.

---

## 2. Sensores: como o poço "fala"

Um sensor transforma uma grandeza física em **sinal elétrico**.

| Tipo | Como funciona | Exemplos |
|---|---|---|
| **Analógico** | Sinal **linear de 4–20 mA** | Pressão, peso, profundidade, torque, nível, fluxo de saída, H2S |
| **Digital** | Só **dois estados** (proximidade; NAMUR ~1 mA e ~3 mA) | SPM e RPM |

### O que cada sensor avisa

| Sensor | Onde fica | O que mostra |
|---|---|---|
| **Pressão (SPP)** | Linha de bombeio | Queda → furo na coluna (**washout**), jatos ou bomba |
| **SPM** | Bomba | Cursos por minuto (vazão) |
| **RPM** | Rotação da coluna | Rotação e possível desgaste da broca |
| **Peso (hook load)** | **Cabo morto** | Coluna acunhada ou não, **drag**, ruptura |
| **Profundidade (encoder)** | **Tambor do guincho** | Movimento da catarina → profundidade da broca e do poço |
| **Nível** | Tanques ativos e **trip tank** | **Ganho = kick**; **queda = perda de circulação** |
| **Fluxo de saída (flowout)** | Flowline | Subiu sem mexer na bomba → **possível kick** |
| **H2S** | Peneiras, plataforma, unidades | Gás tóxico |

> 💡 Sensor de nível: **longe** de paredes, agitadores e pontos de descarga.

### Parâmetros diretos × indiretos

- **Direto:** lido direto no sensor (profundidade, pressão, hook load).
- **Indireto:** **calculado** (ROP, WOB, flowin).

---

## 3. H2S: o gás perigoso

- Incolor, cheiro característico, **muito tóxico**, **mais denso que o ar**.
- Inflamável: autoignição **260 °C** e limite inferior de explosividade **≈ 4,3%**.
- Calibrar com **cilindro do gás**, **em local aberto** e com **máscara**.

---

## 4. Gás: de onde vem e como se mede

**Caminho:** fluido de retorno → **gas trap** (agitador) → linha com bomba → **DGT** (gás total, chama FID) e **cromatógrafo** (C1, C2, C3, C4, nC4, C5, nC5).

**Calibração:** injetar cilindros de **metano** e de **mistura** com concentração conhecida.

### Dois tipos de gás que chegam ao fluido

- **Gás liberado:** sai dos poros da rocha que a **broca** quebrou.
- **Gás produzido:** é **empurrado** para o poço pela pressão dos poros.

### Anomalias gasosas

Gás liberado · de **manobra** · **reciclado** · de **conexão** · produzido · **background** (nível de fundo).

> 💡 **Gás de conexão crescente** = o sobrebalanço está diminuindo.

### O fluido muda a leitura

- **Mais peso ou salinidade** → o fluido dissolve **menos** gás → mais gás liberado.
- **OBM** (base óleo): dissolve hidrocarbonetos, sobretudo os pesados → leitura **atenuada**.

---

## 5. Hidrostática e kick (conta clássica)

**Ph = 0,17 × ρ (lb/gal) × h (m)**

- Poço com **overbalance**: Ph > pressão de poros.
- Baixou o peso da lama? **Recalcule** Ph e compare com a pressão de poros.

**Exemplo:** 1.934 m, lama 12,1 → 11,6 lb/gal: Ph ≈ 3.814 psi. Poros 3.778 psi → **sem kick**.
**Exemplo:** 2.798 m, lama 9,3 → 8,9 lb/gal: Ph ≈ 4.233 psi. Poros 4.301 psi → **kick**.

---

## 6. Manobras: o momento crítico

- **POOH** (retirada) e **RIH** (descida): o volume que entra/sai deve ser igual ao **deslocamento do aço**.
- Diferença = **kick** ou **perda**.
- **Swab** (pistoneio, reduz pressão) e **surge** (aumenta pressão).

---

## 7. Bomba triplex e volumes

| O que | Fórmula |
|---|---|
| Capacidade da bomba | **Cv (bbl/stroke) = D² · L · Ep ÷ 411.765,7** |
| Vazão | **Q = Cv × SPM** |
| Strokes para um volume | **Nstk = Vol ÷ Cv** |
| Volume anular (L em m) | **(Dext² − dint²) × L ÷ 313,76** |
| Volume anular (L em pés) | **(Dext² − dint²) × L ÷ 1.029,4** |

**Exemplo:** camisa 6″, curso 12″, 95% → **0,0997 bbl/stroke**. Para 200 bbl: ≈ **2.007 strokes**.
**Lembre:** 1 bbl = 42 gal. Trocar a camisa por uma **menor** reduz a capacidade **e** a vazão.

---

## 8. Lag: "quanto o cascalho demora para subir"

| Termo | O que é |
|---|---|
| **Lag down (STB)** | Superfície → broca, pelo interior da coluna |
| **Lag up (bottoms-up)** | Broca → superfície, pelo anular |
| **Ciclo completo** | Lag down + lag up |

**Lag = Volume ÷ Vazão.** Depende de vazão, geometria do poço e BHA.

**Exemplo do curso:** bomba 0,123 bbl/stk a 75 SPM (≈ 9,2 bbl/min). Anular ≈ 1.083 bbl → lag up ≈ **117 min**. Coluna ≈ 151 bbl → lag down ≈ **16 min**. Ciclo ≈ **133 min**.

> 💡 Poço **alargado** → mais volume anular → lag real **maior** que o calculado. O teste com **carbureto** (ciclo completo) ajuda a avaliar.

---

## 9. Amostras de calha

**Calha** = fragmentos de rocha trazidos pelo fluido. Mostra litologia, fósseis, potencial gerador e **indícios de hidrocarbonetos**.

- **Intervalos:** 9×9 m, 6×6 m ou 3×3 m (menor nas zonas de interesse).
- **Profundidade** da amostra = **base** do intervalo.
- **Descrição:** rochas em ordem decrescente, em frações de **10%**. **Traços** 1–9%; **raros** < 1%.
- **Seleção:** boa (1–2 classes) · regular (3–4) · má (5+).

### Reconhecer minerais e contaminantes

- **HCl:** calcita e dolomita reagem. **Anidrita não reage**.
- **Desabamento:** folhelho **côncavo** = pressão anormal. Blocos = alívio de tensões.
- **Aditivos do fluido:** aparecem de repente e em quantidade → chamar o técnico de fluidos.
- **Cimento:** fenolftaleína + HCl.
- Outros contaminantes: ferrugem, limalha, tinta, borracha, graxa.

### Indícios de óleo

- **Fluorescência (UV):** total > 90% · esparsa 10–90% · pontual < 10% · rara < 1%.
- **Corte:** o HC se espalha num solvente (acetona, nafta, éter...). **Imediato, moderado ou provocado**; **radial** ou **aureolar**.
- Cuidado: **minerais e aditivos também fluorescem**.

---

## Resumão de 30 segundos

- **Kick:** ganho nos tanques + flowout subindo + gás total.
- **Analógico** 4–20 mA; **digital** só dois estados (SPM e RPM).
- **Hook load** no cabo morto; **encoder** no guincho.
- **H2S:** mais pesado que o ar; calibrar ao ar livre.
- **Cv = D²·L·Ep ÷ 411.765,7**; **Lag = V ÷ Q**; ciclo = lag down + lag up.
- Peso ou salinidade **↑** → mais gás liberado; **OBM** atenua.
- **Anidrita** não reage ao HCl; **cimento**: fenolftaleína.
- **Fluorescência:** total > 90% · esparsa 10–90% · pontual < 10%.
