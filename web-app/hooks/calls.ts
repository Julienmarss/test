'use client';

import {useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions} from '@tanstack/react-query';
import {serviceClient} from "@/api/client.api";
import {AxiosResponse} from "axios";

// Types pour les options de query
export interface ApiQueryOptions<TData = any> extends Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'> {
    // Options additionnelles si nécessaire
}

// Types pour les options de mutation
export interface ApiMutationOptions<TData = any, TVariables = any> extends Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'> {
    method?: 'post' | 'put' | 'patch' | 'delete';
    invalidateQueries?: string[];
}

export const useApiQuery = <TData = any>(
    key: string | string[],
    endpoint: string,
    options: ApiQueryOptions<TData> = {}
) => {
    return useQuery({
        queryKey: Array.isArray(key) ? key : [key],
        queryFn: async () => {
            const { data } = await serviceClient.get(endpoint);
            return data;
        },
        ...options,
    });
};

export const useApiMutation = <TData = any, TVariables = any>(
    endpoint: string,
    options: ApiMutationOptions<TData, TVariables> = {}
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: TVariables): Promise<TData> => {
            const method = options.method || 'post';

            let response: AxiosResponse<TData>;

            switch (method) {
                case 'post':
                    response = await serviceClient.post(endpoint, data);
                    break;
                case 'put':
                    response = await serviceClient.put(endpoint, data);
                    break;
                case 'patch':
                    response = await serviceClient.patch(endpoint, data);
                    break;
                case 'delete':
                    response = await serviceClient.delete(endpoint);
                    break;
                default:
                    response = await serviceClient.post(endpoint, data);
            }

            return response.data;
        },
        onSuccess: (data, variables, context) => {
            // Invalider les queries reliées si spécifié
            if (options.invalidateQueries) {
                queryClient.invalidateQueries({
                    queryKey: options.invalidateQueries
                });
            }

            options.onSuccess?.(data, variables, context);
        },
        ...options,
    });
};