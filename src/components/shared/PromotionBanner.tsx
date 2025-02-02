"use client";

import React from "react";

export default function PromotionBanner() {
  return (
    <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-2 text-center">
      <span className="inline-flex items-center gap-2">
        <span className="text-yellow-300">⭐</span>
        Super Promoção - Todos os planos com 50% de desconto, aproveite!
      </span>
    </div>
  );
}
