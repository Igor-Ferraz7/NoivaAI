import "./globals.css";

export const metadata = {
  title: "Noiva.AI – Encontrar Fornecedores",
  description: "Diga a cidade, a categoria e o orçamento e a nossa IA procura fornecedores para o seu casamento.",
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-rose-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
