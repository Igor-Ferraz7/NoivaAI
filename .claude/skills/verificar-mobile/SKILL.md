---
name: verificar-mobile
description: Verificar Responsividade Mobile. Use sempre que criar ou editar um componente visual (botões, formulários, telas, layouts, ficheiros em src/components/) ou quando pedirem para verificar se algo fica bem no telemóvel, celular, mobile ou ecrãs pequenos.
---

# Skill: Verificar Responsividade Mobile (Noiva.AI)

**Quando usar:** Usa esta skill sempre que criares ou editares um ficheiro na pasta `src/components/` ou sempre que a equipa pedir para "verificar se fica bem no telemóvel".

**Passos:**
1. Inspeciona o ficheiro modificado procurando por classes CSS (Tailwind) orientadas a tamanhos de ecrã (ex: `md:`, `lg:`).
2. Verifica se a classe base (sem prefixo) está otimizada para ecrãs pequenos (ex: largura total, elementos empilhados).
3. Se o componente não for flexível (ex: larguras fixas em pixeis), reescreve-o usando classes utilitárias flexíveis.
4. **Parada:** Mostra à equipa um pequeno resumo das classes adicionadas/removidas e pergunta: "O comportamento mobile parece adequado?".
