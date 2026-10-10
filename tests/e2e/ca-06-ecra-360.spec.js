// CA-06: Formulário num ecrã de 360 px (restrição mobile-first da secção 8).
import { test, expect } from "@playwright/test";
import { campos } from "./apoio.js";

const LARGURA = 360;
test.use({ viewport: { width: LARGURA, height: 740 }, hasTouch: true, isMobile: true });

async function esperarTudoDentroDoEcra(page) {
  const c = campos(page);
  for (const [nome, elemento] of Object.entries(c)) {
    await elemento.scrollIntoViewIfNeeded();
    await expect(elemento, nome).toBeVisible();
    const caixa = await elemento.boundingBox();
    expect(caixa.x, `${nome} começa dentro do ecrã`).toBeGreaterThanOrEqual(0);
    expect(caixa.x + caixa.width, `${nome} acaba dentro do ecrã`).toBeLessThanOrEqual(LARGURA);
  }
  const larguraDoConteudo = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(larguraDoConteudo, "sem rolagem horizontal").toBeLessThanOrEqual(LARGURA);
}

test("CA-06: a 360 px, todos os campos e o botão ficam visíveis sem rolagem horizontal", async ({ page }) => {
  await page.goto("/");
  await esperarTudoDentroDoEcra(page);
});

test("CA-06 com as mensagens de erro: os textos longos também cabem em 360 px", async ({ page }) => {
  await page.goto("/");
  const c = campos(page);
  await c.cidadeUf.fill("Uma cidade com um nome muito comprido mesmo - XX");
  await c.data.fill("2020-01-10");
  await c.orcamento.fill("0");
  await c.convidados.fill("-10");
  await expect(page.getByText("UF inválida. Use a sigla de 2 letras do estado")).toBeVisible();

  await esperarTudoDentroDoEcra(page);
});
