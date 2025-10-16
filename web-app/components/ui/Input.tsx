import { ChangeEventHandler, useEffect, useState } from "react";
import { AlertCircle, ChevronDown, Copy, Euro, Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/lib";
import { countries } from "@/utils/countries";

type InputType = "text" | "password" | "tel" | "email" | "search" | "date" | "number" | "amount";

interface InputFieldProps {
	label?: string;
	placeholder: string;
	className?: string;
	classNameLabel?: string;
	help?: string;
	error?: string;
	disabled?: boolean;
	value?: string | number;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	type?: InputType;
	showCopy?: boolean;
	required?: boolean;
	setInputValue?: (value: string) => void;
}

export const isValidDateFormat = (value?: string): boolean => {
	if (!value) {
		return false;
	}
	return /^([0-2]\d|3[0-1])\/(0\d|1[0-2])\/\d{4}$/.test(value);
};

export function Input({
	label,
	placeholder,
	className,
	classNameLabel,
	help = "",
	error,
	disabled,
	value,
	onChange,
	setInputValue,
	type = "text",
	showCopy = false,
	required = false,
}: InputFieldProps) {
	const [focused, setFocused] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState(countries[15]);
	const [showCountryMenu, setShowCountryMenu] = useState(false);

	const isTel = type === "tel";
	const isSearch = type === "search";
	const isPassword = type === "password";
	const isAmount = type === "amount";
	const hasError = !!error;
	const inputType = isPassword ? (showPassword ? "text" : "password") : type;

	useEffect(() => {
		if (!isTel || typeof value !== "string") return;

		if (isTel) {
			const match = value.match(/\(\+(\d{1,4})\)/);
			if (match) {
				const dialCode = `(+${match[1]})`;
				const matchCountry = countries.find((c) => c.dialCode === dialCode);
				if (matchCountry) {
					setSelectedCountry(matchCountry);
				}
			}
		}
	}, [value]);

	const baseClasses =
		"w-full px-3 py-2 text-sm rounded-md border transition bg-white placeholder-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100";

	const borderColor = hasError
		? "border-red-500 focus:border-red-500"
		: focused
			? "border-sky-600 ring-2 ring-sky-300"
			: "border-gray-300 hover:border-gray-400 focus:border-sky-600";

	return (
		<div className="w-full">
			{label && label.length > 0 && (
				<label className={cn("mb-1 block text-sm font-medium text-gray-900", classNameLabel)}>
					{label} {required && <span className="text-red-500">*</span>}
				</label>
			)}

			<div
				className={`relative flex items-center ${disabled ? "opacity-70" : ""}`}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
			>
				{/* Country code selector */}
				{isTel && (
					<div className="absolute left-2 flex h-full items-center">
						<button
							type="button"
							className="flex items-center gap-1 px-1 text-sm text-gray-700 hover:text-black focus:outline-none"
							onClick={() => {
								setInputValue && setInputValue(`${selectedCountry.dialCode} `);
								setShowCountryMenu((prev) => !prev);
							}}
						>
							<span>{selectedCountry.emoji}</span>
							<ChevronDown size={14} />
						</button>
						{showCountryMenu && (
							<div className="absolute left-0 top-full z-10 mt-1 max-h-40 w-28 overflow-y-auto rounded border bg-white shadow-lg">
								{countries.map((country) => (
									<button
										key={country.code}
										className="w-full px-2 py-1 text-left text-sm hover:bg-gray-100"
										onClick={() => {
											setSelectedCountry(country);
											setShowCountryMenu(false);
											setInputValue && setInputValue(`${country.dialCode} `);
										}}
									>
										{country.emoji} {country.dialCode}
									</button>
								))}
							</div>
						)}
					</div>
				)}
				{isSearch && (
					<div className="absolute left-2 flex h-full items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-4"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>
					</div>
				)}

				<input
					type={inputType === "amount" ? "number" : inputType}
					placeholder={placeholder}
					disabled={disabled}
					value={value ?? ""}
					onChange={onChange}
					className={cn(
						`${baseClasses} ${borderColor} ${
							isTel ? "pl-16" : isSearch ? "pl-8" : isAmount ? "pr-6" : ""
						} ${isPassword || showCopy ? "pr-10" : ""}`,
						className,
					)}
				/>

				{/* Password toggle */}
				{isPassword && (
					<button
						type="button"
						onClick={() => setShowPassword((prev) => !prev)}
						className="absolute right-3 text-gray-500 hover:text-gray-700"
					>
						{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
					</button>
				)}

				{/* Copy button */}
				{showCopy && !isPassword && (
					<button
						type="button"
						onClick={() => navigator.clipboard.writeText(`${value}` || "")}
						className="absolute right-3 text-gray-500 hover:text-gray-700"
					>
						<Copy size={16} />
					</button>
				)}

				{/* Error icon */}
				{hasError ? (
					<div className="absolute right-2 text-red-500">
						<AlertCircle size={16} />
					</div>
				) : (
					isAmount && (
						<div className="absolute right-2 text-slate-400">
							<Euro size={14} />
						</div>
					)
				)}
			</div>

			{hasError && <p className="mt-1 text-sm text-red-600">{error}</p>}

			{help && help.length > 0 && <p className="mt-1 text-sm text-gray-500">{help}</p>}

			{required && (
				<div className="mt-1 flex items-center gap-1">
					<span className="text-red-500">*</span> <p className="text-sm text-gray-500">Champ obligatoire</p>
				</div>
			)}
		</div>
	);
}
