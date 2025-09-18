import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CollaboratorResponse } from "@/api/collaborator/collaborators.dto";
import { useState } from "react";
import { ColumnFilterListCheckbox } from "../ColumnFilterListCheckbox";

type Props = {
    collaborators: CollaboratorResponse[];
    filter: string[];
    setFilter: (values: string[]) => void;
    filteredCollaborators: CollaboratorResponse[];
};
export const FonctionColumn = ({ collaborators, filter, setFilter, filteredCollaborators }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <div className="flex items-center space-x-1">
                    <span>Fonction</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                </div>
            </PopoverTrigger>
            <PopoverContent className="max-h-[250px] overflow-y-auto">
                <ColumnFilterListCheckbox
                    title="Rechercher une fonction"
                    placeholder={"ex : Assistant RH"}
                    options={Array.from(
                        new Set(
                            collaborators
                                .map(c => c.professionalSituation?.jobTitle)
                                .filter((title): title is string => Boolean(title))
                        )
                    ).map(title => ({ label: title, value: title }))}
                    selectedValues={filter}
                    onChange={setFilter}
                    onReset={() => setFilter([])}
                    totalResults={filteredCollaborators.length}
                    onClose={() => setOpen(false)}
                />
            </PopoverContent>
        </Popover>
    );
};