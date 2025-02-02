"use client";

import React, { useState } from "react";
import { FormData } from "@/types/form";
import { PaymentResponse, PlanType } from "@/types/payment";
import Image from "next/image";

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

export default function PaymentForm({
  formData,
  onPrevStep,
}: PaymentFormProps) {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0]);
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    email: "",
    document: "",
    phone: "",
  });

  const handlePayment = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          planType: selectedPlan.type,
          planPrice: selectedPlan.price,
          customer: {
            name: customerData.name,
            email: customerData.email,
            document_number: customerData.document.replace(/\D/g, ""),
            phone_numbers: [customerData.phone.replace(/\D/g, "")],
          },
        }),
      });

      const data: PaymentResponse = await response.json();

      if (data.success && data.init_point) {
        // Abrir o checkout em uma nova aba
        window.open(data.init_point, '_blank');
      } else {
        alert("Erro ao criar pagamento. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      alert("Erro ao processar pagamento. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
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
            disabled={loading || !customerData.name || !customerData.email || !customerData.document || !customerData.phone}
            className="btn btn-primary disabled:opacity-50"
          >
            {loading ? "Processando..." : "Pagar agora"}
          </button>
        </div>
      </div>
    </div>
  );
}
