import { NextResponse } from "next/server";
import pagarme from "pagarme";
import { handleSuccessfulPayment } from "@/services/pages";
import { FormData } from "@/types/form";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Verificar se é uma notificação válida
    const client = await pagarme.client.connect({
      api_key: process.env.PAGARME_SECRET_KEY || "",
    });

    // Buscar informações detalhadas da transação
    const transaction = await client.transactions.find({ id: body.id });
    const status = transaction.status;
    const metadata = transaction.metadata as {
      formData: string;
      planType: string;
    };

    // Processar o pagamento com base no status
    if (status === "paid" && metadata?.formData && metadata?.planType) {
      const formData = JSON.parse(metadata.formData) as FormData;
      const success = await handleSuccessfulPayment(
        transaction.id,
        transaction.customer?.email || "",
        formData,
        metadata.planType
      );

      if (!success) {
        console.error("Falha ao processar pagamento aprovado:", {
          transactionId: transaction.id,
          email: transaction.customer?.email,
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
    console.log(`Transaction ${transaction.id} status: ${status}`, {
      metadata,
      customer: {
        email: transaction.customer?.email,
        name: transaction.customer?.name,
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
