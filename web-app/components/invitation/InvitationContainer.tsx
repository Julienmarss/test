"use client";

import { useInvitationByToken } from "@/api/company/invitation.api";
import { UUID } from "node:crypto";
import { useState } from "react";
import { Image } from "../ui/hero-ui/Image";
import { Skeleton } from "../ui/hero-ui/Skeleton";
import InvitationForm from "./InvitationForm";

export default function InvitationContainer({ token }: { token: UUID }) {
    const [firstname, setFirstname] = useState("");
    const { data, isLoading } = useInvitationByToken(token);

    const inviter = data ? `${data.inviterFirstname} ${data.inviterLastname.toUpperCase()}` : "";
    const company = data?.companyName ?? "";
    const email = data?.email ?? "";

    return (
        <div className="flex h-full w-full items-center justify-center p-20">
            <div className="flex w-full flex-col gap-10">
                <Image src="/logo-legipilot.svg" alt="Logo Legipilot" />

                <div>
                    <h1 className="mb-2 text-3xl font-bold text-slate-900">
                        Bienvenue{firstname.length > 0 ? ` ${firstname}` : ""} !
                    </h1>

                    <p className="mb-2 flex flex-wrap items-baseline gap-2 text-gray-500">
                        <span className="shrink-0">{isLoading ? <Skeleton className="h-4 w-32 rounded-sm" /> : inviter}</span>
                        <span className="whitespace-normal">vous a invité à rejoindre l&apos;entreprise</span>
                        <span className="shrink-0">{isLoading ? <Skeleton className="h-4 w-36 rounded-sm" /> : company}</span>
                    </p>

                    <p className="flex flex-wrap items-baseline gap-2 text-sky-600">
                        <span>Rappel de votre adresse email :</span>
                        <span className="shrink-0">{isLoading ? <Skeleton className="h-4 w-40 rounded-sm" /> : email}</span>
                    </p>
                </div>

                <InvitationForm handleFirstnameChange={setFirstname} token={token} email={email} />
            </div>
        </div>
    );
}