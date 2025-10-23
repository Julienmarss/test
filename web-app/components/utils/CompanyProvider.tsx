"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { CompanyResponse } from "@/api/company/company.api";

type CompanyContextType = {
    company: CompanyResponse;
    setCompany: (company: CompanyResponse) => void;
    isInitialized: boolean;
};

const CompanyContext = createContext<CompanyContextType | null>(null);

// ✅ État global partagé (en dehors du composant)
let globalCompany: CompanyResponse | null = null;
let globalSetters: Set<(company: CompanyResponse) => void> = new Set();

export const useSelectedCompany = () => {
    const ctx = useContext(CompanyContext);
    if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
    return ctx;
};

export const CompanyProvider = ({
                                    initialCompany,
                                    children
                                }: {
    initialCompany: CompanyResponse;
    children: React.ReactNode;
}) => {
    // ✅ Initialiser avec l'état global s'il existe, sinon avec initialCompany
    const [companyInfo, setCompanyInfoState] = useState<CompanyResponse>(() => {
        if (globalCompany) {
            console.log("🔄 [CompanyProvider] Restoring from global state:", {
                id: globalCompany.id,
                name: globalCompany.name,
            });
            return globalCompany;
        }
        console.log("🚀 [CompanyProvider] First mount with company:", {
            id: initialCompany.id,
            name: initialCompany.name,
        });
        globalCompany = initialCompany;
        return initialCompany;
    });

    // ✅ Fonction qui met à jour à la fois l'état local ET global
    const setCompanyInfo = (company: CompanyResponse) => {
        console.log("📝 [CompanyProvider] setCompany called with:", {
            id: company.id,
            name: company.name,
        });
        globalCompany = company;
        setCompanyInfoState(company);

        // Notifier tous les autres providers (au cas où)
        globalSetters.forEach(setter => {
            if (setter !== setCompanyInfoState) {
                setter(company);
            }
        });
    };

    // ✅ S'enregistrer pour recevoir les mises à jour
    useEffect(() => {
        globalSetters.add(setCompanyInfoState);
        return () => {
            globalSetters.delete(setCompanyInfoState);
        };
    }, []);

    useEffect(() => {
        console.log("🏢 [CompanyProvider] Company state changed to:", {
            id: companyInfo.id,
            name: companyInfo.name,
        });
    }, [companyInfo]);

    return (
        <CompanyContext.Provider value={{
            company: companyInfo,
            setCompany: setCompanyInfo,
            isInitialized: globalCompany !== null
        }}>
            {children}
        </CompanyContext.Provider>
    );
};