import AdministrationDashboard from "./administration-dashboard"
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import React from "react";
import AppLayout from "@/app/AppLayout";

export default async function AdministrationPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return <div className="flex items-center justify-center h-screen w-full">
            <span className="text-blue-400">Vous devez vous connecter pour acceder à cette page.</span>
        </div>
    }

    if (!session.user.roles?.includes("SUPER_ADMIN")) {
        return <div className="flex items-center justify-center h-screen w-full">
            <span className="text-blue-400">Vous n'avez pas les droits pour acceder à cette page.</span>
        </div>
    }

    return <AppLayout>
        <AdministrationDashboard/>
    </AppLayout>;
}