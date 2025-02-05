import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("\n=== Verificando status do pagamento ===");
    console.log("Transaction/Payment ID:", params.id);

    // Buscar página pelo payment_id
    const { data: pages, error } = await supabase
      .from("pages")
      .select("status, payment_id, created_at, updated_at")
      .eq('payment_id', params.id)
      .order('created_at', { ascending: false });

    console.log("Resultado da busca:", {
      found: pages?.length || 0,
      pages,
      error: error?.message,
      timestamp: new Date().toISOString()
    });

    if (error) {
      console.error("Erro ao buscar status do pagamento:", {
        error,
        transactionId: params.id
      });
      return NextResponse.json(
        { success: false, error: "Erro ao buscar status" },
        { status: 500 }
      );
    }

    if (!pages || pages.length === 0) {
      console.log("Página não encontrada para ID:", params.id);
      return NextResponse.json(
        { success: false, error: "Página não encontrada" },
        { status: 404 }
      );
    }

    // Pegar a página mais recente
    const page = pages[0];
    const status = page.status === "published" ? "paid" : "pending";
    
    console.log("Status atual:", {
      pageStatus: page.status,
      returnStatus: status,
      paymentId: page.payment_id,
      createdAt: page.created_at,
      updatedAt: page.updated_at
    });

    return NextResponse.json({
      success: true,
      status,
      page
    });
  } catch (error) {
    console.error("Erro ao verificar status:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
