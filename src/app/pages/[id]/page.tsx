"use client";

import React from "react";
import { getPageById, PageRecord } from "@/lib/supabase";
import { formatDate } from "@/utils/date";
import BackgroundAnimation from "@/components/preview/BackgroundAnimation";
import MusicPlayer from "@/components/preview/MusicPlayer";
import TimeCounter from "@/components/preview/TimeCounter";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const [pageData, setPageData] = React.useState<PageRecord | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadPage() {
      try {
        const data = await getPageById(params.id);
        if (!data) {
          setError("Página não encontrada");
        } else if (data.status !== "published") {
          setError("Esta página ainda não está disponível");
        } else {
          setPageData(data);
        }
      } catch (err) {
        setError("Erro ao carregar a página");
        console.error("Erro ao carregar página:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ops! {error}</h1>
          <p className="text-white/60">
            A página que você está procurando não existe ou foi removida.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] py-8">
      <div className="container mx-auto px-4">
        <div className="relative w-full min-h-[400px] bg-[#111111] rounded-lg overflow-hidden">
          {/* Animação de fundo */}
          <BackgroundAnimation type={pageData.animation} />

          {/* Conteúdo */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-8 text-center">
            {/* Foto */}
            {pageData.photos?.[0] && (
              <div className="relative w-64 h-64 mb-8 rounded-lg overflow-hidden">
                <img
                  src={pageData.photos[0]}
                  alt="Foto do casal"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}

            {/* Título */}
            <h1 
              className="text-4xl font-bold mb-6"
              style={{ 
                fontFamily: "'Dancing Script', cursive",
                color: "#ef4444"
              }}
            >
              {pageData.title || "Nosso Amor"}
            </h1>

            {/* Mensagem */}
            {pageData.message && (
              <div className="max-w-md text-white/60 mb-8 whitespace-pre-line">
                {pageData.message}
              </div>
            )}

            {/* Data e Contagem */}
            {pageData.startDate && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-white/60">Compartilhando momentos há</p>
                  <TimeCounter startDate={pageData.startDate} />
                </div>
                <div className="text-white/80">
                  <span className="text-white/60 mr-2">Desde</span>
                  {formatDate(pageData.startDate, pageData.dateDisplayMode)}
                </div>
              </div>
            )}

            {/* Player de música */}
            {pageData.music.url && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <MusicPlayer music={pageData.music} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
