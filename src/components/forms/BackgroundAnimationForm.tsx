"use client";

import React from "react";
import { FormData, AnimationType } from "@/types/form";

interface BackgroundAnimationFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export default function BackgroundAnimationForm({
  formData,
  setFormData,
  onNextStep,
  onPrevStep,
}: BackgroundAnimationFormProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">
          Animação de fundo
        </h1>
        <p className="text-gray-400">
          Escolha uma animação para o fundo da sua página
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sem animação */}
        <button
          type="button"
          onClick={() => {
            setFormData(prev => ({
              ...prev,
              animation: "none"
            }));
          }}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            formData.animation === "none"
              ? "border-red-500 bg-[#1A1A1A]"
              : "border-[#333333] hover:border-red-500"
          }`}
        >
          <div className="font-medium text-white">Sem animação</div>
          <div className="text-sm text-gray-400">Fundo simples e minimalista</div>
        </button>

        {/* Chuva de corações */}
        <button
          type="button"
          onClick={() => {
            setFormData(prev => ({
              ...prev,
              animation: "hearts"
            }));
          }}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            formData.animation === "hearts"
              ? "border-red-500 bg-[#1A1A1A]"
              : "border-[#333333] hover:border-red-500"
          }`}
        >
          <div className="font-medium text-white">Chuva de corações</div>
          <div className="text-sm text-gray-400">Corações flutuando suavemente</div>
        </button>

        {/* Aurora boreal */}
        <button
          type="button"
          onClick={() => {
            setFormData(prev => ({
              ...prev,
              animation: "aurora"
            }));
          }}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            formData.animation === "aurora"
              ? "border-red-500 bg-[#1A1A1A]"
              : "border-[#333333] hover:border-red-500"
          }`}
        >
          <div className="font-medium text-white">Aurora boreal</div>
          <div className="text-sm text-gray-400">Efeito de aurora boreal colorida</div>
        </button>

        {/* Céu estrelado */}
        <button
          type="button"
          onClick={() => {
            setFormData(prev => ({
              ...prev,
              animation: "stars-meteors"
            }));
          }}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            formData.animation === "stars-meteors"
              ? "border-red-500 bg-[#1A1A1A]"
              : "border-[#333333] hover:border-red-500"
          }`}
        >
          <div className="font-medium text-white">Céu estrelado</div>
          <div className="text-sm text-gray-400">Estrelas e meteoros brilhantes</div>
        </button>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onPrevStep}
          className="px-6 py-2 text-white bg-transparent border border-[#333333] rounded-lg hover:bg-[#222222]"
        >
          Voltar etapa
        </button>
        <button
          type="button"
          onClick={onNextStep}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Próxima etapa
        </button>
      </div>
    </div>
  );
}
