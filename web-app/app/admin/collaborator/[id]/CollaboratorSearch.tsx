"use client";

import { Search, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getFilteredCollaborators } from "@/app/admin/collaborator/collaborator.service";
import { useCollaborators } from "@/api/collaborator/collaborators.api";

export const CollaboratorSearch = ({ companyId }: { companyId: string }) => {
	const router = useRouter();
	const { data: collaborators } = useCollaborators(companyId);
	const [searchQuery, setSearchQuery] = useState("");
	const [showSearchResults, setShowSearchResults] = useState(false);

	const filteredCollaborators = collaborators ? getFilteredCollaborators(collaborators, searchQuery) : [];

	return (
		<div className="relative">
			<SearchIcon className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
			<Input
				type="text"
				placeholder="Nom, fonction, responsable, type de contrat, mots-clés, ..."
				value={searchQuery}
				onChange={(e) => {
					setSearchQuery(e.target.value);
					setShowSearchResults(e.target.value.length > 0);
				}}
				// onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
				className="w-full border-none border-slate-200 pl-10"
			/>
			<button
				type="submit"
				className="search-collaborator absolute right-2 top-0 rounded-lg bg-sky-600 p-3 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
			>
				<Search className="h-3 w-3 justify-self-center text-white" />
			</button>

			{/* Search Results Dropdown */}
			{showSearchResults && (
				<div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
					{filteredCollaborators.length > 0 ? (
						<div className="py-2">
							{filteredCollaborators.map((collaborator) => (
								<button
									key={collaborator.id}
									onClick={() => {
										router.push(`/admin/collaborator/${collaborator.id}`);
										setShowSearchResults(false);
										setSearchQuery("");
									}}
									className="w-full border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
								>
									<div className="flex items-center space-x-3">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-700">
											{collaborator.firstname.charAt(0)}
											{collaborator.lastname.charAt(0)}
										</div>
										<div className="min-w-0 flex-1">
											<div className="truncate font-medium text-slate-900">
												{collaborator.firstname} {collaborator.lastname}
											</div>
											<div className="truncate text-sm text-slate-600">
												{collaborator.professionalSituation?.jobTitle} •{" "}
												{collaborator.professionalSituation?.contractType}
											</div>
											<div className="truncate text-xs text-slate-500">
												Responsable: {collaborator.professionalSituation?.responsible}
											</div>
										</div>
									</div>
								</button>
							))}
						</div>
					) : searchQuery.length > 0 ? (
						<div className="px-4 py-8 text-center text-slate-500">
							<div className="text-sm">Aucun collaborateur trouvé pour "{searchQuery}"</div>
						</div>
					) : null}
				</div>
			)}
		</div>
	);
};
