import { cn } from "@/utils/lib";

import { AlertCircle } from "lucide-react";

type TextareaProps = {
	label?: string;
	placeholder?: string;
	className?: string;
	classNameLabel?: string;
	help?: string;
	error?: string;
	disabled?: boolean;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	required?: boolean;
};

export function Textarea({
	label,
	placeholder,
	className,
	classNameLabel,
	help = "",
	error,
	disabled,
	value,
	onChange,
	required = false,
}: TextareaProps) {
	const hasError = !!error;

	return (
		<div className="w-full">
			{label && (
				<label className={cn("mb-1 block text-sm font-medium text-gray-900", classNameLabel)}>
					{label} {required && <span className="text-red-500">*</span>}
				</label>
			)}

			<div className={`relative ${disabled ? "opacity-70" : ""}`}>
				<textarea
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					disabled={disabled}
					rows={4}
					className={cn(
						"w-full rounded-md border border-gray-300 p-2 text-sm focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:bg-gray-100",
						hasError && "border-red-500",
						className,
					)}
				/>

				{hasError && (
					<div className="absolute right-3 top-2 text-red-600">
						<AlertCircle size={16} />
					</div>
				)}
			</div>

			{hasError && <p className="mt-1 text-sm text-red-600">{error}</p>}

			{help && <p className="mt-1 text-sm text-gray-500">{help}</p>}

			{required && (
				<div className="mt-1 flex items-center gap-1">
					<span className="text-red-500">*</span>
					<p className="text-sm text-gray-500">Champ obligatoire</p>
				</div>
			)}
		</div>
	);
}
