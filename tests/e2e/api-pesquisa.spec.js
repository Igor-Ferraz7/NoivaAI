// A rota POST /api/pesquisa aplica as mesmas regras do formulário (RN-01 a RN-05).
import { test, expect } from "@playwright/test";

const CASO_BORDA = { cidadeUf: "Goiânia - GO", categoria: "Fotografia", convidados: "1", orcamento: "0,01", data: "" };

test("API: aceita o caso de borda da spec e entrega ao agente os dados já convertidos", async ({ request }) => {
  const resposta = await request.post("/api/pesquisa", { data: CASO_BORDA });
  expect(resposta.status()).toBe(202);
  expect((await resposta.json()).pedido).toEqual({
    cidade: "Goiânia",
    uf: "GO",
    data: null,
    categoria: "Fotografia",
    orcamentoCentavos: 1,
    convidados: 1,
  });
});

test("API: recusa o caso de erro da spec com a mensagem da RN-02", async ({ request }) => {
  const resposta = await request.post("/api/pesquisa", { data: { ...CASO_BORDA, convidados: "-10" } });
  expect(resposta.status()).toBe(400);
  expect(await resposta.json()).toEqual({ erros: { convidados: "O número de convidados deve ser maior que zero" } });
});
