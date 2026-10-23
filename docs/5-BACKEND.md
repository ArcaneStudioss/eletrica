# 5. Back-end: onde ficam os dados

Site estático. **Nenhum dado é guardado pela Arcane nem pelo site.** O formulário de chamado só monta a mensagem e abre o WhatsApp do cliente; o que a pessoa digitou vai direto para a conversa no WhatsApp da F&E.

## Tabelas e campos
Nenhuma.

## Quem vê e quem edita
- Visitante: só o site público.
- F&E: recebe a conversa no WhatsApp.
- Gabriel: edita textos pelo repositório (ajustes entram na mensalidade).

## Dados pessoais (LGPD)
- Coletado no formulário: equipamento, marca, sintoma, cidade (e o número do próprio WhatsApp de quem chama). Finalidade: orçamento. Guardado só no WhatsApp da F&E.
- GA4 só depois do aceite no aviso de cookies. Política de privacidade em `/politica-de-privacidade`.

## Backup e restauração
- Código no GitHub (`arcanestudioss/eletrica`) + espelho semanal criptografado (`backup-repo.js`), chave fora do servidor.
- Restauração a testar antes do lançamento (clonar o espelho e abrir o site). *(pendente)*

## Segurança
Sem segredo no código. `auditar-codigo.sh .` antes de publicar; `auditar-site.sh URL` depois; cabeçalhos de segurança no `vercel.json`.
