import { redirect } from "next/navigation";

import { checkAdminSession } from "@/lib/auth";
import { getInspirationTemplates } from "@/app/actions/admin-inspirations";
import { InspirationsClient } from "./inspirations-client";

export default async function AdminInspirationsPage() {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) redirect("/admin/login");

  const rows = await getInspirationTemplates({ limit: 50 });

  return <InspirationsClient initialRows={rows as any} />;
}
