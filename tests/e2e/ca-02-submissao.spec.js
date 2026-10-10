// CA-02: Submissão com sucesso.
import { test, expect } from "@playwright/test";
import { preencherCasoFeliz } from "./apoio.js";

const CARREGANDO = "A nossa IA está a procurar os melhores fornecedores para si...";

test("CA-02: ao clicar em Encontrar Fornecedores, o formulário sai e aparece o indicador de carregamento", async ({ page }) => {
  // O agente fica a "pensar" (o pedido nunca responde), para o carregamento ficar no ecrã.
  await page.route("**/api/pesquisa", () => {});
  await page.goto("/");
  const c = await preencherCasoFeliz(page);

  await c.botao.click();

  await expect(page.getByRole("form", { name: "Pesquisa de fornecedores" })).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText(CARREGANDO);
});

test("CA-02 de ponta a ponta: o pedido chega à API com os dados do formulário e o ecrã confirma o recebimento", async ({ page }) => {
  await page.goto("/");
  const c = await preencherCasoFeliz(page);

  const [pedido] = await Promise.all([page.waitForRequest("**/api/pesquisa"), c.botao.click()]);
  expect(pedido.postDataJSON()).toEqual({
    cidadeUf: "Rio Verde - GO",
    data: "2027-12-20",
    categoria: "Buffet",
    orcamento: "15000",
    convidados: "150",
  });
  expect((await pedido.response()).status()).toBe(202);

  await expect(page.getByRole("status")).toHaveText("Recebemos o seu pedido. A lista de fornecedores chega em breve.");
});
