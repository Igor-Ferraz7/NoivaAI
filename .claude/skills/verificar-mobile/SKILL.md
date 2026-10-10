---
name: verificar-mobile
description: Verificar Responsividade Mobile. Use sempre que criar ou editar um componente visual (botões, formulários, telas, layouts, ficheiros em src/components/ ou src/app/) ou quando pedirem para verificar se algo fica bem no telemóvel, celular, mobile ou ecrãs pequenos.
---

# Skill: Verificar Responsividade Mobile (Noiva.AI)

**Quando usar:** sempre que criares ou editares um ficheiro em `src/components/` ou `src/app/`, ou quando a equipa pedir para "verificar se fica bem no telemóvel".

**Critério:** a restrição mobile-first das specs (Spec 001, secção 8, e CA-06): a 360 px de largura, todos os campos e botões ficam visíveis sem rolagem horizontal.

**Passos:**
1. **Mede primeiro:** corre `npx playwright test ca-06`. O teste abre a página num ecrã de 360 px, com e sem mensagens de erro, e falha se algum campo ou o botão sair da largura ou se a página rolar na horizontal.
2. Se falhar, a mensagem diz que elemento saiu do ecrã (ex.: "botao acaba dentro do ecrã"). Procura nesse componente larguras fixas (`w-[400px]`, `min-w-*`, `width` em px) e troca-as por classes flexíveis (`w-full`, `min-w-0`, `max-w-*`), com a versão sem prefixo pensada para ecrãs pequenos e `md:`/`lg:` só para ecrãs maiores.
3. Se criaste um ecrã ou campo novo, acrescenta-o ao teste do CA-06 (ou ao critério equivalente da spec nova). Nunca relaxes o teste para passar.
4. Corre `npx playwright test ca-06` de novo até passar.
5. **Parada:** mostra à equipa o resultado do teste e as classes que mudaste, e pergunta: "O comportamento mobile parece adequado?".
