import {X} from "lucide-react";
import {useFilters} from "@/app/admin/components/table.service";
import {displayStatus, displayStatusCollaborator} from "@/app/admin/collaborator/collaborator.service";
import {StatusResponse, StatusResponseCollaborator} from "@/api/collaborator/collaborators.dto";

type Props = {
    filters: ReturnType<typeof useFilters>["filters"];
    setPartialFilter: ReturnType<typeof useFilters>["setPartialFilter"];
    resetFilters: ReturnType<typeof useFilters>["resetFilters"];
};
export const ActiveFilters = ({filters, setPartialFilter, resetFilters}: Props) => {
    const hasFilters =
        filters.function.length > 0 ||
        filters.manager.length > 0 ||
        filters.contract.length > 0 ||
        filters.status.length > 0 ||
        filters.date.start !== undefined ||
        filters.date.end !== undefined ||
        filters.compensation.min !== undefined ||
        filters.compensation.max !== undefined;

    const renderBadge = (label: string, key: string) => (
        <span
            key={key}
            className="bg-sky-100 text-gray-800 text-sm px-3 py-1 rounded-full flex items-center justify-center gap-1"
        >
            {label}
            <X className="w-5 h-5 text-sky-400 cursor-pointer" onClick={() => setPartialFilter(key as any, [])}/>
        </span>
    );

    return (
        <section>
            {hasFilters && (
                <section className="flex flex-wrap gap-2 items-center">
                    {filters.function.map((fn) => renderBadge(fn, `function`))}
                    {filters.manager.map((m) => renderBadge(m, `manager`))}
                    {filters.contract.map((c) => renderBadge(c, `contract`))}
                    {filters.status.map((s) => renderBadge(displayStatusCollaborator(s as StatusResponseCollaborator), `status`))}

                    {(filters.date.start || filters.date.end) &&
                        renderBadge(
                            `${filters.date.start?.toLocaleDateString() || "…"} - ${filters.date.end?.toLocaleDateString() || "…"}`,
                            "date"
                        )}

                    {(filters.compensation.min !== undefined || filters.compensation.max !== undefined) &&
                        renderBadge(
                            `${filters.compensation.min ?? "…"} € - ${filters.compensation.max ?? "…"} €`,
                            "compensation"
                        )}

                    <span
                        className="text-sm text-gray-500 underline cursor-pointer ml-2"
                        onClick={() => resetFilters()}
                    >
                        Réinitialiser
                    </span>
                </section>
            )}
        </section>
    );
};