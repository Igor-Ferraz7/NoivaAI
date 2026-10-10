// CA-04: Orçamento zero.
import { test, expect } from "@playwright/test";
import { esperarErroNoCampo, preencherCasoFeliz } from "./apoio.js";

test("CA-04: orçamento 0 deixa o campo vermelho, com a mensagem, e o botão desativado", async ({ page }) => {
  await page.goto("/");
  const c = await preencherCasoFeliz(page);
  await expect(c.botao).toBeEnabled();

  await c.orcamento.fill("0");

  await esperarErroNoCampo(expect, c.orcamento, "O orçamento deve ser maior que R$ 0,00");
  await expect(c.botao).toBeDisabled();
});
