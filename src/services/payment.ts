import { FormData } from "@/types/form";
import { PaymentResponse, PlanType } from "@/types/payment";
import { CreateOrderResponse, PagarmeOrder, PagarmePayment, PagarmeCustomer } from "@/types/pagarme";

interface CreatePaymentProps {
  formData: FormData;
  planType: PlanType;
  planPrice: number;
}

const PAGARME_API_URL = 'https://api.pagar.me/core/v5';

export async function createPayment({ formData, planType, planPrice }: CreatePaymentProps): Promise<PaymentResponse> {
  try {
    const orderData: Partial<PagarmeOrder> = {
      items: [
        {
          amount: planPrice * 100, // Pagar.me trabalha com centavos
          description: `Plano ${planType}`,
          quantity: 1,
          code: planType,
        },
      ],
customer: {
  name: formData.name || 'Cliente',
  email: formData.email || 'cliente@example.com',
  type: 'individual',
  document: formData.document || '',
  external_id: formData.email || 'cliente@example.com',
} as PagarmeCustomer,
      payment: {
        payment_method: 'credit_card',
        credit_card: {
          installments: 1,
          statement_descriptor: 'DAYLOVE',
          card: {
            number: '',  // Será preenchido pelo checkout
            holder_name: '',
            exp_month: 0,
            exp_year: 0,
            cvv: '',
          },
        },
      },
      metadata: {
        formData: JSON.stringify(formData),
        planType,
      },
    };

    const response = await fetch(`${PAGARME_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.PAGARME_SECRET_KEY || '').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar pagamento');
    }

    const order: CreateOrderResponse = await response.json();

    return {
      success: true,
      preferenceId: order.id,
      init_point: order.charges[0]?.last_transaction?.gateway_response?.code || '',
    };
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    return {
      success: false,
      error: "Erro ao criar pagamento",
    };
  }
}
