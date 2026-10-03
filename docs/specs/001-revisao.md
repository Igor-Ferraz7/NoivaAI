# Revisão Cruzada – Spec 001 (Pesquisa Inicial de Fornecedores)

- **Revisor:** Andrey Vieira
- **Equipa do revisor:** Andrey Vieira, Guilherme Marques, Leonardo Pacheco e João Pedro Almeida
- **Data:** 03/10/2026
- **Versão revista:** commit `4658f3e` de `docs/specs/001-pesquisa-fornecedores.md`
- **Perguntas:** as três da troca entre equipes da Aula 07

## 1. Conseguiu entender O QUE deve ser construído sem perguntar nada?
> Quase tudo. Entendi que é um formulário com 5 campos, validações e um botão que só ativa quando tá tudo certo. Mas ainda ficaram umas dúvidas, tipo qual mensagem aparece quando o orçamento é zero ou a UF é inválida, e o que acontece se a IA der erro no carregamento.

**O que a equipa fez:** tabela de mensagens de erro por regra e nova RN-06 para a falha do agente (decisão D-08).

## 2. Achou alguma frase que admite DUAS LEITURAS diferentes?
> Sim, o "Orçamento máximo". Não dá pra saber se é o orçamento do casamento inteiro ou só daquele fornecedor que a pessoa escolheu. Por exemplo, os R$ 15.000 do caso feliz podem ser pro casamento todo ou só pro buffet.

**O que a equipa fez:** o campo passou a ser "Orçamento máximo para a categoria", com a definição explícita na secção Dados e no caso feliz (decisão D-07).

## 3. Consegue dizer, lendo SÓ os critérios de aceite, se a feature está pronta?
> Não totalmente. Os critérios testam a data no passado, o envio com sucesso e o botão bloqueado, mas não testam orçamento zero, UF inválida nem a regra do celular de 360 px. Daria pra entregar a feature com essas partes quebradas e ela ainda "passaria" nos critérios.

**O que a equipa fez:** novos critérios CA-04 (orçamento zero), CA-05 (UF inválida), CA-06 (ecrã de 360 px) e CA-07 (falha do agente) (decisão D-09).
