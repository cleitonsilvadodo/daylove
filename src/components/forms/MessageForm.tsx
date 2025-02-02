"use client";

import React from "react";
import { FormData } from "@/types/form";

interface MessageFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNextStep: () => void;
  onPrevStep: () => void;
}

const MessageForm: React.FC<MessageFormProps> = ({
  formData,
  setFormData,
  onNextStep,
  onPrevStep,
}) => {
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 800) {
      setFormData((prev) => ({
        ...prev,
        message: newValue,
      }));
    }
  };

  const handleNext = () => {
    console.log("Attempting to move to next step"); // Debug
    if (formData.message.trim()) {
      onNextStep();
    }
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">
          Escreva sua mensagem
        </h1>
        <p className="text-gray-400">
          Adicione uma mensagem especial para tornar sua página mais significativa
        </p>
      </div>

      {/* Indicador de progresso */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((step) => (
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

      {/* Formulário */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">
              Sua mensagem
            </label>
            <span className="text-sm text-gray-500">
              {formData.message.length}/800 caracteres
            </span>
          </div>
          <textarea
            id="message"
            value={formData.message}
            onChange={handleMessageChange}
            placeholder="Escreva aqui sua mensagem especial..."
            className="w-full h-48 px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
            autoFocus
          />
          <p className="text-sm text-gray-500">
            Seja criativo e demonstre todo seu carinho nesta mensagem
          </p>
        </div>

        {/* Exemplos de mensagens */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-300">
            Sugestões de mensagens
          </p>
          <div className="grid grid-cols-1 gap-2">
            {[
              "Cada momento ao seu lado é especial...",
              "Nossa história começou assim...",
              "Quero celebrar nosso amor com você...",
              "Juntos construímos memórias incríveis...",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, message: suggestion }))
                }
                className="p-2 text-sm text-left text-gray-400 bg-[#1A1A1A] rounded-lg hover:bg-[#222222] transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Botões de navegação */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onPrevStep}
          className="px-6 py-2 text-white bg-transparent border border-[#333333] rounded-lg hover:bg-[#222222] transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={handleNext}
          disabled={!formData.message.trim()}
          className="px-6 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
        >
          Próxima etapa
        </button>
      </div>
    </div>
  );
};

export default MessageForm;
