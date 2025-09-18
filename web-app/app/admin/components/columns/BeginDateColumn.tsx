import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CollaboratorResponse } from "@/api/collaborator/collaborators.dto";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { parseDate } from "@/components/utils/date";
import { ActionButton } from "@/components/ui/buttons/ActionButton";
import { OutlineButton } from "@/components/ui/buttons/OutlineButton";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
    filter: { start?: Date; end?: Date, order?: string };
    setFilter: (values: { start?: Date; end?: Date, order?: string }) => void;
    filteredCollaborators: CollaboratorResponse[];
};
export const BeginDateColumn = ({ filter, setFilter, filteredCollaborators }: Props) => {
    const [open, setOpen] = useState(false);
    const [beginDate, setBeginDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleChange = (value: boolean, type: string) => {
        setFilter({ ...filter, order: type === "asc" && value ? "asc" : "desc" })
    }

    useEffect(() => {
        if (beginDate && parseDate(beginDate)) {
            setFilter({ ...filter, start: parseDate(beginDate) });
        }
    }, [beginDate]);

    useEffect(() => {
        if (endDate && parseDate(endDate)) {
            setFilter({ ...filter, end: parseDate(endDate) });
        }
    }, [endDate]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <div className="flex items-center space-x-1">
                    <span>Date de début</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                        stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <section className="flex flex-col gap-3" >
                    <div className="flex flex-row gap-2">
                        <Input
                            placeholder={"ex: JJ/MM/AAA"}
                            label="Date de début"
                            value={beginDate}
                            onChange={(e) => setBeginDate(e.target.value)} />
                        <Input
                            placeholder={"ex: JJ/MM/AAA"}
                            label="Date de fin"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <Separator className="bg-gray-200" />
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center">
                            <Checkbox className="text-white"
                                checked={filter?.order === "asc"}
                                onCheckedChange={(value) => handleChange(value as boolean, "asc")}
                            />
                            <span className="ml-2 text-sm text-gray-700">Ordre croissant</span>
                        </div>
                        <div className="flex items-center">
                            <Checkbox className="text-white"
                                checked={filter?.order === "desc"}
                                onCheckedChange={(value) => handleChange(value as boolean, "desc")}
                            />
                            <span className="ml-2 text-sm text-gray-700">Ordre décroissant</span>
                        </div>
                    </div>
                    <Separator className="bg-gray-200" />
                </section>
                <div className="mt-4 flex justify-between">
                    <OutlineButton onClick={() => setFilter({ start: undefined, end: undefined })}>Réinitialiser</OutlineButton>
                    <ActionButton onClick={() => setOpen(false)}>{filteredCollaborators.length} Résultats</ActionButton>
                </div>
            </PopoverContent>
        </Popover>
    );
};