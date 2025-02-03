import { createClient } from "@supabase/supabase-js";
import { FormData, MusicType } from "@/types/form";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log("Inicializando Supabase com URL:", supabaseUrl);
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

export interface PageRecord {
  id: string;
  title: string;
  start_date: string;
  date_display_mode: string;
  message: string;
  photos: string[];
  music: {
    type: MusicType;
    url: string;
    title: string;
  };
  animation: FormData["animation"];
  created_at: string;
  updated_at: string;
  status: "draft" | "published" | "expired";
  payment_id: string | null;
  user_email: string | null;
  plan_type: string | null;
}

export async function uploadFile(
  bucket: "photos" | "music",
  file: File,
  path: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error(`Erro ao fazer upload para ${bucket}:`, error);
    return null;
  }
}

export async function deleteFile(
  bucket: "photos" | "music",
  path: string
): Promise<boolean> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Erro ao deletar arquivo de ${bucket}:`, error);
    return false;
  }
}

export async function getPageById(id: string): Promise<PageRecord | null> {
  try {
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao buscar página:", error);
    return null;
  }
}

export async function createPage(formData: FormData): Promise<PageRecord | null> {
  try {
    console.log("Criando página com dados:", formData);
    
    // Mapeia os campos para corresponder ao schema do banco
    const pageData = {
      title: formData.title,
      message: formData.message,
      start_date: formData.startDate,
      date_display_mode: formData.dateDisplayMode,
      animation: formData.animation,
      photos: formData.photos || [],
      music: formData.music || { url: "", title: "" },
      status: "draft",
    };

    console.log("Dados formatados para inserção:", pageData);

    // Primeiro, verifica se a conexão está funcionando
    const { data: testData, error: testError } = await supabase
      .from("pages")
      .select("count")
      .limit(1);

    if (testError) {
      console.error("Erro ao testar conexão com Supabase:", testError);
      throw new Error("Falha na conexão com Supabase");
    }

    console.log("Conexão com Supabase OK, prosseguindo com inserção");

    const { data, error } = await supabase
      .from("pages")
      .insert([pageData])
      .select()
      .single();

    if (error) {
      console.error("Erro do Supabase ao criar página:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    console.log("Página criada com sucesso:", data);
    return data;
  } catch (error: any) {
    console.error("Erro ao criar página:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      stack: error.stack
    });
    return null;
  }
}

export async function updatePage(
  id: string,
  updates: Partial<PageRecord>
): Promise<PageRecord | null> {
  try {
    const { data, error } = await supabase
      .from("pages")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao atualizar página:", error);
    return null;
  }
}

export async function publishPage(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("pages")
      .update({ status: "published" })
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erro ao publicar página:", error);
    return false;
  }
}
