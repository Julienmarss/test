export const ROLE_OPTIONS = [
	{ value: "Dirigeant", label: "Dirigeant" },
	{ value: "RH", label: "Responsable RH" },
	{ value: "Juridique", label: "Juridique" },
	{ value: "Comptabilité", label: "Comptabilité" },
	{ value: "Expert-comptable", label: "Expert-comptable" },
	{ value: "RH Externe", label: "RH Externe" },
] as const;

export type RoleOption = { value: string; label: string };
