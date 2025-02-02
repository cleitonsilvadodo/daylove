"use client";

import React from "react";
import { FormData } from "@/types/form";

export default function StartDateForm({
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
          Data de início
        </h1>
        <p className="text-gray-400">
          Quando começou essa história de amor?
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

      <div className="space-y-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">
            Data de início
          </label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                startDate: e.target.value
              }));
            }}
            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white"
            style={{
              colorScheme: "dark"
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Estilo de exibição
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  dateDisplayMode: "padrao"
                }));
              }}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.dateDisplayMode === "padrao"
                  ? "border-red-500 bg-[#1A1A1A]"
                  : "border-[#333333] hover:border-red-500"
              }`}
            >
              <div className="font-medium text-white">Padrão</div>
              <div className="text-sm text-gray-400">14 de fevereiro de 2024</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  dateDisplayMode: "classico"
                }));
              }}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.dateDisplayMode === "classico"
                  ? "border-red-500 bg-[#1A1A1A]"
                  : "border-[#333333] hover:border-red-500"
              }`}
            >
              <div className="font-medium text-white">Clássico</div>
              <div className="text-sm text-gray-400">14/02/2024</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  dateDisplayMode: "simples"
                }));
              }}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.dateDisplayMode === "simples"
                  ? "border-red-500 bg-[#1A1A1A]"
                  : "border-[#333333] hover:border-red-500"
              }`}
            >
              <div className="font-medium text-white">Simples</div>
              <div className="text-sm text-gray-400">14.02.24</div>
            </button>
          </div>
        </div>
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
          disabled={!formData.startDate}
          className="px-6 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600"
        >
          Próxima etapa
        </button>
      </div>
    </div>
  );
}
