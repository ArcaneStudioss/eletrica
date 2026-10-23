// Gera as páginas de serviço (servicos/<slug>/index.html) a partir do index.html (cabeçalho, janela de chamado,
// rodapé e CTA fixo saem de lá, para não ter duas versões). Rodar: node ferramentas/gerar-paginas.js
const fs = require('fs'), path = require('path');
const raiz = path.join(__dirname, '..');
const DOM = 'https://fepower.arcanestudios.io';
const V = '20261023';
const idx = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
const pega = re => { const m = idx.match(re); if (!m) throw new Error('não achei ' + re); return m[0]; };
const topo = pega(/<header class="topo">[\s\S]*?<\/header>/).replace(/href="#(servicos|processo|cases|duvidas)"/g, 'href="/#$1"');
const rodape = pega(/<footer class="rodape">[\s\S]*?<\/footer>/);
const ctaFixo = pega(/<div class="cta-fixo">[\s\S]*?<\/div>/);
const dialogo = pega(/<dialog class="chamado"[\s\S]*?<\/dialog>/);
const WA = 'https://wa.me/5519982784289?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20quero%20abrir%20um%20chamado.';

const servicos = [
  { slug: 'placas-eletronicas', nome: 'Placas eletrônicas', equip: 'Placa eletrônica',
    titulo: 'Conserto de placas eletrônicas industriais',
    h1: 'Conserto de placas eletrônicas industriais.',
    lead: 'Placas de controle, de potência e fontes de máquinas industriais, diagnosticadas em bancada para achar o componente que falhou.',
    desc: 'Conserto de placas eletrônicas industriais em bancada: placas de controle, potência e fontes. Multimarcas, com laudo técnico e coleta sem custo.',
    defeitos: ['Fonte que não liga ou desliga sozinha', 'Componentes queimados por surto ou curto-circuito', 'Soldas e trilhas danificadas por calor ou vibração', 'Falha intermitente: some e volta sem motivo aparente'] },
  { slug: 'drives-e-inversores', nome: 'Drives e inversores', equip: 'Drive / inversor',
    titulo: 'Conserto de drives e inversores de frequência',
    h1: 'Conserto de drives e inversores de frequência.',
    lead: 'Inversor desarmando, com erro no display ou sem ligar. Diagnóstico em bancada, reparo e teste antes de voltar para a máquina.',
    desc: 'Conserto de inversores de frequência e drives Siemens, WEG, ABB, Schneider, Allen-Bradley, Yaskawa e outros. Laudo técnico e coleta sem custo.',
    defeitos: ['Desarma na partida ou quando entra carga', 'Erro de sobrecorrente, sobretensão ou subtensão', 'Não liga ou display apagado', 'Aquecimento, ruído ou ventilação com defeito'] },
  { slug: 'ihm', nome: 'IHMs', equip: 'IHM',
    titulo: 'Conserto de IHM (interface homem-máquina)',
    h1: 'Conserto de IHM, a tela que comanda a máquina.',
    lead: 'Tela apagada, touch sem resposta ou IHM sem conversar com o CLP. Reparo em bancada e teste antes da devolução.',
    desc: 'Conserto de IHM industrial: tela apagada, touch sem resposta, falha de comunicação. Multimarcas, com laudo técnico e coleta sem custo.',
    defeitos: ['Tela apagada, com manchas ou linhas', 'Touch sem resposta ou fora de posição', 'Sem comunicação com o CLP', 'Reinicia sozinha ou trava na inicialização'] },
  { slug: 'clp', nome: 'CLPs', equip: 'CLP',
    titulo: 'Conserto de CLP (controlador lógico programável)',
    h1: 'Conserto de CLPs e módulos.',
    lead: 'CPU em falha, entradas e saídas que não respondem ou fonte do rack com defeito. Diagnóstico em bancada e laudo do que foi feito.',
    desc: 'Conserto de CLP e módulos de entrada e saída: CPU em falha, fonte, comunicação. Multimarcas, com laudo técnico e coleta sem custo.',
    defeitos: ['CPU em falha ou que não entra em operação', 'Entradas ou saídas que não respondem', 'Fonte do rack com defeito', 'Erro de comunicação na rede da máquina'] },
  { slug: 'servomotores-e-motores', nome: 'Servomotores e motores', equip: 'Servomotor / motor',
    titulo: 'Conserto de servomotores, servodrives e motores',
    h1: 'Conserto de servomotores e motores.',
    lead: 'Servo com erro de encoder, perdendo posição, vibrando ou esquentando. Reparo e teste para a máquina voltar a ter precisão.',
    desc: 'Conserto de servomotores, servodrives e motores industriais: encoder, vibração, aquecimento. Multimarcas, com laudo técnico e coleta sem custo.',
    defeitos: ['Erro de encoder ou perda de posição', 'Vibração, ruído ou aquecimento fora do normal', 'Freio que não libera', 'Servodrive em alarme'] },
  { slug: 'manutencao-preventiva-e-corretiva', nome: 'Manutenção preventiva e corretiva', equip: 'Outro',
    titulo: 'Manutenção preventiva e corretiva de eletrônica industrial',
    h1: 'Manutenção preventiva e corretiva.',
    lead: 'Corretiva quando a máquina já parou. Preventiva para ela não parar no pior momento. As duas com laudo do que foi encontrado.',
    desc: 'Manutenção preventiva e corretiva de eletrônica industrial: placas, inversores, IHMs, CLPs e servos. Laudo técnico e coleta sem custo.',
    defeitos: ['Corretiva: equipamento parado que precisa voltar rápido', 'Preventiva: revisão antes da falha aparecer', 'Equipamento reserva revisado para ficar pronto', 'Histórico por laudo para planejar as próximas paradas'] },
  { slug: 'laudos-tecnicos', nome: 'Laudos técnicos', equip: 'Outro',
    titulo: 'Laudo técnico de equipamentos industriais',
    h1: 'Laudo técnico de equipamentos industriais.',
    lead: 'Documento do que foi encontrado, do que foi trocado e de como o equipamento foi testado. Para histórico, auditoria e decisão de compra.',
    desc: 'Laudo técnico de equipamentos industriais: causa da falha, serviço executado e teste. Para histórico, auditoria e decisão entre reparar ou trocar.',
    defeitos: ['Causa da falha, não só o sintoma', 'Serviço executado e componentes trocados', 'Como o equipamento foi testado', 'Base para decidir entre reparar ou trocar'] },
];

const seta = '<svg class="comp__seta" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 18l6-6M13 6l6 6"/></svg>';
const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

for (const s of servicos) {
  const url = `${DOM}/servicos/${s.slug}/`;
  const outros = servicos.filter(o => o !== s).map(o => `<a href="/servicos/${o.slug}/">${o.nome}</a>`).join('');
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' https://www.googletagmanager.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; base-uri 'none'; form-action 'self' https://wa.me">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>${esc(s.titulo)} · F&amp;E Power</title>
  <meta name="description" content="${esc(s.desc)}">
  <meta property="og:title" content="${esc(s.titulo)} · F&amp;E Power">
  <meta property="og:description" content="${esc(s.desc)}">
  <meta property="og:image" content="${DOM}/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Placa eletrônica com trilhas acesas e a frase: a gente traz o sinal de volta">
  <meta property="og:url" content="${url}">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="${url}">
  <meta name="ga4-id" content="">
  <meta name="theme-color" content="#ECEEE9">
  <meta name="color-scheme" content="light">
  <link rel="icon" href="/favicon.svg?v=${V}" type="image/svg+xml">
  <link rel="preload" href="/fonts/Geist-Variable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/arcane-ui.css?v=${V}">
  <link rel="stylesheet" href="/arcane-motion.css?v=${V}">
  <link rel="stylesheet" href="/arcane-conversao.css?v=${V}">
  <link rel="stylesheet" href="/styles.css?v=${V}">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@graph":[{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Início","item":"${DOM}/"},{"@type":"ListItem","position":2,"name":"Serviços","item":"${DOM}/#servicos"},{"@type":"ListItem","position":3,"name":"${s.nome}","item":"${url}"}]},{"@type":"Service","name":"${s.titulo}","description":"${s.desc}","provider":{"@type":"ProfessionalService","name":"F&E Power Serviços Industrial","telephone":"+55 19 98278-4289","url":"${DOM}/"}}]}
  </script>
</head>
<body class="tem-cta-fixo">
  <!-- Gerado por ferramentas/gerar-paginas.js. Editar lá, não aqui. -->
  <div class="progresso-scroll" aria-hidden="true"></div>
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>
  ${topo}
  <main id="conteudo">
    <section class="pagina-topo">
      <div data-placa="calma"></div>
      <nav class="migalha" aria-label="Você está em"><ol><li><a href="/">Início</a></li><li><a href="/#servicos">Serviços</a></li><li aria-current="page">${s.nome}</li></ol></nav>
      <div class="bloco">
        <h1 data-reveal>${s.h1}</h1>
        <p class="lead" data-reveal style="--i:1">${s.lead}</p>
        <div class="acoes" data-reveal style="--i:2">
          <a class="btn btn-pulso" data-chamado="${s.equip}" href="${WA}" target="_blank" rel="noopener noreferrer">Abrir chamado no WhatsApp</a>
          <a class="btn btn-vidro" href="tel:+5519982784289">Ligar (19) 98278-4289</a>
        </div>
      </div>
    </section>
    <section class="bloco duas">
      <div>
        <p class="rotulo">Sintomas que chegam na bancada</p>
        <h2 data-reveal>Reconhece algum desses?</h2>
        <ul class="lista-tec" data-stagger>${s.defeitos.map(x => `<li>${x}</li>`).join('')}</ul>
      </div>
      <div>
        <p class="rotulo">Como funciona</p>
        <h2 data-reveal>Da coleta ao laudo.</h2>
        <ol class="passos">
          <li><span>01</span><div><b>Chamado pelo WhatsApp</b><p>Equipamento, marca, o que está acontecendo e a cidade.</p></div></li>
          <li><span>02</span><div><b>Coleta sem custo</b><p>A gente busca na sua empresa. Consulte se a sua cidade está na rota.</p></div></li>
          <li><span>03</span><div><b>Diagnóstico e orçamento</b><p>Você aprova antes de qualquer reparo.</p></div></li>
          <li><span>04</span><div><b>Reparo, teste e laudo</b><p>Volta testado e com o laudo do que foi feito.</p></div></li>
        </ol>
        <p class="promessa">Atendimento 24 horas, de segunda a segunda.</p>
      </div>
    </section>
    <section class="bloco" style="padding-top:0">
      <p class="rotulo">Multimarcas</p>
      <p style="font-size:clamp(1.3rem,4vw,1.9rem);font-weight:650;letter-spacing:-.02em;margin:0;max-width:30ch">Siemens, WEG, ABB, Schneider Electric, Allen-Bradley, Yaskawa e outras marcas.</p>
      <p class="rotulo" style="margin-top:48px">Outros serviços</p>
      <div class="outros">${outros}</div>
    </section>
  </main>
  ${rodape}
  ${ctaFixo.replace(/data-chamado /g, `data-chamado="${s.equip}" `)}
  ${dialogo}
  <script src="/arcane-ui.js?v=${V}"></script>
  <script src="/placa.js?v=${V}"></script>
  <script src="/site.js?v=${V}"></script>
  <script src="/arcane-analytics.js?v=${V}"></script>
</body>
</html>
`;
  fs.mkdirSync(path.join(raiz, 'servicos', s.slug), { recursive: true });
  fs.writeFileSync(path.join(raiz, 'servicos', s.slug, 'index.html'), html);
}

// sitemap
const hoje = '2026-10-23';
const urls = ['/', ...servicos.map(s => `/servicos/${s.slug}/`), '/politica-de-privacidade/'];
fs.writeFileSync(path.join(raiz, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${DOM}${u}</loc><lastmod>${hoje}</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log('geradas', servicos.length, 'páginas + sitemap.xml');
