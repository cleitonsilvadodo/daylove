import { NextResponse } from "next/server";
import { CreatePaymentRequest } from "@/types/payment";

export async function POST(request: Request) {
  try {
    const body: CreatePaymentRequest = await request.json();

    // Verificar se a chave está presente
    const accountId = process.env.PAGARME_ACCOUNT_ID;
    if (!accountId) {
      console.error("ID da conta do Pagar.me não encontrado");
      return NextResponse.json(
        { success: false, error: "Configuração inválida" },
        { status: 500 }
      );
    }

    // Criar checkout
    const checkoutData = {
      amount: Math.round(body.planPrice * 100),
      paymentMethods: "credit_card",
      maxInstallments: 1,
      defaultInstallment: 1,
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        document_number: body.customer.document_number,
        phone_numbers: body.customer.phone_numbers,
      },
      items: [{
        id: body.planType,
        title: `Plano ${body.planType === "forever" ? "Para Sempre" : "Anual"} - DayLove`,
        unit_price: Math.round(body.planPrice * 100),
        quantity: 1,
        tangible: false
      }],
      metadata: {
        formData: JSON.stringify(body.formData),
        planType: body.planType,
      },
      postbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/pagarme`,
      successfulPaymentUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      failedPaymentUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure`,
      pendingPaymentUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/pending`,
    };

    // Gerar URL do checkout
    const checkoutUrl = `https://pay.pagar.me/${accountId}/${Buffer.from(JSON.stringify(checkoutData)).toString('base64')}`;

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
