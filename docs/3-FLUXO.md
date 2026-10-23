# 3. Fluxo: o que cada clique faz

## Lista de telas
1. Início (uma página longa)
2. Páginas por equipamento: placas, drives e inversores, IHMs, CLPs, servomotores, manutenção, laudos (mesmo molde, texto próprio)
3. Obrigado (depois de abrir o chamado)
4. Política de privacidade
5. 404

## Caminho principal do visitante
1. Chega no início (Google ou Instagram) e vê o hero: o que fazem + botão "Chamar no WhatsApp".
2. Clica no botão → abre janela (modal) "Abrir chamado" com 4 campos: equipamento (lista), marca (lista com "outra"), sintoma (texto curto), cidade.
3. Clica "Enviar pelo WhatsApp" → abre o WhatsApp com a mensagem pronta e a página vai para "Obrigado" (com prazo de resposta e o que preparar: foto da etiqueta do equipamento).
4. Caminho curto: botão fixo no celular "WhatsApp" e "Ligar" abrem direto, sem formulário.
5. Quem rola: serviços → processo (OS) → marcas → cases reais *(quando houver)* → dúvidas (5 perguntas) → área de coleta e mapa → equipe → contato.

## Casos de erro e vazio
- Campo obrigatório vazio: aviso embaixo do campo, sem `alert`.
- WhatsApp não abre (PC sem app): a página de obrigado mostra o número e o botão do WhatsApp Web.
- JS desligado: todo conteúdo visível, botões viram links diretos `wa.me` e `tel:`.
- Movimento reduzido: osciloscópio já aparece com a onda limpa, sem animação.
- Página inexistente: 404 no tema do site ("Sinal não encontrado") com links para início e WhatsApp.

## Telas obrigatórias dos 20 itens
404, obrigado e política de privacidade incluídas acima.
