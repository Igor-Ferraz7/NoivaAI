# Achado Escolhido e Reparo Aplicado

## Primeira medição
- **Ferramenta:** Better Harness (QoderAI), plugin do Claude Code, executado com `/better-harness`.
- **Relatório completo:** [`relatorio-1-antes.md`](relatorio-1-antes.md) (versão renderizada: [`relatorio-1-antes.html`](relatorio-1-antes.html)).
- **Estado medido:** commit `766df99`, ou seja, o repositório antes das correções do harness. A medição foi feita numa cópia local (`git checkout 766df99`) para registar o "antes" sem as alterações posteriores.
- **Resumo:** efetividade do loop 37/100; 6 achados (1 High, 3 Medium, 2 Low); 0 verificados.

![Resumo do primeiro relatório](img/relatorio1-resumo.png)

## Achado escolhido
**Achado 1: "Reads of .env and \*.secret are likely not blocked"** (`settings-permissions-schema`, severidade **High**, dimensão Execução Controlada).

- **Facto apontado:** em `.claude/settings.json`, `permissions` era uma lista de objetos `{tool, args, path, action}`, mas o Claude Code espera um objeto com listas `allow`/`ask`/`deny` no formato `Read(./.env)`.
- **Consequência:** as únicas proteções de segredos do repositório existiam só no papel. Ao abrir o Claude Code nessa versão, ele mostra "Settings Error… Files with errors are skipped entirely", ou seja, ignora o arquivo inteiro.
- **Porque este:** é o único achado de severidade High e o único com risco de segurança (exposição do `.env`).

## Reparo aplicado
- **Commit:** `527dcfc` — `spec(001): adiciona spec inicial e configura harness de seguranca e automacao`
- **O que mudou:** `permissions` reescrito no formato do Claude Code, com `deny` para `Read(./.env)`, `Read(./.env.*)`, `Read(./**/*.secret)` e comandos de terminal que imprimem o `.env`. No commit `3b8927b` entraram também as regras `ask` (`git push`, `npm install`).
- **Prova de que funciona:** Prova 1 em [`evidencias.md`](evidencias.md): o agente tentou ler o `.env` e foi bloqueado pela regra `deny`.

O mesmo commit `527dcfc` também atacou os achados 2 (hook com formato errado), 3 (`@AGENTS.md` em falta no CLAUDE.md) e 5 (skill sem `name`/`description`); o achado 4 (comandos inexistentes no AGENTS.md) foi corrigido em `3b8927b`.
