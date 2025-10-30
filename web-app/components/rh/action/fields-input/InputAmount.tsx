import { FieldDto } from "@/api/event/events.dto";
import NumberInput from "@/components/ui/hero-ui/NumberInput";
import { useEffect, useMemo, useState } from "react";

function parseFrenchNumber(input: unknown): number | null {
	if (input == null || input === "") return null;
	const str = String(input)
		.replace(/\s/g, "")
		.replace(/\u202F/g, "")
		.replace(",", ".");
	const n = Number(str);
	return Number.isFinite(n) ? n : null;
}

export default function InputAmount({
	field,
	onChange,
}: {
	field: FieldDto;
	onChange: (id: string, value: number | null) => void;
}) {
	const initialAmount = useMemo(() => parseFrenchNumber(field.value), [field.value]);
	const [amountValue, setAmountValue] = useState<number | null>(initialAmount);

	useEffect(() => {
		setAmountValue(initialAmount);
	}, [initialAmount]);

	return (
		<NumberInput
			label={field.label}
			isRequired={field.validation?.required}
			className="w-full"
			placeholder={field.expectedFormat}
			value={amountValue ?? undefined}
			onValueChange={(v) => {
				setAmountValue(v ?? null);
				onChange(field.id, v ?? null);
			}}
			step={0.01}
			minValue={field.validation?.minimumAmount !== null ? field.validation?.minimumAmount : undefined}
			maxValue={field.validation?.maximumAmount !== null ? field.validation?.maximumAmount : undefined}
			formatOptions={{
				style: "currency",
				currency: "EUR",
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
				currencyDisplay: "symbol",
				useGrouping: true,
			}}
		/>
	);
}
