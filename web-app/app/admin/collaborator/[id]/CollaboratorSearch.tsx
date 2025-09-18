'use client';

import {Search, SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/Input";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {getFilteredCollaborators} from "@/app/admin/collaborator/collaborator.service";
import {useCollaborators} from "@/api/collaborator/collaborators.api";

export const CollaboratorSearch = ({companyId}: { companyId: string }) => {
    const router = useRouter();
    const {data: collaborators} = useCollaborators(companyId);
    const [searchQuery, setSearchQuery] = useState("")
    const [showSearchResults, setShowSearchResults] = useState(false)

    const filteredCollaborators = collaborators
        ? getFilteredCollaborators(collaborators, searchQuery)
        : [];

    return (
        <div className="relative">
            <SearchIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 z-10"/>
            <Input
                type="text"
                placeholder="Nom, fonction, responsable, type de contrat, mots-clés, ..."
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSearchResults(e.target.value.length > 0)
                }}
                // onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
                className="pl-10 border-slate-200 border-none w-full"
            />
            <button type="submit"
                    className="text-white absolute right-2 top-0 bg-sky-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-3">
                <Search className="w-3 h-3 justify-self-center text-white"/>
            </button>

            {/* Search Results Dropdown */}
            {showSearchResults && (
                <div
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                    {filteredCollaborators.length > 0 ? (
                        <div className="py-2">
                            {filteredCollaborators.map((collaborator) => (
                                <button
                                    key={collaborator.id}
                                    onClick={() => {
                                        router.push(`/admin/collaborator/${collaborator.id}`)
                                        setShowSearchResults(false)
                                        setSearchQuery("")
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 focus:outline-none focus:bg-slate-50"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-sm font-medium text-slate-700">
                                            {collaborator.firstname.charAt(0)}
                                            {collaborator.lastname.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-slate-900 truncate">
                                                {collaborator.firstname} {collaborator.lastname}
                                            </div>
                                            <div className="text-sm text-slate-600 truncate">
                                                {collaborator.professionalSituation?.jobTitle} • {collaborator.professionalSituation?.contractType}
                                            </div>
                                            <div
                                                className="text-xs text-slate-500 truncate">Responsable: {collaborator.professionalSituation?.responsible}</div>
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