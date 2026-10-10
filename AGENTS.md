# Noiva.AI - Regras de Desenvolvimento

Este documento define como os agentes de IA devem operar no repositório do Noiva.AI.

## Stack Técnica
- Node.js 20 LTS ou superior (npm 10+). Testado com Node 22.12 e npm 10.9.
- Next.js 15.5.27 (App Router) + React 19.3.0 + Tailwind CSS 4.3.3, versões exatas no `package.json`. O `overrides` força o PostCSS 8.5.29 porque o Next 15 traz uma versão com falhas de segurança conhecidas.
- ESLint 9.39.5 + eslint-plugin-react 7.37.5 (configuração em `eslint.config.mjs`). O lint falha com qualquer aviso (`--max-warnings=0`).
- Testes: executor nativo do Node (`node --test`) para as regras puras.
- Planeado, ainda não instalado: Supabase (PostgreSQL); API da OpenAI/Gemini (Spec 002). Na Spec 001 o agente é um substituto em `src/lib/agente.js`.
- Servidores MCP: nenhum instalado. Qualquer MCP adicionado tem de vir de fonte conhecida e ser listado aqui.

## Comandos Reais
Num clone limpo, por esta ordem:
1. Instalar dependências exatamente como no `package-lock.json`: `npm ci` (para adicionar um pacote novo: `npm install --save-exact <pacote>@<versão>`)
2. Rodar em desenvolvimento: `npm run dev` e abrir http://localhost:3000
3. Gerar a versão de produção: `npm run build` e depois `npm run start`
4. Rodar o lint: `npm run lint`
5. Rodar os testes: `npm test`

## Estrutura de Pastas
- `docs/specs/`: especificações das features (ex.: `001-pesquisa-fornecedores.md`).
- `docs/harness/`: relatórios do Better Harness e evidências do harness.
- `src/components/`: componentes visuais.
- `src/app/`: páginas e rotas de API do Next.js (App Router).
- `src/lib/`: regras de negócio sem interface (validação, agente).
- `tests/unit/`: testes das regras puras (`node --test`).

## Como deves trabalhar (Princípios)
1. **Lê as specs antes de codificar:** nunca adivinhes regras de negócio. Vai a `docs/specs/` ler.
2. **Pequenos passos:** faz uma alteração de cada vez e pede feedback.
3. **Testa sempre:** nunca digas que terminaste sem antes correr `npm test` e `npm run lint`.
4. **Sem jargões com os utilizadores:** o código pode ser complexo, mas a interface tem de ser simples para as noivas/noivos.
