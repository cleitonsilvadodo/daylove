"use client";

import React, { useRef } from "react";
import { FormData } from "@/types/form";

export default function PhotoForm({
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
  const MAX_PHOTOS = 8;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = MAX_PHOTOS - formData.photos.length;
    if (remainingSlots <= 0) {
      alert(`Você já atingiu o limite máximo de ${MAX_PHOTOS} fotos.`);
      return;
    }
    
    const newPhotos = Array.from(files).slice(0, remainingSlots).map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
      photoDisplayMode: "coverflow"
    }));

    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const files = e.dataTransfer.files;
    if (!files) return;

    const remainingSlots = MAX_PHOTOS - formData.photos.length;
    if (remainingSlots <= 0) {
      alert(`Você já atingiu o limite máximo de ${MAX_PHOTOS} fotos.`);
      return;
    }
    
    const newPhotos = Array.from(files).slice(0, remainingSlots).map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
      photoDisplayMode: "coverflow"
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">
          Fotos
        </h1>
        <p className="text-gray-400">
          Adicione até {MAX_PHOTOS} fotos especiais para sua página
        </p>
      </div>

      {/* Indicador de progresso */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((step) => (
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
        {/* Área de upload */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-[#333333] rounded-lg p-8 text-center hover:border-red-500 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="space-y-2">
            <div className="text-gray-400">
              Arraste e solte suas fotos aqui
            </div>
            <div className="text-sm text-gray-500">
              PNG, JPG, JPEG, GIF (máx. {MAX_PHOTOS} fotos)
            </div>
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-[#222222] text-white rounded-lg hover:bg-[#333333] transition-colors"
            >
              Selecionar fotos
            </button>
          </div>
        </div>

        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Preview das fotos */}
        {formData.photos.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-300 font-medium">Fotos selecionadas</h3>
              <span className="text-sm text-gray-500">
                {formData.photos.length} de {MAX_PHOTOS} fotos
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {formData.photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-video bg-[#1A1A1A] rounded-lg overflow-hidden relative group"
                >
                  <img
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        photos: prev.photos.filter((_, i) => i !== index)
                      }));
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
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
