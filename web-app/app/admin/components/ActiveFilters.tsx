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

    const renderBadge = (label: string, onRemove: () => void, key: string) => (
        <span
            key={key + "-" + label}
            className="bg-sky-100 text-sky-900 text-xs leading-4 font-semibold px-3 py-2 rounded-full flex items-center justify-center gap-1"
        >
            {label}
            <X className="w-4 h-4 text-sky-400 cursor-pointer" onClick={onRemove}/>
        </span>
    );
    if(!hasFilters) return null;

    return  (
        <section className="flex flex-wrap gap-3 items-center">

            <div className="w-px h-6 bg-gray-200" />
            {filters.function.map((fn) =>
                renderBadge(fn, () => setPartialFilter("function", filters.function.filter(v => v !== fn)), "function")
            )}

            {filters.manager.map((m) =>
                renderBadge(m, () => setPartialFilter("manager", filters.manager.filter(v => v !== m)), "manager")
            )}

            {filters.contract.map((c) =>
                renderBadge(c, () => setPartialFilter("contract", filters.contract.filter(v => v !== c)), "contract")
            )}

            {filters.status.map((s) =>
                renderBadge(
                    displayStatusCollaborator(s as StatusResponseCollaborator),
                    () => setPartialFilter("status", filters.status.filter(v => v !== s)),
                    "status"
                )
            )}

            {(filters.date.start || filters.date.end) &&
                renderBadge(
                    `${filters.date.start?.toLocaleDateString() || "…"} - ${filters.date.end?.toLocaleDateString() || "…"}`,
                    () => setPartialFilter("date", { ...filters.date, start: undefined, end: undefined, order: undefined }),
                    "date"
                )
            }

            {(filters.compensation.min !== undefined || filters.compensation.max !== undefined) &&
                renderBadge(
                    `${filters.compensation.min ?? "…"} € - ${filters.compensation.max ?? "…"} €`,
                    () => setPartialFilter("compensation", { ...filters.compensation, min: undefined, max: undefined, order: undefined }),
                    "compensation"
                )
            }


            <span
                className="text-sm text-gray-500 underline cursor-pointer ml-2"
                onClick={() => resetFilters()}
            >
                Réinitialiser
            </span>
        </section>
    );
};