/* F&E Power · tela de carregamento ("ligando o sistema").
   Carregado no <head>, sem defer: decide antes da primeira pintura se a tela aparece.
   Aparece 1 vez por visita (sessionStorage), nunca com movimento reduzido, e some sozinha em no máximo 4,5 s
   (o CSS também tem trava própria, caso este arquivo falhe no meio). Sem JS: não aparece. */
(() => {
  'use strict';
  const d = document, root = d.documentElement;
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (sessionStorage.getItem('fe-ligado')) return;
    sessionStorage.setItem('fe-ligado', '1');
  } catch { return; }
  root.classList.add('carregando');

  const MIN = 2300, MAX = 4800, t0 = performance.now();
  let carregou = false, saiu = false;
  addEventListener('load', () => { carregou = true; }, { once: true });

  const sair = () => {
    if (saiu) return; saiu = true;
    const el = d.querySelector('.carga');
    const pct = d.querySelector('[data-carga-pct]'); if (pct) pct.textContent = '100%';
    root.style.setProperty('--carga', 1);
    const txt = d.querySelector('.carga__status span'); if (txt) txt.textContent = 'Sistema ligado';
    root.classList.add('carga-pronto');                       // clarão: a linha inteira acende
    setTimeout(() => {
      root.classList.add('carga-saindo');
      setTimeout(() => { root.classList.remove('carregando', 'carga-pronto', 'carga-saindo'); el?.remove(); }, 820);
    }, 560);
  };
  setTimeout(sair, MAX);

  const passo = agora => {
    if (saiu) return;
    const t = agora - t0;
    const alvo = carregou ? Math.min(1, t / MIN) : Math.min(0.9, t / MIN);   // sem "load", segura em 90%
    const p = 1 - Math.pow(1 - alvo, 2.2);
    root.style.setProperty('--carga', p.toFixed(3));
    const pct = d.querySelector('[data-carga-pct]'); if (pct) pct.textContent = Math.round(p * 100) + '%';
    if (carregou && t >= MIN) { sair(); return; }
    requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
})();
