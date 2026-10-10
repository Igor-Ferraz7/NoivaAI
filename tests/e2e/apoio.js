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
