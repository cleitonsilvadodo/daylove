import pagarme from 'pagarme';
import { FormData } from "@/types/form";
import { PaymentResponse, PlanType } from "@/types/payment";

interface CreatePaymentProps {
  formData: FormData;
  planType: PlanType;
  planPrice: number;
}

export async function createPayment({ formData, planType, planPrice }: CreatePaymentProps): Promise<PaymentResponse> {
  try {
    const client = await pagarme.client.connect({
      api_key: process.env.PAGARME_SECRET_KEY || '',
    });

    const transaction = await client.transactions.create({
      amount: planPrice * 100, // Pagar.me trabalha com centavos
      payment_method: 'credit_card',
      postback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/pagarme`,
      async: false,
      capture: true,
      soft_descriptor: 'DAYLOVE',
      metadata: {
        formData: JSON.stringify(formData),
        planType,
      },
    });

    return {
      success: true,
      preferenceId: transaction.id,
      init_point: transaction.card.payment_url || '',
    };
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    return {
      success: false,
      error: "Erro ao criar pagamento",
    };
  }
}
