import { NextResponse } from "next/server";
import { createPayment } from "@/services/payment";
import { CreatePaymentRequest } from "@/types/payment";

export async function POST(request: Request) {
  try {
    const body = await request.json() as CreatePaymentRequest;
    const { formData, planType, planPrice } = body;

    const result = await createPayment({
      formData,
      planType,
      planPrice
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Erro ao criar pagamento" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
