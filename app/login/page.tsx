import { getSessionUser } from "@/app/actions/user-auth";
import { redirect } from "next/navigation";
import LoginPageClient from "./login-client";

export default async function LoginPage() {
    const user = await getSessionUser();
    
    if (user) {
        redirect("/gallery");
    }

    return <LoginPageClient />;
}
