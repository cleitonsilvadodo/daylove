"use client";

import React from "react";
import Link from "next/link";

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1A1A1A] rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">
          Ops! Algo deu errado
        </h1>

        <p className="text-white/60 mb-8">
          Não foi possível processar seu pagamento. Por favor, tente novamente ou
          entre em contato conosco se o problema persistir.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="btn btn-primary inline-block"
          >
            Tentar novamente
          </Link>

          <div>
            <a
              href="mailto:suporte@daylove.com.br"
              className="text-red-500 hover:text-red-400 text-sm"
            >
              Precisa de ajuda? Entre em contato
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
