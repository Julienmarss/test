import { FieldDto } from "@/api/event/events.dto";
import { PageSpinner } from "@/components/ui/icons/Spinner";
import FieldInput from "./FieldInput";
import { FieldValue } from "@/utils/fieldValueFormat";

export default function ActionForm({
	fields,
	isLoading = false,
	onFieldChange,
}: {
	fields: FieldDto[];
	isLoading?: boolean;
	onFieldChange: (fieldId: string, newValue: FieldValue, fieldType?: FieldDto["fieldType"]) => void;
}) {
	if (isLoading) {
		return (
			<div className="col-span-2 min-h-60">
				<PageSpinner />
			</div>
		);
	}

	return fields.map((field) => (
		<FieldInput
			key={`field-${field.id}`}
			field={field}
			onChange={(id, val) => onFieldChange(id, val, field.fieldType)}
		/>
	));
}
