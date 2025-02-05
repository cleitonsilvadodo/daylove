"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import AnimatedLogo from "@/components/shared/AnimatedLogo";

export default function PendingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Pegar parâmetros da URL
  const qrCode = searchParams.get("qr_code") || "";
  const pixKey = searchParams.get("pix_key") || "";
  const expiresAt = searchParams.get("expires_at");
  const orderId = searchParams.get("order_id");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  // Gerar QR code quando o componente montar
  useEffect(() => {
    async function generateQRCode() {
      if (qrCode) {
        try {
          const response = await fetch("/api/generate-qrcode", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: qrCode }),
          });

          const data = await response.json();
          if (data.success) {
            setQrCodeUrl(data.qrCodeDataUrl);
          }
        } catch (error) {
          console.error("Erro ao gerar QR code:", error);
        }
      }
    }

    generateQRCode();
  }, [qrCode]);

  // Verificar status do pagamento
  useEffect(() => {
    if (!orderId) return;

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/check-payment/${orderId}`);
        const data = await response.json();

        if (data.success && data.status === "paid") {
          router.push("/payment/success");
        }
      } catch (error) {
        console.error("Erro ao verificar status:", error);
      }
    };

    // Verificar a cada 3 segundos
    const interval = setInterval(checkPaymentStatus, 3000);

    // Limpar intervalo quando componente for desmontado
    return () => clearInterval(interval);
  }, [orderId, router]);

  // Atualizar contador regressivo
  useEffect(() => {
    if (!expiresAt) return;

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const expires = new Date(expiresAt).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setTimeLeft("Expirado");
        return;
      }

      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  // Copiar código PIX
  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="bg-[#1A1A1A] p-8 rounded-lg max-w-md w-full text-center">
        <div className="relative mb-6">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-pink-500/10 to-purple-500/5 rounded-full blur-2xl transform scale-150"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full animate-pulse"></div>
            <div className="relative w-full h-full transform hover:scale-105 transition-transform duration-300">
              <AnimatedLogo />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Pagamento Pendente</h1>
        </div>
        
        {/* QR Code */}
        {qrCodeUrl && qrCode && (
          <div className="mb-6">
            <div className="bg-white p-4 rounded-lg inline-block mb-2">
              <Image
                src={qrCodeUrl}
                alt="QR Code PIX"
                width={200}
                height={200}
                className="mx-auto"
                unoptimized
              />
            </div>
            <p className="text-white/60 text-sm">
              Escaneie o QR code com seu aplicativo do banco
            </p>
          </div>
        )}

        {/* Código PIX */}
        {pixKey && (
          <div className="mb-6">
            <p className="text-white/60 mb-2">Ou copie o código PIX:</p>
            <div className="bg-black/20 p-3 rounded-lg flex items-center justify-between gap-2 mb-2">
              <code className="text-white/80 text-sm break-all">
                {pixKey.substring(0, 30)}...
              </code>
              <button
                onClick={copyPix}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded transition-colors"
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>
        )}

        {/* Timer */}
        {timeLeft && (
          <div className="mb-6">
            <p className="text-white/60 mb-1">Tempo restante para pagamento:</p>
            <p className="text-2xl font-bold text-white">{timeLeft}</p>
          </div>
        )}

        {/* Status */}
        <div className="animate-pulse mb-6">
          <p className="text-white/80">
            Aguardando confirmação do pagamento...
          </p>
          <p className="text-white/60 text-sm mt-2">
            Você será redirecionado automaticamente após a confirmação
          </p>
        </div>

        {/* Mensagem do Desenvolvedor */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg blur-xl"></div>
          <div className="bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] p-6 rounded-lg border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-pink-500/10 blur-2xl transform rotate-45"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center relative">
                    <div className="absolute inset-0.5 bg-gradient-to-br from-red-400 to-pink-500 rounded-full"></div>
                    <span className="relative text-xl font-bold text-white font-sans" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>C</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold">Cleiton</h3>
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-xs px-2 py-0.5 rounded-full text-white">Verificado ✓</span>
                  </div>
                  <p className="text-white/60 text-sm">Desenvolvedor DayLove</p>
                </div>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Olá! Sou o desenvolvedor do DayLove e quero garantir que você tenha a melhor experiência possível. 
                Após a confirmação do seu pagamento, enviarei pessoalmente todos os dados necessários para o suporte.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
