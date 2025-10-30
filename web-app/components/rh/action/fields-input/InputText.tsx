import { FieldDto } from "@/api/event/events.dto";
import { Input } from "@/components/ui/hero-ui/Input";
import { useEffect, useState } from "react";

export default function InputText({
	field,
	onChange,
}: {
	field: FieldDto;
	onChange: (id: string, value: string | null) => void;
}) {
	const [val, setVal] = useState(field.value ?? "");

	useEffect(() => {
		setVal(field.value ?? "");
	}, [field.value]);

	return (
		<Input
			label={field.label}
			value={val.toString()}
			onChange={(e) => {
				setVal(e.target.value);
				onChange(field.id, e.target.value ?? "");
			}}
			className="w-full"
			placeholder={field.expectedFormat ?? undefined}
			required={field.validation?.required}
		/>
	);
}
