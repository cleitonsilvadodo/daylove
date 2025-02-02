"use client";

import React from "react";
import Preview from "./Preview";
import { FormData } from "@/types/form";

interface PreviewFrameProps {
  formData: FormData;
}

export default function PreviewFrame({ formData }: PreviewFrameProps) {
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-xl">
      {/* Barra de navegador */}
      <div className="bg-[#2D2D2D] p-2">
        {/* Botões de controle */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#FF605C]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD44]"></div>
          <div className="w-3 h-3 rounded-full bg-[#00CA4E]"></div>
        </div>
        {/* Barra de URL */}
        <div className="bg-[#1A1A1A] rounded px-3 py-1 text-sm text-white/60 flex items-center">
          <span>https://daylove.com.br/</span>
        </div>
      </div>

      {/* Conteúdo do Preview */}
      <Preview formData={formData} />
    </div>
  );
}
