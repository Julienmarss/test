"use client";
import { Eye } from "@/components/ui/icons/Eye";
import { EyeSlash } from "@/components/ui/icons/EyeSlash";
import { Input as HInput, type InputProps as HInputProps } from "@heroui/react";
import * as React from "react";

export const Input = React.forwardRef<HTMLInputElement, HInputProps>((props, ref) => {
	const { type, endContent, ...rest } = props;

	const isPassword = type === "password";
	const [isVisible, setIsVisible] = React.useState(false);
	const toggleVisibility = () => setIsVisible((v) => !v);

	const resolvedType = isPassword ? (isVisible ? "text" : "password") : type;

	const passwordToggle = isPassword && (
		<button
			type="button"
			onClick={toggleVisibility}
			aria-label={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
			className="focus:outline-none"
		>
			{isVisible ? (
				<Eye className="pointer-events-none size-5 text-default-400" />
			) : (
				<EyeSlash className="pointer-events-none size-5 text-default-400" />
			)}
		</button>
	);

	const mergedEndContent = isPassword ? (
		<div className="flex items-center gap-2">
			{endContent}
			{passwordToggle}
		</div>
	) : (
		endContent
	);

	return (
		<HInput
			ref={ref}
			variant="bordered"
			labelPlacement="outside"
			classNames={{
				inputWrapper:
					"border border-gray-200 bg-white rounded-md min-h-[36px] h-[36px] " +
					"!transition-all !duration-200 !ease-out " +
					"data-[hover=true]:border-gray-300 " +
					"data-[focus=true]:!border-sky-700 " +
					"data-[focus=true]:shadow-[0_0_0_4px_rgba(116,212,255,1)]",
				label: "-translate-y-[calc(100%_+_theme(fontSize.small)/2_+_20px)] text-gray-900 start-0 ",
				clearButton: "text-gray-400",
			}}
			type={resolvedType}
			endContent={mergedEndContent}
			{...rest}
		/>
	);
});
Input.displayName = "Input";
