// Datas sempre como 'YYYY-MM-DD' no fuso local.
// Para testar, a data de hoje pode ser simulada com ?hoje=2026-10-20 na URL.

const param = new URLSearchParams(location.search).get('hoje') || '';
const simulada = /^\d{4}-\d{2}-\d{2}$/.test(param) && !Number.isNaN(paraUTC(param)) ? param : null;

function paraUTC(data) {
  const [a, m, d] = data.split('-').map(Number);
  return Date.UTC(a, m - 1, d);
}

export function dataSimulada() {
  return simulada;
}

export function hoje() {
  if (simulada) return simulada;
  const d = new Date();
  const dois = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
}

// Dias de `a` até `b` (positivo se b é depois de a).
export function diasEntre(a, b) {
  return Math.round((paraUTC(b) - paraUTC(a)) / 864e5);
}

export function somarDias(data, n) {
  return new Date(paraUTC(data) + n * 864e5).toISOString().slice(0, 10);
}

export function ddmm(data) {
  const [, m, d] = data.split('-');
  return `${d}/${m}`;
}

export function ddmmaaaa(data) {
  const [a, m, d] = data.split('-');
  return `${d}/${m}/${a}`;
}
