const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function esc(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

// Texto dos dados: tudo escapado, só **negrito** vira marcação.
export function rico(texto) {
  return esc(texto).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

export function embaralhar(lista) {
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function plural(n, um, varios) {
  return n === 1 ? um : varios;
}

export function fmtTempo(ms) {
  const seg = Math.round(ms / 1000);
  const min = Math.floor(seg / 60);
  const resto = String(seg % 60).padStart(2, '0');
  return min ? `${min} min ${resto} s` : `${seg} s`;
}

// Só aceita cores hexadecimais vindas do índice; qualquer outra coisa cai no âmbar.
export function corSegura(cor) {
  return /^#[0-9a-f]{3,8}$/i.test(cor || '') ? cor : 'var(--ambar)';
}
