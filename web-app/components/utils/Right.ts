import { Right } from "@/api/company/right.api";

export function getSelectorOptionByRight(right: Right) {
    switch (right) {
        case "OWNER" :
            return [
                { key: "OWNER", label: "Propriétaire" },
                { key: "MANAGER", label: "Responsable" },
            ];
        case "MANAGER":
            return [
                { key: "MANAGER", label: "Responsable" },
            ];
        default: {
            break;
        }
    }
}