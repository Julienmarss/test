import { ActionButton } from "@/components/ui/buttons/ActionButton";
import { OutlineButton } from "@/components/ui/buttons/OutlineButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/separator";
import { useMemo, useState } from "react";
import { getStatusColor, getStatusColorCollaborator } from "./table.service";
import { StatusResponse, StatusResponseCollaborator } from "@/api/collaborator/collaborators.dto";

type Option = { label: string; value: string }

type ColumnFilterListCheckboxProps = {
    title?: string
    placeholder?: string
    options: Option[]
    selectedValues: string[]
    onChange: (values: string[]) => void
    onReset?: () => void
    onClose?: () => void
    totalResults?: number
    type?: string;
}

export function ColumnFilterListCheckbox({
    title,
    placeholder,
    options,
    selectedValues,
    onChange,
    onReset,
    onClose,
    totalResults,
    type
}: ColumnFilterListCheckboxProps) {
    const [search, setSearch] = useState<string>("");

    const handleChange = (e: any) => {
        setSearch(e.target.value);
    }

    const handleChangeCheckbox = (value: string) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter((val) => val !== value))
        } else {
            onChange([...(selectedValues || []), value])
        }
    }

    const optionsFiltered = useMemo(() => {
        return options.filter(option =>
            option.label.toLowerCase().includes(search.toLowerCase())
        );
    }, [options, search]);
    return (
        <>
            <section className="flex flex-col gap-3">
                {title && placeholder &&
                    <>
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
                            <Input value={search} onChange={handleChange} placeholder={placeholder} />
                        </div>
                        <Separator className="bg-gray-200" />
                    </>
                }
                <div className="flex flex-col gap-4">
                    {optionsFiltered.map((option) => {
                        if (type === "status") {
                            return (
                                <div key={option.value} className="flex items-center justify-between">
                                    <div key={option.value} className="flex items-center">
                                        <Checkbox
                                            className="text-white mt-1"
                                            checked={selectedValues.includes(option.value)}
                                            onCheckedChange={() => handleChangeCheckbox(option.value)}
                                        />
                                        <span className="text-sm text-gray-700 ml-2">{option.label}</span>
                                    </div>
                                     <div className={`flex items-center ml-4 justify-center h-4 w-4 rounded-full border-4
                                            ${getStatusColorCollaborator(option.value as StatusResponseCollaborator).border}
                                        `}
                                    >
                                        <div
                                            className={`
                                                h-2
                                                w-2
                                                rounded-full
                                                ${getStatusColorCollaborator(option.value as StatusResponseCollaborator).bg}
                                            `}
                                        />  
                                    </div>
                                </div>
                            )
                        }
                        return (
                            <div key={option.value} className="flex items-start">
                                <Checkbox
                                    className="text-white mt-1"
                                    checked={selectedValues.includes(option.value)}
                                    onCheckedChange={() => handleChangeCheckbox(option.value)}
                                />
                                {type === "contract" ?
                                    <div className="flex flex-col ml-2">
                                        <span className="text-sm text-gray-700">{option.value}</span>
                                        <span className="text-xs text-gray-500">{option.label}</span>
                                    </div>
                                    : <span className="text-sm text-gray-700 ml-2">{option.label}</span>
                                }

                            </div>
                        )
                    })}
                </div>
                {title && <Separator className="bg-gray-200" />}
            </section>
            {onReset && onClose &&
                <div className="mt-4 flex gap-x-4 justify-between">
                    <OutlineButton onClick={onReset}>Réinitialiser</OutlineButton>
                    <ActionButton onClick={onClose}>{totalResults} Résultats</ActionButton>
                </div>}
        </>
    )
}
