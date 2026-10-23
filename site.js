// F&E Power · código do site (a parte reutilizável fica em arcane-ui.js e placa.js)
(() => {
  'use strict';
  const d = document;
  const NUMERO = '5519982784289';
  const comMovimento = () => d.documentElement.classList.contains('motion');

  // Menu do celular
  const btn = d.querySelector('.menu-btn'), menu = d.getElementById('menu');
  if (btn && menu) {
    btn.addEventListener('click', () => { const aberto = menu.classList.toggle('aberto'); btn.setAttribute('aria-expanded', String(aberto)); });
    menu.addEventListener('click', e => { if (e.target.closest('a')) { menu.classList.remove('aberto'); btn.setAttribute('aria-expanded', 'false'); } });
    d.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('aberto')) { menu.classList.remove('aberto'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
  }

  // Janela "Abrir chamado". Sem JS, os botões continuam sendo links diretos para o WhatsApp.
  const dlg = d.getElementById('chamado');
  if (dlg && typeof dlg.showModal === 'function') {
    const form = dlg.querySelector('form');
    let origem = null;
    const abrir = (equip) => {
      origem = d.activeElement;
      if (equip) { const r = form.querySelector(`input[name=equipamento][value="${equip}"]`); if (r) r.checked = true; }
      d.documentElement.classList.add('ui-lock');
      dlg.showModal();
      (form.querySelector('input[name=equipamento]:checked') ? form.sintoma : form.querySelector('input[name=equipamento]')).focus();
    };
    const fechar = () => { dlg.close(); };
    dlg.addEventListener('close', () => { d.documentElement.classList.remove('ui-lock'); origem?.focus?.(); });
    dlg.addEventListener('click', e => { if (e.target === dlg) fechar(); });
    dlg.querySelector('[data-fechar]').addEventListener('click', fechar);
    d.addEventListener('click', e => {
      const a = e.target.closest('[data-chamado]');
      if (!a) return;
      e.preventDefault();
      abrir(a.dataset.chamado || '');
    });

    const erro = (nome, msg) => { const p = form.querySelector(`[data-erro="${nome}"]`); if (p) p.textContent = msg; const c = form.elements[nome]; if (c && c.setAttribute) c.setAttribute('aria-invalid', String(!!msg)); };
    form.addEventListener('submit', e => {
      e.preventDefault();
      const equip = form.querySelector('input[name=equipamento]:checked')?.value || '';
      const marca = form.querySelector('input[name=marca]:checked')?.value || 'não informada';
      const sintoma = form.sintoma.value.trim(), cidade = form.cidade.value.trim();
      erro('equipamento', equip ? '' : 'Escolha o tipo de equipamento.');
      erro('sintoma', sintoma ? '' : 'Conte em poucas palavras o que está acontecendo.');
      erro('cidade', cidade ? '' : 'Informe a cidade para confirmarmos a coleta.');
      if (!equip) { form.querySelector('input[name=equipamento]').focus(); return; }
      if (!sintoma) { form.sintoma.focus(); return; }
      if (!cidade) { form.cidade.focus(); return; }
      const texto = `Olá! Vim pelo site e quero abrir um chamado.\n\nEquipamento: ${equip}\nMarca: ${marca}\nO que acontece: ${sintoma}\nCidade: ${cidade}`;
      window.open(`https://wa.me/${NUMERO}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
      setTimeout(() => location.assign('/obrigado/'), 600);
    });
    form.addEventListener('input', e => { if (e.target.name) erro(e.target.name, ''); });
  }

  // Barramento: a corrente desce e acende os serviços um a um
  const bar = d.querySelector('[data-barramento]');
  if (bar) {
    const comps = [...bar.children];
    const acender = () => {
      bar.classList.add('ligado');
      comps.forEach((c, i) => comMovimento() ? setTimeout(() => c.classList.add('aceso'), 260 + i * 190) : c.classList.add('aceso'));
    };
    if (!comMovimento() || !('IntersectionObserver' in window)) acender();
    else { const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { acender(); io.disconnect(); } }, { threshold: 0.25 }); io.observe(bar); }
  }

  // Ordem de serviço: acompanha o passo que a pessoa está lendo
  const etapas = [...d.querySelectorAll('[data-os] .etapa')], passos = [...d.querySelectorAll('[data-passos] li')];
  const barraOS = d.querySelector('.os__barra');
  const marcar = n => {
    etapas.forEach((el, i) => { el.classList.toggle('feita', i < n); el.classList.toggle('agora', i === n); });
    barraOS?.style.setProperty('--prog', ((n + 1) / etapas.length).toFixed(3));
  };
  if (etapas.length) {
    if (!comMovimento() || !('IntersectionObserver' in window)) marcar(etapas.length);
    else {
      // passo atual = último cujo topo já passou do meio da tela (funciona também com pulo de âncora)
      const atualizar = () => { const meio = innerHeight * 0.55; let n = 0; passos.forEach((p, i) => { if (p.getBoundingClientRect().top < meio) n = i; }); marcar(n); };
      const io = new IntersectionObserver(atualizar, { threshold: [0, 0.5, 1], rootMargin: '0px 0px -45% 0px' });
      passos.forEach(p => io.observe(p));
      atualizar();
    }
  }

  const ano = d.getElementById('ano'); if (ano) ano.textContent = new Date().getFullYear();
})();
