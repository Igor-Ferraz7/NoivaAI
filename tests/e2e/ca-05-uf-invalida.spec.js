// CA-05: UF inválida.
import { test, expect } from "@playwright/test";
import { esperarErroNoCampo, preencherCasoFeliz } from "./apoio.js";

test("CA-05: \"Rio Verde - XX\" deixa o campo vermelho, com a mensagem, e o botão desativado", async ({ page }) => {
  await page.goto("/");
  const c = await preencherCasoFeliz(page);
  await expect(c.botao).toBeEnabled();

  await c.cidadeUf.fill("Rio Verde - XX");

  await esperarErroNoCampo(expect, c.cidadeUf, "UF inválida. Use a sigla de 2 letras do estado");
  await expect(c.botao).toBeDisabled();
});
