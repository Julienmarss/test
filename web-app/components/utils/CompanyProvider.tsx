"use client";

import { createContext, useContext, useState } from "react";
import { CompanyResponse } from "@/api/company/company.api";
import { setSelectedCompanyIdClient } from "@/lib/company-cookie";

type CompanyContextType = {
	company: CompanyResponse;
	setCompany: (company: CompanyResponse) => void;
};

const CompanyContext = createContext<CompanyContextType | null>(null);

export const useSelectedCompany = () => {
	const ctx = useContext(CompanyContext);
	if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
	return ctx;
};

export const CompanyProvider = ({
	initialCompany,
	children,
}: {
	initialCompany: CompanyResponse;
	children: React.ReactNode;
}) => {
	const [company, setCompanyState] = useState<CompanyResponse>(initialCompany);

	const setCompany = (newCompany: CompanyResponse) => {
		setCompanyState(newCompany);
		setSelectedCompanyIdClient(newCompany.id);
	};

	return <CompanyContext.Provider value={{ company, setCompany }}>{children}</CompanyContext.Provider>;
};
