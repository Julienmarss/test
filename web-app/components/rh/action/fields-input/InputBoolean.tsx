import { FieldDto } from "@/api/event/events.dto";
import { RadioGroup, Radio } from "@/components/ui/hero-ui/RadioGroup";
import { useEffect, useState } from "react";

function toBool(v: unknown): boolean | null {
	if (v === true || v === "true") return true;
	if (v === false || v === "false") return false;
	return null;
}

function toStr(v: boolean | null): string {
	if (v === true) return "true";
	if (v === false) return "false";
	return "";
}

export default function InputBoolean({
	field,
	onChange,
}: {
	field: FieldDto;
	onChange: (id: string, value: boolean | null) => void;
}) {
	const [boolValue, setBoolValue] = useState<boolean | null>(toBool(field.value));

	useEffect(() => {
		setBoolValue(toBool(field.value));
	}, [field.value]);

	return (
		<RadioGroup
			label={field.label}
			orientation="horizontal"
			value={toStr(boolValue)}
			isRequired={field.validation?.required}
			onValueChange={(v) => {
				const nextBool = toBool(v);
				setBoolValue(nextBool);
				onChange(field.id, nextBool);
			}}
		>
			<Radio value="true">Oui</Radio>
			<Radio value="false">Non</Radio>
		</RadioGroup>
	);
}
