import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { handleSuccessfulPayment } from "@/services/pages";
import { FormData } from "@/types/form";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
});

const paymentClient = new Payment(client);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Verificar se é uma notificação de pagamento
    if (body.type === "payment") {
      const paymentId = body.data.id;
      
      // Buscar informações detalhadas do pagamento
      const payment = await paymentClient.get({ id: paymentId });
      const status = payment.status;
      const metadata = payment.metadata as {
        formData: FormData;
        planType: string;
      };
      const payer = payment.payer;

      // Processar o pagamento com base no status
      if (status === "approved" && payer?.email && metadata?.formData && metadata?.planType) {
        const success = await handleSuccessfulPayment(
          paymentId,
          payer.email,
          metadata.formData,
          metadata.planType
        );

        if (!success) {
          console.error("Falha ao processar pagamento aprovado:", {
            paymentId,
            email: payer.email,
          });
          
          // Retorna 200 mesmo em caso de erro para evitar reprocessamento
          return NextResponse.json({
            success: false,
            error: "Falha ao processar pagamento"
          });
        }
        
        return NextResponse.json({ success: true });
      }

      // Log para outros status
      console.log(`Payment ${paymentId} status: ${status}`, {
        metadata,
        payer: {
          email: payer?.email,
          name: payer?.first_name,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
