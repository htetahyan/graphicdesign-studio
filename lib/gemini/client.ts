import "server-only";

import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { assertNotLiteModel } from "./models";

const isVertex = 
  process.env.GOOGLE_GENAI_USE_VERTEXAI === 'true' || 
  process.env.VERTEXAI === 'true' || 
  !!process.env.VERTEX_API_KEY || 
  !!process.env.VERTEX_PROJECT_ID;

const aiOptions: any = {};

if (isVertex) {
  aiOptions.vertexai = true;
  const vertexApiKey = process.env.VERTEX_API_KEY || process.env.GEMINI_API_KEY;
  if (vertexApiKey) {
    aiOptions.apiKey = vertexApiKey;
  } else {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.VERTEX_PROJECT_ID;
    if (projectId) aiOptions.project = projectId;
    const location = process.env.GOOGLE_CLOUD_LOCATION || process.env.VERTEX_LOCATION;
    if (location) aiOptions.location = location;
  }
} else {
  aiOptions.apiKey = process.env.GEMINI_API_KEY;
}

export const ai = new GoogleGenAI(aiOptions);

const activeCaches = new Map<string, { cacheName: string; expiresAt: number }>();

export async function getOrCreateContextCache(systemInstruction: string, model: string): Promise<string | null> {
  try {
    const cacheKey = `${model}:${systemInstruction}`;
    const existing = activeCaches.get(cacheKey);
    const now = Date.now();
    
    if (existing && existing.expiresAt > now) {
      return existing.cacheName;
    }

    console.log(`[Context Cache] Attempting to create content cache for model: ${model}...`);
    
    const cache = await ai.caches.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        ttl: "3600s",
        displayName: `graphicdesign-app-${model.replace(/[^a-zA-Z0-9]/g, "-")}`.slice(0, 40),
      },
    });

    if (cache?.name) {
      console.log(`[Context Cache] Successfully created cache: ${cache.name}`);
      activeCaches.set(cacheKey, {
        cacheName: cache.name,
        expiresAt: Date.now() + 55 * 60 * 1000,
      });
      return cache.name;
    }
  } catch (error) {
    console.warn("[Context Cache] Context caching failed. Falling back.", error);
  }
  return null;
}

export function is503UnavailableError(e: any) {
  const status = e?.status ?? e?.error?.code;
  const msg = String(e?.message || "").toLowerCase();
  return (
    status === 503 ||
    msg.includes("503") ||
    msg.includes("unavailable") ||
    msg.includes("high demand") ||
    msg.includes("service unavailable")
  );
}

export function isModelFallbackError(e: any) {
  if (is503UnavailableError(e)) return true;
  const status = e?.status ?? e?.code;
  const msg = String(e?.message || "").toLowerCase();
  return (
    status === 404 ||
    status === 400 ||
    msg.includes("not found") ||
    msg.includes("not supported") ||
    msg.includes("unknown model") ||
    msg.includes("invalid model")
  );
}

export async function generateContentWithModelFallback(params: {
  primaryModel: string;
  fallbackModel: string;
  contents: any;
  config?: any;
}) {
  assertNotLiteModel(params.primaryModel);
  assertNotLiteModel(params.fallbackModel);
  try {
    return await ai.models.generateContent({
      model: params.primaryModel,
      contents: params.contents,
      config: params.config,
    });
  } catch (e: any) {
    if (isModelFallbackError(e)) {
      return await ai.models.generateContent({
        model: params.fallbackModel,
        contents: params.contents,
        config: params.config,
      });
    }
    throw e;
  }
}

export async function callWithRetry(fn: () => Promise<any>, retries = 3, delay = 5000) {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      lastError = e;
      const isRetryable = e.status === 429 || e.message?.includes("quota") || e.status >= 500;

      if (isRetryable && i < retries - 1) {
        console.warn(`Gemini error. Waiting ${delay}ms before retry ${i + 1}/${retries}...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
    }
  }
  throw lastError ?? new Error("Unknown error in callWithRetry");
}

async function compressImageBuffer(buffer: Buffer, mimeType: string): Promise<Buffer> {
  try {
    let sharpInstance = sharp(buffer);
    const metadata = await sharpInstance.metadata();

    if (metadata.width && metadata.width > 1024) {
      sharpInstance = sharpInstance.resize(1024, null, { withoutEnlargement: true });
    } else if (metadata.height && metadata.height > 1024) {
      sharpInstance = sharpInstance.resize(null, 1024, { withoutEnlargement: true });
    }

    if (mimeType.includes('png')) {
      return await sharpInstance.png({ compressionLevel: 6 }).toBuffer();
    } else if (mimeType.includes('webp')) {
      return await sharpInstance.webp({ quality: 80 }).toBuffer();
    }
    return await sharpInstance.jpeg({ quality: 80 }).toBuffer();
  } catch (error) {
    console.warn("Image compression failed, using original:", error);
    return buffer;
  }
}

export async function prepareImageInput(item: string | { buffer: Buffer; mimeType: string }) {
  if (typeof item === "string") {
    if (item.startsWith("data:image/")) {
      const [mimeType, base64Data] = item.split(",");
      const actualMimeType = mimeType.split(":")[1].split(";")[0];
      return { inlineData: { data: base64Data, mimeType: actualMimeType } };
    } else {
      const response = await fetch(item);
      const buffer = Buffer.from(await response.arrayBuffer());
      const mimeType = response.headers.get("content-type") || "image/jpeg";
      const compressedBuffer = await compressImageBuffer(buffer, mimeType);
      return { inlineData: { data: compressedBuffer.toString("base64"), mimeType } };
    }
  }

  const compressedBuffer = await compressImageBuffer(item.buffer, item.mimeType);
  return { inlineData: { data: compressedBuffer.toString("base64"), mimeType: item.mimeType } };
}
