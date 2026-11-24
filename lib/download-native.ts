import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { logger } from "./logger";
import { DownloadResult } from "./download";

const ALBUM_NAME = "GraphicDesign";

export async function downloadImageNative(
  imageUrl: string,
  filename: string,
): Promise<DownloadResult> {
  const platform = Capacitor.getPlatform();

  // 1. Fetch image bytes in JavaScript or parse base64 directly
  let base64: string;
  let mimeType: string;

  try {
    if (imageUrl.startsWith("data:")) {
      const parts = imageUrl.split(",");
      const mimePart = parts[0].split(";")[0];
      mimeType = mimePart.split(":")[1] || "image/png";
      base64 = parts[1] || "";
    } else {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      if (!blob || blob.size === 0) throw new Error("Image empty");
      mimeType = blob.type || "image/png";
      base64 = await blobToBase64(blob);
    }
  } catch (err: any) {
    throw new Error(`Failed to process image: ${err?.message ?? String(err)}`);
  }

  const base64DataUrl = `data:${mimeType};base64,${base64}`;
  const ext = mimeType.includes("jpeg") || mimeType.includes("jpg") ? "jpg" : "png";
  const fullFilename = normalizeFilename(filename, ext);
  const baseName = stripExtension(fullFilename);

  // 2. Resolve real album identifier
  let albumIdentifier: string | undefined = undefined;

  if (platform === "android") {
    try {
      const { Media } = await import("@capacitor-community/media");
      const { albums } = await Media.getAlbums();
      let album = albums.find(
        (a) => a.name?.toLowerCase() === ALBUM_NAME.toLowerCase(),
      );

      if (!album) {
        logger.info(`[download] Creating album "${ALBUM_NAME}"...`);
        await Media.createAlbum({ name: ALBUM_NAME });
        const { albums: freshAlbums } = await Media.getAlbums();
        album = freshAlbums.find(
          (a) => a.name?.toLowerCase() === ALBUM_NAME.toLowerCase(),
        );
      }

      if (album?.identifier) {
        albumIdentifier = album.identifier;
      }
    } catch (albumErr: any) {
      logger.warn("[download] Album lookup/create failed", { error: albumErr });
    }
  }

  const buildSaveOptions = (path: string) => ({
    path,
    ...(albumIdentifier ? { albumIdentifier } : {}),
    ...(platform === "android" ? { fileName: baseName } : {}),
  });

  // 3. Save to gallery via Media plugin
  try {
    const { Media } = await import("@capacitor-community/media");
    await Media.savePhoto(buildSaveOptions(base64DataUrl));
    return {
      method: "gallery-direct",
      toastMessage: "🖼️ Gallery ထဲ save ပြီးပါပြီ ✅",
      toastType: "success",
    };
  } catch (mediaErr: any) {
    logger.warn("[download] savePhoto base64 failed, trying Cache", { error: mediaErr });
  }

  // 4. Fallback: write to Cache -> Media.savePhoto(fileUri)
  let fileUri: string;
  try {
    await Filesystem.writeFile({
      path: fullFilename,
      data: base64,
      directory: Directory.Cache,
      recursive: true,
    });
    const uriResult = await Filesystem.getUri({
      path: fullFilename,
      directory: Directory.Cache,
    });
    fileUri = uriResult.uri;
  } catch (writeErr: any) {
    throw new Error(`Cache write failed: ${writeErr?.message ?? writeErr}`);
  }

  try {
    const { Media } = await import("@capacitor-community/media");
    await Media.savePhoto(buildSaveOptions(fileUri));
    silentDelete(fullFilename, Directory.Cache);
    return {
      method: "gallery-direct",
      toastMessage: "🖼️ Gallery ထဲ save ပြီးပါပြီ ✅",
      toastType: "success",
    };
  } catch (fileMediaErr: any) {
    logger.warn("[download] savePhoto fileUri failed, trying Share", { error: fileMediaErr });
  }

  // 5. Final fallback: Share sheet
  try {
    const { Share } = await import("@capacitor/share");
    await Share.share({
      files: [fileUri],
      title: "Design ပုံ သိမ်းရန်",
      dialogTitle: platform === "android" ? "Gallery ထဲ save ရန် ရွေးချယ်ပါ" : "Photos ထဲ save ရန်",
    });
    silentDelete(fullFilename, Directory.Cache);
    return {
      method: "share-fallback",
      toastMessage: platform === "ios"
        ? '"Save Image" ကိုနှိပ်ပြီး Photos ထဲ သိမ်းပါ 📱'
        : "Gallery app ကိုရွေးချယ်ပြီး ပုံ သိမ်းပါ 📁",
      toastType: "info",
    };
  } catch (shareErr: any) {
    const cancelled =
      typeof shareErr?.message === "string" &&
      (shareErr.message.toLowerCase().includes("cancel") ||
        shareErr.message.toLowerCase().includes("dismiss"));
    if (cancelled) {
      return {
        method: "share-fallback",
        toastMessage: "💾 ဖိုင် device ထဲ save ပြီးပါပြီ (Files app မှ ရှာနိုင်ပါသည်)",
        toastType: "info",
      };
    }
    throw new Error(`Save failed: ${shareErr?.message ?? shareErr}`);
  }
}

function normalizeFilename(filename: string, defaultExt: string): string {
  if (filename.endsWith(".png") || filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
    return filename;
  }
  return `${filename}.${defaultExt}`;
}

function stripExtension(filename: string): string {
  return filename.replace(/\.(png|jpe?g)$/i, "");
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const parts = result?.split(",");
      if (!parts || parts.length < 2 || !parts[1]) {
        reject(new Error("base64 conversion failed"));
        return;
      }
      resolve(parts[1]);
    };
    reader.onerror = () => reject(new Error("FileReader error"));
    reader.readAsDataURL(blob);
  });
}

async function silentDelete(path: string, directory: Directory): Promise<void> {
  try {
    await Filesystem.deleteFile({ path, directory });
  } catch {
    // ignore
  }
}
