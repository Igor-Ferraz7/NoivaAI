// CA-01: Validação de data no passado.
import { test, expect } from "@playwright/test";
import { esperarErroNoCampo, preencherCasoFeliz } from "./apoio.js";

test("CA-01: data 10/01/2020 deixa o campo vermelho, com a mensagem, e o botão desativado", async ({ page }) => {
  await page.goto("/");
  const c = await preencherCasoFeliz(page);
  await expect(c.botao).toBeEnabled(); // só a data vai tornar o formulário inválido

  await c.data.fill("2020-01-10"); // o navegador em pt-BR mostra 10/01/2020

  await esperarErroNoCampo(expect, c.data, "A data não pode estar no passado");
  await expect(c.botao).toBeDisabled();
});
