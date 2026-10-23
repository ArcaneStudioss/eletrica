# 6. Plano: em que ordem construir

| # | Etapa | Como testar | Status |
|---|---|---|---|
| 0 | Gabriel aprova os 6 documentos e escolhe o conceito (A ou B) | OK por escrito | feito (23/10: "vamo pro código", conceito A mais chamativo) |
| 1 | Esqueleto a partir de `templates/site-starter/` + tokens do conceito | abre em 390 e 1440 px, sem erro no console | feito |
| 2 | Hero com o momento uau 1 + plano B parado | movimento reduzido e JS desligado | feito |
| 3 | Serviços, processo (OS), marcas em texto, dúvidas, área de coleta, equipe | leitura no celular, contraste AA | feito (equipe e avaliações aguardam material real) |
| 4 | Modal "Abrir chamado" → WhatsApp → página de obrigado | testar envio no celular e no PC | feito (validação testada; envio real no WhatsApp a conferir no aparelho) |
| 5 | Trilha de circuito (uau 2, só PC) e raio-x (uau 3) | 60 fps no PC, nada preso no celular | feito (barramento + OS que acompanha a leitura; 56 fps no PC) |
| 6 | Páginas por equipamento (SEO local) | títulos e descriptions únicos | feito (7 páginas, `ferramentas/gerar-paginas.js`) |
| 7 | Os 20 itens (`checar-20-itens.sh`, zero FALTA) | script | feito (0 FALTA, 1 MANUAL: mapa sem endereço) |
| 8 | Segurança (`auditar-codigo.sh`, zero FALHA) | script | feito (0 FALHA) |
| 9 | QA (`delivery-checklist.md`), screenshots 390/1440, grep de caixas nativas | checklist | feito |
| 10 | Backup configurado e restauração testada | restaurar numa pasta limpa | a fazer |
| 11 | Prévia `fepower.arcanestudios.io` (noindex) → aprovação → domínio final, `auditar-site.sh` | curl + celular | a fazer |
| 12 | Resumo ao Gabriel: link, preço, upsells, pendências | | a fazer |
