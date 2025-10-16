"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, MapPin, Search } from "lucide-react";
import { CompanyDto } from "@/app/api/pappers/route";
import { Input } from "@/components/ui/Input";

interface CompanySearchProps {
	onCompanySelect: (company: CompanyDto) => void;
	onManualInput?: (value: string) => void;
	placeholder?: string;
	value?: string;
}

export default function CompanySearch({
	onCompanySelect,
	onManualInput,
	placeholder = "Saisissez le nom de votre entreprise...",
	value = "",
}: CompanySearchProps) {
	const [query, setQuery] = useState(value);
	const [results, setResults] = useState<CompanyDto[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const debounceRef = useRef<number>(0);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setShowResults(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const searchCompanies = async (searchQuery: string) => {
		if (searchQuery.length < 2) {
			setResults([]);
			setShowResults(false);
			return;
		}

		setIsLoading(true);
		try {
			const res = await fetch(`/api/pappers?q=${encodeURIComponent(searchQuery)}`);
			const body = await res.json();
			const results: CompanyDto[] = body;
			setResults(results || []);
			setShowResults(true);
		} catch (error) {
			console.error("Erreur lors de la recherche:", error);
			setResults([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newQuery = e.target.value;
		setQuery(newQuery);

		if (onManualInput) {
			onManualInput(newQuery);
		}

		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		debounceRef.current = window.setTimeout(() => {
			searchCompanies(newQuery);
		}, 300);
	};

	const handleCompanySelect = (company: CompanyDto) => {
		setQuery(company.nom_entreprise);
		setShowResults(false);
		onCompanySelect(company);
	};

	const formatAddress = (siege: CompanyDto["siege"]) => {
		return `${siege.numero_voie} ${siege.type_voie} ${siege.libelle_voie}, ${siege.code_postal} ${siege.ville}`;
	};

	return (
		<div ref={containerRef} className="relative">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
				<Input
					type="text"
					label="Le nom de votre entreprise"
					placeholder={placeholder}
					value={query}
					onChange={handleInputChange}
					className="rounded-t-md"
				/>
				{isLoading && (
					<div className="absolute right-3 top-1 -translate-y-1/2 transform">
						<div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-500"></div>
					</div>
				)}
			</div>

			{showResults && results.length > 0 && (
				<div className="absolute z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
					{results.map((company) => (
						<button
							key={company.siren}
							onClick={() => handleCompanySelect(company)}
							className="w-full border-b border-slate-100 p-4 text-left last:border-b-0 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
						>
							<div className="flex items-start space-x-3">
								<Building2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400" />
								<div className="min-w-0 flex-1">
									<div className="truncate font-medium text-slate-900">{company.nom_entreprise}</div>
									<div className="mt-1 flex items-center text-sm text-slate-600">
										<MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
										<span className="truncate">{formatAddress(company.siege)}</span>
									</div>
									<div className="mt-1 text-xs text-slate-500">
										SIREN: {company.siren} • SIRET: {company.siege.siret}
									</div>
								</div>
							</div>
						</button>
					))}
				</div>
			)}

			{showResults && query.length >= 2 && results.length === 0 && !isLoading && (
				<div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white p-4 text-center text-slate-500 shadow-lg">
					Aucune entreprise trouvée pour "{query}"
				</div>
			)}
		</div>
	);
}
