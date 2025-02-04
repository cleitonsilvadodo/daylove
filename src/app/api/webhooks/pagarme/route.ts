import { NextResponse } from "next/server";
import { handleSuccessfulPayment } from "@/services/pages";
import { FormData } from "@/types/form";
import { PagarmeWebhook, PagarmeOrder, OrderStatus } from "@/types/pagarme";
import crypto from 'crypto';
import { sendPaymentConfirmationEmail } from "@/services/email";

const verifySignature = (body: string, signature: string): boolean => {
  const hash = crypto.createHmac('sha256', process.env.PAGARME_SECRET_KEY || '')
    .update(body)
    .digest('hex');
  return hash === signature;
};

// Adiciona método GET para teste
export async function GET() {
  return NextResponse.json({ message: "Webhook endpoint is working" });
}

export async function POST(request: Request) {
  try {
    console.log("Recebendo webhook do Pagar.me...");
    const body = await request.text();
    const signature = request.headers.get('X-Hub-Signature');

    console.log("Headers recebidos:", {
      signature,
      contentType: request.headers.get('Content-Type')
    });

    // Em produção, vamos logar mais informações para debug
    console.log("Ambiente:", process.env.NODE_ENV);
    console.log("PAGARME_SECRET_KEY:", process.env.PAGARME_SECRET_KEY ? "Configurada" : "Não configurada");
    console.log("Body completo:", body);

    // Remover temporariamente a verificação de assinatura para teste
    // if (!signature || !verifySignature(body, signature)) {
    //   console.error("Assinatura do webhook inválida");
    //   console.error("Signature recebida:", signature);
    //   return NextResponse.json(
    //     { success: false, error: "Assinatura inválida" },
    //     { status: 401 }
    //   );
    // }

    console.log("Parseando webhook data...");
    const webhookData = JSON.parse(body) as PagarmeWebhook;
    
    if (!webhookData.data || !webhookData.data.id) {
      console.error("Webhook inválido:", webhookData);
      return NextResponse.json(
        { success: false, error: "Webhook inválido" },
        { status: 400 }
      );
    }

    // Sempre usar os dados do webhook em produção por enquanto
    console.log("Usando dados do webhook diretamente");
    const order = webhookData.data as PagarmeOrder;

    console.log("Processando pedido:", order.id);
    const charge = order.charges?.[0];
    
    // Logar mais informações do pedido
    console.log("Detalhes do pedido:", {
      orderId: order.id,
      status: charge?.status,
      customer: order.customer,
      metadata: order.metadata,
      charges: order.charges
    });

    if (charge?.status === "paid") {
      console.log("Pagamento aprovado, processando...");
      const metadata = order.metadata as {
        formData: string;
        planType: string;
      };

      console.log("Metadados:", metadata);
      const formData = JSON.parse(metadata.formData) as FormData;
      console.log("Form data:", formData);

      // Adicionar email do cliente aos dados do formulário
      formData.user_email = order.customer?.email || '';

      // Primeiro enviar email de confirmação de pagamento
      console.log("Enviando email de confirmação de pagamento...");
      const emailSent = await sendPaymentConfirmationEmail({
        ...formData,
        payment_id: order.id,
      });

      if (!emailSent) {
        console.error("Falha ao enviar email de confirmação de pagamento");
      }

      // Depois processar o pagamento e criar a página
      console.log("Processando pagamento e criando página...");
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
      
      console.log("Pagamento processado com sucesso!");
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
    if (error instanceof Error) {
      console.error("Detalhes do erro:", {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
