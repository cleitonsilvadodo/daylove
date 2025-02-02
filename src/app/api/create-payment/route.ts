import { NextResponse } from "next/server";
import pagarme from "pagarme";
import { CreatePaymentRequest } from "@/types/payment";

export async function POST(request: Request) {
  try {
    const body: CreatePaymentRequest = await request.json();

    // Verificar se a chave está presente
    const apiKey = process.env.PAGARME_SECRET_KEY;
    if (!apiKey) {
      console.error("Chave da API do Pagar.me não encontrada");
      return NextResponse.json(
        { success: false, error: "Configuração inválida" },
        { status: 500 }
      );
    }

    console.log("Conectando ao Pagar.me...");
    const client = await pagarme.client.connect({
      api_key: apiKey,
      encryption_key: process.env.PAGARME_PUBLIC_KEY,
    });

    console.log("Criando transação...");
    const transaction = await client.transactions.create({
      amount: Math.round(body.planPrice * 100), // Converte para centavos
      payment_method: "credit_card",
      postback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/pagarme`,
      async: false,
      capture: true,
      soft_descriptor: "DAYLOVE",
      metadata: {
        formData: JSON.stringify(body.formData),
        planType: body.planType,
      },
      customer: {
        external_id: "1",
        name: "Cliente Teste",
        email: "cliente@teste.com",
        country: "br",
        type: "individual",
        document_number: "00000000000",
        phone_numbers: ["+5500000000000"],
      },
    });

    return NextResponse.json({
      success: true,
      preferenceId: transaction.id,
      init_point: transaction.card.payment_url || "",
    });
  } catch (error: any) {
    console.error("Erro ao criar pagamento:", error);
    console.error("Detalhes do erro:", error.response?.errors || error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: "Erro ao criar pagamento",
        details: error.response?.errors || error.message
      },
      { status: 500 }
    );
  }
}
