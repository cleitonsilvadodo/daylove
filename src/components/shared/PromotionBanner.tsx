"use client";

import React from "react";

export default function PromotionBanner() {
  return (
    <div className="bg-gradient-to-r from-red-600/90 to-pink-600/90 backdrop-blur-sm text-white py-2.5 px-4 text-center shadow-lg transition-all duration-300">
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="text-yellow-300 animate-pulse">⭐</span>
        Super Promoção - Todos os planos com 50% de desconto, aproveite!
        <span className="text-yellow-300 animate-pulse">⭐</span>
      </span>
    </div>
  );
}
