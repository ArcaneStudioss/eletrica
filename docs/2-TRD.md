# 2. TRD: com que peças

| Peça | Escolha | Por quê |
|---|---|---|
| Código | HTML/CSS/JS estático a partir de `templates/site-starter/` | Rápido, barato de manter, sem servidor para invadir. |
| Animação | CSS + `arcane-motion`/`arcane-ui`; GSAP 3 (ScrollTrigger) só nas cenas do PC | A Premium permite biblioteca quando o roteiro pede; a onda do osciloscópio e a trilha do circuito pedem linha do tempo. |
| Componentes 21st.dev | Consultar e adaptar para HTML puro (sem React) | A chave `API_KEY_21ST` não está nesta sessão; quando estiver, buscar referências de hero/stepper e reescrever no nosso CSS. |
| Banco de dados | Nenhum | O chamado vai direto para o WhatsApp. |
| Login | Nenhum | Não há área do cliente na v1. |
| Pagamento | Nenhum | Serviço é orçado caso a caso. |
| Hospedagem | Vercel (plano Pro) ou Cloudflare Pages | Cliente básico estático; Hobby não vale para cliente. |
| Domínio e DNS | Domínio do cliente no Registro.br; prévia em `fepower.arcanestudios.io` (Cloudflare) | Prévia com `noindex` até aprovar. |
| Integrações | WhatsApp (link com mensagem pronta), Google Meu Negócio, GA4 com consentimento, mapa | O post já vende pelo WhatsApp; o resto é SEO local. |
| Backup | Repositório no GitHub + espelho semanal criptografado (`templates/backup/backup-repo.js`) | Regra da base para site estático. |
| Segurança | Nível estático: `auditar-codigo.sh` antes e `auditar-site.sh` depois; cabeçalhos do `vercel.json` | Sem backend, o risco é baixo, mas a regra vale. |

## Custo mensal estimado
- Cliente: mensalidade R$ 150 a 200 (hospedagem, backup, ajustes pequenos, relatório).
- Arcane: parte do Vercel Pro (cerca de US$ 20/mês dividido entre clientes) ou R$ 0 no Cloudflare Pages. Domínio cerca de R$ 40/ano (pago pelo cliente).

## Riscos
- Promessa "24 h" sem estrutura real vira reclamação: confirmar antes de publicar.
- Logo de fabricante (Siemens, WEG...) sugere parceria oficial: usar só o nome em texto.
- Sem fotos reais o site perde força; IA só como fundo abstrato, nunca como "nossa equipe".
