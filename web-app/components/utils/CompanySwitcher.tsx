"use client";

import { useMemo } from "react";
import { useMyCompanies } from "@/api/company/company.api";
import { useSelectedCompany } from "@/components/utils/CompanyProvider";
import { serviceClient } from "@/api/client.api";
import type { CompanyResponse } from "@/api/company/company.api";
import { toast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from "@/components/ui/hero-ui/Dropdown";
import { Avatar } from "../ui/hero-ui/Avatar";

type CompanySwitcherProps = {
	isCollapsed?: boolean;
};

export default function CompanySwitcher({ isCollapsed = false }: CompanySwitcherProps) {
	const { data: companies, isLoading } = useMyCompanies();
	const { company, setCompany } = useSelectedCompany();
	const queryClient = useQueryClient();

	const hasMenu = (companies?.length ?? 0) > 1;

	const trigger = useMemo(() => {
        const avatar = <Avatar size="sm" showFallback className="bg-gray-600 h-6 w-6 text-white border border-sky-700" src={company.picture} name={company?.name?.[0]} />

		if (isCollapsed) {
			// Icône seule
			return (
				<button className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-sky-900">
					{avatar}
				</button>
			);
		}

		// Ligne complète
		return (
			<button  className="flex w-full items-center justify-between transition-colors hover:bg-sky-900 rounded-lg py-1 px-2">
				<div className="flex items-center space-x-3">
					{avatar}
					<div className="text-left">
						<div className="text-sm font-medium text-white">{company?.name}</div>
						<div className="text-xs text-slate-400">
							{company?.collaborators?.length ?? 0} collaborateur{company?.collaborators?.length > 1 ? "s" : ""}
						</div>
					</div>
				</div>

				{/* Chevron */}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="size-5 stroke-sky-200"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
				</svg>
			</button>
		);
	}, [company, isCollapsed]);

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

	const handleSwitchCompany = async (selectedCompanyId: string) => {
		try {
			const resp = await serviceClient.get<CompanyResponse>(`/companies/${selectedCompanyId}`);
			setCompany(resp.data);
			queryClient.clear();

			toast({
				title: "Entreprise changée",
				description: `Vous êtes maintenant sur ${resp.data.name}`,
			});
		} catch {
			toast({
				title: "Erreur",
				description: "Impossible de changer d'entreprise",
				variant: "destructive",
			});
		}
	};
    
	return (
			<Dropdown classNames={{content: "bg-gray-800 border border-slate-700"}}>
				<DropdownTrigger>{trigger}</DropdownTrigger>
				{hasMenu && (
					<DropdownMenu
						aria-label="Choisir une entreprise"
						onAction={(key) => handleSwitchCompany(String(key))}
                        className="w-64"
					>
						{(!isLoading && companies) ? companies.map((c) => {
							const selected = company?.id === c.companyId;
							return (
								<DropdownItem
									key={c.companyId}
									className={`data-[hover=true]:bg-gray-600 ${
										selected ? "bg-gray-700" : ""
									}`}
									endContent={selected ? <Check className="h-4 w-4 text-sky-400" /> : null}
								>
                                    <div className="flex items-center gap-3">
                                        <Avatar size="sm" showFallback className="bg-gray-600 h-6 w-6 text-white text-xs border border-sky-700" src={c.picture} name={c.companyName[0]} />
                                        <div className="">
                                            <div className="text-sm font-medium text-white">{c.companyName}</div>
                                            <div className="text-xs text-slate-400">{getRightLabel(c.rights)}</div>
                                        </div>
                                    </div>
									
								</DropdownItem>
							);
						}) : <></>}
					</DropdownMenu>
				)}
			</Dropdown>
	)
}
