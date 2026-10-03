# Noiva.AI - Regras de Desenvolvimento

Este documento define como os agentes de IA devem operar no repositório do Noiva.AI.

## Stack Técnica
- Node.js 20 LTS ou superior (npm 10+).
- ESLint 9.x (instalado; configuração em `eslint.config.mjs`).
- Testes: executor nativo do Node (`node --test`), sem dependências extra.
- Planeado, ainda não instalado: Next.js 15 + React 19 + Tailwind CSS 4; Supabase (PostgreSQL); API da OpenAI/Gemini. Quando forem instalados, atualizar esta secção com as versões do `package.json`.
- Servidores MCP: nenhum instalado. Qualquer MCP adicionado tem de vir de fonte conhecida e ser listado aqui.

## Comandos Reais
- Instalar dependências: `npm install`
- Rodar o lint: `npm run lint`
- Rodar os testes: `npm test`
- Ainda não existe `npm run dev`: só passa a existir quando o Next.js for instalado.

## Estrutura de Pastas
- `docs/specs/`: especificações das features (ex.: `001-pesquisa-fornecedores.md`).
- `docs/harness/`: relatórios do Better Harness e evidências do harness.
- `src/components/`: componentes visuais.
- `src/app/`: páginas do sistema (quando o Next.js for instalado).

## Como deves trabalhar (Princípios)
1. **Lê as specs antes de codificar:** nunca adivinhes regras de negócio. Vai a `docs/specs/` ler.
2. **Pequenos passos:** faz uma alteração de cada vez e pede feedback.
3. **Testa sempre:** nunca digas que terminaste sem antes correr `npm test` e `npm run lint`.
4. **Sem jargões com os utilizadores:** o código pode ser complexo, mas a interface tem de ser simples para as noivas/noivos.
