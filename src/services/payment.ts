import { MercadoPagoConfig, Preference } from "mercadopago";
import { FormData } from "@/types/form";
import { PaymentResponse, PlanType } from "@/types/payment";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
});

const preferenceClient = new Preference(client);

interface CreatePaymentProps {
  formData: FormData;
  planType: PlanType;
  planPrice: number;
}

export async function createPayment({ formData, planType, planPrice }: CreatePaymentProps): Promise<PaymentResponse> {
  try {
    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: planType,
            title: `Plano ${planType === "forever" ? "Para Sempre" : "Anual"} - DayLove`,
            quantity: 1,
            unit_price: planPrice,
            currency_id: "BRL",
          },
        ],
        metadata: {
          formData,
          planType,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/pending`,
        },
        auto_return: "approved",
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/mercadopago`,
        statement_descriptor: "DAYLOVE",
      }
    });

    return {
      success: true,
      preferenceId: preference.id,
      init_point: preference.init_point || "",
    };
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    return {
      success: false,
      error: "Erro ao criar pagamento",
    };
  }
}
