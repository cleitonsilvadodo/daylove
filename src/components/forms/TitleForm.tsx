"use client";

import React from "react";
import { FormData } from "@/types/form";

interface TitleFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export default function TitleForm({
  formData,
  setFormData,
  onNextStep,
  onPrevStep,
}: TitleFormProps) {
  const suggestions = [
    "João & Maria",
    "Nosso Amor",
    "Para Sempre Juntos",
    "Feliz Aniversário",
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">
          Crie sua página especial
        </h1>
        <p className="text-gray-400">
          Comece escolhendo um título para sua página dedicatória
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
        <div>
          <label htmlFor="title" className="label">
            Título da página
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                title: e.target.value
              }));
            }}
            placeholder="Ex: João & Maria"
            className="input"
          />
          <p className="mt-1 text-sm text-gray-500">
            Este será o título principal da sua página dedicatória
          </p>
        </div>

        <div>
          <label className="label">
            Sugestões de títulos
          </label>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    title: suggestion
                  }));
                }}
                className="px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white hover:border-red-500 transition-all duration-300"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onNextStep}
          disabled={!formData.title}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próxima etapa
        </button>
      </div>
    </div>
  );
}
