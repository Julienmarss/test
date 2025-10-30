import { FieldDto } from "@/api/event/events.dto";
import NumberInput from "@/components/ui/hero-ui/NumberInput";
import { useEffect, useMemo, useState } from "react";

export default function InputNumber({
	field,
	onChange,
}: {
	field: FieldDto;
	onChange: (id: string, value: number | null) => void;
}) {
	const initialNum = useMemo(() => {
		if (field.value == null || field.value === "") return null;
		const n = Number(String(field.value));
		return Number.isFinite(n) ? n : null;
	}, [field.value]);

	const [numValue, setNumValue] = useState<number | null>(initialNum);

	useEffect(() => {
		setNumValue(initialNum);
	}, [initialNum]);

	return (
		<NumberInput
			label={field.label}
			isRequired={field.validation?.required}
			className="w-full"
			value={numValue}
			onValueChange={(v) => {
				setNumValue(v ?? null);
				onChange(field.id, v ?? null);
			}}
			minValue={field.validation?.minimumNumber ?? undefined}
			maxValue={field.validation?.maximumNumber ?? undefined}
			step={1}
			placeholder={field.expectedFormat}
			formatOptions={{ maximumFractionDigits: 0, useGrouping: true }}
		/>
	);
}
