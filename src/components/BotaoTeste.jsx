// Botão de teste — serve de referência para o estilo dos botões principais
// (ex: "Encontrar Fornecedores", Spec 001). Mobile-first: largura total e
// área de toque confortável no telemóvel; largura automática a partir de `md:`.
export default function BotaoTeste({ texto = "Botão de teste", desativado = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desativado}
      className="w-full min-h-12 px-4 py-3 rounded-xl text-base font-semibold text-white bg-rose-600 active:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed md:w-auto md:px-8 md:hover:bg-rose-700"
    >
      {texto}
    </button>
  );
}
