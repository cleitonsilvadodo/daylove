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
  return (
    <div className="relative w-full min-h-[400px] bg-[#171717] rounded-lg overflow-hidden">
      {/* Animação de fundo */}
      <BackgroundAnimation type={formData.animation} />

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-8 text-center">
        {/* Foto */}
        {formData.photos?.[0] && (
          <div className="relative w-64 h-64 mb-8 rounded-lg overflow-hidden">
            <img
              src={formData.photos[0]}
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
