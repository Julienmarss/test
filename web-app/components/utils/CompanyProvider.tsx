"use client";

import { createContext, useContext, useState } from "react";
import { CompanyResponse } from "@/api/company/company.api";

type CompanyContextType = {
	company: CompanyResponse;
	setCompany: React.Dispatch<React.SetStateAction<CompanyResponse>>;
};

const CompanyContext = createContext<CompanyContextType | null>(null);

export const useCompany = () => {
	const ctx = useContext(CompanyContext);
	if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
	return ctx;
};

export const CompanyProvider = ({ company, children }: { company: CompanyResponse; children: React.ReactNode }) => {
	const [companyInfo, setCompanyInfo] = useState<CompanyResponse>(company);

	return (
		<CompanyContext.Provider value={{ company: companyInfo, setCompany: setCompanyInfo }}>
			{children}
		</CompanyContext.Provider>
	);
};
