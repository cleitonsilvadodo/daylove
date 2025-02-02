"use client";

import React, { useRef } from "react";
import { FormData } from "@/types/form";

export default function MusicForm({
  formData,
  setFormData,
  onNextStep,
  onPrevStep,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNextStep: () => void;
  onPrevStep: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      music: {
        type: "file",
        url: url,
        title: file.name.replace(/\.[^/.]+$/, "") // Remove extensão
      }
    }));

    e.target.value = '';
  };

  const handleYoutubeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (!url) {
      setFormData(prev => ({
        ...prev,
        music: { type: "", url: "", title: "" }
      }));
      return;
    }

    // Extrair ID do vídeo do YouTube
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    
    if (videoId) {
      setFormData(prev => ({
        ...prev,
        music: {
          type: "youtube",
          url: videoId,
          title: "Música do YouTube" // Poderia ser atualizado com a API do YouTube
        }
      }));
    }
  };

  const handleSpotifyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (!url) {
      setFormData(prev => ({
        ...prev,
        music: { type: "", url: "", title: "" }
      }));
      return;
    }

    // Extrair ID da faixa do Spotify
    const trackId = url.match(/track\/([a-zA-Z0-9]+)/)?.[1];
    
    if (trackId) {
      setFormData(prev => ({
        ...prev,
        music: {
          type: "spotify",
          url: trackId,
          title: "Música do Spotify" // Poderia ser atualizado com a API do Spotify
        }
      }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">
          Música dedicada
        </h1>
        <p className="text-gray-400">
          Escolha uma música especial para tocar na sua página (opcional)
        </p>
      </div>

      {/* Indicador de progresso */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
          <div
            key={step}
            className={`h-2 rounded-full transition-all duration-300 ${
              step === formData.currentStep
                ? "w-8 bg-red-500"
                : step < formData.currentStep
                ? "w-4 bg-green-500"
                : "w-4 bg-[#222222]"
            }`}
          />
        ))}
      </div>

      <div className="space-y-6">
        {/* Upload de arquivo */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Enviar arquivo de música
          </label>
          <div
            className="border-2 border-dashed border-[#333333] rounded-lg p-8 text-center hover:border-red-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-2">
              <div className="text-gray-400">
                Clique para selecionar um arquivo
              </div>
              <div className="text-sm text-gray-500">
                MP3, WAV (máx. 10MB)
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Separador */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[#333333]"></div>
          <span className="text-gray-500">ou</span>
          <div className="flex-1 h-px bg-[#333333]"></div>
        </div>

        {/* Links de streaming */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Link do YouTube
            </label>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              onChange={handleYoutubeInput}
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Link do Spotify
            </label>
            <input
              type="text"
              placeholder="https://open.spotify.com/track/..."
              onChange={handleSpotifyInput}
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* Preview do player */}
        {formData.music.url && (
          <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#333333]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#222222] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {formData.music.title || "Música selecionada"}
                </div>
                <div className="text-xs text-gray-500">
                  via {formData.music.type === "file" ? "Upload" : formData.music.type}
                </div>
              </div>
              <button
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    music: { type: "", url: "", title: "" }
                  }));
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onPrevStep}
          className="px-6 py-2 text-white bg-transparent border border-[#333333] rounded-lg hover:bg-[#222222]"
        >
          Voltar etapa
        </button>
        <div className="space-x-4">
          <button
            type="button"
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                music: { type: "", url: "", title: "" }
              }));
              onNextStep();
            }}
            className="px-6 py-2 text-white bg-transparent border border-[#333333] rounded-lg hover:bg-[#222222]"
          >
            Pular etapa
          </button>
          <button
            type="button"
            onClick={onNextStep}
            disabled={!formData.music.url}
            className="px-6 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600"
          >
            Próxima etapa
          </button>
        </div>
      </div>
    </div>
  );
}
