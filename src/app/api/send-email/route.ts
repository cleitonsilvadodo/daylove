import { NextRequest, NextResponse } from "next/server";
import { sendPaymentConfirmationEmail, sendPageCreatedEmail } from "@/services/email";
import { FormData } from "@/types/form";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body as { type: "payment" | "page", data: FormData };

    if (!data.user_email) {
      return NextResponse.json(
        { error: "Email do usuário é obrigatório" },
        { status: 400 }
      );
    }

    let success = false;

    switch (type) {
      case "payment":
        const paymentResult = await sendPaymentConfirmationEmail(data);
        success = paymentResult === true;
        break;
      case "page":
        const pageResult = await sendPageCreatedEmail(data);
        success = pageResult === true;
        break;
      default:
        return NextResponse.json(
          { error: "Tipo de email inválido" },
          { status: 400 }
        );
    }

    if (!success) {
      return NextResponse.json(
        { error: "Erro ao enviar email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao processar requisição de email:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
