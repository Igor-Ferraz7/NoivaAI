// Agente de pesquisa de fornecedores.
// Spec 001: substituto (plano, P-03). Só confirma que recebeu o pedido; não
// chama nenhuma IA, por isso não precisa de chave nem tem custo.
// Spec 002: trocar o corpo desta função pela chamada ao agente real, que
// devolve a lista de fornecedores.
export async function pesquisarFornecedores(pedido) {
  return { estado: "recebido", pedido };
}
