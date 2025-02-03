"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-white/60">Carregando pagamento...</p>
      </div>
    </div>
  );
}

function PaymentPendingContent() {
  const searchParams = useSearchParams();
  const [qrCodeImage, setQrCodeImage] = useState<string>();
  const [pixKey, setPixKey] = useState<string>();
  const [expiresAt, setExpiresAt] = useState<string>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Gerar QR code para o PIX
    async function generateQRCode() {
      const key = searchParams.get('pix_key');
      if (key) {
        try {
          const response = await fetch("/api/generate-qrcode", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: key }),
          });

          const data = await response.json();
          if (data.success) {
            setQrCodeImage(data.qrCodeDataUrl);
          }
        } catch (error) {
          console.error("Erro ao gerar QR code:", error);
        }
      }
    }

    // Recuperar dados do PIX da URL
    const key = searchParams.get('pix_key');
    const expires = searchParams.get('expires_at');

    if (key) {
      setPixKey(key);
      generateQRCode();
    }
    if (expires) {
      setExpiresAt(expires);
    }
  }, [searchParams]);

  const handleCopyPix = async () => {
    if (pixKey) {
      try {
        await navigator.clipboard.writeText(pixKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Erro ao copiar:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#1A1A1A] p-8 rounded-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Aguardando Pagamento PIX
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Seu pedido foi criado e está aguardando o pagamento.
          </p>
        </div>

        {/* Apresentação do Desenvolvedor */}
        <div className="bg-[#222222] p-6 rounded-lg text-center">
          <p className="text-white mb-2">
            Olá, me chamo Cleiton e sou o desenvolvedor do DayLove.
          </p>
          <p className="text-white/60 text-sm">
            Após o pagamento, você receberá os dados para suporte e contato.
          </p>
        </div>

        {/* QR Code e Chave PIX */}
        {(qrCodeImage || pixKey) && (
          <div className="bg-[#222222] p-6 rounded-lg text-center space-y-6">
            {qrCodeImage && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-white font-medium">Escaneie o QR Code:</p>
                <img
                  src={qrCodeImage}
                  alt="QR Code PIX"
                  className="bg-white p-2 rounded-lg w-[200px] h-[200px]"
                />
              </div>
            )}
            {pixKey && (
              <div className="space-y-2">
                <p className="text-white font-medium">Ou copie a chave PIX:</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white/10 p-2 rounded break-all">
                    <code className="text-white text-sm">{pixKey}</code>
                  </div>
                  <button
                    onClick={handleCopyPix}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  >
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>
            )}
            {expiresAt && (
              <p className="text-sm text-white/60">
                Expira em: {new Date(expiresAt).toLocaleString()}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 space-y-6">
          <div className="rounded-md bg-[#222222] p-4">
            <div className="text-sm text-white/80">
              <p className="mb-4">
                Para concluir sua compra:
              </p>
              <ul className="list-decimal list-inside space-y-2 ml-2">
                <li>Abra o app do seu banco</li>
                <li>Escaneie o QR code ou copie a chave PIX</li>
                <li>Confirme o pagamento no valor exato</li>
                <li>Aguarde a confirmação automática</li>
              </ul>
            </div>
          </div>

          <div className="rounded-md bg-[#222222] p-4">
            <h3 className="text-lg font-medium text-white mb-2">
              O que acontece depois?
            </h3>
            <div className="space-y-2 text-sm text-white/80">
              <p>Após a confirmação do pagamento:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Você será redirecionado automaticamente</li>
                <li>Receberá um email com os detalhes do pagamento</li>
                <li>Em seguida, receberá outro email com o link da sua página e QR code</li>
              </ul>
            </div>
          </div>

          <div className="rounded-md bg-[#222222] p-4">
            <h3 className="text-lg font-medium text-white mb-2">
              Precisa de ajuda?
            </h3>
            <p className="text-sm text-white/80 mb-4">
              Estou aqui para ajudar você em qualquer etapa do processo.
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

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PaymentPendingContent />
    </Suspense>
  );
}
