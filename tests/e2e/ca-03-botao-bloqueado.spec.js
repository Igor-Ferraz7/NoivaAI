// CA-03: Botão bloqueado por falta de dados.
import { test, expect } from "@playwright/test";
import { campos, contarPedidosAoAgente } from "./apoio.js";

test("CA-03: só com Cidade/UF e Categoria, o botão fica desativado e cinzento e não envia", async ({ page }) => {
  const pedidos = contarPedidosAoAgente(page);
  await page.goto("/");
  const c = campos(page);

  await c.cidadeUf.fill("Rio Verde - GO");
  await c.categoria.selectOption("Buffet");

  await expect(c.botao).toBeDisabled();
  await expect(c.botao).toHaveCSS("background-color", /oklch\(0\.87|rgb\(209, 213, 219\)/); // gray-300

  await c.botao.click({ force: true });
  await c.cidadeUf.press("Enter");

  await expect(c.botao).toBeVisible();
  await expect(page.getByRole("status")).toHaveCount(0);
  expect(pedidos).toHaveLength(0);
});
