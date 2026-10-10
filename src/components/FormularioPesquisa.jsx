"use client";

// Formulário da pesquisa inicial de fornecedores (Spec 001).
import { useState } from "react";
import BotaoPrincipal from "./BotaoPrincipal.jsx";
import { CATEGORIAS, validarPesquisa } from "../lib/pesquisa.js";

const VAZIO = { cidadeUf: "", data: "", categoria: "", orcamento: "", convidados: "" };

const estiloBase =
  "block w-full min-w-0 min-h-12 rounded-xl border bg-white px-3 py-2 text-base focus:outline-none focus-visible:ring-2";

// Campo com erro: contorno vermelho (secção 5 da spec).
const estiloCampo = (erro) =>
  `${estiloBase} ${erro ? "border-2 border-red-600 focus-visible:ring-red-300" : "border-gray-300 focus-visible:ring-rose-400"}`;

// Liga o campo à mensagem de erro, para leitores de ecrã a anunciarem.
const ligacaoErro = (id, erro) => ({
  "aria-invalid": erro ? true : undefined,
  "aria-describedby": erro ? `${id}-erro` : undefined,
});

function Campo({ id, rotulo, ajuda, erro, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-medium">
        {rotulo}
      </label>
      {children}
      {erro ? (
        <p id={`${id}-erro`} className="text-sm font-medium text-red-700">
          {erro}
        </p>
      ) : (
        ajuda && <p className="text-sm text-gray-600">{ajuda}</p>
      )}
    </div>
  );
}

export default function FormularioPesquisa() {
  const [valores, setValores] = useState(VAZIO);
  const { erros, valido } = validarPesquisa(valores);

  const alterar = (campo) => (evento) => setValores((atuais) => ({ ...atuais, [campo]: evento.target.value }));

  // Propriedades comuns a cada campo: valor, alteração, estilo e ligação ao erro.
  const ligar = (campo) => ({
    id: campo,
    value: valores[campo],
    onChange: alterar(campo),
    className: estiloCampo(erros[campo]),
    ...ligacaoErro(campo, erros[campo]),
  });

  function enviar(evento) {
    evento.preventDefault();
    if (!valido) return; // RN-04: nada é enviado com dados em falta ou inválidos.
  }

  return (
    <form onSubmit={enviar} noValidate aria-label="Pesquisa de fornecedores" className="mt-6 flex flex-col gap-5">
      <Campo id="cidadeUf" rotulo="Cidade/UF" ajuda="Exemplo: Rio Verde - GO" erro={erros.cidadeUf}>
        <input type="text" autoComplete="address-level2" {...ligar("cidadeUf")} />
      </Campo>

      <Campo id="data" rotulo="Data prevista (opcional)" erro={erros.data}>
        <input type="date" {...ligar("data")} />
      </Campo>

      <Campo id="categoria" rotulo="Categoria de fornecedor">
        <select {...ligar("categoria")}>
          <option value="">Escolha uma categoria</option>
          {CATEGORIAS.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </Campo>

      <Campo
        id="orcamento"
        rotulo="Orçamento máximo para a categoria (R$)"
        ajuda="Só o que aceita gastar com este fornecedor, não com o casamento inteiro."
        erro={erros.orcamento}
      >
        <input type="text" inputMode="decimal" {...ligar("orcamento")} />
      </Campo>

      <Campo id="convidados" rotulo="Número estimado de convidados" erro={erros.convidados}>
        <input type="number" inputMode="numeric" min="1" step="1" {...ligar("convidados")} />
      </Campo>

      <BotaoPrincipal tipo="submit" texto="Encontrar Fornecedores" desativado={!valido} />
    </form>
  );
}
