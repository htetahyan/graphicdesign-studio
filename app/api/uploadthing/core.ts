import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { checkAdminSession } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  inspirationImageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const isAdmin = await checkAdminSession();
      if (!isAdmin) throw new UploadThingError("Unauthorized");
      return { role: "admin" };
    })
    .onUploadComplete(
      async ({ file }: {
        file: {
          ufsUrl: string;
          key: string;
          name: string;
          size: number;
          type: string;
        };
      }) => {
        return {
          url: file.ufsUrl,
          key: file.key,
          name: file.name,
          size: file.size,
          type: file.type,
        };
      },
    ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
