"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { maskCPF, maskPhone, maskCardNumber, maskCardExpiry, maskCardCVV } from "@/utils/masks";
import { FormData } from "@/types/form";
import { PaymentResponse, PlanType, PaymentMethod } from "@/types/payment";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface PaymentFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onPrevStep: () => void;
}

interface CustomerData {
  name: string;
  email: string;
  document: string;
  phone: string;
}

interface CardData {
  number: string;
  holder_name: string;
  exp_month: string;
  exp_year: string;
  cvv: string;
}

interface PixData {
  qr_code?: string;
  qr_code_url?: string;
  pix_key?: string;
  expires_at?: string;
}

const PLANS = [
  {
    type: "forever" as PlanType,
    title: "Para sempre",
    price: 1.00,
    oldPrice: 62.00,
    period: "/uma vez",
    features: [
      { text: "Texto dedicado", included: true, icon: "✍️" },
      { text: "Data de início", included: true, icon: "📅" },
      { text: "Máximo de 8 imagens", included: true, icon: "🖼️" },
      { text: "Com música", included: true, icon: "🎵" },
      { text: "Com animações exclusivas", included: true, icon: "✨" },
      { text: "Acesso vitalício", included: true, icon: "🔒" },
    ],
    recommended: true,
    popularTag: "Mais Popular",
  },
  {
    type: "annual" as PlanType,
    title: "Anual",
    price: 1.00,
    oldPrice: 42.00,
    period: "/por ano",
    features: [
      { text: "Texto dedicado", included: true, icon: "✍️" },
      { text: "Data de início", included: true, icon: "📅" },
      { text: "Máximo de 4 imagens", included: true, icon: "🖼️" },
      { text: "Sem música", included: false, icon: "🎵" },
      { text: "Sem animações exclusivas", included: false, icon: "✨" },
      { text: "Renovação anual", included: true, icon: "🔄" },
    ],
  },
];

const PAYMENT_METHODS = [
  {
    id: "credit_card" as PaymentMethod,
    title: "Cartão de Crédito",
    icon: "💳",
    description: "Pagamento em até 12x",
  },
  {
    id: "pix" as PaymentMethod,
    title: "PIX",
    icon: "⚡",
    description: "Aprovação imediata",
  },
];

const SECURITY_FEATURES = [
  {
    icon: "🔒",
    title: "Pagamento Seguro",
    description: "Seus dados estão protegidos"
  },
  {
    icon: "✨",
    title: "Satisfação Garantida",
    description: "7 dias de garantia"
  },
  {
    icon: "⚡",
    title: "Ativação Instantânea",
    description: "Disponível após pagamento"
  }
];

export default function PaymentForm({
  formData,
  onPrevStep,
}: PaymentFormProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("credit_card");
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    email: "",
    document: "",
    phone: "",
  });
  const [cardData, setCardData] = useState<CardData>({
    number: "",
    holder_name: "",
    exp_month: "",
    exp_year: "",
    cvv: "",
  });
  const [pixData, setPixData] = useState<PixData>();
  const [qrCodeImage, setQrCodeImage] = useState<string>();

  useEffect(() => {
    async function generateQRCode() {
      if (pixData?.pix_key) {
        try {
          const response = await fetch("/api/generate-qrcode", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: pixData.pix_key }),
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

    generateQRCode();
  }, [pixData?.pix_key]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setPixData(undefined);
      setQrCodeImage(undefined);

      const paymentData: any = {
        formData,
        planType: selectedPlan.type,
        planPrice: selectedPlan.price,
        paymentMethod: selectedMethod,
        customer: {
          name: customerData.name,
          email: customerData.email,
          document_number: customerData.document.replace(/\D/g, ""),
          phone_numbers: [customerData.phone.replace(/\D/g, "")],
        },
      };

      if (selectedMethod === "credit_card") {
        paymentData.card = {
          number: cardData.number.replace(/\s/g, ""),
          holder_name: cardData.holder_name,
          exp_month: parseInt(cardData.exp_month),
          exp_year: parseInt(cardData.exp_year),
          cvv: cardData.cvv,
        };
      }

      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const data: PaymentResponse = await response.json();

      if (data.success) {
        if (selectedMethod === "pix") {
          setPixData({
            qr_code: data.qr_code,
            qr_code_url: data.qr_code_url,
            pix_key: data.pix_key,
            expires_at: data.expires_at,
          });

          const qrCodeResponse = await fetch("/api/generate-qrcode", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: data.qr_code }),
          });

          const qrCodeData = await qrCodeResponse.json();
          
          const params = new URLSearchParams({
            qr_code: data.qr_code || '',
            qr_code_url: qrCodeData.success ? qrCodeData.qrCodeDataUrl : '',
            pix_key: data.pix_key || '',
            expires_at: data.expires_at || '',
            order_id: data.preferenceId || '',
          });

          router.push(`/payment/pending?${params.toString()}`);
        } else if (data.init_point) {
          window.open(data.init_point, '_blank');
          router.push('/payment/success');
        }
      } else {
        console.error("Erro na API:", data);
        alert(data.error || "Erro ao criar pagamento. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      alert("Erro ao processar pagamento. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (!customerData.name || !customerData.email || !customerData.document || !customerData.phone) {
      return false;
    }
    if (selectedMethod === "credit_card") {
      return (
        cardData.number &&
        cardData.holder_name &&
        cardData.exp_month &&
        cardData.exp_year &&
        cardData.cvv
      );
    }
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-3">Nossos Planos</h2>
        <p className="text-white/60 text-sm mb-4">
          Escolha o plano ideal para sua página personalizada
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="bg-white px-3 py-1.5 rounded-lg opacity-90 hover:opacity-100 transition-opacity">
            <span className="text-black text-sm font-bold">Pagar.me</span>
          </div>
          <Image
            src="/ssl-badge.svg"
            alt="SSL Secure"
            width={80}
            height={32}
            className="opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
        {PLANS.map((plan) => (
          <div
            key={plan.type}
            onClick={() => setSelectedPlan(plan)}
            className={`
              relative overflow-hidden rounded-xl transition-all duration-300
              ${selectedPlan.type === plan.type 
                ? 'bg-gradient-card border-2 border-primary-500 shadow-lg shadow-primary-500/20 scale-[1.02]' 
                : 'bg-gradient-card border border-white/10 hover:border-white/20 hover:scale-[1.01]'}
              backdrop-blur-xl cursor-pointer group
            `}
          >
            <div className="relative p-3 sm:p-4">
              {plan.popularTag && (
                <div className="absolute -top-1 -right-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-shine animate-shine" style={{ backgroundSize: '200% 100%' }}></div>
                    <div className="bg-gradient-to-r from-primary-400 to-primary-600 text-white text-xs font-bold py-1 px-3 rounded-bl-lg">
                      {plan.popularTag}
                    </div>
                  </div>
                </div>
              )}
              
              <h3 className="text-lg font-bold text-white mb-2">{plan.title}</h3>
              
              <div className="mb-3">
                <span className="text-white/60 line-through text-xs">R$ {plan.oldPrice.toFixed(2)}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-bold text-white">R$ {plan.price.toFixed(2)}</span>
                  <span className="text-white/60 text-sm">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-base">{feature.icon}</span>
                    <div className="flex-1">
                      <span className={`${feature.included ? 'text-white' : 'text-white/40'}`}>
                        {feature.text}
                      </span>
                    </div>
                    {feature.included ? (
                      <span className="text-green-400">✓</span>
                    ) : (
                      <span className="text-red-400">✕</span>
                    )}
                  </li>
                ))}
              </ul>

              <div className={`
                mt-4 py-1.5 px-3 rounded-lg text-center text-sm font-medium transition-all duration-300
                ${selectedPlan.type === plan.type 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white/10 text-white/80 group-hover:bg-white/20'}
              `}>
                {selectedPlan.type === plan.type ? 'Plano Selecionado' : 'Selecionar Plano'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className="space-y-6">
        {/* Métodos de Pagamento */}
        <div className="bg-gradient-card backdrop-blur-xl border border-white/10 p-4 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-3">Forma de Pagamento</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedMethod === method.id
                    ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 border border-primary-500'
                    : 'bg-black/20 border border-transparent hover:bg-white/5'
                }`}
                role="radio"
                aria-checked={selectedMethod === method.id}
                tabIndex={0}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl">{method.icon}</span>
                  <div>
                    <h4 className="font-medium text-white text-sm">{method.title}</h4>
                    <p className="text-xs text-white/60">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulário de dados do cliente */}
        <div className="bg-gradient-card backdrop-blur-xl border border-white/10 p-4 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-3">Dados para pagamento</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="name" className="block text-sm text-white/80 mb-1">Nome completo</label>
              <input
                type="text"
                id="name"
                value={customerData.name}
                onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all duration-300"
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-white/80 mb-1">E-mail</label>
              <input
                type="email"
                id="email"
                value={customerData.email}
                onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all duration-300"
                autoComplete="email"
                inputMode="email"
                required
              />
            </div>
            <div>
              <label htmlFor="document" className="block text-sm text-white/80 mb-1">CPF</label>
              <input
                type="text"
                id="document"
                value={customerData.document}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const maskedValue = maskCPF(e.target.value);
                  setCustomerData(prev => ({ ...prev, document: maskedValue }));
                }}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                placeholder="000.000.000-00"
                maxLength={14}
                pattern="\d{3}\.?\d{3}\.?\d{3}-?\d{2}"
                inputMode="numeric"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm text-white/80 mb-1">Telefone</label>
              <input
                type="tel"
                id="phone"
                value={customerData.phone}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const maskedValue = maskPhone(e.target.value);
                  setCustomerData(prev => ({ ...prev, phone: maskedValue }));
                }}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                placeholder="(00) 00000-0000"
                maxLength={15}
                pattern="\(\d{2}\) \d{5}-\d{4}"
                inputMode="tel"
                autoComplete="tel"
                required
              />
            </div>
          </div>
        </div>

        {/* Formulário de dados do cartão de crédito */}
        {selectedMethod === "credit_card" && (
          <div className="bg-gradient-card backdrop-blur-xl border border-white/10 p-4 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-3">Dados do Cartão</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="card_number" className="block text-sm text-white/80 mb-1">Número do Cartão</label>
                <input
                  type="text"
                  id="card_number"
                  value={cardData.number}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const maskedValue = maskCardNumber(e.target.value);
                    setCardData(prev => ({ ...prev, number: maskedValue }));
                  }}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  pattern="\d{4} \d{4} \d{4} \d{4}"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  required
                />
              </div>
              <div>
                <label htmlFor="card_holder_name" className="block text-sm text-white/80 mb-1">Nome no Cartão</label>
                <input
                  type="text"
                  id="card_holder_name"
                  value={cardData.holder_name}
                  onChange={(e) => setCardData(prev => ({ ...prev, holder_name: e.target.value }))}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                  autoComplete="cc-name"
                  spellCheck="false"
                  required
                />
              </div>
              <div>
                <label htmlFor="card_expiration" className="block text-sm text-white/80 mb-1">Validade</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="card_exp_month"
                    value={cardData.exp_month}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 2) {
                        setCardData(prev => ({ ...prev, exp_month: value }));
                      }
                    }}
                    className="w-1/2 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                    placeholder="MM"
                    maxLength={2}
                    pattern="\d{2}"
                    inputMode="numeric"
                    autoComplete="cc-exp-month"
                    required
                  />
                  <input
                    type="text"
                    id="card_exp_year"
                    value={cardData.exp_year}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) {
                        setCardData(prev => ({ ...prev, exp_year: value }));
                      }
                    }}
                    className="w-1/2 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                    placeholder="AAAA"
                    maxLength={4}
                    pattern="\d{4}"
                    inputMode="numeric"
                    autoComplete="cc-exp-year"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="card_cvv" className="block text-sm text-white/80 mb-1">CVV</label>
                <input
                  type="text"
                  id="card_cvv"
                  value={cardData.cvv}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const maskedValue = maskCardCVV(e.target.value);
                    setCardData(prev => ({ ...prev, cvv: maskedValue }));
                  }}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                  placeholder="123"
                  maxLength={3}
                  pattern="\d{3}"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Security Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SECURITY_FEATURES.map((feature, index) => (
            <div key={index} className="bg-gradient-card backdrop-blur-xl border border-white/10 p-3 rounded-xl text-center">
              <div className="text-xl mb-1">{feature.icon}</div>
              <h4 className="text-white font-medium text-sm mb-0.5">{feature.title}</h4>
              <p className="text-white/60 text-xs">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            type="button"
            onClick={onPrevStep}
            className="w-full sm:w-auto px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <span>←</span>
            Voltar
          </button>
          <div className="flex items-center gap-3">
            <div className="text-white/60 text-xs text-right">
              Pagamento processado por <br/>
              <span className="text-white">Pagar.me</span>
            </div>
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className={`
                px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${loading || !isFormValid()
                  ? 'bg-white/10 text-white/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-400 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/20 hover:scale-105'}
              `}
              aria-busy={loading}
            >
              {loading ? "Processando..." : "Pagar agora"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
