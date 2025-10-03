import { useState, useCallback } from "react";
import { StatusResponse, StatusResponseCollaborator } from "@/api/collaborator/collaborators.dto";

export type Filters = {
    name?: string;
    function: string[];
    manager: string[];
    contract: string[];
    status: string[];
    date: { start?: Date; end?: Date, order?: string };
    compensation: { min?: number; max?: number, order?: string };
};

const initialFilters: Filters = {
    name: undefined,
    function: [],
    manager: [],
    contract: [],
    status: [],
    date: { start: undefined, end: undefined, order: undefined },
    compensation: { min: undefined, max: undefined, order: undefined },
};

export function useFilters(defaults: Partial<Filters> = {}) {
    const [filters, setFilters] = useState<Filters>({ ...initialFilters, ...defaults });

    const setPartialFilter = useCallback(
        <K extends keyof Filters>(key: K, value: Filters[K]) => {
            const filterValues = key === "name"
                ? {
                    ...filters,
                    date: { ...filters.date, order: undefined },
                    compensation: { ...filters.compensation, order: undefined }
                }
                : key === "date" && (value as { start?: Date; end?: Date, order?: string })?.order
                    ? {
                        ...filters,
                        name: undefined,
                        compensation: { ...filters.compensation, order: undefined }
                    }
                    : key === "compensation" && (value as { min?: number; max?: number, order?: string })?.order
                        ? {
                            ...filters,
                            name: undefined,
                            date: { ...filters.date, order: undefined }
                        }
                        : { ...filters };

            setFilters({ ...filterValues, [key]: value });
        },
        [filters]
    );

    const resetFilters = () => {
        setFilters({ ...initialFilters });
    };

    return {
        filters,
        setPartialFilter,
        resetFilters,
    };
}

export const getStatusColor = (status?: StatusResponse) => {
    switch (status) {
        case 'ACTIVE':
            return 'bg-green-500';
        case 'EXTERNAL':
            return 'bg-blue-500';
        case 'EX_COLLABORATOR':
            return 'bg-gray-500';
        case 'FOLLOW_UP':
            return 'bg-orange-500';
        case 'SENSITIVE':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
};

export const getStatusColorCollaborator = (status?: StatusResponseCollaborator) => {
  switch (status) {
    case 'ACTIVE':
      return { bg: 'bg-green-500', border: 'border-green-500/20' };
    case 'IN_PROGRESS':
      return { bg: 'bg-[#F54A00]', border: 'border-[#F54A00]/20' };
    case 'RELEASE_IN_PROGRESS':
      return { bg: 'bg-[#E7000B]', border: 'border-[#E7000B]/20' };
    case 'EXTERNAL':
      return { bg: 'bg-[#155DFC]', border: 'border-[#155DFC]/20' };
    case 'INACTIVE':
      return { bg: 'bg-[#99A1AF]', border: 'border-[#99A1AF]/20' };
    default:
      return { bg: 'bg-[#99A1AF]', border: 'border-[#99A1AF]/20' };
  }
};


export const getStatusBorderColor = (status?: StatusResponse) => {
    switch (status) {
        case 'ACTIVE':
            return 'border border-green-700';
        case 'EXTERNAL':
            return 'border border-blue-700';
        case 'EX_COLLABORATOR':
            return 'border border-gray-700';
        case 'FOLLOW_UP':
            return 'border border-orange-700';
        case 'SENSITIVE':
            return 'border border-red-700';
        default:
            return 'border border-gray-700';
    }
};