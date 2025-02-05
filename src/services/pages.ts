import { supabase } from "@/lib/supabase";
import { FormData } from "@/types/form";
import { sendPageCreatedEmail } from "./email";

export async function handleSuccessfulPayment(
  payment_id: string,
  user_email: string,
  formData: FormData,
  planType: string
): Promise<boolean> {
  try {
    console.log("\n=== Processando pagamento bem-sucedido ===");
    console.log("Dados recebidos:", {
      payment_id,
      user_email,
      formData,
      planType,
      timestamp: new Date().toISOString()
    });

    // Formatar dados para inserção
    const pageData = {
      title: formData.title,
      message: formData.message,
      start_date: formData.startDate,
      date_display_mode: formData.dateDisplayMode,
      animation: formData.animation,
      photos: formData.photos || [],
      music: formData.music || { type: "", url: "", title: "" },
      status: "published", // Publicar imediatamente após pagamento
      payment_id, // Usar transaction_id como payment_id
      user_email,
      plan_type: planType,
    };

    console.log("Dados formatados para inserção:", pageData);

    // Inserir página no Supabase
    const { data: page, error } = await supabase
      .from("pages")
      .insert(pageData)
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar página:", error);
      return false;
    }

    console.log("Página criada com sucesso:", page);

    // Enviar email de página criada
    console.log("Tentando enviar email de página criada para:", user_email);
    const emailSent = await sendPageCreatedEmail({
      ...formData,
      payment_id: page.id,
    });

    if (!emailSent) {
      console.error("Falha ao enviar email de página criada");
    }

    return true;
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return false;
  }
}
