# 4. Design: qual é a cara

Mobile primeiro (390 px), PC por cima. Conceitos desenhados no Figma: https://www.figma.com/design/sS7I9WpkK3J5iLa315mqv3

## Dois caminhos (o Gabriel e o cliente escolhem um)

### A · "Sinal restabelecido" (tema claro, bancada de laboratório)
- **Metáfora:** a máquina chega com ruído e sai com sinal limpo. Hero com um osciloscópio: a linha entra tremida e vira uma onda estável. Uma trilha vermelha de circuito desce a página ligando as seções; cada serviço é um componente da placa (U1, U2...) que acende quando a trilha chega.
- **Cores:** fundo bancada `#F2F3EF`, texto azul-noite `#0E1A2B`, texto apoio `#55606E`, destaque vermelho da marca `#C8202B`, linhas `#D9DCD4`.
- **Fontes:** Geist (títulos 600, texto 400) + Geist Mono (leituras e rótulos).
- **Cantos:** 6 px (botões e cartões), 14 px só na tela do osciloscópio.

### B · "Ordem de serviço" (tema escuro, folha técnica)
- **Metáfora:** o site é uma OS aberta. Hero com o cartão da OS em que as etapas acendem sozinhas (coleta, diagnóstico, orçamento, reparo, teste, laudo). Título em bloco: "DIAGNÓSTICO. REPARO. LAUDO."
- **Cores:** fundo `#0B1422`, painel `#111D30`, texto `#EEF1F5`, apoio `#93A1B5`, destaque `#E5323B`, linhas `#22324B`.
- **Fontes:** Archivo ExtraBold (títulos) + JetBrains Mono (rótulos e botões).
- **Cantos:** 0 (tudo reto, cara de documento técnico).

**Recomendação da Arcane: A.** É diferente de tudo que já fizemos (claro, sem vídeo de fundo), conversa com "solução e tecnologia" e o osciloscópio explica o serviço sem texto. O B fica como plano se o cliente preferir algo mais "pesado".

## Botões, campos e espaços (valem para os dois)
- Principal: vermelho cheio, texto branco, "Chamar no WhatsApp". Secundário: contorno na cor do texto.
- Espaços: 8, 16, 24, 40, 64, 120. Toque mínimo 44 px. Rótulo acima do campo.

## Movimento (Premium, intensidade 6)
1. **Uau 1, hero:** onda do osciloscópio estabiliza (A) ou etapas da OS acendem (B). 1,6 s, só `transform/opacity` e `stroke-dashoffset`.
2. **Uau 2, rolagem (só PC):** trilha de circuito desce a página e acende os serviços (GSAP ScrollTrigger). No celular: entram em sequência por tempo.
3. **Uau 3, processo:** "raio-x" do equipamento: ao passar o mouse/tocar num serviço, aparece o que é testado na bancada.
Plano B: movimento reduzido mostra o estado final parado; sem JS tudo visível.

## Acabamento do navegador
Barra de rolagem fina nas cores do tema, seleção vermelha clara, foco visível 3 px, selects e autofill estilizados, modal próprio (nunca `alert/confirm/prompt`). Ver `native-ui-polish.md`.

## Proibições
Tracinho longo em texto, número ou depoimento inventado, foto de IA como equipe, logo de fabricante, OS de exemplo sem a palavra "EXEMPLO".

## Decisão (23/10/2026)
Gabriel aprovou e pediu "mais chamativo, menos artificial". Ficou o **A** com o topo escuro: a placa eletrônica viva em canvas (corrente nas trilhas, varredura de diagnóstico que acha os defeitos e conserta, LED vermelho vira verde, lanterna no mouse), o osciloscópio por cima, painel vermelho "Máquina parada custa caro" e a OS do conceito B na seção de processo. Página clara (bancada) com painéis escuros/vermelho.
Desempenho: brilhos pré-desenhados (sprites), sem `backdrop-filter`/`mix-blend-mode` sobre o canvas, teto de pulsos (34 celular, 70 PC), pausa fora da tela. Sem JS: imagem estática da placa (`img/placa-*.webp`) e onda em SVG.

## Tela de carregamento (pedido do Gabriel, 23/10/2026)
"Ligando o sistema": a engrenagem se desenha e parte girando como motor, o arco azul fecha em volta, o nome entra, um pulso elétrico corre na linha e a porcentagem segue o carregamento real. Em 100% a linha inteira acende (clarão) e a tela fecha num círculo com um anel vermelho abrindo o site. Dura cerca de 2,3 a 3 s, aparece **uma vez por visita**, nunca com movimento reduzido nem sem JS, e tem trava que a tira do ar em 5,4 s mesmo se algo falhar (`carga.js` + fim do `styles.css`).
Logo da F&E redesenhada em vetor (engrenagem vermelha `#E3262B`, arcos azuis `#1F6FD8`/`#4A97EC`, nome em Geist 800): a engrenagem gira e entra, os arcos giram em sentidos opostos e fecham, o nome se revela e os arcos pulsam até 100%. Se chegar o arquivo original, trocar mantendo as classes `engrenagem`, `ponta`, `arco` e `nome`.

**Botões em pílula** (pedido do Gabriel, 23/10): todos os `.btn` com `border-radius: 999px`; cartões continuam com cantos de 8 a 18 px.

## Topo mais calmo (pedido do Gabriel, 23/10/2026: "muito poluído")
Placa com metade dos componentes, sem etiquetas, trilhas e pinos bem mais apagados, poucos pulsos (26 no PC, 12 no celular), varredura discreta e no máximo 3 defeitos. Camada escura mais forte sobre a placa. No PC, a placa aparece mais nítida só em volta do mouse (lanterna), então o detalhe técnico fica como descoberta, não como ruído.

## Respiro no celular (pedido do Gabriel, 23/10/2026: "muito apertado")
No celular: topo só com título, frase e um botão (osciloscópio e "Ligar" saem; o "Ligar" fica na barra fixa); barra fixa só aparece depois que o botão do topo sai da tela; seções com 84 px de respiro; a OS ilustrada some (os passos já contam o processo); painel vermelho vira lista com linhas em vez de três caixas; laudo reto com o selo "exemplo" dentro do papel; contato com um botão só. PC sem mudança.
