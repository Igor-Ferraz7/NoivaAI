// Regras de validação da pesquisa de fornecedores (Spec 001, secção 5).
// Sem interface: o formulário (navegador) e a rota /api/pesquisa (servidor)
// usam as mesmas funções, para as regras não divergirem.

export const CATEGORIAS = [
  "Espaço",
  "Buffet",
  "Fotografia",
  "Filmagem",
  "Decoração",
  "Música/DJ",
  "Vestido/Traje",
  "Cerimonial",
];

// RN-05: as 27 siglas oficiais.
export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

// Textos literais da spec: não alterar sem alterar a spec.
export const MENSAGENS = {
  dataPassada: "A data não pode estar no passado", // RN-01
  convidados: "O número de convidados deve ser maior que zero", // RN-02
  orcamento: "O orçamento deve ser maior que R$ 0,00", // RN-03
  uf: "UF inválida. Use a sigla de 2 letras do estado", // RN-05
  falhaAgente: "Não conseguimos procurar fornecedores agora. Tente novamente.", // RN-06
  carregando: "A nossa IA está a procurar os melhores fornecedores para si...", // CA-02
};

// RN-06: tempo máximo de espera pela resposta do agente.
export const TEMPO_LIMITE_AGENTE_MS = 60_000;

// Data de hoje no fuso de quem usa, no formato do <input type="date"> (AAAA-MM-DD).
export function hojeLocal(agora = new Date()) {
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

// "Rio Verde - GO" → { cidade: "Rio Verde", uf: "GO" }; fora do formato → null.
// Aceita espaços opcionais à volta do hífen e a UF em minúsculas (plano, P-07).
export function separarCidadeUf(texto) {
  const partes = /^(.*\S)\s*-\s*([A-Za-z]{2})$/.exec(String(texto).trim());
  if (!partes) return null;
  const uf = partes[2].toUpperCase();
  if (!UFS.includes(uf)) return null;
  return { cidade: partes[1].trim(), uf };
}

// Valor em reais com até 2 casas → centavos (inteiro); fora do formato → null.
// Aceita "15000", "15.000", "15.000,50", "0,01" e "R$ 1.500" (plano, P-08).
export function converterOrcamentoEmCentavos(texto) {
  const valor = String(texto).trim().replace(/^R\$\s*/, "");
  let inteiros;
  let decimais = "";
  if (/^(\d{1,3}(\.\d{3})+|\d+),\d{1,2}$/.test(valor)) {
    [inteiros, decimais] = valor.replace(/\./g, "").split(",");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(valor)) {
    inteiros = valor.replace(/\./g, "");
  } else if (/^\d+(\.\d{1,2})?$/.test(valor)) {
    [inteiros, decimais = ""] = valor.split(".");
  } else {
    return null;
  }
  return Number(inteiros) * 100 + Number(decimais.padEnd(2, "0"));
}

// Cada validador recebe um campo já preenchido e devolve a mensagem da regra
// violada, ou null se o valor é válido.

export function validarData(data, hoje = hojeLocal()) {
  return data < hoje ? MENSAGENS.dataPassada : null; // RN-01 (AAAA-MM-DD compara como texto)
}

export function validarConvidados(texto) {
  const valor = String(texto).trim();
  return /^\d+$/.test(valor) && Number(valor) > 0 ? null : MENSAGENS.convidados; // RN-02
}

export function validarOrcamento(texto) {
  const centavos = converterOrcamentoEmCentavos(texto);
  return centavos !== null && centavos > 0 ? null : MENSAGENS.orcamento; // RN-03
}

export function validarCidadeUf(texto) {
  return separarCidadeUf(texto) ? null : MENSAGENS.uf; // RN-05
}

const preenchido = (valor) => String(valor ?? "").trim() !== "";

// Valida o formulário inteiro.
// - erros: mensagem por campo, só para campos preenchidos (plano, P-06);
// - valido: RN-04, os quatro obrigatórios preenchidos e nenhum erro.
export function validarPesquisa(dados, hoje = hojeLocal()) {
  const { cidadeUf = "", data = "", categoria = "", orcamento = "", convidados = "" } = dados ?? {};
  const erros = {};
  if (preenchido(cidadeUf) && validarCidadeUf(cidadeUf)) erros.cidadeUf = MENSAGENS.uf;
  if (preenchido(data) && validarData(data, hoje)) erros.data = MENSAGENS.dataPassada;
  if (preenchido(orcamento) && validarOrcamento(orcamento)) erros.orcamento = MENSAGENS.orcamento;
  if (preenchido(convidados) && validarConvidados(convidados)) erros.convidados = MENSAGENS.convidados;

  const obrigatoriosPreenchidos =
    preenchido(cidadeUf) && CATEGORIAS.includes(categoria) && preenchido(orcamento) && preenchido(convidados);
  return { erros, valido: obrigatoriosPreenchidos && Object.keys(erros).length === 0 };
}
