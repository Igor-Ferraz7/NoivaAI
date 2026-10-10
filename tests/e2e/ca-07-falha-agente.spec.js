// CA-07: Falha do agente durante o carregamento (RN-06).
import { test, expect } from "@playwright/test";
import { preencherCasoFeliz } from "./apoio.js";

const FALHA = "Não conseguimos procurar fornecedores agora. Tente novamente.";

async function esperarFormularioDeVoltaPreenchido(page, c) {
  // Só o alerta do formulário: o Next.js tem o seu próprio (anunciador de rotas).
  await expect(page.getByRole("form", { name: "Pesquisa de fornecedores" }).getByRole("alert")).toHaveText(FALHA);
  await expect(c.cidadeUf).toHaveValue("Rio Verde - GO");
  await expect(c.data).toHaveValue("2027-12-20");
  await expect(c.categoria).toHaveValue("Buffet");
  await expect(c.orcamento).toHaveValue("15000");
  await expect(c.convidados).toHaveValue("150");
  await expect(c.botao).toBeEnabled(); // pode tentar de novo
}

test("CA-07 (erro): se o agente devolve erro, o formulário volta preenchido com a mensagem", async ({ page }) => {
  await page.route("**/api/pesquisa", (rota) => rota.fulfill({ status: 500, body: "erro" }));
  await page.goto("/");
  const c = await preencherCasoFeliz(page);

  await c.botao.click();

  await esperarFormularioDeVoltaPreenchido(page, c);
});

test("CA-07 (60 s): se o agente não responde em 60 segundos, o formulário volta preenchido com a mensagem", async ({ page }) => {
  await page.clock.install(); // relógio controlado pelo teste: não se espera 60 s de verdade
  await page.route("**/api/pesquisa", () => {}); // o agente nunca responde
  await page.goto("/");
  const c = await preencherCasoFeliz(page);

  await c.botao.click();
  await expect(page.getByRole("status")).toBeVisible();

  await page.clock.fastForward(59_000);
  await expect(page.getByRole("status")).toBeVisible(); // aos 59 s ainda espera

  await page.clock.fastForward(1_000);
  await esperarFormularioDeVoltaPreenchido(page, c);
});
