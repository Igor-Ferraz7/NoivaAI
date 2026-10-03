# Spec 001 - Pesquisa Inicial de Fornecedores

## 1. Objetivo
Permitir que os noivos informem cidade, categoria de fornecedor, orçamento máximo para essa categoria, número de convidados e, opcionalmente, a data do casamento, para que o agente de IA receba esses dados e faça a pesquisa de fornecedores que atendam a esses cinco critérios.

## 2. Escopo
**O que entra:**
- Formulário com os campos: Cidade/UF, Data prevista, Categoria de fornecedor, Orçamento máximo para a categoria e Número estimado de convidados.
- O sistema valida os dados (RN-01 a RN-05) antes de os enviar ao agente.
- O sistema exibe um indicador de carregamento enquanto o agente processa o pedido.
- O sistema avisa o utilizador quando o agente não responde ou devolve erro.

**O que não entra (Fora do escopo):**
- A resposta final do agente com a lista de fornecedores (Spec 002).
- Autenticação de utilizador ou gravação de perfis (nesta fase o uso é anónimo).
- Integração com WhatsApp ou envio de e-mails para fornecedores.
- Pesquisa de mais de uma categoria no mesmo envio.

## 3. Atores
- **Noivo/Noiva:** a pessoa que organiza o casamento e preenche o formulário de pesquisa.

## 4. Dados
| Campo | Tipo | Obrigatório |
| :--- | :--- | :--- |
| Cidade/UF | Texto no formato "Cidade - UF", com UF de 2 letras de uma das 27 unidades federativas | Sim |
| Data prevista | Data (DD/MM/AAAA) | Não |
| Categoria de fornecedor | Seleção única entre: Espaço, Buffet, Fotografia, Filmagem, Decoração, Música/DJ, Vestido/Traje, Cerimonial | Sim |
| Orçamento máximo para a categoria | Valor em reais (R$), com até 2 casas decimais, que os noivos aceitam gastar **só com o fornecedor da categoria escolhida** (não é o orçamento do casamento inteiro) | Sim |
| Número estimado de convidados | Número inteiro | Sim |

## 5. Regras de Negócio
- **RN-01:** A data prevista, se preenchida, não pode ser anterior à data atual do sistema.
- **RN-02:** O número estimado de convidados deve ser um inteiro maior que zero.
- **RN-03:** O orçamento máximo para a categoria deve ser maior que R$ 0,00.
- **RN-04:** O botão "Encontrar Fornecedores" só fica ativo quando os quatro campos obrigatórios estão preenchidos e nenhum campo viola RN-01, RN-02, RN-03 ou RN-05.
- **RN-05:** A UF informada deve ser uma das 27 siglas oficiais (AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO).
- **RN-06:** Se o agente devolver erro ou não responder em 60 segundos, o sistema volta a exibir o formulário com os dados já preenchidos e a mensagem "Não conseguimos procurar fornecedores agora. Tente novamente.".

**Mensagens de erro por regra** (exibidas abaixo do campo, que fica com contorno vermelho):

| Regra | Mensagem |
| :--- | :--- |
| RN-01 | "A data não pode estar no passado" |
| RN-02 | "O número de convidados deve ser maior que zero" |
| RN-03 | "O orçamento deve ser maior que R$ 0,00" |
| RN-05 | "UF inválida. Use a sigla de 2 letras do estado" |

## 6. Tabela de Exemplos (RN-04, a regra mais importante)
| Cenário | Cidade/UF | Categoria | Convidados | Orçamento da categoria | Data Prevista | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Caso Feliz** | Rio Verde - GO | Buffet | 150 | 15000 (só para o buffet) | 20/12/2027 | Botão ativo, submissão permitida. |
| **Caso de Borda** | Goiânia - GO | Fotografia | 1 | 0,01 | Vazio | Botão ativo, submissão permitida (data é opcional; 1 convidado e R$ 0,01 são os mínimos válidos). |
| **Caso de Erro** | Jataí - GO | Espaço | -10 | 5000 | 15/10/2027 | Mensagem "O número de convidados deve ser maior que zero". Botão inativo. |

## 7. Critérios de Aceite
**CA-01: Validação de data no passado**
- **Dado** que o utilizador está a preencher o formulário de pesquisa
- **Quando** insere a data "10/01/2020"
- **Então** o campo fica com contorno vermelho, mostra a mensagem "A data não pode estar no passado" e o botão "Encontrar Fornecedores" permanece desativado.

**CA-02: Submissão com sucesso**
- **Dado** que o utilizador preencheu Cidade/UF, Categoria, Orçamento máximo para a categoria e Convidados com valores que cumprem RN-02, RN-03 e RN-05
- **Quando** clica no botão "Encontrar Fornecedores"
- **Então** o formulário deixa de ser exibido e o ecrã mostra um indicador de carregamento com a mensagem "A nossa IA está a procurar os melhores fornecedores para si...".

**CA-03: Botão bloqueado por falta de dados**
- **Dado** que o utilizador abriu a página de pesquisa
- **Quando** preenche apenas a Cidade/UF e a Categoria
- **Então** o botão "Encontrar Fornecedores" mantém-se desativado (cinzento) e clicar nele não envia o formulário.

**CA-04: Orçamento zero**
- **Dado** que o utilizador está a preencher o formulário de pesquisa
- **Quando** insere "0" no campo Orçamento máximo para a categoria
- **Então** o campo fica com contorno vermelho, mostra a mensagem "O orçamento deve ser maior que R$ 0,00" e o botão "Encontrar Fornecedores" permanece desativado.

**CA-05: UF inválida**
- **Dado** que o utilizador está a preencher o formulário de pesquisa
- **Quando** insere "Rio Verde - XX" no campo Cidade/UF
- **Então** o campo fica com contorno vermelho, mostra a mensagem "UF inválida. Use a sigla de 2 letras do estado" e o botão "Encontrar Fornecedores" permanece desativado.

**CA-06: Formulário num ecrã de 360 px**
- **Dado** que o utilizador abre a página de pesquisa num ecrã com 360 px de largura
- **Quando** percorre o formulário do primeiro campo até ao botão
- **Então** todos os campos e o botão "Encontrar Fornecedores" ficam visíveis sem rolagem horizontal.

**CA-07: Falha do agente durante o carregamento**
- **Dado** que o utilizador enviou o formulário e o ecrã mostra o indicador de carregamento
- **Quando** o agente devolve erro ou passam 60 segundos sem resposta
- **Então** o formulário volta a ser exibido com os mesmos dados preenchidos e a mensagem "Não conseguimos procurar fornecedores agora. Tente novamente.".

## 8. Restrições
- Mobile-first: o formulário inteiro tem de ser utilizável num ecrã de 360 px de largura, sem rolagem horizontal, porque o público chega à página por links no Instagram e no TikTok, abertos no telemóvel.

---

## Secção de Decisões
**D-01 – Data obrigatória ou opcional**
- **Ambiguidade:** inicialmente exigimos a data para ajudar a IA a filtrar quem tem agenda.
- **Decisão:** a data é opcional.
- **Motivo:** muitos noivos começam a procurar espaço ou fotógrafo antes de fechar a data, guiando-se pela disponibilidade do fornecedor. Obrigá-los a inventar uma data criaria fricção.

**D-02 – Lista de categorias aberta ("etc.")** *(varredura de fuga)*
- **Ambiguidade:** a lista terminava em "etc.", o que não permite saber que opções o campo mostra.
- **Decisão:** lista fechada com 8 categorias (Espaço, Buffet, Fotografia, Filmagem, Decoração, Música/DJ, Vestido/Traje, Cerimonial).
- **Motivo:** são os fornecedores contratados com mais frequência num casamento; novas categorias entram por alteração desta spec.

**D-03 – "Faixa de orçamento" vs. "Orçamento máximo"**
- **Ambiguidade:** o Escopo falava em faixa (mínimo e máximo) e os Dados num único valor.
- **Decisão:** um único campo, Orçamento máximo, em reais.
- **Motivo:** os noivos pensam no teto que podem gastar; pedir um mínimo não ajuda a pesquisa.

**D-04 – Termos vagos** *(varredura de vagueza)*
- **Ambiguidade:** "fornecedores compatíveis com a sua realidade" e "preencheu corretamente".
- **Decisão:** o Objetivo passou a listar os cinco critérios da pesquisa, e o CA-02 passou a citar as regras que os valores cumprem.
- **Nota:** "os melhores fornecedores" continua no CA-02 por ser o texto literal exibido ao utilizador, não um requisito.

**D-05 – "A maioria do público-alvo"** *(varredura de ator e quantidade)*
- **Ambiguidade:** a restrição mobile-first dependia de uma quantidade não medida.
- **Decisão:** a restrição passou a ser verificável (360 px de largura, sem rolagem horizontal).
- **Motivo:** assim o agente consegue confirmar a restrição sem precisar de dados de audiência.

**D-06 – Formato de Cidade/UF**
- **Ambiguidade:** o campo era só "texto", sem formato definido.
- **Decisão:** formato "Cidade - UF", validado pela RN-05.
- **Motivo:** a UF é necessária para a IA distinguir cidades com o mesmo nome em estados diferentes.

**D-07 – Orçamento do casamento ou da categoria?** *(apontado na revisão cruzada, ver `001-revisao.md`)*
- **Ambiguidade:** "Orçamento máximo" admitia duas leituras: o orçamento do casamento inteiro ou só o do fornecedor escolhido.
- **Decisão:** é o orçamento só para a categoria escolhida. O campo passou a chamar-se "Orçamento máximo para a categoria".
- **Motivo:** cada pesquisa procura uma única categoria; comparar fornecedores de buffet com o orçamento do casamento inteiro faria a IA sugerir opções fora da realidade dos noivos.

**D-08 – Mensagens de erro e falha da IA** *(apontado na revisão cruzada)*
- **Lacuna:** a spec não dizia que mensagem aparece com orçamento zero ou UF inválida, nem o que acontece se a IA falhar no carregamento.
- **Decisão:** tabela de mensagens por regra (secção 5) e nova RN-06 para a falha do agente, com tempo limite de 60 segundos.
- **Motivo:** sem isto, o agente inventaria as mensagens e o comportamento de erro.

**D-09 – Critérios de aceite incompletos** *(apontado na revisão cruzada)*
- **Lacuna:** os critérios não testavam orçamento zero, UF inválida, a restrição de 360 px nem a falha da IA; a feature podia "passar" com essas partes quebradas.
- **Decisão:** novos critérios CA-04 a CA-07, um para cada lacuna.

**Pergunta de validação:** se o código fosse apagado agora, esta spec seria suficiente para reconstruí-lo?
**Resposta:** sim, para o formulário. Campos, formatos, lista de categorias, regras de validação, mensagens e reações do ecrã estão descritos sem depender de tecnologia. O que esta spec não cobre, de propósito, é a lista de fornecedores devolvida pelo agente quando a pesquisa dá certo: isso fica para a Spec 002.
