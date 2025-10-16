import { X } from "lucide-react";
import { useFilters } from "@/app/admin/components/table.service";
import { displayStatus, displayStatusCollaborator } from "@/app/admin/collaborator/collaborator.service";
import { StatusResponse, StatusResponseCollaborator } from "@/api/collaborator/collaborators.dto";

type Props = {
	filters: ReturnType<typeof useFilters>["filters"];
	setPartialFilter: ReturnType<typeof useFilters>["setPartialFilter"];
	resetFilters: ReturnType<typeof useFilters>["resetFilters"];
};
export const ActiveFilters = ({ filters, setPartialFilter, resetFilters }: Props) => {
	const hasFilters =
		filters.function.length > 0 ||
		filters.manager.length > 0 ||
		filters.contract.length > 0 ||
		filters.status.length > 0 ||
		filters.date.start !== undefined ||
		filters.date.end !== undefined ||
		filters.compensation.min !== undefined ||
		filters.compensation.max !== undefined;

	const renderBadge = (label: string, onRemove: () => void, key: string) => (
		<span
			key={key + "-" + label}
			className="flex items-center justify-center gap-1 rounded-full bg-sky-100 px-3 py-2 text-xs font-semibold leading-4 text-sky-900"
		>
			{label}
			<X className="h-4 w-4 cursor-pointer text-sky-400" onClick={onRemove} />
		</span>
	);
	if (!hasFilters) return null;

	return (
		<section className="flex flex-wrap items-center gap-3">
			<div className="h-6 w-px bg-gray-200" />
			{filters.function.map((fn) =>
				renderBadge(
					fn,
					() =>
						setPartialFilter(
							"function",
							filters.function.filter((v) => v !== fn),
						),
					"function",
				),
			)}

			{filters.manager.map((m) =>
				renderBadge(
					m,
					() =>
						setPartialFilter(
							"manager",
							filters.manager.filter((v) => v !== m),
						),
					"manager",
				),
			)}

			{filters.contract.map((c) =>
				renderBadge(
					c,
					() =>
						setPartialFilter(
							"contract",
							filters.contract.filter((v) => v !== c),
						),
					"contract",
				),
			)}

			{filters.status.map((s) =>
				renderBadge(
					displayStatusCollaborator(s as StatusResponseCollaborator),
					() =>
						setPartialFilter(
							"status",
							filters.status.filter((v) => v !== s),
						),
					"status",
				),
			)}

			{(filters.date.start || filters.date.end) &&
				renderBadge(
					`${filters.date.start?.toLocaleDateString() || "…"} - ${filters.date.end?.toLocaleDateString() || "…"}`,
					() => setPartialFilter("date", { ...filters.date, start: undefined, end: undefined, order: undefined }),
					"date",
				)}

			{(filters.compensation.min !== undefined || filters.compensation.max !== undefined) &&
				renderBadge(
					`${filters.compensation.min ?? "…"} € - ${filters.compensation.max ?? "…"} €`,
					() =>
						setPartialFilter("compensation", {
							...filters.compensation,
							min: undefined,
							max: undefined,
							order: undefined,
						}),
					"compensation",
				)}

			<span className="ml-2 cursor-pointer text-sm text-gray-500 underline" onClick={() => resetFilters()}>
				Réinitialiser
			</span>
		</section>
	);
};
