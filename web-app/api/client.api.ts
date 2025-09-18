'use client';

import axios from 'axios';
import {getSession, signOut} from 'next-auth/react';
import {toast} from "@/hooks/use-toast";

const serviceClientNonAuthentifie = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVICE_URL!,
    headers: {
        'Content-Type': 'application/json',
    },
});

serviceClientNonAuthentifie.interceptors.response.use(
    (response) => response,
    async (error) => {
        return Promise.reject(error.response.data);
    }
);

const serviceClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVICE_URL!,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({resolve, reject}) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });

    failedQueue = [];
};

export type ServiceError = {
    title: string;
    message: string;
    status: number;
    uri: string;
};

export function isServiceError(error: unknown): error is ServiceError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'title' in error &&
        'message' in error
    );
}

// Intercepteur pour ajouter le token automatiquement
serviceClient.interceptors.request.use(
    async (config) => {
        try {
            const session = await getSession();

            if (session?.accessToken) {
                // Si l'expiration est définie
                config.headers.Authorization = `Bearer ${session.accessToken}`;
            }

            return config;
        } catch (error) {
            console.error('Error getting session:', error);
            return config;
        }
    },
    (error) => Promise.reject(error)
);

// Intercepteur pour logging côté client
serviceClient.interceptors.request.use(
    (config) => {
        console.log(`[CLIENT] Calling: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur pour gestion d'erreurs avec retry et refresh
serviceClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Si un refresh est déjà en cours, attendre
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                }).then(() => {
                    return serviceClient(originalRequest);
                }).catch(err => {
                    signOut({callbackUrl: '/signin'});
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Essayer de récupérer une nouvelle session
                const session = await getSession();

                if (session?.accessToken) {
                    originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
                    processQueue(null, session.accessToken);
                    return serviceClient(originalRequest);
                } else {
                    // Session expirée, déconnecter
                    await signOut({callbackUrl: '/signin'});
                    processQueue(new Error('Session expired'), null);
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                processQueue(refreshError, null);
                await signOut({callbackUrl: '/signin'});
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }

        // Autres codes d'erreur
        if (error.response?.status === 403) {
            console.error('[CLIENT] Access forbidden');
            // Optionnel: rediriger vers une page d'erreur
            window.location.href = '/signin';
        }

        if (error.response?.status >= 500 || error.response?.status >= 400) {
            console.error('[CLIENT] Server error:', error.response?.status, error.response.data.title, error.response.data.message);
            toast({
                title: error.response.data.title,
                description: error.response.data.message,
                variant: 'destructive',
            });
        }

        return Promise.reject(error.response.data);
    }
);

export {serviceClient, serviceClientNonAuthentifie};