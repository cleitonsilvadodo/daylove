import { NextResponse } from "next/server";
import { handleSuccessfulPayment } from "@/services/pages";
import { FormData } from "@/types/form";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Verificar se é uma notificação válida
    if (!body.data || !body.data.id) {
      console.error("Webhook inválido:", body);
      return NextResponse.json(
        { success: false, error: "Webhook inválido" },
        { status: 400 }
      );
    }

    // Buscar informações detalhadas do pedido
    const apiKey = process.env.PAGARME_SECRET_KEY;
    if (!apiKey) {
      console.error("Chave da API do Pagar.me não encontrada");
      return NextResponse.json(
        { success: false, error: "Configuração inválida" },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.pagar.me/core/v5/orders/${body.data.id}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      console.error("Erro ao buscar pedido:", await response.text());
      return NextResponse.json(
        { success: false, error: "Erro ao buscar pedido" },
        { status: response.status }
      );
    }

    const order = await response.json();

    // Verificar se o pedido foi pago
    const charge = order.charges?.[0];
    if (charge?.status === "paid") {
      const metadata = order.metadata as {
        formData: string;
        planType: string;
      };

      const formData = JSON.parse(metadata.formData) as FormData;
      const success = await handleSuccessfulPayment(
        order.id,
        order.customer.email,
        formData,
        metadata.planType
      );

      if (!success) {
        console.error("Falha ao processar pagamento aprovado:", {
          orderId: order.id,
          email: order.customer.email,
        });
        
        return NextResponse.json({
          success: false,
          error: "Falha ao processar pagamento"
        });
      }
      
      return NextResponse.json({ success: true });
    }

    // Log para outros status
    console.log(`Order ${order.id} status: ${charge?.status}`, {
      metadata: order.metadata,
      customer: {
        email: order.customer?.email,
        name: order.customer?.name,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
