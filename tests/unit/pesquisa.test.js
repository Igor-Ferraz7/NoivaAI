// Regras RN-01 a RN-05 da Spec 001, sem navegador.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MENSAGENS,
  converterOrcamentoEmCentavos,
  hojeLocal,
  separarCidadeUf,
  validarPesquisa,
} from "../../src/lib/pesquisa.js";

const HOJE = "2026-10-09";

test("RN-01: data no passado é recusada; hoje, futuro e vazio são aceites", () => {
  assert.equal(validarPesquisa({ data: "2020-01-10" }, HOJE).erros.data, MENSAGENS.dataPassada);
  assert.equal(validarPesquisa({ data: "2026-10-08" }, HOJE).erros.data, MENSAGENS.dataPassada);
  assert.equal(validarPesquisa({ data: HOJE }, HOJE).erros.data, undefined);
  assert.equal(validarPesquisa({ data: "2027-12-20" }, HOJE).erros.data, undefined);
  assert.equal(validarPesquisa({ data: "" }, HOJE).erros.data, undefined);
});

test("RN-02: convidados tem de ser inteiro maior que zero", () => {
  for (const invalido of ["0", "-10", "1.5", "abc"]) {
    assert.equal(validarPesquisa({ convidados: invalido }).erros.convidados, MENSAGENS.convidados, invalido);
  }
  for (const valido of ["1", "150"]) {
    assert.equal(validarPesquisa({ convidados: valido }).erros.convidados, undefined, valido);
  }
});

test("RN-03: orçamento tem de ser maior que R$ 0,00, com até 2 casas", () => {
  for (const invalido of ["0", "0,00", "abc", "10,555", "-5"]) {
    assert.equal(validarPesquisa({ orcamento: invalido }).erros.orcamento, MENSAGENS.orcamento, invalido);
  }
  assert.equal(converterOrcamentoEmCentavos("0,01"), 1);
  assert.equal(converterOrcamentoEmCentavos("15000"), 1_500_000);
  assert.equal(converterOrcamentoEmCentavos("15.000"), 1_500_000);
  assert.equal(converterOrcamentoEmCentavos("15.000,50"), 1_500_050);
  assert.equal(converterOrcamentoEmCentavos("R$ 1.500"), 150_000);
  assert.equal(converterOrcamentoEmCentavos("99.9"), 9_990);
});

test("RN-05: UF tem de ser uma das 27 siglas, no formato Cidade - UF", () => {
  assert.deepEqual(separarCidadeUf("Rio Verde - GO"), { cidade: "Rio Verde", uf: "GO" });
  assert.deepEqual(separarCidadeUf("rio verde-go"), { cidade: "rio verde", uf: "GO" });
  assert.deepEqual(separarCidadeUf("Embu-Guaçu - SP"), { cidade: "Embu-Guaçu", uf: "SP" });
  for (const invalido of ["Rio Verde - XX", "Rio Verde", "Rio Verde - GOI", " - GO"]) {
    assert.equal(validarPesquisa({ cidadeUf: invalido }).erros.cidadeUf, MENSAGENS.uf, invalido);
  }
});

test("RN-04: tabela de exemplos da spec (secção 6)", () => {
  const feliz = { cidadeUf: "Rio Verde - GO", categoria: "Buffet", convidados: "150", orcamento: "15000", data: "2027-12-20" };
  assert.deepEqual(validarPesquisa(feliz, HOJE), { erros: {}, valido: true });

  const borda = { cidadeUf: "Goiânia - GO", categoria: "Fotografia", convidados: "1", orcamento: "0,01", data: "" };
  assert.deepEqual(validarPesquisa(borda, HOJE), { erros: {}, valido: true });

  const erro = { cidadeUf: "Jataí - GO", categoria: "Espaço", convidados: "-10", orcamento: "5000", data: "2027-10-15" };
  assert.deepEqual(validarPesquisa(erro, HOJE), { erros: { convidados: MENSAGENS.convidados }, valido: false });
});

test("RN-04: falta de campo obrigatório ou categoria fora da lista deixa inválido, sem mensagem", () => {
  const soCidadeECategoria = { cidadeUf: "Rio Verde - GO", categoria: "Buffet" };
  assert.deepEqual(validarPesquisa(soCidadeECategoria, HOJE), { erros: {}, valido: false });

  const categoriaInventada = { cidadeUf: "Rio Verde - GO", categoria: "Padre", convidados: "10", orcamento: "100" };
  assert.equal(validarPesquisa(categoriaInventada, HOJE).valido, false);
});

test("hojeLocal usa o formato do campo de data", () => {
  assert.equal(hojeLocal(new Date(2026, 0, 5)), "2026-01-05");
});
