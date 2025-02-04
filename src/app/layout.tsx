import "@/styles/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DayLove - Crie sua página de amor",
  description: "Crie uma página especial para celebrar seu amor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#111111]">
        {children}
      </body>
    </html>
  );
}
