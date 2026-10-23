# F&E Power · site

Site da F&E Power Serviços Industrial (reparo de eletrônica industrial). Projeto da Arcane Studios.

- Documentos do projeto: `docs/` (PRD, TRD, Fluxo, Design, Back-end, Plano)
- Conceitos no Figma: https://www.figma.com/design/sS7I9WpkK3J5iLa315mqv3

## Como mexer
- Site estático, sem build. Páginas de serviço são geradas: editar `ferramentas/gerar-paginas.js` e rodar `node ferramentas/gerar-paginas.js` (cabeçalho, janela de chamado e rodapé vêm do `index.html`).
- A cada deploy, trocar o `?v=20261023b` nos HTML e no gerador.
- `.vercelignore` impede que `docs/` (com preços) e `ferramentas/` vão para o ar.
- `vercel.json` manda `X-Robots-Tag: noindex` enquanto é prévia. **Tirar no lançamento** e trocar `fepower.arcanestudios.io` pelo domínio final (canonical, og, sitemap, robots).
