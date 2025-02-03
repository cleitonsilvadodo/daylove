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

    // Validar dados do cartão para pagamento com cartão de crédito
    if (body.paymentMethod === 'credit_card' && !body.card) {
      return NextResponse.json(
        { success: false, error: "Dados do cartão de crédito são obrigatórios para pagamento com cartão" },
        { status: 400 }
      );
    }

    // Dados base do pedido
    const orderData = {
      items: [
        {
          amount: Math.round(body.planPrice * 100),
          description: `Plano ${body.planType}`,
          quantity: 1,
          code: body.planType,
        },
      ],
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        type: 'individual',
        document: body.customer.document_number.replace(/\D/g, ""),
        phones: {
          mobile_phone: {
            country_code: '55',
            area_code: body.customer.phone_numbers[0].slice(0, 2),
            number: body.customer.phone_numbers[0].slice(2).replace(/\D/g, ""),
          },
        },
        external_id: body.customer.email,
      },
      payments: [
        {
          payment_method: body.paymentMethod,
          credit_card: body.paymentMethod === 'credit_card' && body.card ? {
            installments: 1,
            statement_descriptor: 'DAYLOVE',
            card: {
              number: body.card.number,
              holder_name: body.card.holder_name,
              exp_month: body.card.exp_month,
              exp_year: body.card.exp_year,
              cvv: body.card.cvv,
            },
          } : undefined,
          pix: body.paymentMethod === 'pix' ? {
            expires_in: 3600,
          } : undefined,
        },
      ],
      metadata: {
        formData: JSON.stringify(body.formData),
        planType: body.planType,
      },
    };

    // Criar pedido
    console.log("Criando pedido:", JSON.stringify(orderData, null, 2));
    const response = await fetch("https://api.pagar.me/core/v5/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro na API do Pagar.me:", data);
      return NextResponse.json(
        { success: false, error: data.message || "Erro ao criar pagamento" },
        { status: response.status }
      );
    }

    console.log("Resposta da API do Pagar.me:", JSON.stringify(data, null, 2));

    // Retornar dados específicos dependendo do método de pagamento
    if (body.paymentMethod === "pix") {
      const pixData = data.charges[0]?.last_transaction;
      if (!pixData?.qr_code) {
        console.error("QR Code do PIX não encontrado na resposta:", pixData);
        return NextResponse.json(
          { success: false, error: "QR Code do PIX não gerado" },
          { status: 500 }
        );
      }

      // Garantir que todos os dados do PIX estão presentes
      return NextResponse.json({
        success: true,
        preferenceId: data.id,
        qr_code: pixData.qr_code,
        qr_code_url: pixData.qr_code_url,
        pix_key: pixData.pix_key || pixData.qr_code, // Fallback para o QR code se a chave não estiver presente
        expires_at: pixData.expires_at,
      });
    }

    return NextResponse.json({
      success: true,
      preferenceId: data.id,
      init_point: data.charges[0]?.last_transaction?.url,
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
