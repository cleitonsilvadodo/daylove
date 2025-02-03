"use client";

import React from "react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#1A1A1A] p-8 rounded-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Obrigado pela sua compra! ❤️
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Seu pagamento foi processado com sucesso.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md bg-[#222222] p-4">
            <div className="text-sm text-white/80">
              <p className="mb-4">
                Enviamos um email com os detalhes do seu pagamento e em breve você receberá outro email com:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Link da sua página personalizada</li>
                <li>QR code para compartilhar</li>
                <li>Instruções de acesso</li>
              </ul>
            </div>
          </div>

          <div className="rounded-md bg-[#222222] p-4">
            <h3 className="text-lg font-medium text-white mb-2">
              Precisa de ajuda?
            </h3>
            <p className="text-sm text-white/80 mb-4">
              Nossa equipe está sempre pronta para ajudar você.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-white/60">
                Email para suporte:
                <a
                  href="mailto:suporte@daylove.com.br"
                  className="ml-2 text-red-500 hover:text-red-400"
                >
                  suporte@daylove.com.br
                </a>
              </p>
              <p className="text-sm text-white/60">
                Horário de atendimento: Segunda a Sexta, 9h às 18h
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Voltar para a página inicial
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-white/40">
            DayLove - Compartilhando amor desde 2024 ❤️
          </p>
        </div>
      </div>
    </div>
  );
}
