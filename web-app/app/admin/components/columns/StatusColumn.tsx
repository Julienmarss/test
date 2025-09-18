import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ColumnFilterDropdown } from "@/app/admin/components/ColumnFilterDropdown";
import { CollaboratorResponse } from "@/api/collaborator/collaborators.dto";
import { useState } from "react";
import { displayStatus, toStatus } from "@/app/admin/collaborator/collaborator.service";
import { ColumnFilterListCheckbox } from "../ColumnFilterListCheckbox";

type Props = {
    collaborators: CollaboratorResponse[];
    filter: string[];
    setFilter: (values: string[]) => void;
    filteredCollaborators: CollaboratorResponse[];
};
export const StatusColumn = ({ collaborators, filter, setFilter, filteredCollaborators }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <div className="flex items-center space-x-1">
                    <span>Statut</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                        stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <ColumnFilterListCheckbox
                    options={[{ label: "Actif", value: "ACTIVE" },
                    { label: "Action en cours", value: "IN_PROGRESS" },
                    { label: "Sortie en cours", value: "RELEASE_IN_PROGRESS" },
                    { label: "Externe", value: "EXTERNAL" },
                    { label: "Inactif", value: "INACTIVE" },
                    ]}
                    selectedValues={filter}
                    onChange={setFilter}
                    type="status"
                />
            </PopoverContent>
        </Popover>
    );
};