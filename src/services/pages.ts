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

    // 3. Criar página
    const pageData = await createSupabasePage({
      ...formData,
      photos: photoUrls,
      music: musicData,
    });

    return pageData;
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

    const updatedData: Partial<PageRecord> = { ...updates };

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
    // 1. Criar a página
    const pageData = await createPage(formData);
    if (!pageData) throw new Error("Falha ao criar página");

    // 2. Atualizar com informações do pagamento
    const updatedPage = await updateSupabasePage(pageData.id, {
      payment_id: paymentId,
      user_email: userEmail,
      plan_type: planType,
      status: "draft"
    });
    if (!updatedPage) throw new Error("Falha ao atualizar página");

    // 3. Publicar a página
    const published = await publishPage(pageData.id);
    if (!published) throw new Error("Falha ao publicar página");

    return true;
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return false;
  }
}
