import { FieldDto } from "@/api/event/events.dto";
import { Select, SelectItem } from "@/components/ui/hero-ui/Select";
import { useEffect, useMemo, useState } from "react";
import type { Selection } from "@react-types/shared";

type OptionItem = { key: string; label: string };

const OPTION_LABELS: Record<string, Record<string, string>> = {
	ContractType: {
		CDI: "Contrat à durée indéterminée",
		CDD: "Contrat à durée déterminée",
		APP: "Contrat d'apprentissage",
		PRO: "Contrat de professionnalisation",
		STA: "Convention de stage",
		CTT: "Contrat de travail temporaire",
		CTI: "Contrat de travail intermittent",
		CUI: "Contrat unique d'insertion",
	},
	CollectiveBargainingAgreementType: {
		SYNTEC: "Syntec",
		OTHER: "Autre / Pas de CCN",
	},
	SendingMethod: {
		REGISTERED_MAIL: "Lettre recommandée AR",
		HAND_DELIVERY: "Remise en main propre",
	},
};

function resolveLabel(selectionType: string | undefined, key: string): string {
	const normalized = key.replace(/_/g, " ").toLowerCase();
	if (selectionType && OPTION_LABELS[selectionType]?.[key]) {
		return OPTION_LABELS[selectionType][key];
	}
	return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export default function InputSelection({
	field,
	onChange,
}: {
	field: FieldDto;
	onChange: (id: string, value: string | null) => void;
}) {
	const options: OptionItem[] = useMemo(() => {
		return (field.options ?? []).map((opt) => ({
			key: opt,
			label: resolveLabel(field.selectionType, opt),
		}));
	}, [field.options, field.selectionType]);

	const initial: Selection = useMemo(() => {
		const v = field.value as string | undefined;
		return v ? new Set([v]) : new Set([]);
	}, [field.value]);

	const [value, setValue] = useState<Selection>(initial);

	useEffect(() => {
		setValue(initial);
	}, [initial]);

	return (
		<Select
			items={options}
			selectedKeys={value}
			isRequired={field.validation?.required}
			onSelectionChange={(sel) => {
				setValue(sel);
				const v = Array.from(sel)[0] as string | undefined;
				onChange(field.id, v ?? null);
			}}
			label={field.label}
			className="w-full"
		>
			{(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
		</Select>
	);
}
