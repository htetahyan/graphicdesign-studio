import "server-only";

import { supabase, supabaseAdmin } from "@/lib/supabase";
import { generateStoragePath } from "@/lib/file-utils";

export async function uploadBrandLogo(userId: string, logo: File): Promise<string | null> {
  if (!logo || logo.size === 0) return null;
  
  const logoName = generateStoragePath(userId, "logo", logo.name);
  const { error: logoUploadError } = await supabaseAdmin.storage
    .from("brand-assets")
    .upload(logoName, logo, { upsert: false });

  if (!logoUploadError) {
    const { data } = supabase.storage
      .from("brand-assets")
      .getPublicUrl(logoName);
    return data.publicUrl;
  }
  
  return null;
}
