# Spec 001 - Pesquisa Inicial de Fornecedores

## 1. Objetivo
Permitir que o utilizador (noivos) informe as características principais do seu casamento para que o sistema possa gerar uma pesquisa orientada de fornecedores compatíveis com a sua realidade.

## 2. Escopo
**O que entra:**
- Formulário de captura com os campos: Cidade/UF, Data prevista, Categoria desejada (ex: Buffet, Fotografia, Espaço), Faixa de orçamento e Número estimado de convidados.
- Validação dos dados inseridos antes de enviar para o processamento do agente.
- Exibição de estado de carregamento enquanto o agente processa a lista.

**O que não entra (Fora do escopo):**
- A resposta final do agente com a lista de fornecedores (será tratado na Spec 002).
- Autenticação de utilizador ou gravação de perfis (nesta fase será de uso anónimo/livre).
- Integração com WhatsApp ou envio de e-mails para fornecedores.

## 3. Atores
- **Noivo/Noiva:** O utilizador que está a organizar o casamento e a operar o sistema em busca de fornecedores.

## 4. Dados
- Cidade/UF (texto, obrigatório).
- Data Prevista (formato de data, opcional - pois podem ainda não ter data fechada).
- Categoria de Fornecedor (seleção única: Espaço, Buffet, Fotografia, etc., obrigatório).
- Orçamento Máximo (valor numérico, obrigatório).
- Número Estimado de Convidados (valor numérico inteiro, obrigatório).

## 5. Regras de Negócio
- **RN-01:** A data prevista, se preenchida, não pode ser anterior à data atual do sistema.
- **RN-02:** O número estimado de convidados deve ser maior que zero.
- **RN-03:** O orçamento máximo deve ser um valor positivo e maior que zero.
- **RN-04:** O botão "Encontrar Fornecedores" só fica ativo se todos os campos obrigatórios estiverem preenchidos e válidos.

## 6. Tabela de Exemplos
| Cenário | Categoria | Convidados | Orçamento | Data Prevista | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Caso Feliz** | Buffet | 150 | 15000 | 20/12/2027 | Botão ativo, submissão permitida. |
| **Caso de Borda** | Fotografia | 50 | 2000 | Vazio | Botão ativo, submissão permitida (data é opcional). |
| **Caso de Erro** | Espaço | -10 | 5000 | 15/10/2027 | Erro na RN-02: Convidados deve ser maior que zero. Botão inativo. |

## 7. Critérios de Aceite
**CA-01: Validação de data no passado**
- **Dado** que o utilizador está a preencher o formulário de pesquisa
- **Quando** insere uma data que já passou (ex: "10/01/2020")
- **Então** o campo fica com contorno vermelho, mostra a mensagem "A data não pode estar no passado" e o botão de envio permanece bloqueado.

**CA-02: Submissão com sucesso**
- **Dado** que o utilizador preencheu Cidade, Categoria, Orçamento e Convidados corretamente
- **Quando** clica no botão "Encontrar Fornecedores"
- **Então** o formulário desaparece, o ecrã exibe um indicador de carregamento e a mensagem "A nossa IA está a procurar os melhores fornecedores para si...".

**CA-03: Botão bloqueado por falta de dados**
- **Dado** que o utilizador abriu a página de pesquisa
- **Quando** preenche apenas a Cidade e a Categoria
- **Então** o botão "Encontrar Fornecedores" mantém-se desativado (cinzento) e não permite o clique.

## 8. Restrições
- O formulário deve ser "mobile-first", uma vez que a maioria do público-alvo fará a pesquisa via telemóvel através de links no Instagram/TikTok.

---

## Secção de Decisões
**Ambiguidade encontrada:** Inicialmente exigimos que a data fosse obrigatória para ajudar a IA a filtrar quem tem agenda.
**Decisão da equipa:** Tornámos a data opcional.
**Motivo:** Muitas pessoas começam a procurar espaços ou fotógrafos antes de fechar a data exata, guiando-se pela disponibilidade do fornecedor. Obrigá-los a inventar uma data criaria fricção.

**Pergunta de validação:** Se o código fosse apagado agora, esta spec seria suficiente para reconstruí-lo?
**Resposta:** Sim. O comportamento do formulário, as regras de validação visual, a obrigatoriedade dos campos e as reações do ecrã estão descritos sem depender de tecnologias, permitindo que um agente reconstrua o componente do zero.
