import { FormData } from "@/types/form";
import {
  supabase,
  uploadFile,
  createPage as createSupabasePage,
  updatePage as updateSupabasePage,
  publishPage as publishSupabasePage,
  getPageById,
  deleteFile,
  PageRecord,
} from "@/lib/supabase";
import { sendPageCreatedEmail } from "./email";

export async function createPage(formData: FormData): Promise<PageRecord | null> {
  try {
    // 1. Upload de fotos
    const photoUrls: string[] = [];
    if (formData.photos?.length) {
      for (const photoUrl of formData.photos) {
        if (photoUrl.startsWith("data:")) {
          // É um arquivo novo (base64)
          const response = await fetch(photoUrl);
          const blob = await response.blob();
          const file = new File([blob], `photo-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          const path = `${Date.now()}-${file.name}`;
          const uploadedUrl = await uploadFile("photos", file, path);
          if (uploadedUrl) {
            photoUrls.push(uploadedUrl);
          }
        } else {
          // É uma URL existente
          photoUrls.push(photoUrl);
        }
      }
    }

    // 2. Upload de música
    let musicData = formData.music;
    if (formData.music.url?.startsWith("data:")) {
      const response = await fetch(formData.music.url);
      const blob = await response.blob();
      const file = new File([blob], `music-${Date.now()}.mp3`, {
        type: "audio/mpeg",
      });
      const path = `${Date.now()}-${file.name}`;
      const uploadedUrl = await uploadFile("music", file, path);
      if (uploadedUrl) {
        musicData = {
          ...musicData,
          url: uploadedUrl,
        };
      }
    }

    // 3. Validar dados obrigatórios
    if (!formData.startDate) {
      throw new Error("Data de início é obrigatória");
    }
    if (!formData.dateDisplayMode) {
      throw new Error("Modo de exibição da data é obrigatório");
    }

    // 4. Criar página
    const pageData = {
      title: formData.title,
      message: formData.message,
      start_date: formData.startDate,
      date_display_mode: formData.dateDisplayMode,
      animation: formData.animation,
      photos: photoUrls,
      music: musicData,
      status: "draft",
    };

    console.log("Dados formatados para inserção:", pageData);

    const { data, error } = await supabase
      .from("pages")
      .insert([pageData])
      .select()
      .single();

    if (error) {
      console.error("Erro do Supabase ao criar página:", error);
      throw error;
    }

    if (!data) {
      throw new Error("Nenhum dado retornado ao criar página");
    }

    console.log("Página criada com sucesso:", data);
    return data;
  } catch (error) {
    console.error("Erro ao criar página:", error);
    return null;
  }
}

export async function updatePage(
  id: string,
  updates: Partial<FormData>
): Promise<PageRecord | null> {
  try {
    const currentPage = await getPageById(id);
    if (!currentPage) throw new Error("Página não encontrada");

    const updatedData: Partial<PageRecord> = {
      title: updates.title,
      message: updates.message,
      start_date: updates.startDate,
      date_display_mode: updates.dateDisplayMode,
      animation: updates.animation,
    };

    // 1. Atualizar fotos
    if (updates.photos) {
      const photoUrls: string[] = [];
      for (const photoUrl of updates.photos) {
        if (photoUrl.startsWith("data:")) {
          // É um arquivo novo
          const response = await fetch(photoUrl);
          const blob = await response.blob();
          const file = new File([blob], `photo-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          const path = `${Date.now()}-${file.name}`;
          const uploadedUrl = await uploadFile("photos", file, path);
          if (uploadedUrl) {
            photoUrls.push(uploadedUrl);
          }
        } else {
          // É uma URL existente
          photoUrls.push(photoUrl);
        }
      }
      updatedData.photos = photoUrls;

      // Deletar fotos antigas que não estão mais sendo usadas
      const oldPhotos = currentPage.photos || [];
      for (const oldPhoto of oldPhotos) {
        if (!photoUrls.includes(oldPhoto)) {
          const path = oldPhoto.split("/").pop();
          if (path) {
            await deleteFile("photos", path);
          }
        }
      }
    }

    // 2. Atualizar música
    if (updates.music?.url?.startsWith("data:")) {
      const response = await fetch(updates.music.url);
      const blob = await response.blob();
      const file = new File([blob], `music-${Date.now()}.mp3`, {
        type: "audio/mpeg",
      });
      const path = `${Date.now()}-${file.name}`;
      const uploadedUrl = await uploadFile("music", file, path);
      if (uploadedUrl) {
        updatedData.music = {
          ...updates.music,
          url: uploadedUrl,
        };

        // Deletar música antiga
        if (currentPage.music?.url) {
          const oldPath = currentPage.music.url.split("/").pop();
          if (oldPath) {
            await deleteFile("music", oldPath);
          }
        }
      }
    }

    // 3. Atualizar página
    return await updateSupabasePage(id, updatedData);
  } catch (error) {
    console.error("Erro ao atualizar página:", error);
    return null;
  }
}

export async function publishPage(id: string): Promise<boolean> {
  return await publishSupabasePage(id);
}

export async function getPage(id: string): Promise<PageRecord | null> {
  return await getPageById(id);
}

export async function handleSuccessfulPayment(
  paymentId: string,
  userEmail: string,
  formData: FormData,
  planType: string
): Promise<boolean> {
  try {
    // 1. Limpar funcionalidades baseadas no plano
    const cleanedFormData = { ...formData };
    if (planType === "annual") {
      // Plano anual não tem música nem animação
      cleanedFormData.music = { type: "", url: "", title: "" };
      cleanedFormData.animation = "none";
      console.log("Plano anual: removendo música e animação");
    }

    // 2. Criar a página
    const pageData = await createPage(cleanedFormData);
    if (!pageData) throw new Error("Falha ao criar página");

    // 3. Atualizar com informações do pagamento
    const updatedPage = await updateSupabasePage(pageData.id, {
      payment_id: pageData.id, // Usar o ID da página como payment_id
      user_email: userEmail,
      plan_type: planType,
      status: "draft"
    } as Partial<PageRecord>);
    if (!updatedPage) throw new Error("Falha ao atualizar página");

    // 4. Publicar a página
    const published = await publishPage(pageData.id);
    if (!published) throw new Error("Falha ao publicar página");

    // 5. Enviar email com o ID correto da página
    await sendPageCreatedEmail({
      ...cleanedFormData,
      payment_id: pageData.id, // Usar o ID da página
      user_email: userEmail
    });

    return true;
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return false;
  }
}
