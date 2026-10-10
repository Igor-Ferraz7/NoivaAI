# Diário do agente – Feature 001 (Pesquisa Inicial de Fornecedores)

- **Harness:** Claude Code (modelo Claude Opus 5.5), sessão de 09/10/2026 conduzida por Igor Sousa Ferraz Aragão
- **Resultado:** os sete critérios (CA-01 a CA-07) têm teste e passam. São 7 testes de regra e 12 de navegador, todos verdes num clone limpo. Nenhum teste foi apagado, desativado ou afrouxado.
- **Plano e commits:** [`docs/specs/001-plano.md`](../specs/001-plano.md), um commit por tarefa (T1 a T9).

## 1. Nível do slider de autonomia
Trabalhamos no **nível "agente executa, humano aprova nos portões"**. Isso não chega a ser autonomia total, mas vai além de aprovar cada edição. O agente fez cada tarefa de ponta a ponta sozinho (código, teste, lint e commit), mas parou em dois portões humanos. O primeiro foi o plano, revisto antes de qualquer código. O segundo foi o push para o GitHub.
**Por quê:** cada tarefa tinha um sensor objetivo (o teste do critério), então não era preciso um humano olhar cada linha. Já as decisões que a spec deixava em aberto, e a publicação no repositório da equipe, são de quem responde pelo projeto. O risco era baixo: não há IA real, segredo nem dado de usuário.

## 2. Uma vez em que o agente errou, e o que pegou o erro
**Erro:** na T3, o agente encadeou `npm run lint && git commit` e fez o commit sem ler a saída. O lint tinha mostrado 3 avisos.
**Mecanismo que pegou:** nenhum. O lint só avisava, então saiu com código 0 e o commit seguiu. O próprio agente viu os avisos depois, ao reler a saída. Eram falsos positivos: o ESLint não percebia que `<Campo>` usa a função `Campo`. Só que um erro verdadeiro do mesmo tipo também teria passado. A correção foi no harness, e não só no código: [`6394ce2`](https://github.com/Igor-Ferraz7/NoivaAI/commit/6394ce2d472db1924b78678cd059d33351119b36).
**Outros dois, pegos por sensores:**
- O teste do CA-07 falhou porque encontrou dois "alertas" na página. O segundo era o anunciador de rotas do Next.js. Corrigimos a forma de procurar o alerta, sem mudar a verificação.
- O teste de clone limpo, com uma pasta de navegadores vazia, mostrou que o `AGENTS.md` não mandava instalar o Chromium.

## 3. Quando o agente perguntou antes de assumir, e quando deveria ter perguntado
**Perguntou:** antes do código, fez quatro perguntas. A mais importante foi a P-04: a spec não diz o que aparece quando o agente responde bem, porque isso é a Spec 002. Em vez de inventar, propôs a tela "Recebemos o seu pedido…", e ela entrou na spec como RN-07 provisória.
**Deveria ter perguntado e não perguntou:** o plano aprovado dizia Next.js 15.5.26. O `npm audit` apontou falhas de segurança, e o agente trocou para a 15.5.27, além de forçar o PostCSS 8.5.29 por `overrides`, sem consultar a equipe. A troca está explicada no commit [`1e97384`](https://github.com/Igor-Ferraz7/NoivaAI/commit/1e9738496e6d96d59277a6749804170c7798da9b) e no `AGENTS.md`. Mesmo assim, mudou um item aprovado. Também decidiu sozinho usar o fuso de Rio Branco na validação da data no servidor (D-13), e essa regra não tem teste automático.

## 4. O que mudaríamos no harness
**Já mudamos:**
- Lint que entende JSX e falha com avisos ([`6394ce2`](https://github.com/Igor-Ferraz7/NoivaAI/commit/6394ce2d472db1924b78678cd059d33351119b36)).
- Mais quatro ajustes no commit [`67ea488`](https://github.com/Igor-Ferraz7/NoivaAI/commit/67ea488ed54067ca70277ac7639734ed61200a4a):
  - O passo do Chromium e as regras de teste no `AGENTS.md`.
  - O hook de lint sai com 2, para o erro chegar ao agente (antes ficava escondido).
  - `npm ci`, `npm i` e `npm add` passam a pedir confirmação.
  - A skill `verificar-mobile` roda o teste do CA-06 em vez de só olhar as classes.

**Falta mudar:**
- **Abrir a sessão sempre na pasta do repositório.** Esta sessão começou fora dela, então o `settings.json` do projeto não foi carregado. O `npm install` não pediu confirmação e o hook não correu: o lint foi rodado à mão. O harness só protege quem o carrega.
- **Um portão antes de "terminei":** um hook `Stop` que roda `npm test`.
- **Uma CI no GitHub** (`npm ci`, `npx playwright install chromium`, `npm test` a cada push), para o clone limpo ser verificado sempre, e não só quando alguém se lembra.
- **Testar também no WebKit (Safari).** O público chega pelo Instagram, muitas vezes num iPhone, e hoje só testamos no Chromium.
