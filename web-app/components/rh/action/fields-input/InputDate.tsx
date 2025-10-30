import { FieldDto } from "@/api/event/events.dto";
import DatePicker from "@/components/ui/hero-ui/DatePicker";
import { DateValue, parseDate } from "@internationalized/date";
import { useEffect, useMemo, useState } from "react";

function toIsoYMD(v: DateValue | null): string | null {
	if (!v) return null;
	const y = v.year.toString().padStart(4, "0");
	const m = v.month.toString().padStart(2, "0");
	const d = v.day.toString().padStart(2, "0");
	return `${y}-${m}-${d}`;
}

export default function InputDate({
	field,
	onChange,
}: {
	field: FieldDto;
	onChange: (id: string, value: string | null) => void;
}) {
	const initialDate: DateValue | null = useMemo(() => {
		if (!field.value) return null;
		return parseDate(String(field.value).slice(0, 10));
	}, [field.value]);

	const [dateValue, setDateValue] = useState<DateValue | null>(initialDate);

	useEffect(() => {
		setDateValue(initialDate);
	}, [initialDate]);

	return (
		<DatePicker
			label={field.label}
			isRequired={field.validation?.required}
			minValue={field.validation?.minimumDate ? parseDate(field.validation.minimumDate) : undefined}
			maxValue={field.validation?.maximumDate ? parseDate(field.validation.maximumDate) : undefined}
			value={dateValue}
			onChange={(v) => {
				setDateValue(v);
				onChange(field.id, toIsoYMD(v));
			}}
			className="w-full"
		/>
	);
}
