// Revisar › Revisão espaçada: caixas 1–5 com intervalos de 1, 3, 7, 14 e 30 dias.
import * as store from '../store.js';
import { hoje, ddmm, diasEntre } from '../datas.js';
import { embaralhar, plural } from '../util.js';
import { filtroUnidades, vencidas, caixas, proximaRevisao } from '../revisao.js';
import { telaPergunta, htmlItemRespondido } from './pergunta.js';

function quando(data) {
  const n = diasEntre(hoje(), data);
  return n === 1 ? 'amanhã' : `em ${ddmm(data)}`;
}

export function subEspacada(raiz, partes, moldura) {
  let fila = [];
  let pos = 0;
  let feitas = [];

  function entrada() {
    const corpo = moldura(entrada);
    const unidades = filtroUnidades();
    const fila0 = vencidas(unidades);
    const n = fila0.length;
    const porCaixa = caixas(unidades);
    const total = porCaixa.reduce((a, b) => a + b, 0);
    const prox = proximaRevisao(unidades);

    corpo.innerHTML = `
      <section class="cartao dia">
        <p class="rotulo">Revisão espaçada</p>
        ${n
          ? `<p class="dia-texto"><span class="num">${n}</span> ${plural(n, 'pergunta vencida hoje', 'perguntas vencidas hoje')}</p>
             <button class="btn primario grande" type="button" id="revisar">Revisar agora</button>`
          : `<p class="dia-texto">${total ? '✓ Nenhuma revisão vencida hoje' : 'Nada na revisão'}</p>
             ${total ? '' : '<p class="nota">As perguntas que você errar entram aqui e voltam em intervalos cada vez maiores.</p>'}`}
        ${prox ? `<p class="nota">Próxima revisão ${quando(prox.data)}: <span class="num">${prox.n}</span> ${plural(prox.n, 'pergunta', 'perguntas')}.</p>` : ''}
      </section>

      <section aria-label="Caixas da revisão">
        <p class="rotulo">Caixas</p>
        <ol class="caixas">
          ${porCaixa.map((qtd, i) => `
            <li>
              <span class="num">${qtd}</span>
              <small>Caixa ${i + 1}</small>
              <small>${store.INTERVALOS[i]} ${plural(store.INTERVALOS[i], 'dia', 'dias')}</small>
            </li>`).join('')}
        </ol>
        <p class="nota">Acertou, sobe de caixa. Errou, volta para a caixa 1. Acertar na caixa 5 tira a pergunta da revisão.</p>
      </section>`;

    corpo.querySelector('#revisar')?.addEventListener('click', () => {
      fila = embaralhar(fila0);
      pos = 0;
      feitas = [];
      mostrar();
    });
  }

  function mostrar() {
    window.scrollTo(0, 0);
    if (pos >= fila.length) {
      resultado();
      return;
    }
    const q = fila[pos];
    telaPergunta(raiz, {
      q,
      progresso: { atual: pos + 1, total: fila.length },
      proxima: pos === fila.length - 1 ? 'Ver resultado' : 'Próxima',
      aoResponder(i, acertou) {
        store.responder(q.id, i, acertou, hoje(), true);
        feitas.push({ q, escolha: i, acertou });
        const rev = store.registro(q.id)?.rev;
        if (!acertou) return 'Voltou para a caixa 1 — reaparece amanhã.';
        if (!rev) return 'Saiu da revisão: você acertou na última caixa.';
        return `Subiu para a caixa ${rev.caixa} — reaparece ${quando(rev.prox)}.`;
      },
      aoProxima() {
        pos++;
        mostrar();
      },
    });
  }

  function resultado() {
    const erradas = feitas.filter((f) => !f.acertou);
    const acertos = feitas.length - erradas.length;
    raiz.innerHTML = `
      <section class="resultado">
        <p class="rotulo">Revisão espaçada</p>
        <h1>Revisão concluída</h1>
        <div class="placar dois">
          <div><span class="num">${acertos}/${feitas.length}</span><small>acertos</small></div>
          <div><span class="num">${erradas.length}</span><small>${plural(erradas.length, 'voltou para a caixa 1', 'voltaram para a caixa 1')}</small></div>
        </div>
        <div class="botoes">
          <button class="btn grande" type="button" id="voltar">Voltar para Revisar</button>
        </div>
        ${erradas.length ? `
          <h2 class="secao">${erradas.length} ${plural(erradas.length, 'pergunta errada', 'perguntas erradas')}</h2>
          <ul class="erradas">
            ${erradas.map((f) => `<li class="errada-item">${htmlItemRespondido(f.q, f.escolha)}</li>`).join('')}
          </ul>` : ''}
      </section>`;
    raiz.querySelector('#voltar').addEventListener('click', () => {
      entrada();
      window.scrollTo(0, 0);
    });
  }

  entrada();
}
