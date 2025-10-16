import { ActionButton } from "@/components/ui/buttons/ActionButton";
import { Select } from "@/components/ui/Select";
import { OutlineButton } from "@/components/ui/buttons/OutlineButton";

type Option = { label: string; value: string };

type ColumnFilterDropdownProps = {
	title: string;
	placeholder: string;
	options: Option[];
	selectedValues: string[];
	onChange: (values: string[]) => void;
	onReset: () => void;
	onClose: () => void;
	totalResults: number;
};

export function ColumnFilterDropdown({
	title,
	placeholder,
	options,
	selectedValues,
	onChange,
	onReset,
	onClose,
	totalResults,
}: ColumnFilterDropdownProps) {
	return (
		<>
			<Select
				label={title}
				placeholder={placeholder}
				value={selectedValues}
				options={options}
				onChange={(newValues) => {
					onChange(newValues as string[]);
				}}
				multiple={true}
			/>

			<div className="mt-4 flex justify-between gap-x-4">
				<OutlineButton onClick={onReset}>Réinitialiser</OutlineButton>
				<ActionButton onClick={onClose}>{totalResults} Résultats</ActionButton>
			</div>
		</>
	);
}
