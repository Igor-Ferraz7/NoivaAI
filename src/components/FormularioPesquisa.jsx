"use client";

// Formulário da pesquisa inicial de fornecedores (Spec 001).
import { useState } from "react";
import BotaoPrincipal from "./BotaoPrincipal.jsx";
import { CATEGORIAS, validarPesquisa } from "../lib/pesquisa.js";

const VAZIO = { cidadeUf: "", data: "", categoria: "", orcamento: "", convidados: "" };

const estiloCampo =
  "block w-full min-h-12 rounded-xl border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400";

function Campo({ id, rotulo, ajuda, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-medium">
        {rotulo}
      </label>
      {children}
      {ajuda && <p className="text-sm text-gray-600">{ajuda}</p>}
    </div>
  );
}

export default function FormularioPesquisa() {
  const [valores, setValores] = useState(VAZIO);
  const { valido } = validarPesquisa(valores);

  const alterar = (campo) => (evento) => setValores((atuais) => ({ ...atuais, [campo]: evento.target.value }));

  function enviar(evento) {
    evento.preventDefault();
    if (!valido) return; // RN-04: nada é enviado com dados em falta ou inválidos.
  }

  return (
    <form onSubmit={enviar} noValidate aria-label="Pesquisa de fornecedores" className="mt-6 flex flex-col gap-5">
      <Campo id="cidadeUf" rotulo="Cidade/UF" ajuda="Exemplo: Rio Verde - GO">
        <input id="cidadeUf" type="text" autoComplete="address-level2" value={valores.cidadeUf} onChange={alterar("cidadeUf")} className={estiloCampo} />
      </Campo>

      <Campo id="data" rotulo="Data prevista (opcional)">
        <input id="data" type="date" value={valores.data} onChange={alterar("data")} className={estiloCampo} />
      </Campo>

      <Campo id="categoria" rotulo="Categoria de fornecedor">
        <select id="categoria" value={valores.categoria} onChange={alterar("categoria")} className={estiloCampo}>
          <option value="">Escolha uma categoria</option>
          {CATEGORIAS.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </Campo>

      <Campo id="orcamento" rotulo="Orçamento máximo para a categoria (R$)" ajuda="Só o que aceita gastar com este fornecedor, não com o casamento inteiro.">
        <input id="orcamento" type="text" inputMode="decimal" value={valores.orcamento} onChange={alterar("orcamento")} className={estiloCampo} />
      </Campo>

      <Campo id="convidados" rotulo="Número estimado de convidados">
        <input id="convidados" type="number" inputMode="numeric" min="1" step="1" value={valores.convidados} onChange={alterar("convidados")} className={estiloCampo} />
      </Campo>

      <BotaoPrincipal tipo="submit" texto="Encontrar Fornecedores" desativado={!valido} />
    </form>
  );
}
