"use server";

import { checkAdminSession } from "@/lib/auth";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function uploadFromUrl(url: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized");

  try {
    // 1. Fetch the image from the URL
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    
    const contentType = response.headers.get("content-type");
    if (!contentType?.startsWith("image/")) {
      throw new Error("URL does not point to a valid image");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Create a File-like object for UploadThing
    const extension = contentType.split("/")[1] || "jpg";
    const fileName = `pinterest-${Date.now()}.${extension}`;
    
    const file = new File([buffer], fileName, { type: contentType });

    // 2. Upload to UploadThing using UTApi
    const res = await utapi.uploadFiles(file);

    if (res.error) {
      throw new Error(res.error.message);
    }

    return {
      url: res.data.ufsUrl,
      key: res.data.key,
    };
  } catch (error: any) {
    console.error("URL Upload failed:", error);
    throw new Error(error.message || "Failed to upload image from URL");
  }
}
