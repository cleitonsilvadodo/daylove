import { NextResponse } from "next/server";
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

    // Criar checkout
    const response = await fetch('https://api.pagar.me/core/v5/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(apiKey).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{
          amount: Math.round(body.planPrice * 100),
          description: `Plano ${body.planType === "forever" ? "Para Sempre" : "Anual"} - DayLove`,
          quantity: 1,
          code: body.planType,
        }],
        customer: {
          name: body.customer.name,
          email: body.customer.email,
          document: body.customer.document_number,
          type: 'individual',
          phones: {
            mobile_phone: {
              country_code: '55',
              number: body.customer.phone_numbers[0].replace(/\D/g, ''),
              area_code: body.customer.phone_numbers[0].replace(/\D/g, '').substring(0, 2),
            }
          }
        },
        payments: [{
          payment_method: 'credit_card',
          credit_card: {
            installments: 1,
            statement_descriptor: 'DAYLOVE',
          }
        }],
        metadata: {
          formData: JSON.stringify(body.formData),
          planType: body.planType,
        },
        antifraud_enabled: false,
        closed: false,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro na API do Pagar.me:", data);
      return NextResponse.json(
        { success: false, error: data.message || "Erro ao criar pagamento" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      preferenceId: data.id,
      init_point: data.checkouts[0].payment_url,
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
