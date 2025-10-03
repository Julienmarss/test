"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/buttons/Button"
import { ChevronLeft, ChevronRight, Download, Plus } from "lucide-react"
import { MyCollaboratorsHeader } from "@/app/admin/components/MyCollaboratorsHeader";
import { MyCollaboratorsTable } from "@/app/admin/components/MyCollaboratorsTable";
import { getFilteredCollaborators } from "@/app/admin/collaborator/collaborator.service";
import { Header } from "@/app/admin/components/Header";
import { AjouterCollaborateursModal } from "@/app/admin/components/AjouterCollaborateursModal";
import { useCollaborators, useExportCollaborators } from "@/api/collaborator/collaborators.api";
import { useCompany } from "@/components/utils/CompanyProvider";
import { PageSpinner } from "@/components/ui/icons/Spinner";
import { CollaboratorResponse } from "@/api/collaborator/collaborators.dto";
import { ActiveFilters } from "./ActiveFilters";
import { useFilters } from "@/app/admin/components/table.service";
import { MyCollaboratorsTrombinoscope } from "./MyCollaboratorsTrombinoscope";
import { SelectView } from "@/app/admin/components/SelectView";
import { usePersistedState } from "@/hooks/use-persisted-state";
import React from "react";
import { parseDate } from "@/components/utils/date";
import _ from "lodash";

export default function MyCollaborators() {
    const { company } = useCompany()
    const [view, setView] = usePersistedState<"list" | "trombinoscope">("collaborators_view", "list");
    const { data: collaborators } = useCollaborators(company?.id);
    const { mutate: exportCollaborators } = useExportCollaborators();
    const [openModal, setOpenModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCollaborators, setSelectedCollaborators] = useState<CollaboratorResponse[]>([])
    const [itemsPerPage, setItemsPerPage] = useState(25)
    const [currentPage, setCurrentPage] = useState(1)
    const { filters, setPartialFilter, resetFilters } = useFilters();
    const options = [25, 50, 100];

    const filteredCollaborators = collaborators ? getFilteredCollaborators(collaborators, searchQuery) : [];

    // Calculs de pagination
    const totalItems = filteredCollaborators.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageCollaborators = filteredCollaborators.slice(startIndex, endIndex);

    const filteredCurrentPageCollaborators: CollaboratorResponse[] = useMemo(() => {
        if (currentPageCollaborators.length > 0) {
            let collaboratorsFiltered = currentPageCollaborators.filter((c) => {
                const { function: fn, manager, contract, status, date, compensation } = filters;
                const matchFunction = fn.length === 0 || (c.professionalSituation && fn.includes(c.professionalSituation.jobTitle));
                const matchManager = manager.length === 0 || (c.professionalSituation && manager.includes(c.professionalSituation.responsible));
                const matchContract = contract.length === 0 || (c.professionalSituation && contract.includes(c.professionalSituation.contractType));
                const matchStatus = status.length === 0 || (c.status && status.includes(c.status));
                const matchDate = (() => {
                    if (!date.start && !date.end) return true;
                    const parsed = parseDate(c.professionalSituation?.hireDate);
                    if (!parsed) return false;
                    return (!date.start || parsed >= date.start) && (!date.end || parsed <= date.end);
                })();
                const matchCompensation = (() => {
                    const value = c.contractInformations?.totalCompensation;
                    if (value === undefined) return true;
                    return (!compensation.min || value >= compensation.min) &&
                        (!compensation.max || value <= compensation.max);
                })();
                return matchFunction && matchManager && matchContract && matchStatus && matchDate && matchCompensation;
            });

            if (filters?.name) {
                collaboratorsFiltered = _.orderBy(collaboratorsFiltered, [(u) => `${u.firstname} ${u.lastname}`], [filters.name as "asc" | "desc"]);
            }

            if (filters?.date?.order) {
                collaboratorsFiltered = _.orderBy(collaboratorsFiltered,
                    [(u) => parseDate(u?.professionalSituation?.hireDate)],
                    [filters.date.order as "asc" | "desc"]);
            }

            if (filters?.compensation?.order) {
                collaboratorsFiltered = _.orderBy(collaboratorsFiltered, [(u) => u.contractInformations?.annualSalary], [filters.compensation.order as "asc" | "desc"]);
            }
            return collaboratorsFiltered;
        }
        return [];
    }, [currentPageCollaborators, filters]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredCollaborators.length]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        const newTotalPages = Math.ceil(totalItems / newItemsPerPage);
        if (currentPage > newTotalPages) {
            setCurrentPage(1);
        }
    };

    if (!collaborators) {
        return <PageSpinner />
    }

    return (
        <article className="bg-sky-50">
            <Header />

            <MyCollaboratorsHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {openModal && <AjouterCollaborateursModal open={openModal} onClose={() => setOpenModal(false)} />}

            {/* Actions */}
            <div className="flex justify-between p-3 bg-white">
                <section className="flex gap-3 items-center">
                    <SelectView view={view} setView={setView} />
                    <div className="w-px h-6 bg-gray-200" />
                    <span className="text-sm text-gray-500 content-center">
                        {totalItems} Collaborateur{totalItems > 1 ? 's' : ''}
                        {totalItems !== collaborators.length && ` (${collaborators.length} au total)`}
                    </span>
                    <ActiveFilters filters={filters} setPartialFilter={setPartialFilter} resetFilters={resetFilters} />
                </section>

                <section className="flex gap-3 items-center">
                    <Button variant="outline" className="flex items-center space-x-2 bg-transparent border-2"
                        onClick={() => company && exportCollaborators(company.id)}
                    >
                        <Download className="w-4 h-4" />
                        <span>Exporter</span>
                    </Button>
                    <Button className="bg-sky-600 hover:bg-sky-700 text-white flex items-center space-x-2"
                        onClick={() => setOpenModal(true)}
                    >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter un collaborateur</span>
                    </Button>
                </section>
            </div>

            <section className={`min-h-[65vh] ${view === "list" ? "bg-white" : "bg-gray-50"}`}>
                {view === "list" ?
                    <MyCollaboratorsTable
                        filters={filters}
                        setPartialFilter={setPartialFilter}
                        collaborators={filteredCurrentPageCollaborators}
                        allCollaborators={collaborators}
                        selectedCollaborators={selectedCollaborators}
                        setSelectedCollaborators={setSelectedCollaborators}
                    /> :
                    <MyCollaboratorsTrombinoscope
                        collaborators={filteredCurrentPageCollaborators}
                        selectedCollaborators={selectedCollaborators}
                        setSelectedCollaborators={setSelectedCollaborators}
                    />
                }
            </section>

            {/* Pagination */}
            <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-gray-200">
                <div className="flex items-center justify-between flex-col gap-2 md:flex-row md:gap-0">
                    <div className="flex items-center space-x-4 flex-col gap-2 md:flex-row md:gap-0">
                        {/* Sélecteur custom */}
                        <div className="flex rounded-lg border border-gray-300">
                            {options.map((option, index) => (
                                <button
                                    key={option}
                                    onClick={() => handleItemsPerPageChange(option)}
                                    className={`px-4 py-2 rounded-lg ${index === 0 ? 'rounded-r-none' : index === options.length - 1 ? 'rounded-l-none' : 'rounded-none'} text-sm font-medium transition-all duration-200 ${itemsPerPage === option
                                            ? 'bg-sky-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        {/* Texte */}
                        <span className="text-gray-500 text-sm">Collaborateurs par pages</span>
                    </div>

                    <div className="flex items-center space-x-4 flex-col gap-2 md:flex-row md:gap-0">
                        <span className="text-sm text-gray-600">
                            {totalItems === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, totalItems)} sur {totalItems}
                        </span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {/* Pages */}
                            <div className="flex space-x-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => {
                                        return Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages;
                                    })
                                    .map((page, index, arr) => (
                                        <React.Fragment key={page}>
                                            {index > 0 && arr[index - 1] !== page - 1 && (
                                                <span className="px-2 py-2 text-sm text-gray-500">...</span>
                                            )}
                                            <button
                                                onClick={() => handlePageChange(page)}
                                                className={`px-3 py-2 text-sm font-medium border rounded-md transition-colors ${page === currentPage
                                                        ? 'bg-sky-600 border-sky-600 text-white'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                    ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}