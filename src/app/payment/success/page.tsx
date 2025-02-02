"use client";

import React from "react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1A1A1A] rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">
          Pagamento aprovado!
        </h1>

        <p className="text-white/60 mb-8">
          Seu pagamento foi processado com sucesso. Em breve você receberá um email
          com o link da sua página e o QR Code para compartilhar.
        </p>

        <Link
          href="/"
          className="btn btn-primary inline-block"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
