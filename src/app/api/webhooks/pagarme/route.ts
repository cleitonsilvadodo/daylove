import { NextResponse } from "next/server";
import { handleSuccessfulPayment } from "@/services/pages";
import { FormData } from "@/types/form";
import { PagarmeWebhook, PagarmeOrder } from "@/types/pagarme";
import crypto from 'crypto';

const verifySignature = (body: string, signature: string): boolean => {
  const hash = crypto.createHmac('sha256', process.env.PAGARME_SECRET_KEY || '')
    .update(body)
    .digest('hex');
  return hash === signature;
};

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('X-Hub-Signature');

    if (!signature || !verifySignature(body, signature)) {
      console.error("Assinatura do webhook inválida");
      return NextResponse.json(
        { success: false, error: "Assinatura inválida" },
        { status: 401 }
      );
    }

    const webhookData = JSON.parse(body) as PagarmeWebhook;
    
    if (!webhookData.data || !webhookData.data.id) {
      console.error("Webhook inválido:", webhookData);
      return NextResponse.json(
        { success: false, error: "Webhook inválido" },
        { status: 400 }
      );
    }

    const apiKey = process.env.PAGARME_SECRET_KEY;
    if (!apiKey) {
      console.error("Chave da API do Pagar.me não encontrada");
      return NextResponse.json(
        { success: false, error: "Configuração inválida" },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.pagar.me/core/v5/orders/${webhookData.data.id}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro ao buscar pedido:", errorText);
      return NextResponse.json(
        { success: false, error: "Erro ao buscar pedido" },
        { status: response.status }
      );
    }

    const order = await response.json() as PagarmeOrder;

    const charge = order.charges?.[0];
    if (charge?.status === "paid") {
      const metadata = order.metadata as {
        formData: string;
        planType: string;
      };

      const formData = JSON.parse(metadata.formData) as FormData;
      const success = await handleSuccessfulPayment(
        order.id,
        order.customer?.email || '',
        formData,
        metadata.planType
      );

      if (!success) {
        console.error("Falha ao processar pagamento aprovado:", {
          orderId: order.id,
          email: order.customer?.email,
        });
        
        return NextResponse.json({
          success: false,
          error: "Falha ao processar pagamento"
        });
      }
      
      return NextResponse.json({ success: true });
    }

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
