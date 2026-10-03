# Noiva.AI - Regras de Desenvolvimento

Este documento define como os agentes de IA devem operar no repositório do Noiva.AI.

## Stack Técnica
- Frontend: React (Next.js) com Tailwind CSS.
- Backend/IA: Node.js, chamadas à API da OpenAI/Gemini.
- Base de dados: Supabase (PostgreSQL).

## Comandos Principais
- Instalar dependências: `npm install`
- Rodar localmente: `npm run dev`
- Rodar testes: `npm test`
- Linting: `npm run lint`

## Estrutura de Pastas
- `docs/specs/`: Todas as especificações de features.
- `src/components/`: Componentes visuais.
- `src/app/`: Páginas do sistema.

## Como deves trabalhar (Princípios)
1. **Lê as specs antes de codificar:** Nunca adivinhes regras de negócio. Vai a `docs/specs/` ler.
2. **Pequenos passos:** Faz uma alteração de cada vez e pede feedback.
3. **Testa sempre:** Nunca digas que terminaste sem antes correr `npm test` ou `npm run lint`.
4. **Sem jargões com os utilizadores:** O código pode ser complexo, mas a interface tem de ser simples para as noivas/noivos.
