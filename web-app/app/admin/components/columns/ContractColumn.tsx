import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ColumnFilterDropdown } from "@/app/admin/components/ColumnFilterDropdown";
import { CollaboratorResponse } from "@/api/collaborator/collaborators.dto";
import { useState } from "react";
import { ColumnFilterListCheckbox } from "../ColumnFilterListCheckbox";

type Props = {
    filter: string[];
    setFilter: (values: string[]) => void;
    filteredCollaborators: CollaboratorResponse[];
};
export const ContractColumn = ({ filter, setFilter, filteredCollaborators }: Props) => {
    const [open, setOpen] = useState(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <div className="flex items-center space-x-1">
                    <span>Contrat</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                </div>
            </PopoverTrigger>
            <PopoverContent className="max-h-[250px] overflow-y-auto">
                <ColumnFilterListCheckbox
                    options={[{ label: "Contrat à durée indéterminée", value: "CDI" },
                    { label: "Contrat à durée déterminée", value: "CDD" },
                    { label: "Contrat d’apprentissage", value: "APP" },
                    { label: "Contrat de professionnalisation", value: "PRO" },
                    { label: "Convention de stage", value: "STA" },
                    { label: "Contrat de travail temporaire", value: "CTT" },
                    { label: "Contrat de travail intermittent", value: "CTI" },
                    { label: "Contrat unique d'insertion", value: "CUI" },
                    { label: "Contrat externe", value: "EXT" }]}
                    selectedValues={filter}
                    onChange={setFilter}
                    type="contract"
                />
            </PopoverContent>
        </Popover>
    );
};