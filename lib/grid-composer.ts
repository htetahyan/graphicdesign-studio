/**
 * Composites multiple slide images into a single grid layout on the client side.
 * Supported counts: 2 to 6 slides.
 */
export async function composeCarouselGrid(
  imageUrls: string[],
  aspectRatioStr: string = "1:1"
): Promise<string> {
  const images = await Promise.all(
    imageUrls.map((url) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(new Error("Failed to load slide image for grid composition."));
      });
    })
  );

  const count = images.length;
  if (count === 0) throw new Error("No images to composite");

  // Determine grid dimensions
  let cols = 2;
  let rows = 2;
  if (count <= 2) {
    cols = count;
    rows = 1;
  } else if (count === 3) {
    cols = 3;
    rows = 1;
  } else if (count === 4) {
    cols = 2;
    rows = 2;
  } else {
    // 5 or 6 slides
    cols = 3;
    rows = Math.ceil(count / 3);
  }

  // Parse aspect ratio
  const parts = aspectRatioStr.split(":");
  const wRatio = parts[0] ? Number(parts[0]) : 1;
  const hRatio = parts[1] ? Number(parts[1]) : 1;
  
  // Base dimensions per slide (1080px is Instagram high-res standard)
  const slideWidth = 1080;
  const slideHeight = Math.round((slideWidth * hRatio) / wRatio);

  const canvas = document.createElement("canvas");
  canvas.width = cols * slideWidth;
  canvas.height = rows * slideHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get 2D canvas context");

  // Paint background color (white fallback)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw each slide image in its slot
  images.forEach((img, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = col * slideWidth;
    const y = row * slideHeight;
    ctx.drawImage(img, x, y, slideWidth, slideHeight);
  });

  return canvas.toDataURL("image/jpeg", 0.92);
}
