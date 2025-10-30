import { FieldType } from "@/api/event/events.dto";

export type FieldValue = string | number | boolean | null;

export function toStableString(fieldType: FieldType, v: FieldValue): string {
	if (v == null || v === "") return "";
	switch (fieldType) {
		case "AMOUNT": {
			const n = typeof v === "number" ? v : Number(String(v).replace(",", "."));
			return Number.isFinite(n) ? n.toFixed(2) : "";
		}
		case "NUMBER": {
			const n = typeof v === "number" ? v : Number(String(v));
			return Number.isFinite(n) ? String(n) : "";
		}
		case "DATE":
			return String(v).slice(0, 10);
		case "SELECTION":
		default:
			return String(v);
	}
}
