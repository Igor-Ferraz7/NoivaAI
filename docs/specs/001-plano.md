# Plano de tarefas – Spec 001 (Pesquisa Inicial de Fornecedores)

- **Spec de origem:** [`001-pesquisa-fornecedores.md`](001-pesquisa-fornecedores.md), versão do commit `7981210`
- **Ciclo:** especificar → planejar → implementar → verificar → atualizar a spec
- **Regra dos commits:** um commit por tarefa; a mensagem cita a spec e os critérios atendidos, no formato `tipo(001): descrição [CA-0X]`.

## 1. Decisões de desenho (para a equipe revisar antes do código)

| # | Decisão | Por quê |
| :--- | :--- | :--- |
| P-01 | **Stack:** Next.js 15.5.26, React 19.3.0, Tailwind CSS 4.3.3, com versões exatas no `package.json` (sem `^`) e o `package-lock.json` commitado. | É a stack que o `AGENTS.md` já previa. Com as versões exatas, um clone limpo instala exatamente o mesmo que a gente testou. Todas têm pelo menos duas semanas de publicação. |
| P-02 | **Testes em dois níveis:** o `node --test` para as regras puras (RN-01 a RN-05) e o Playwright 1.63.0 (navegador Chromium de verdade) para os critérios de aceite. O `npm test` roda os dois. | O CA-06 (360 px sem rolagem horizontal) só pode ser medido num navegador real. Custo: baixar o Chromium uma vez (`npx playwright install chromium`, cerca de 150 MB). |
| P-03 | **O agente da Spec 001 é um substituto (stub):** a rota `POST /api/pesquisa` valida os dados de novo e responde `202 Recebido`. Não há chamada à OpenAI/Gemini. | A resposta do agente com fornecedores é a Spec 002. Sem IA real, não há chave, custo nem segredo no repositório. A troca pelo agente real fica num único arquivo, o `src/lib/agente.js`. |
| P-04 | **Depois de uma resposta de sucesso**, o ecrã mostra "Recebemos o seu pedido. A lista de fornecedores chega em breve." | A spec não diz o que acontece quando o agente responde bem, porque isso é a Spec 002. Sem esta tela, o indicador de carregamento ficaria girando para sempre. Entra na spec como decisão provisória. |
| P-05 | **Data prevista:** `<input type="date">`, o seletor nativo do navegador. | O seletor só aceita datas que existem, então não é preciso inventar uma mensagem para "formato inválido". No celular, abre o calendário do sistema. Num navegador em português, a data aparece como DD/MM/AAAA. |
| P-06 | **Quando a mensagem de erro aparece:** só quando o campo está preenchido e viola a regra. Campo vazio não mostra erro, só mantém o botão desativado. | É o que o CA-03 descreve: com campos em falta, o botão fica cinzento e não aparece nenhuma mensagem. |
| P-07 | **Cidade/UF:** aceita "Cidade - UF" com ou sem espaços em volta do hífen e com a UF em minúsculas, que é convertida para maiúsculas. Qualquer texto fora do formato, como "Rio Verde" sem UF, mostra a mensagem da RN-05. | A spec só define uma mensagem para este campo. Aceitar "go" e "Rio Verde-GO" evita rejeitar quem escreve com pressa no celular. |
| P-08 | **Orçamento:** campo de texto com teclado numérico. Aceita "15000", "15.000", "15.000,50" e "0,01". Um valor fora do formato (letras, três casas decimais) mostra a mensagem da RN-03. | A spec diz "até 2 casas decimais", mas não diz que mensagem aparece se a regra for violada. Vai para a spec como decisão. |
| P-09 | **Limite de 60 s:** o pedido é cancelado aos 60 segundos (`AbortController`). Nos testes, o Playwright adianta o relógio (`page.clock`) e simula a falha do agente interceptando a rede (`page.route`). | Assim o teste do CA-07 não espera 60 segundos de verdade, e o produto não carrega código que só existe para os testes. |

## 2. Tarefas

| # | Tarefa | Critério | Sensor: como sabemos que está pronta |
| :--- | :--- | :--- | :--- |
| T1 | Esqueleto: Next.js, React e Tailwind instalados; página `/` com o título; scripts `dev`, `build` e `start`; o `AGENTS.md` com os comandos novos. | — | `npm run build` termina sem erro e `npm run dev` abre a página. |
| T2 | Regras de validação puras em `src/lib/pesquisa.js`, com as mensagens literais da spec. | RN-01 a RN-05 | `tests/unit/pesquisa.test.js` (`node --test`) |
| T3 | Playwright configurado; formulário com os cinco campos, as oito categorias e o botão "Encontrar Fornecedores" desativado enquanto falta algum dado. | CA-03 | `tests/e2e/ca-03-botao-bloqueado.spec.js` |
| T4 | Contorno vermelho e mensagem abaixo do campo para data no passado, orçamento zero e UF inválida. | CA-01, CA-04, CA-05 | `tests/e2e/ca-01…`, `ca-04…`, `ca-05…` |
| T5 | Envio: a rota `POST /api/pesquisa` com o agente substituto (P-03), o indicador de carregamento e a tela de pedido recebido (P-04). | CA-02 | `tests/e2e/ca-02-submissao.spec.js` |
| T6 | Falha do agente: um erro ou 60 s sem resposta trazem de volta o formulário preenchido com a mensagem da RN-06. | CA-07 | `tests/e2e/ca-07-falha-agente.spec.js` (casos de erro e de 60 s) |
| T7 | Verificação em 360 px: nenhum campo nem o botão saem do ecrã, mesmo com as mensagens de erro visíveis. | CA-06 | `tests/e2e/ca-06-ecra-360.spec.js` |
| T8 | Spec 001 atualizada com as decisões que a implementação tomou (P-04, P-07, P-08). | — | Revisão humana do diff da spec. |
| T9 | Diário do agente (`docs/harness/diario-001.md`) e ajustes do harness aprendidos nesta feature. | — | Revisão humana. |

**Ordem:** T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9. Cada tarefa só começa com `npm run lint` e `npm test` verdes na anterior.

## 3. Fora deste plano
- A lista de fornecedores devolvida pelo agente e a chamada à IA real (Spec 002).
- Autenticação, gravação de perfis, WhatsApp e e-mail (fora do escopo da spec).
- CI no GitHub: fica como sugestão no diário.

## 4. Revisão da equipe
- **Revisor:** Igor Sousa Ferraz Aragão, em 09/10/2026, antes de qualquer código.
- **Perguntas que o agente fez antes de começar:** o que mostrar depois do sucesso (P-04), qual ferramenta de teste usar (P-02), IA real ou agente substituto (P-03) e se podia fazer o push no fim.
- **Resultado:** plano aprovado sem mudanças. P-02, P-03 e P-04 ficaram como propostos, e o push foi autorizado para depois dos testes e do teste de clone limpo.
