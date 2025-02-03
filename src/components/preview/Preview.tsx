"use client";

import React from "react";
import { FormData } from "@/types/form";
import { formatDate } from "@/utils/date";
import BackgroundAnimation from "./BackgroundAnimation";
import MusicPlayer from "./MusicPlayer";
import TimeCounter from "./TimeCounter";

interface PreviewProps {
  formData: FormData;
}

export default function Preview({ formData }: PreviewProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState(0);

  // Função para avançar para a próxima foto
  const nextPhoto = () => {
    if (formData.photos?.length) {
      setCurrentPhotoIndex((prev) => (prev + 1) % formData.photos.length);
    }
  };

  // Função para voltar para a foto anterior
  const prevPhoto = () => {
    if (formData.photos?.length) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? formData.photos.length - 1 : prev - 1
      );
    }
  };

  // Avançar foto automaticamente a cada 5 segundos
  React.useEffect(() => {
    if (formData.photos && formData.photos.length > 1) {
      const timer = setInterval(nextPhoto, 5000);
      return () => clearInterval(timer);
    }
  }, [formData.photos]);

  const hasMultiplePhotos = formData.photos && formData.photos.length > 1;

  return (
    <div className="relative w-full min-h-[400px] bg-[#171717] rounded-lg overflow-hidden">
      {/* Animação de fundo */}
      <BackgroundAnimation type={formData.animation} />

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-8 text-center">
        {/* Foto com carrossel */}
        {formData.photos && formData.photos.length > 0 && (
          <div className="relative w-64 h-64 mb-8 rounded-lg overflow-hidden group">
            <img
              src={formData.photos[currentPhotoIndex]}
              alt={`Foto ${currentPhotoIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            />
            
            {/* Botões de navegação (visíveis apenas quando hover e mais de uma foto) */}
            {hasMultiplePhotos && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  ←
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  →
                </button>
              </>
            )}

            {/* Indicadores de foto */}
            {hasMultiplePhotos && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {formData.photos.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentPhotoIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
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
          {formData.title || "Nosso Amor"}
        </h1>

        {/* Mensagem */}
        {formData.message && (
          <div className="max-w-md text-white/60 mb-8 whitespace-pre-line">
            {formData.message}
          </div>
        )}

        {/* Data e Contagem */}
        {formData.startDate && (
          <div className="space-y-4">
            <p className="text-white/60">Compartilhando momentos há</p>
            <div className="max-w-2xl mx-auto">
              <TimeCounter startDate={formData.startDate} />
            </div>
            <div className="text-white/80 mt-4">
              <span className="text-white/60 mr-2">Desde</span>
              {formatDate(formData.startDate, formData.dateDisplayMode)}
            </div>
          </div>
        )}

        {/* Player de música */}
        {formData.music.url && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <MusicPlayer music={formData.music} />
          </div>
        )}
      </div>
    </div>
  );
}
