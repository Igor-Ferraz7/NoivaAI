// Ajudas partilhadas pelos testes dos critérios de aceite.

export const campos = (page) => ({
  cidadeUf: page.getByLabel("Cidade/UF"),
  data: page.getByLabel("Data prevista"),
  categoria: page.getByLabel("Categoria de fornecedor"),
  orcamento: page.getByLabel("Orçamento máximo para a categoria"),
  convidados: page.getByLabel("Número estimado de convidados"),
  botao: page.getByRole("button", { name: "Encontrar Fornecedores" }),
});

// Caso feliz da tabela de exemplos (secção 6 da spec).
export async function preencherCasoFeliz(page) {
  const c = campos(page);
  await c.cidadeUf.fill("Rio Verde - GO");
  await c.data.fill("2027-12-20");
  await c.categoria.selectOption("Buffet");
  await c.orcamento.fill("15000");
  await c.convidados.fill("150");
  return c;
}

// Regista os pedidos feitos ao agente, para provar que nada foi enviado.
export function contarPedidosAoAgente(page) {
  const pedidos = [];
  page.on("request", (pedido) => {
    if (pedido.url().includes("/api/pesquisa")) pedidos.push(pedido);
  });
  return pedidos;
}

// O campo fica com contorno vermelho e a mensagem aparece logo abaixo dele.
export async function esperarErroNoCampo(expect, campo, mensagem) {
  await expect(campo).toHaveAttribute("aria-invalid", "true");
  await expect(campo).toHaveAccessibleDescription(mensagem);
  await expect(campo).toHaveCSS("border-top-color", /oklch\(0\.577 0\.245 27\.325\)|rgb\(220, 38, 38\)/); // red-600

  const idErro = await campo.getAttribute("aria-describedby");
  const textoErro = campo.page().locator(`#${idErro}`);
  await expect(textoErro).toBeVisible();
  const caixaCampo = await campo.boundingBox();
  const caixaErro = await textoErro.boundingBox();
  expect(caixaErro.y).toBeGreaterThanOrEqual(caixaCampo.y + caixaCampo.height);
}
