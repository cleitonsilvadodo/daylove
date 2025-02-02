"use client";

import React from "react";
import { FormData } from "@/types/form";

export default function TestForm({
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
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">
          Formulário de Teste
        </h1>
        <p className="text-gray-400">
          Esta é uma etapa de teste para verificar a navegação
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Campo de teste
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                title: e.target.value,
              }));
            }}
            className="w-full px-4 py-3"
            placeholder="Digite algo aqui..."
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onPrevStep}
          className="px-6 py-2 text-white bg-transparent border border-[#333333] rounded-lg hover:bg-[#222222]"
        >
          Voltar
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
