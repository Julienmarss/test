"use client";

import { useState } from "react";
import { useMyCompanies } from "@/api/company/company.api";
import { useSelectedCompany } from "@/components/utils/CompanyProvider";
import { serviceClient } from "@/api/client.api";
import { CompanyResponse } from "@/api/company/company.api";
import { toast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import {useQueryClient} from "@tanstack/react-query";

type CompanySwitcherProps = {
    isCollapsed?: boolean;
};

export default function CompanySwitcher({ isCollapsed = false }: CompanySwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { data: companies, isLoading } = useMyCompanies();
    const { company, setCompany } = useSelectedCompany();
    const queryClient = useQueryClient();

    const handleSwitchCompany = async (selectedCompanyId: string) => {
        try {
            const response = await serviceClient.get<CompanyResponse>(
                `/companies/${selectedCompanyId}`
            );

            queryClient.invalidateQueries({ queryKey: ["company"] });
            queryClient.invalidateQueries({ queryKey: ["collaborators"] });
            queryClient.invalidateQueries({ queryKey: ["company-administrators"] });
            queryClient.invalidateQueries({ queryKey: ["invitations"] });
            queryClient.invalidateQueries({ queryKey: ["my-company-rights"] });
            queryClient.invalidateQueries({ queryKey: ["my-rights"] });

            // Mettre à jour le context
            setCompany(response.data);
            setIsOpen(false);

            toast({
                title: "Entreprise changée",
                description: `Vous êtes maintenant sur ${response.data.name}`,
                variant: "default",
            });
        } catch (error) {
            console.error("Erreur lors du changement d'entreprise:", error);
            toast({
                title: "Erreur",
                description: "Impossible de changer d'entreprise",
                variant: "destructive",
            });
        }
    };

    const getRightLabel = (right: string) => {
        switch (right) {
            case "OWNER":
                return "Propriétaire";
            case "MANAGER":
                return "Responsable";
            case "READONLY":
                return "Observateur";
            default:
                return right;
        }
    };

    const getRightCount = (companyId: string) => {
        // On pourrait récupérer le nombre de collaborateurs et l'affiche
        return company.id === companyId ? company.collaborators?.length || 0 : null;
    };

    if (isLoading || !companies) return null;

    if (companies.length <= 1) {
        if (isCollapsed) {
            return (
                <div className="flex h-8 w-8 items-center justify-center">
                    {company.picture && company.picture.length > 0 ? (
                        <div
                            className="h-8 w-8 rounded-full"
                            style={{
                                backgroundImage: `url(${company.picture})`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                            }}
                        />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600">
                            <div className="text-center text-xs text-white">{company?.name?.[0]}</div>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="border-t border-slate-700 px-6 py-4">
                <div className="flex items-center space-x-3">
                    {company.picture && company.picture.length > 0 ? (
                        <div
                            className="h-8 w-8 rounded-full"
                            style={{
                                backgroundImage: `url(${company.picture})`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                            }}
                        />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600">
                            <div className="text-center text-white">{company?.name?.[0]}</div>
                        </div>
                    )}
                    <div>
                        <div className="text-sm font-medium text-white">{company?.name}</div>
                        <div className="text-xs text-slate-400">
                            {company?.collaborators?.length || 0} collaborateur(s)
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isCollapsed) {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-slate-700"
                >
                    {company.picture && company.picture.length > 0 ? (
                        <div
                            className="h-8 w-8 rounded-full"
                            style={{
                                backgroundImage: `url(${company.picture})`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                            }}
                        />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600">
                            <div className="text-center text-xs text-white">{company?.name?.[0]}</div>
                        </div>
                    )}
                </button>

                {isOpen && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg border border-slate-700 bg-sky-950 shadow-lg">
                        <div className="max-h-80 overflow-y-auto p-2">
                            {companies.map((comp) => (
                                <button
                                    key={comp.companyId}
                                    onClick={() => handleSwitchCompany(comp.companyId)}
                                    className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-700 ${
                                        company.id === comp.companyId ? "bg-slate-800" : ""
                                    }`}
                                >
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-600 text-xs text-white">
                                        {comp.companyName[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="truncate text-sm font-medium text-white">{comp.companyName}</div>
                                        <div className="text-xs text-slate-400">{getRightLabel(comp.rights)}</div>
                                    </div>
                                    {company.id === comp.companyId && (
                                        <Check className="h-4 w-4 flex-shrink-0 text-sky-400" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="border-t border-slate-700 px-6 py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between transition-colors hover:opacity-80"
            >
                <div className="flex items-center space-x-3">
                    {company.picture && company.picture.length > 0 ? (
                        <div
                            className="h-8 w-8 rounded-full"
                            style={{
                                backgroundImage: `url(${company.picture})`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                            }}
                        />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600">
                            <div className="text-center text-white">{company?.name?.[0]}</div>
                        </div>
                    )}
                    <div>
                        <div className="text-sm font-medium text-white">{company?.name}</div>
                        <div className="text-xs text-slate-400">
                            {company?.collaborators?.length || 0} collaborateur(s)
                        </div>
                    </div>
                </div>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`size-6 h-5 w-5 stroke-sky-200 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                </svg>
            </button>

            {isOpen && (
                <div className="mt-2 max-h-80 space-y-1 overflow-y-auto rounded-lg border border-slate-700 bg-slate-800 p-2">
                    {companies.map((comp) => (
                        <button
                            key={comp.companyId}
                            onClick={() => handleSwitchCompany(comp.companyId)}
                            className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-700 ${
                                company.id === comp.companyId ? "bg-slate-700" : ""
                            }`}
                        >
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-600 text-xs text-white">
                                {comp.companyName[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="truncate text-sm font-medium text-white">{comp.companyName}</div>
                                <div className="text-xs text-slate-400">
                                    {getRightLabel(comp.rights)}
                                    {company.id === comp.companyId &&
                                        ` • ${company.collaborators?.length || 0} collaborateur(s)`
                                    }
                                </div>
                            </div>
                            {company.id === comp.companyId && (
                                <Check className="h-4 w-4 flex-shrink-0 text-sky-400" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}