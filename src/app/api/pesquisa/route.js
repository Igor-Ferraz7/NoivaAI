// POST /api/pesquisa: recebe o formulário da Spec 001 e entrega-o ao agente.
import { pesquisarFornecedores } from "../../../lib/agente.js";
import { converterOrcamentoEmCentavos, separarCidadeUf, validarPesquisa } from "../../../lib/pesquisa.js";

// RN-01 no servidor: o servidor pode estar noutro fuso (UTC). Usa-se a data de
// Rio Branco (UTC-5), o fuso mais a oeste do Brasil, para não recusar o "hoje"
// de quem está no Brasil.
const hojeNoBrasil = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Rio_Branco" }).format(new Date());

export async function POST(request) {
  let dados;
  try {
    dados = await request.json();
  } catch {
    return Response.json({ erro: "Pedido inválido" }, { status: 400 });
  }

  // As mesmas regras do formulário: o navegador não é a única barreira.
  const { erros, valido } = validarPesquisa(dados, hojeNoBrasil());
  if (!valido) return Response.json({ erros }, { status: 400 });

  const { cidade, uf } = separarCidadeUf(dados.cidadeUf);
  const pedido = {
    cidade,
    uf,
    data: dados.data || null,
    categoria: dados.categoria,
    orcamentoCentavos: converterOrcamentoEmCentavos(dados.orcamento),
    convidados: Number(dados.convidados),
  };

  try {
    return Response.json(await pesquisarFornecedores(pedido), { status: 202 });
  } catch {
    return Response.json({ erro: "O agente não respondeu" }, { status: 502 });
  }
}
