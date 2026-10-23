/* F&E Power · "placa viva" e osciloscópio. Sem dependências.
   [data-placa]       canvas de fundo: placa eletrônica com corrente nas trilhas; a varredura de diagnóstico
                      passa, acha os componentes com defeito (LED vermelho) e eles voltam a funcionar (LED verde).
                      data-placa="hero" (denso, com consertos) | "calma" (fundo discreto, sem consertos)
   [data-scope]       osciloscópio: o ruído vira onda limpa ("sinal de volta").
   Movimento reduzido: desenha o estado final parado. Fora da tela ou aba escondida: pausa. */
(() => {
  'use strict';
  const reduzir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const economia = navigator.connection?.saveData === true;

  const rng = semente => () => (semente = (semente * 16807) % 2147483647) / 2147483647;
  const COR = { trilha: 'rgba(98,128,170,.17)', trilhaClara: 'rgba(143,166,198,.26)', corpo: '#0A1628', borda: 'rgba(143,166,198,.15)', pad: 'rgba(170,190,215,.24)', serigrafia: 'rgba(143,166,198,.22)', vermelho: '255,61,71', azul: '158,193,255', verde: '43,212,125' };
  const sprites = {};
  const brilho = (cor, raio) => {
    const k = cor + raio; if (sprites[k]) return sprites[k];
    const c = document.createElement('canvas'); c.width = c.height = raio * 2; const x = c.getContext('2d');
    const g = x.createRadialGradient(raio, raio, 0, raio, raio, raio); g.addColorStop(0, `rgba(${cor},1)`); g.addColorStop(.35, `rgba(${cor},.35)`); g.addColorStop(1, `rgba(${cor},0)`);
    x.fillStyle = g; x.fillRect(0, 0, raio * 2, raio * 2); return (sprites[k] = c);
  };
  const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

  /* ---------------- placa ---------------- */
  function placa(box) {
    const modo = box.dataset.placa || 'hero';
    const cv = document.createElement('canvas'); cv.setAttribute('aria-hidden', 'true'); box.append(cv);
    const ctx = cv.getContext('2d');
    const base = document.createElement('canvas'), bctx = base.getContext('2d');
    let W = 0, H = 0, dpr = 1, G = 22, comps = [], trilhas = [], pulsos = [], rodando = false, visivel = false, t0 = performance.now(), ultimo = 0;
    let lant = null, lctx = null;
    let mouse = { x: -1e4, y: -1e4, ax: 0, ay: 0, tx: 0, ty: 0 };
    let varredura = { ativa: false, x: -1, inicio: 0 };

    function montar() {
      const r = box.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, W < 700 ? 1.5 : 1.75);
      cv.width = base.width = Math.round(W * dpr); cv.height = base.height = Math.round(H * dpr);
      G = W < 700 ? 18 : 22;
      gerar(); desenharBase();
      quadro(performance.now(), true);
      box.classList.add('viva');
    }

    function gerar() {
      const r = rng(modo === 'hero' ? 9127 : 4421);
      const cols = Math.ceil(W / G) + 2, lins = Math.ceil(H / G) + 2;
      const ocup = new Uint8Array(cols * lins);
      const livre = (c, l) => c >= 0 && l >= 0 && c < cols && l < lins && !ocup[l * cols + c];
      const marca = (c, l, v = 1) => { if (c >= 0 && l >= 0 && c < cols && l < lins) ocup[l * cols + c] = v; };
      const pc = W >= 1080;                       // no PC o texto fica à esquerda; no celular, embaixo
      const peso = (c, l) => {
        const x = c / cols, y = l / lins;
        if (modo !== 'hero') return 0.55;
        return pc ? Math.min(1, 0.12 + Math.pow(x, 1.4) * 1.25) : Math.min(1, 0.2 + (1 - y) * 1.1);
      };
      comps = []; trilhas = [];
      const alvo = Math.round((W * H) / (modo === 'hero' ? 30000 : 42000));
      let n = 0, tentativas = 0;
      while (comps.length < alvo && tentativas++ < alvo * 40) {
        const tipo = r() < 0.42 ? 'ic' : r() < 0.55 ? 'smd' : r() < 0.6 ? 'cap' : 'con';
        let w, h;
        if (tipo === 'ic') { w = 3 + Math.floor(r() * 5); h = 2 + Math.floor(r() * 3); if (r() < 0.3) { w = 4 + Math.floor(r() * 3); h = w; } }
        else if (tipo === 'smd') { w = r() < 0.5 ? 2 : 1; h = w === 2 ? 1 : 2; }
        else if (tipo === 'cap') { w = h = 2 + Math.floor(r() * 2); }
        else { w = 4 + Math.floor(r() * 5); h = 1; if (r() < 0.5) [w, h] = [h, w]; }
        const c = Math.floor(r() * (cols - w - 2)) + 1, l = Math.floor(r() * (lins - h - 2)) + 1;
        if (r() > peso(c + w / 2, l + h / 2)) continue;
        let ok = true;
        for (let y = l - 1; y <= l + h && ok; y++) for (let x = c - 1; x <= c + w && ok; x++) if (!livre(x, y)) ok = false;
        if (!ok) continue;
        for (let y = l - 1; y <= l + h; y++) for (let x = c - 1; x <= c + w; x++) marca(x, y, 2);
        const comp = { tipo, c, l, w, h, nome: ({ ic: 'U', smd: 'R', cap: 'C', con: 'J' })[tipo] + (++n), pinos: [], falha: false, consertadoEm: 0 };
        if (tipo === 'ic') {
          const vertical = h > w;
          if (!vertical || w === h) for (let x = c; x < c + w; x++) { comp.pinos.push([x, l - 1, 0, -1]); comp.pinos.push([x, l + h, 0, 1]); }
          if (vertical || w === h) for (let y = l; y < l + h; y++) { comp.pinos.push([c - 1, y, -1, 0]); comp.pinos.push([c + w, y, 1, 0]); }
        } else if (tipo === 'con') {
          if (w > 1) for (let x = c; x < c + w; x++) comp.pinos.push([x, l + h, 0, 1]); else for (let y = l; y < l + h; y++) comp.pinos.push([c + w, y, 1, 0]);
        } else {
          comp.pinos.push(w >= h ? [c - 1, l, -1, 0] : [c, l - 1, 0, -1]);
          comp.pinos.push(w >= h ? [c + w, l + h - 1, 1, 0] : [c + w - 1, l + h, 0, 1]);
        }
        comps.push(comp);
      }
      // trilhas: saem dos pinos, andam em linhas retas com curvas de 45 graus e terminam numa via
      for (const comp of comps) {
        for (const [pc0, pl0, dx0, dy0] of comp.pinos) {
          if (r() < (comp.tipo === 'ic' ? 0.2 : 0.1)) continue;
          let c = pc0, l = pl0, d = DIRS.findIndex(([a, b]) => a === dx0 && b === dy0), dAnt = -1;
          const pts = [[c, l]]; let passos = 0, alvoPassos = 8 + Math.floor(r() * 34), reto = 1 + Math.floor(r() * 4);
          if (!livre(c, l)) { if (ocup[l * cols + c] !== 2) continue; }
          marca(c, l, 1);
          while (passos < alvoPassos) {
            if (reto <= 0) { const v = r(); if (v < 0.5) d = (d + (r() < 0.5 ? 1 : 7)) % 8; reto = 2 + Math.floor(r() * 6); }
            const [dx, dy] = DIRS[d]; const nc = c + dx, nl = l + dy;
            if (!livre(nc, nl) || (dx && dy && (!livre(c + dx, l) && !livre(c, l + dy)))) { if (passos < 2) { pts.length = 0; } break; }
            c = nc; l = nl; marca(c, l, 1); passos++; reto--;
            if (d === dAnt) { const ult = pts[pts.length - 1]; ult[0] = c; ult[1] = l; }   // mesma direção: só estica o segmento
            else pts.push([c, l]);
            dAnt = d;
          }
          if (pts.length < 2) continue;
          const px = pts.map(([a, b]) => [a * G + G / 2, b * G + G / 2]);
          let comp2 = 0; const seg = [];
          for (let i = 1; i < px.length; i++) { const L = Math.hypot(px[i][0] - px[i - 1][0], px[i][1] - px[i - 1][1]); seg.push(L); comp2 += L; }
          trilhas.push({ px, seg, total: comp2, dono: comp, largura: r() < 0.18 ? 3 : 1.6 });
        }
      }
      // defeitos: alguns CIs começam com LED vermelho
      if (modo === 'hero') {
        const ics = comps.filter(k => k.tipo === 'ic');
        for (let i = 0; i < Math.min(3, Math.ceil(ics.length / 5)); i++) { const k = ics[Math.floor(r() * ics.length)]; if (k) k.falha = true; }
        if (reduzir) comps.forEach(k => { if (k.falha) { k.falha = false; k.consertadoEm = 1; } });
      }
      pulsos = [];
      const teto = W < 700 ? 12 : 26;
      const qtd = Math.min(teto, Math.round(trilhas.length * (economia ? 0.12 : modo === 'hero' ? 0.2 : 0.1)));
      for (let i = 0; i < qtd; i++) pulsos.push(novoPulso(r, true));
      varredura = { ativa: false, x: -1, inicio: performance.now() + 900 };
    }

    const sorte = rng(77);
    function novoPulso(r = sorte, espalhar = false) {
      const tr = trilhas[Math.floor(r() * trilhas.length)];
      if (!tr) return null;
      return { tr, s: espalhar ? r() * tr.total : 0, v: 60 + r() * 120, cor: r() < 0.85 ? COR.vermelho : COR.azul, cauda: 60 + r() * 90, ida: r() < 0.5 };
    }

    function ponto(tr, s) {
      if (s <= 0) return tr.px[0];
      let a = 0;
      for (let i = 0; i < tr.seg.length; i++) {
        if (a + tr.seg[i] >= s) { const f = (s - a) / tr.seg[i], p = tr.px[i], q = tr.px[i + 1]; return [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f]; }
        a += tr.seg[i];
      }
      return tr.px[tr.px.length - 1];
    }

    function desenharBase() {
      const c = bctx; c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
      c.lineCap = 'round'; c.lineJoin = 'round';
      // malha do plano de terra
      c.fillStyle = 'rgba(143,166,198,.035)';
      for (let x = G / 2; x < W; x += G) for (let y = G / 2; y < H; y += G) c.fillRect(x - .6, y - .6, 1.2, 1.2);
      for (const tr of trilhas) {
        c.strokeStyle = tr.largura > 2 ? COR.trilhaClara : COR.trilha; c.lineWidth = tr.largura;
        c.beginPath(); tr.px.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
        const [vx, vy] = tr.px[tr.px.length - 1];
        c.beginPath(); c.arc(vx, vy, 3.2, 0, 7); c.strokeStyle = COR.pad; c.lineWidth = 1.4; c.stroke();
      }
      c.font = `500 ${G < 20 ? 8 : 9}px "Geist Mono", ui-monospace, monospace`;
      for (const k of comps) {
        const x = k.c * G + 2, y = k.l * G + 2, w = k.w * G - 4, h = k.h * G - 4;
        if (k.tipo === 'cap') {
          const cx = x + w / 2, cy = y + h / 2, rr = Math.min(w, h) / 2;
          const g = c.createRadialGradient(cx - rr * .3, cy - rr * .3, 1, cx, cy, rr);
          g.addColorStop(0, '#2A3E5E'); g.addColorStop(1, '#0B1628');
          c.fillStyle = g; c.beginPath(); c.arc(cx, cy, rr, 0, 7); c.fill();
          c.strokeStyle = COR.borda; c.lineWidth = 1; c.stroke();
          c.beginPath(); c.arc(cx, cy, rr * .55, -0.6, 0.6); c.strokeStyle = 'rgba(170,190,215,.35)'; c.stroke();
        } else {
          const g = c.createLinearGradient(x, y, x, y + h);
          g.addColorStop(0, k.tipo === 'smd' ? '#18263A' : '#0F1C2F'); g.addColorStop(1, '#09131F');
          c.fillStyle = g; roundRect(c, x, y, w, h, k.tipo === 'ic' ? 3 : 2); c.fill();
          c.strokeStyle = COR.borda; c.lineWidth = 1; c.stroke();
          if (k.tipo === 'ic') { c.beginPath(); c.arc(x + 7, y + 7, 2.2, 0, 7); c.fillStyle = 'rgba(143,166,198,.35)'; c.fill(); }
        }
        c.fillStyle = COR.pad;
        for (const [pc, pl] of k.pinos) { const px = pc * G + G / 2, py = pl * G + G / 2; c.fillRect(px - 3, py - 3, 6, 6); }
      }
    }

    function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

    function quadro(agora, parado = false) {
      const dt = Math.min(0.05, (agora - (ultimo || agora)) / 1000); ultimo = agora;
      const t = (agora - t0) / 1000;
      // câmera acompanha o mouse devagar
      mouse.ax += (mouse.tx - mouse.ax) * 0.06; mouse.ay += (mouse.ty - mouse.ay) * 0.06;
      const ox = mouse.ax * 10, oy = mouse.ay * 8;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.drawImage(base, ox * dpr, oy * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, ox * dpr, oy * dpr);
      ctx.globalCompositeOperation = 'lighter';

      // lanterna do mouse: em volta do cursor a placa aparece mais nítida (o resto fica no escuro)
      if (fino && mouse.x > -1e3) {
        const R = 230, lx = mouse.x - ox, ly = mouse.y - oy;
        if (!lant) { lant = document.createElement('canvas'); lctx = lant.getContext('2d'); }
        const L = Math.round(R * 2 * dpr); if (lant.width !== L) { lant.width = lant.height = L; }
        lctx.globalCompositeOperation = 'source-over'; lctx.clearRect(0, 0, L, L);
        lctx.drawImage(base, (lx - R) * dpr, (ly - R) * dpr, L, L, 0, 0, L, L);
        lctx.globalCompositeOperation = 'destination-in';
        const g = lctx.createRadialGradient(L / 2, L / 2, 0, L / 2, L / 2, L / 2);
        g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.55, 'rgba(0,0,0,.6)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        lctx.fillStyle = g; lctx.fillRect(0, 0, L, L);
        ctx.drawImage(lant, lx - R, ly - R, R * 2, R * 2); ctx.drawImage(lant, lx - R, ly - R, R * 2, R * 2);
        ctx.globalAlpha = 1;
      }

      // pulsos de corrente (cometa com cauda)
      for (let i = 0; i < pulsos.length; i++) {
        const p = pulsos[i]; if (!p) continue;
        if (!parado) p.s += p.v * dt;
        if (p.s > p.tr.total + p.cauda) { pulsos[i] = novoPulso(); continue; }
        const passos = 8, spr = brilho(p.cor, 6);
        for (let k = passos - 1; k >= 0; k--) {
          const s = p.s - (k / passos) * p.cauda; if (s < 0 || s > p.tr.total) continue;
          const [x, y] = ponto(p.tr, p.ida ? s : p.tr.total - s), a = 1 - k / passos;
          ctx.globalAlpha = a * a * 0.9; const r = 2 + 4 * a; ctx.drawImage(spr, x - r, y - r, r * 2, r * 2);
        }
        if (p.s <= p.tr.total) {
          const [x, y] = ponto(p.tr, p.ida ? p.s : p.tr.total - p.s);
          ctx.globalAlpha = 0.7; ctx.drawImage(brilho(p.cor, 14), x - 14, y - 14, 28, 28);
        }
        ctx.globalAlpha = 1;
      }

      // varredura de diagnóstico + consertos
      if (modo === 'hero') {
        const ciclo = 7.5, dur = 3.2;
        if (!parado && agora >= varredura.inicio) {
          const f = ((agora - varredura.inicio) / 1000) / dur;
          if (f <= 1) {
            const x = -80 + f * (W + 160);
            const g = ctx.createLinearGradient(x - 90, 0, x + 6, 0);
            g.addColorStop(0, 'rgba(158,193,255,0)'); g.addColorStop(.85, 'rgba(158,193,255,.04)'); g.addColorStop(1, 'rgba(210,228,255,.13)');
            ctx.fillStyle = g; ctx.fillRect(x - 90 - ox, -oy - 10, 96, H + 20);
            for (const k of comps) if (k.falha && (k.c + k.w / 2) * G < x) { k.falha = false; k.consertadoEm = agora; for (let j = 0; j < 4; j++) { const tr = trilhas.find(q => q.dono === k && sorte() < .6); if (tr) pulsos.push({ tr, s: 0, v: 160, cor: COR.verde, cauda: 120, ida: true }); } }
          } else if (f > ciclo / dur) {
            // nova rodada: quebra outros componentes
            const ics = comps.filter(k => k.tipo === 'ic');
            ics.forEach(k => { if (sorte() < 0.18) { k.falha = true; } });
            if (pulsos.length > 40) pulsos.length = 40;
            varredura.inicio = agora + 400;
          }
        }
        for (const k of comps) {
          if (k.tipo !== 'ic') continue;
          const x = k.c * G + 2, y = k.l * G + 2, w = k.w * G - 4, h = k.h * G - 4;
          const lx = x + w - 7, ly = y + 7;
          if (k.falha) {
            const pisca = 0.55 + 0.45 * Math.sin(t * 6 + k.c);
            ctx.strokeStyle = `rgba(${COR.vermelho},${(0.25 + 0.35 * pisca).toFixed(3)})`; ctx.lineWidth = 1.5; roundRect(ctx, x - 2, y - 2, w + 4, h + 4, 4); ctx.stroke();
            led(lx, ly, COR.vermelho, pisca);
          } else if (k.consertadoEm) {
            const idade = parado ? 9 : (agora - k.consertadoEm) / 1000;
            if (idade < 0.7) { ctx.strokeStyle = `rgba(255,255,255,${(0.8 * (1 - idade / 0.7)).toFixed(3)})`; ctx.lineWidth = 2; roundRect(ctx, x - 3, y - 3, w + 6, h + 6, 5); ctx.stroke(); }
            led(lx, ly, COR.verde, 1);
          }
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    function led(x, y, cor, a) {
      ctx.globalAlpha = 0.9 * a; ctx.drawImage(brilho(cor, 12), x - 12, y - 12, 24, 24); ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(${cor},1)`; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 7); ctx.fill();
    }

    const laco = agora => { if (!rodando) return; quadro(agora); requestAnimationFrame(laco); };
    const ligar = () => { if (reduzir || rodando || !visivel || document.hidden) return; rodando = true; ultimo = 0; requestAnimationFrame(laco); };
    const desligar = () => { rodando = false; };

    montar();
    if (reduzir) return;
    new IntersectionObserver(([e]) => { visivel = e.isIntersecting; visivel ? ligar() : desligar(); }).observe(box);
    document.addEventListener('visibilitychange', () => document.hidden ? desligar() : ligar());
    let espera; new ResizeObserver(() => { clearTimeout(espera); espera = setTimeout(() => { const r = box.getBoundingClientRect(); if (Math.abs(r.width - W) > 2 || Math.abs(r.height - H) > 60) montar(); }, 180); }).observe(box);
    if (fino) {
      const alvo = box.closest('section,header,div') || box;
      alvo.addEventListener('pointermove', e => { const r = box.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.tx = (mouse.x / r.width - .5) * -1; mouse.ty = (mouse.y / r.height - .5) * -1; }, { passive: true });
      alvo.addEventListener('pointerleave', () => { mouse.x = mouse.y = -1e4; mouse.tx = mouse.ty = 0; });
    }
  }

  /* ---------------- osciloscópio ---------------- */
  function scope(box) {
    const cv = box.querySelector('canvas'), ctx = cv.getContext('2d');
    const status = box.querySelector('[data-scope-status]');
    let W, H, dpr, rodando = false, visivel = false, inicio = 0;
    const r = rng(311);
    const ruido = Array.from({ length: 512 }, () => r() - 0.5);
    const medir = () => { const b = cv.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 2); W = b.width; H = b.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); };
    function desenhar(agora, final = false) {
      const t = final ? 9 : (agora - inicio) / 1000;
      const k = final ? 1 : Math.min(1, Math.max(0, (t - 0.5) / 1.6));
      const e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(91,122,166,.2)'; ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += W / 10) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += H / 6) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.strokeStyle = 'rgba(91,122,166,.4)'; ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
      const fase = final ? 0 : t * 2.2, amp = H * 0.28, mid = H / 2;
      const caminho = () => {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 2) {
          const i = Math.floor((x / 3 + t * 60) % ruido.length);
          const y = mid + ruido[i] * H * 0.5 * (1 - e) - Math.sin(x / W * Math.PI * 5 + fase) * amp * e;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
      };
      const cor = e < 1 ? '255,61,71' : '255,61,71';
      ctx.lineJoin = 'round';
      caminho(); ctx.strokeStyle = `rgba(${cor},.22)`; ctx.lineWidth = 8; ctx.stroke();
      caminho(); ctx.strokeStyle = `rgba(${cor},1)`; ctx.lineWidth = 2; ctx.stroke();
      if (e >= 1 && !box.classList.contains('estavel')) { box.classList.add('estavel'); if (status) status.textContent = 'Sinal estável'; }
    }
    const laco = agora => { if (!rodando) return; desenhar(agora); requestAnimationFrame(laco); };
    medir();
    if (reduzir) { desenhar(0, true); return; }
    box.classList.remove('estavel'); if (status) status.textContent = 'Diagnosticando';
    inicio = performance.now();
    new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel && !rodando && !document.hidden) { rodando = true; requestAnimationFrame(laco); } else if (!visivel) rodando = false; }).observe(box);
    document.addEventListener('visibilitychange', () => { if (document.hidden) rodando = false; else if (visivel && !rodando) { rodando = true; requestAnimationFrame(laco); } });
    new ResizeObserver(() => { medir(); if (!rodando) desenhar(performance.now(), reduzir); }).observe(cv);
  }

  const iniciar = () => {
    document.querySelectorAll('[data-placa]').forEach(placa);
    document.querySelectorAll('[data-scope]').forEach(scope);
  };
  document.fonts?.ready ? document.fonts.ready.then(iniciar) : iniciar();
})();
