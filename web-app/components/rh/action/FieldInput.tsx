"use client";

import { FieldDto } from "@/api/event/events.dto";
import { cn } from "@/utils/lib";
import InputDate from "./fields-input/InputDate";
import InputAmount from "./fields-input/InputAmount";
import InputNumber from "./fields-input/InputNumber";
import InputText from "./fields-input/InputText";
import InputSelection from "./fields-input/InputSelection";
import { PropsWithChildren } from "react";
import { FieldValue } from "@/utils/fieldValueFormat";
import InputBoolean from "./fields-input/InputBoolean";

type WrapperProps = PropsWithChildren<{ className?: string; help?: string }>;

function FieldWrapper({ className, help, children }: WrapperProps) {
	return (
		<div className={cn(className, "flex flex-col gap-2")}>
			{children}
			{help ? <p className="text-xs font-medium leading-5 tracking-normal text-gray-500">{help}</p> : null}
		</div>
	);
}

export default function FieldInput({
	field,
	onChange,
}: {
	field: FieldDto;
	onChange: (id: string, value: FieldValue) => void;
}) {
	const isLarge = field.fieldType === "AMOUNT";
	const help = field.businessRule ?? undefined;

	const commonClass = cn(isLarge ? "col-span-2" : "col-span-2 lg:col-span-1");

	switch (field.fieldType) {
		case "DATE":
			return (
				<FieldWrapper className={commonClass} help={help}>
					<InputDate field={field} onChange={onChange} />
				</FieldWrapper>
			);
		case "AMOUNT":
			return (
				<FieldWrapper className={commonClass} help={help}>
					<InputAmount field={field} onChange={onChange} />
				</FieldWrapper>
			);
		case "NUMBER":
			return (
				<FieldWrapper className={commonClass} help={help}>
					<InputNumber field={field} onChange={onChange} />
				</FieldWrapper>
			);
		case "BOOLEAN":
			return (
				<FieldWrapper className={commonClass} help={help}>
					<InputBoolean field={field} onChange={onChange} />
				</FieldWrapper>
			);
		case "SELECTION":
			return (
				<FieldWrapper className={commonClass} help={help}>
					<InputSelection field={field} onChange={onChange} />
				</FieldWrapper>
			);
		default:
			return (
				<FieldWrapper className={commonClass} help={help}>
					<InputText field={field} onChange={onChange} />
				</FieldWrapper>
			);
	}
}
