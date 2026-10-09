// Aba Mais: menu, Sobre e Zerar progresso. Flashcards e Estatísticas têm módulo próprio.
import * as store from '../store.js';
import { dadosIndice, listaUnidades, todasPerguntas } from '../dados.js';
import { hoje, ddmmaaaa } from '../datas.js';
import { esc, corSegura } from '../util.js';
import { telaFlashcards } from './flashcards.js';
import { telaEstatisticas } from './estatisticas.js';

const ITENS = [
  { id: 'flashcards', titulo: 'Flashcards', descricao: 'Conceitos para virar e conferir', tela: telaFlashcards },
  { id: 'estatisticas', titulo: 'Estatísticas', descricao: 'Acerto por unidade, dias e simulados', tela: telaEstatisticas },
  { id: 'sobre', titulo: 'Sobre', descricao: 'Versão dos dados e conteúdo de cada unidade', tela: telaSobre },
  { id: 'zerar', titulo: 'Zerar progresso', descricao: 'Apagar tudo e começar de novo', tela: telaZerar },
];

export function telaMais(raiz, partes) {
  const item = ITENS.find((i) => i.id === partes[0]);
  if (item) return item.tela(raiz, partes.slice(1));
  if (partes[0]) {
    location.replace('#/mais');
    return undefined;
  }
  raiz.innerHTML = `
    <header class="cabeca">
      <p class="rotulo">Mais</p>
      <h1>Ferramentas</h1>
    </header>
    <ul class="menu">
      ${ITENS.map((i) => `
        <li>
          <a class="menu-item${i.id === 'zerar' ? ' perigo' : ''}" href="#/mais/${i.id}">
            <span class="menu-texto"><b>${i.titulo}</b><small>${i.descricao}</small></span>
            <span class="menu-seta" aria-hidden="true">›</span>
          </a>
        </li>`).join('')}
    </ul>`;
  return undefined;
}

function telaSobre(raiz) {
  const unidades = listaUnidades();
  const linhas = unidades.map((u) => ({
    u,
    perguntas: todasPerguntas().filter((q) => q.unidade === u.id).length,
    flashcards: (u.flashcards || []).length,
  }));
  const soma = (campo) => linhas.reduce((s, l) => s + l[campo], 0);

  raiz.innerHTML = `
    <div class="sessao-topo"><a class="voltar" href="#/mais">‹ Mais</a></div>
    <header class="cabeca">
      <p class="rotulo">Sobre</p>
      <h1>Fluidos — Estudo</h1>
    </header>
    <p>Estudo do curso de Fluidos de Perfuração, Completação e Estimulação.</p>

    <section class="par" aria-label="Versão">
      <div class="medida">
        <p class="rotulo">Versão dos dados</p>
        <p><span class="num">${esc(dadosIndice().versao)}</span></p>
        <small>${unidades.length} ${unidades.length === 1 ? 'unidade' : 'unidades'}</small>
      </div>
      <div class="medida">
        <p class="rotulo">Primeiro dia</p>
        <p><span class="num sobre-data">${store.dia1() ? ddmmaaaa(store.dia1()) : '—'}</span></p>
        <small>de uso neste aparelho</small>
      </div>
    </section>

    <section class="est-secao">
      <h2 class="secao">Conteúdo por unidade</h2>
      <div class="tabela-rolagem">
        <table class="tabela-sobre">
          <thead><tr><th scope="col">Unidade</th><th scope="col">Perguntas</th><th scope="col">Flashcards</th></tr></thead>
          <tbody>
            ${linhas.map((l) => `
              <tr>
                <th scope="row"><span class="chip" style="--cor:${corSegura(l.u.cor)}">${esc(l.u.curto)}</span></th>
                <td class="num">${l.perguntas}</td>
                <td class="num">${l.flashcards}</td>
              </tr>`).join('')}
          </tbody>
          <tfoot><tr><th scope="row">Total</th><td class="num">${soma('perguntas')}</td><td class="num">${soma('flashcards')}</td></tr></tfoot>
        </table>
      </div>
    </section>

    <p class="nota">Seu progresso fica guardado só neste aparelho. Não há login, servidor nem backup: se os dados do navegador forem apagados, o progresso se perde.</p>`;
}

// Confirmação dupla na própria tela. No segundo passo o botão que apaga vem por último e só
// passa a valer depois de um instante, para dois toques seguidos no mesmo lugar não apagarem nada.
const ESPERA_APAGAR_MS = 1200;

function telaZerar(raiz) {
  let passo = 0;
  let espera = null;

  function desenhar() {
    const { respondidas } = store.totais();
    const topo = '<div class="sessao-topo"><a class="voltar" href="#/mais">‹ Mais</a></div>';
    if (passo === 2) {
      raiz.innerHTML = `
        ${topo}
        <section class="vazio">
          <p class="rotulo">Zerar progresso</p>
          <h1>✓ Progresso apagado</h1>
          <p>A contagem de perguntas novas recomeça hoje.</p>
          <a class="btn primario" href="#/inicio">Ir para o início</a>
        </section>`;
      return;
    }
    raiz.innerHTML = `
      ${topo}
      <section class="vazio zerar">
        <p class="rotulo">Zerar progresso</p>
        ${passo === 0 ? `
          <h1>Apagar todo o progresso?</h1>
          <p>Serão apagados: as <span class="num">${respondidas}</span> respostas dadas, as favoritas, a revisão espaçada, a sessão em andamento, as notas dos simulados e a racha. O conteúdo do curso e o tamanho da letra não mudam.</p>
          <div class="botoes">
            <button class="btn grande perigo" type="button" id="seguir">Zerar progresso…</button>
            <a class="btn grande" href="#/mais">Cancelar</a>
          </div>` : `
          <h1>Tem certeza? Não dá para desfazer.</h1>
          <p>Não existe backup. Depois de apagar, tudo recomeça do zero, como no primeiro dia.</p>
          <div class="botoes">
            <button class="btn grande" type="button" id="cancelar">Não, manter meu progresso</button>
            <button class="btn grande perigo cheio" type="button" id="apagar" disabled>Sim, apagar tudo</button>
          </div>`}
      </section>`;
    raiz.querySelector('#seguir')?.addEventListener('click', () => { passo = 1; desenhar(); });
    raiz.querySelector('#cancelar')?.addEventListener('click', () => { passo = 0; desenhar(); });
    clearTimeout(espera);
    const apagar = raiz.querySelector('#apagar');
    if (apagar) espera = setTimeout(() => { apagar.disabled = false; }, ESPERA_APAGAR_MS);
    apagar?.addEventListener('click', () => {
      store.zerar(hoje());
      passo = 2;
      desenhar();
    });
  }

  desenhar();
}
