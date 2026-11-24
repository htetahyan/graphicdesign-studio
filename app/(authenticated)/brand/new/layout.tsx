import type { Metadata } from "next"
import { getSessionUser } from "@/app/actions/user-auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Create Brand - AI Brand Design Studio",
  description: "Create a new brand with AI-powered design tools. Set up your brand identity, colors, and generate custom designs.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BrandNewPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()
  if (!user) {
    redirect("/login")
  }

  return children
}
