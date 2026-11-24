import { redirect } from "next/navigation";
import { getSessionUser } from "@/app/actions/user-auth";

export default async function Home() {
  const user = await getSessionUser();

  if (user) {
    redirect("/gallery");
  } else {
    redirect("/signup");
  }
}
