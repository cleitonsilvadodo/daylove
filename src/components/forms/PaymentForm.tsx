"use client";

import React, { useState, useEffect } from "react";
import { FormData } from "@/types/form";
import { PaymentResponse, PlanType, PaymentMethod } from "@/types/payment";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface PaymentFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onPrevStep: () => void;
}

const PLANS = [
  {
    type: "forever" as PlanType,
    title: "Para sempre",
    price: 29.90,
    oldPrice: 62.00,
    period: "/uma vez",
    features: [
      { text: "Texto dedicado", included: true },
      { text: "Data de início", included: true },
      { text: "Máximo de 8 imagens", included: true },
      { text: "Com música", included: true },
      { text: "Com animações exclusivas", included: true },
      { text: "Acesso vitalício", included: true },
    ],
    recommended: true,
  },
  {
    type: "annual" as PlanType,
    title: "Anual",
    price: 19.90,
    oldPrice: 42.00,
    period: "/por ano",
    features: [
      { text: "Texto dedicado", included: true },
      { text: "Data de início", included: true },
      { text: "Máximo de 4 imagens", included: true },
      { text: "Sem música", included: false },
      { text: "Sem animações exclusivas", included: false },
      { text: "Renovação anual", included: true },
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
    description: "Seus dados estão protegidos com criptografia de ponta a ponta"
  },
  {
    icon: "✨",
    title: "Satisfação Garantida",
    description: "7 dias de garantia incondicional"
  },
  {
    icon: "⚡",
    title: "Ativação Instantânea",
    description: "Sua página fica disponível imediatamente após o pagamento"
  }
];

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

  // Gerar QR code quando o pixData for atualizado
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

          // Construir URL com parâmetros do PIX
          const params = new URLSearchParams({
            qr_code: data.qr_code || '',
            pix_key: data.pix_key || '',
            expires_at: data.expires_at || '',
          });

          // Redirecionar para página de pendente com dados do PIX
          router.push(`/payment/pending?${params.toString()}`);
        } else if (data.init_point) {
          window.open(data.init_point, '_blank');
          // Redirecionar para página de sucesso imediatamente para cartão
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
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">Nossos Planos</h2>
        <p className="text-white/60 mb-6">
          Escolha o plano ideal para sua página personalizada. Você pode escolher entre os planos abaixo.
        </p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-white px-4 py-2 rounded-lg opacity-90 hover:opacity-100 transition-opacity">
            <span className="text-black font-bold">Pagar.me</span>
          </div>
          <Image
            src="/ssl-badge.svg"
            alt="SSL Secure"
            width={100}
            height={40}
            className="opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {PLANS.map((plan) => (
          <div
            key={plan.type}
            className={`card ${selectedPlan.type === plan.type ? 'card-selected' : 'card-default'}`}
            onClick={() => setSelectedPlan(plan)}
          >
            {plan.recommended && (
              <div className="tag-recommended">
                Recomendado
              </div>
            )}
            <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
            <div className="mb-6">
              <span className="price-old">R$ {plan.oldPrice.toFixed(2)}</span>
              <div className="flex items-baseline gap-1">
                <span className="price-current">R$ {plan.price.toFixed(2)}</span>
                <span className="price-period">{plan.period}</span>
              </div>
            </div>
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-white/80">
                  {feature.included ? (
                    <span className="feature-included mr-2">✓</span>
                  ) : (
                    <span className="feature-excluded mr-2">✕</span>
                  )}
                  <span className={feature.included ? '' : 'text-white/40'}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Métodos de Pagamento */}
      <div className="bg-[#1A1A1A] p-6 rounded-lg mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Forma de Pagamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PAYMENT_METHODS.map((method) => (
            <div
              key={method.id}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'bg-white/10 border-2 border-white'
                  : 'bg-black/20 border-2 border-transparent hover:bg-white/5'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <h4 className="font-bold text-white">{method.title}</h4>
                  <p className="text-sm text-white/60">{method.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulário de dados do cliente */}
      <div className="bg-[#1A1A1A] p-6 rounded-lg mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Dados para pagamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="label">Nome completo</label>
            <input
              type="text"
              id="name"
              value={customerData.name}
              onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="label">E-mail</label>
            <input
              type="email"
              id="email"
              value={customerData.email}
              onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="document" className="label">CPF</label>
            <input
              type="text"
              id="document"
              value={customerData.document}
              onChange={(e) => setCustomerData(prev => ({ ...prev, document: e.target.value }))}
              className="input"
              placeholder="000.000.000-00"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="label">Telefone</label>
            <input
              type="tel"
              id="phone"
              value={customerData.phone}
              onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
              className="input"
              placeholder="(00) 00000-0000"
              required
            />
          </div>
        </div>
      </div>

      {/* Formulário de dados do cartão de crédito */}
      {selectedMethod === "credit_card" && (
        <div className="bg-[#1A1A1A] p-6 rounded-lg mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Dados do Cartão de Crédito</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="card_number" className="label">Número do Cartão</label>
              <input
                type="text"
                id="card_number"
                value={cardData.number}
                onChange={(e) => setCardData(prev => ({ ...prev, number: e.target.value }))}
                className="input"
                placeholder="0000 0000 0000 0000"
                required
              />
            </div>
            <div>
              <label htmlFor="card_holder_name" className="label">Nome no Cartão</label>
              <input
                type="text"
                id="card_holder_name"
                value={cardData.holder_name}
                onChange={(e) => setCardData(prev => ({ ...prev, holder_name: e.target.value }))}
                className="input"
                required
              />
            </div>
            <div>
              <label htmlFor="card_expiration" className="label">Data de Expiração</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="card_exp_month"
                  value={cardData.exp_month}
                  onChange={(e) => setCardData(prev => ({ ...prev, exp_month: e.target.value }))}
                  className="input w-1/2"
                  placeholder="MM"
                  required
                />
                <input
                  type="text"
                  id="card_exp_year"
                  value={cardData.exp_year}
                  onChange={(e) => setCardData(prev => ({ ...prev, exp_year: e.target.value }))}
                  className="input w-1/2"
                  placeholder="AAAA"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="card_cvv" className="label">CVV</label>
              <input
                type="text"
                id="card_cvv"
                value={cardData.cvv}
                onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                className="input"
                placeholder="123"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-[#1A1A1A] p-6 rounded-lg">
        {SECURITY_FEATURES.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl mb-2">{feature.icon}</div>
            <h4 className="text-white font-bold mb-1">{feature.title}</h4>
            <p className="text-white/60 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          type="button"
          onClick={onPrevStep}
          className="btn btn-secondary flex items-center gap-2"
        >
          <span>←</span>
          Voltar
        </button>
        <div className="flex items-center gap-4">
          <div className="text-white/60 text-sm text-right">
            Pagamento processado por <br/>
            <span className="text-white">Pagar.me</span>
          </div>
          <button
            type="button"
            onClick={handlePayment}
            disabled={loading || !isFormValid()}
            className="btn btn-primary disabled:opacity-50"
          >
            {loading ? "Processando..." : "Pagar agora"}
          </button>
        </div>
      </div>
    </div>
  );
}
