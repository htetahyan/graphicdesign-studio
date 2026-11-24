import "server-only";

import { ai } from "@/lib/gemini/client";
import { logger } from "@/lib/logger";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

export async function generateAndUploadVideo(opts: {
  imageUrl: string;
  durationSeconds: number; // 4 or 6
  prompt: string;
}) {
  logger.info("Starting video generation", { duration: opts.durationSeconds });

  // 1. Fetch the image to get base64 buffer
  const imageRes = await fetch(opts.imageUrl);
  if (!imageRes.ok) {
    throw new Error(`Failed to fetch image for video generation: ${imageRes.statusText}`);
  }
  const imageBuffer = await imageRes.arrayBuffer();
  const imageBase64 = Buffer.from(imageBuffer).toString("base64");
  const mimeType = imageRes.headers.get("content-type") || "image/jpeg";

  let operation;
  try {
    operation = await ai.models.generateVideos({
      model: "veo-3.1-fast-generate-001",
      prompt: opts.prompt,
      config: {
        numberOfVideos: 1,
        durationSeconds: opts.durationSeconds,
        resolution: "720p",
        lastFrame: {
          imageBytes: imageBase64,
          mimeType: mimeType,
        },
      },
    });
  } catch (e: any) {
    logger.warn("veo-3.1-fast-generate-001 failed, falling back to veo-2.0-generate-001", { err: e.message });
    operation = await ai.models.generateVideos({
      model: "veo-2.0-generate-001",
      prompt: opts.prompt,
      config: {
        numberOfVideos: 1,
        durationSeconds: opts.durationSeconds,
        lastFrame: {
          imageBytes: imageBase64,
          mimeType: mimeType,
        },
      },
    });
  }

  logger.info("Video operation started", { operationName: operation.name });

  // 3. Poll for completion
  let attempts = 0;
  while (!operation.done) {
    attempts++;
    if (attempts > 30) {
      throw new Error("Video generation timed out after 5 minutes.");
    }
    await new Promise((resolve) => setTimeout(resolve, 10000));
    // @ts-ignore
    if (ai.operations && ai.operations.getVideosOperation) {
      // @ts-ignore
      operation = await ai.operations.getVideosOperation({ operation: operation });
    } else if (ai.operations && typeof ai.operations.get === 'function') {
        // @ts-ignore
        operation = await ai.operations.get({ name: operation.name });
    } else {
        throw new Error("Cannot find operation poll method in SDK.");
    }
  }

  if (operation.error) {
    throw new Error(`Video generation failed: ${operation.error.message}`);
  }

  // @ts-ignore
  const generatedVideo = operation.response?.generatedVideos?.[0]?.video;
  if (!generatedVideo) {
    throw new Error("No video returned from the model.");
  }

  const videoBytes = generatedVideo.videoBytes;
  if (!videoBytes) {
      if (generatedVideo.uri) {
          // It's already hosted (e.g. on GCS), we might just return the URL, but if it requires auth we might need to download it.
          // For now, assume public or we return the URI directly.
          return { videoUrl: generatedVideo.uri };
      }
      throw new Error("No videoBytes or URI in response.");
  }
  
  const uploadBuffer = Buffer.from(videoBytes, "base64");
  const fileName = `generated-video-${crypto.randomUUID()}.mp4`;
  
  const { error: uploadError } = await supabaseAdmin.storage
    .from("brand-assets")
    .upload(fileName, uploadBuffer, { contentType: "video/mp4", upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("brand-assets").getPublicUrl(fileName);
  return { videoUrl: data.publicUrl };
}
