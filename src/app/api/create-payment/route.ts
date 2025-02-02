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
    const response = await fetch('https://api.pagar.me/core/v5/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        accepted_payment_methods: ['credit_card'],
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure`,
        expires_in: 30, // minutos
        billing_address_editable: false,
        customer_editable: false,
        skip_checkout_success_page: true,
        payment_config: {
          credit_card: {
            capture: true,
            statement_descriptor: 'DAYLOVE',
          }
        },
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
        items: [{
          amount: Math.round(body.planPrice * 100),
          description: `Plano ${body.planType === "forever" ? "Para Sempre" : "Anual"} - DayLove`,
          quantity: 1,
          code: body.planType,
        }],
        metadata: {
          formData: JSON.stringify(body.formData),
          planType: body.planType,
        },
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
      init_point: data.url,
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
