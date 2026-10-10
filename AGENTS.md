# Noiva.AI - Regras de Desenvolvimento

Este documento define como os agentes de IA devem operar no repositório do Noiva.AI.

## Stack Técnica
- Node.js 20 LTS ou superior (npm 10+). Testado com Node 22.12 e npm 10.9.
- Next.js 15.5.27 (App Router) + React 19.3.0 + Tailwind CSS 4.3.3, versões exatas no `package.json`. O `overrides` força o PostCSS 8.5.29 porque o Next 15 traz uma versão com falhas de segurança conhecidas.
- ESLint 9.39.5 + eslint-plugin-react 7.37.5 (configuração em `eslint.config.mjs`). O lint falha com qualquer aviso (`--max-warnings=0`).
- Testes: executor nativo do Node (`node --test`) para as regras puras e Playwright 1.63.0 (Chromium) para os critérios de aceite.
- Planeado, ainda não instalado: Supabase (PostgreSQL); API da OpenAI/Gemini (Spec 002). Na Spec 001 o agente é um substituto em `src/lib/agente.js`.
- Servidores MCP: nenhum instalado. Qualquer MCP adicionado tem de vir de fonte conhecida e ser listado aqui.

## Comandos Reais
Num clone limpo, por esta ordem:
1. Instalar dependências exatamente como no `package-lock.json`: `npm ci` (para adicionar um pacote novo: `npm install --save-exact <pacote>@<versão>`)
2. Instalar o navegador dos testes (uma vez por máquina, cerca de 150 MB): `npx playwright install chromium`
3. Rodar em desenvolvimento: `npm run dev` e abrir http://localhost:3000
4. Gerar a versão de produção: `npm run build` e depois `npm run start`
5. Rodar o lint: `npm run lint`
6. Rodar os testes: `npm test` (regras puras + critérios de aceite; o Playwright gera e sobe a aplicação sozinho na porta 3100, cerca de 30 s)

Comandos úteis:
- Só as regras puras: `npm run test:unit`
- Só os critérios de aceite: `npm run test:e2e`
- Um critério: `npx playwright test ca-03`
- Se a porta 3100 estiver ocupada por outro servidor, o Playwright reutiliza-o: feche-o antes, ou os testes correm sobre código antigo.

## Testes e critérios de aceite
- Cada critério de aceite `CA-XX` de uma spec tem o seu teste em `tests/e2e/ca-XX-<nome>.spec.js`, com o nome do teste a começar por "CA-XX".
- Nunca apagues, desatives (`skip`, `only`) ou "ajustes" um teste para passar. Se um critério não se cumprir, diz isso à equipa e no diário.
- Mensagens mostradas ao utilizador vêm literais da spec e ficam em `src/lib/pesquisa.js` (`MENSAGENS`).
- Um commit por tarefa do plano (`docs/specs/NNN-plano.md`), com a mensagem a citar a spec e o critério: `feat(001): descrição [CA-03]`.

## Estrutura de Pastas
- `docs/specs/`: especificações das features (ex.: `001-pesquisa-fornecedores.md`).
- `docs/harness/`: relatórios do Better Harness e evidências do harness.
- `src/components/`: componentes visuais.
- `src/app/`: páginas e rotas de API do Next.js (App Router).
- `src/lib/`: regras de negócio sem interface (validação, agente).
- `tests/unit/`: testes das regras puras (`node --test`).
- `tests/e2e/`: um teste por critério de aceite (Playwright).
- `docs/specs/NNN-plano.md`: plano de tarefas de cada spec, revisto pela equipa antes do código.

## Como deves trabalhar (Princípios)
1. **Lê as specs antes de codificar:** nunca adivinhes regras de negócio. Vai a `docs/specs/` ler.
2. **Pequenos passos:** faz uma alteração de cada vez e pede feedback.
3. **Testa sempre:** nunca digas que terminaste sem antes correr `npm test` e `npm run lint`.
4. **Sem jargões com os utilizadores:** o código pode ser complexo, mas a interface tem de ser simples para as noivas/noivos.
