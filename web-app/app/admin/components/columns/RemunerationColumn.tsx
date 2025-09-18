import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CollaboratorResponse } from "@/api/collaborator/collaborators.dto";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { ActionButton } from "@/components/ui/buttons/ActionButton";
import { OutlineButton } from "@/components/ui/buttons/OutlineButton";
import * as Slider from "@radix-ui/react-slider";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
    filter: { min?: number; max?: number, order?: string };
    setFilter: (values: { min?: number; max?: number, order?: string }) => void;
    filteredCollaborators: CollaboratorResponse[];
};
export const RemunerationColumn = ({ filter, setFilter, filteredCollaborators }: Props) => {
    const [open, setOpen] = useState(false);

    const handleChange = (value: boolean, type: string) => {
        setFilter({ ...filter, order: type === "asc" && value ? "asc" : "desc" })
    }
    
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <div className="flex items-center space-x-1">
                    <span>Rémunération</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                        stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <section className="flex flex-row gap-2">
                    <Input type="amount"
                        placeholder={"0.00"}
                        label="Rém. mini"
                        value={filter.min}
                        onChange={(e) => setFilter({ ...filter, min: Number(e.target.value) })} />
                    <Input type="amount"
                        placeholder={"0.00"}
                        label="Rém. maxi"
                        value={filter.max}
                        onChange={(e) => setFilter({ ...filter, max: Number(e.target.value) })} />
                </section>

                <div className="mt-4 px-2">
                    <Slider.Root
                        className="relative flex items-center select-none touch-none w-full h-5"
                        min={0}
                        max={200000}
                        step={100}
                        value={[filter.min ?? 0, filter.max ?? 200000]}
                        onValueChange={([min, max]) => setFilter({ min, max })}
                    >
                        <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
                            <Slider.Range className="absolute bg-sky-600 rounded-full h-full" />
                        </Slider.Track>
                        <Slider.Thumb className="block w-4 h-4 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                        <Slider.Thumb className="block w-4 h-4 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                    </Slider.Root>
                </div>

                <div className="flex flex-col gap-3 mt-3">
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
                </div>

                <div className="mt-4 flex justify-between">
                    <OutlineButton
                        onClick={() => setFilter({ min: undefined, max: undefined })}>Réinitialiser</OutlineButton>
                    <ActionButton onClick={() => setOpen(false)}>{filteredCollaborators.length} Résultats</ActionButton>
                </div>
            </PopoverContent>
        </Popover>
    );
};