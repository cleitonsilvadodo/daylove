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

    // Criar checkout transparente
    const checkoutData = {
      amount: Math.round(body.planPrice * 100),
      title: `Plano ${body.planType === "forever" ? "Para Sempre" : "Anual"} - DayLove`,
      description: "Página dedicatória personalizada",
      customerData: "true",
      paymentMethods: "credit_card",
      maxInstallments: 1,
      defaultInstallment: 1,
      customerName: body.customer.name,
      customerEmail: body.customer.email,
      customerDocumentNumber: body.customer.document_number,
      customerPhoneNumber: body.customer.phone_numbers[0],
      billingName: body.customer.name,
      billingEmail: body.customer.email,
      billingDocumentNumber: body.customer.document_number,
      billingPhoneNumber: body.customer.phone_numbers[0],
      metadata: {
        formData: JSON.stringify(body.formData),
        planType: body.planType,
      },
      postbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/pagarme`,
    };

    // Gerar URL do checkout
    const checkoutUrl = `https://checkout.pagar.me/#/identifier/${Buffer.from(JSON.stringify(checkoutData)).toString('base64')}`;

    return NextResponse.json({
      success: true,
      preferenceId: "checkout",
      init_point: checkoutUrl,
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
