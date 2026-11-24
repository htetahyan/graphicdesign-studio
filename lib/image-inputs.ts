import "server-only";

import { readFile } from "fs/promises";
import path from "path";
import { matchLockedProps, type LockedProp } from "./locked-props/catalog";

export type DesignImageRole =
  | "logo"
  | "primary_subject"
  | "secondary_subject"
  | "style_reference"
  | "existing_design"
  | "locked_prop";

export type DesignImageInput = {
  url: string;
  role: DesignImageRole;
  lockedProp?: Pick<LockedProp, "id" | "label" | "printedText">;
};

async function lockedPropDataUri(file: string): Promise<string> {
  const filePath = path.join(process.cwd(), "public", "assets", "locked-props", file);
  const buf = await readFile(filePath);
  const mime = file.endsWith(".jpg") || file.endsWith(".jpeg") ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export async function withLockedPropsIfNeeded(
  prompt: string,
  imageInputs: DesignImageInput[],
): Promise<DesignImageInput[]> {
  const matched = matchLockedProps(prompt);
  if (matched.length === 0) return imageInputs;

  const already = new Set(
    imageInputs.filter((item) => item.role === "locked_prop" && item.lockedProp?.id).map((item) => item.lockedProp!.id),
  );

  const extras: DesignImageInput[] = [];
  for (const asset of matched) {
    if (already.has(asset.id)) continue;
    extras.push({
      url: await lockedPropDataUri(asset.file),
      role: "locked_prop",
      lockedProp: {
        id: asset.id,
        label: asset.label,
        printedText: asset.printedText,
      },
    });
  }
  return extras.length ? [...imageInputs, ...extras] : imageInputs;
}
