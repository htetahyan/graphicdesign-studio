import type { Metadata } from "next";
import { getSessionUser, getBrandsLite } from "@/app/actions/user-auth";
import { redirect } from "next/navigation";
import { UserSidebar } from "@/components/ui/user-sidebar";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AuthenticatedProviders } from "@/components/context/authenticated-providers";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-snippet": -1,
      "max-image-preview": "none",
      "max-video-preview": -1,
    },
  },
};

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, brands] = await Promise.all([
    getSessionUser(),
    getBrandsLite()
  ]);

  if (!user) {
    redirect("/signup");
  }

  return (
    <ErrorBoundary>
      <AuthenticatedProviders userId={user.id}>
        <div className="flex flex-col h-full w-full overflow-hidden">
           <UserSidebar user={user} brandsCount={brands.length} />
           <div className="flex-1 overflow-y-auto w-full">
              {children}
           </div>
        </div>
      </AuthenticatedProviders>
    </ErrorBoundary>
  );
}
