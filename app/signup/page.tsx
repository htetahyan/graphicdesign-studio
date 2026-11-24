import { getSessionUser } from "@/app/actions/user-auth";
import { redirect } from "next/navigation";
import SignupPageClient from "./signup-client";

export default async function SignupPage() {
    const user = await getSessionUser();
    
    if (user) {
        redirect("/gallery");
    }

    return <SignupPageClient />;
}
