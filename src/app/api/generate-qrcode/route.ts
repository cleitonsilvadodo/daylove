import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Texto do QR code é obrigatório" },
        { status: 400 }
      );
    }

    // Gerar QR code como data URL
    const qrCodeDataUrl = await QRCode.toDataURL(text, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return NextResponse.json({
      success: true,
      qrCodeDataUrl,
    });
  } catch (error) {
    console.error("Erro ao gerar QR code:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao gerar QR code" },
      { status: 500 }
    );
  }
}
