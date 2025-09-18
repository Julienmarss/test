"use client"

import ReactSelect, {components, MultiValue, SingleValue} from "react-select";
import {AlertCircle} from "lucide-react";
import cn from "classnames";

type Option = {
    value: string;
    label: string;
};

type SelectProps = {
    label?: string;
    placeholder?: string;
    options: Option[];
    value?: string | string[];
    onChange: (value: string | string[]) => void;
    className?: string;
    classNameLabel?: string;
    help?: string;
    error?: string;
    disabled?: boolean;
    multiple?: boolean;
    isClearable?: boolean;
    isSearchable?: boolean;
    placement?: "auto" | "top" | "bottom";
};

const DropdownIndicator = (props: any) => (
    <components.DropdownIndicator {...props}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
             className="size-6 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"/>
        </svg>
    </components.DropdownIndicator>
);

const ClearIndicator = (props: any) => (
    <components.ClearIndicator {...props}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
             className="size-6 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
        </svg>
    </components.ClearIndicator>
);

export function Select({
                           label,
                           placeholder = "Sélectionnez une option",
                           options,
                           value,
                           onChange,
                           className,
                           classNameLabel,
                           help = "",
                           error,
                           disabled,
                           multiple = false,
                           isClearable = true,
                           isSearchable = false,
                           placement = "auto"
                       }: SelectProps) {
    const hasError = !!error;

    const selectedValue = multiple
        ? options.filter((opt) => (value as string[]).includes(opt.value))
        : options.find((opt) => opt.value === value);

    const handleChange = (
        selected: MultiValue<Option> | SingleValue<Option>
    ) => {
        if (multiple) {
            onChange((selected as MultiValue<Option>).map((opt) => opt.value));
        } else {
            onChange((selected as SingleValue<Option>)?.value ?? "");
        }
    };

    return (
        <div className="w-full">
            {label && (
                <label
                    className={cn("block text-sm font-medium text-gray-900 mb-1", classNameLabel)}
                >
                    {label}
                </label>
            )}

            <div className={cn("relative", className)}>
                <ReactSelect
                    isMulti={multiple}
                    isDisabled={disabled}
                    options={options}
                    value={selectedValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    unstyled
                    menuPlacement={placement}
                    noOptionsMessage={() => <span className="text-gray-400 text-sm">Aucune option disponible</span>}
                    classNames={{
                        control: ({ isFocused }) =>
                            cn(
                                "min-h-[40px] rounded-md text-sm border px-2 py-1 transition-colors bg-white",
                                hasError
                                    ? "border-red-500 focus:border-red-500 ring-red-300 ring-2"
                                    : isFocused
                                        ? "border-sky-600 ring-2 ring-sky-300"
                                        : "border-gray-300 hover:border-gray-400",
                                disabled && "bg-gray-100 cursor-not-allowed"
                            ),
                        menu: ({ placement }) =>
                            cn(
                                "bg-white border border-gray-200 rounded-md shadow-md z-50 text-sm",
                                placement === "top" ? "mb-1 bottom-full" : "mt-1 top-full"
                            ),
                        option: ({ isFocused, isSelected }) =>
                            cn(
                                "px-3 py-2 cursor-pointer text-sm min-h-[2em] text-sm",
                                isSelected ? "bg-sky-100 text-sky-800 font-medium" : "",
                                isFocused && !isSelected ? "bg-gray-100" : ""
                            ),
                        multiValue: () =>
                            "bg-sky-100 text-sky-800 rounded px-2 py-0.5 text-xs font-medium",
                        multiValueRemove: () =>
                            "text-sky-600 hover:text-sky-800 ml-1 cursor-pointer",
                        valueContainer: () => "flex gap-1 flex-wrap py-1",
                        placeholder: () => "text-gray-400",
                        input: () => "text-sm"
                    }}
                    isClearable={isClearable}
                    isSearchable={isSearchable}
                    components={{
                        DropdownIndicator,
                        ClearIndicator
                    }}
                />

                {hasError && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 z-10">
                        <AlertCircle size={16}/>
                    </div>
                )}
            </div>

            {hasError && <p className="mt-1 text-sm text-red-600">{error}</p>}

            {help && help.length > 0 && (
                <p className="mt-1 text-sm text-gray-500">{help}</p>
            )}
        </div>
    );
}

