import axios, { AxiosRequestConfig } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const serviceClientNonAuthentifie = axios.create({
	baseURL: process.env.NEXT_PUBLIC_SERVICE_URL!,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

const serviceClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_SERVICE_URL!,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

interface ServerApiOptions<T = any> extends AxiosRequestConfig {
	requireAuth?: boolean;
	redirectOnAuth?: boolean;
	customErrorHandler?: (error: any) => T | void | never;
	baseURL?: string;
}

export async function serverApiCall<T = any>(endpoint: string, options: ServerApiOptions<T> = {}): Promise<T> {
	const {
		requireAuth = true,
		redirectOnAuth = true,
		customErrorHandler,
		method = "GET",
		baseURL = process.env.NEXT_PUBLIC_SERVICE_URL!,
		...axiosOptions
	} = options;

	// Vérification d'authentification
	if (requireAuth) {
		const session = await getServerSession(authOptions);

		if (!session || !session.accessToken || !session.user?.id) {
			if (redirectOnAuth) {
				redirect("/signin");
			}
			throw new Error("Unauthorized");
		}

		// Ajouter le token aux headers si disponible
		if (session.accessToken) {
			axiosOptions.headers = {
				...axiosOptions.headers,
				Authorization: `Bearer ${session.accessToken}`,
			};
		}
	}

	// Configuration Axios avec baseURL
	const config = {
		...axiosOptions,
		baseURL,
	};

	try {
		let response;

		switch (method.toUpperCase()) {
			case "GET":
				response = await serviceClient.get(endpoint, config);
				break;
			case "POST":
				response = await serviceClient.post(endpoint, config.data, config);
				break;
			case "PUT":
				response = await serviceClient.put(endpoint, config.data, config);
				break;
			case "PATCH":
				response = await serviceClient.patch(endpoint, config.data, config);
				break;
			case "DELETE":
				response = await serviceClient.delete(endpoint, config);
				break;
			default:
				throw new Error(`Unsupported method: ${method}`);
		}

		return response.data;
	} catch (error: any) {
		console.error(`API Error [${method} ${baseURL}${endpoint}]:`, error);

		// Gestion d'erreur personnalisée
		if (customErrorHandler) {
			const result = customErrorHandler(error);
			// Si le handler retourne quelque chose, on le retourne
			if (result !== undefined) {
				return result;
			}
			// Si le handler ne retourne rien, on assume qu'il veut throw
			// donc on continue avec la gestion par défaut
		}

		// Gestion d'erreur par défaut
		if (error?.response?.status === 401 && redirectOnAuth) {
			redirect("/signin");
		}

		// Re-throw l'erreur pour que le composant puisse la gérer
		throw error;
	}
}

export const serverGet = <T = any>(endpoint: string, options?: ServerApiOptions<T>): Promise<T> =>
	serverApiCall<T>(endpoint, { ...options, method: "GET" });

export const serverPost = <T = any>(endpoint: string, data?: any, options?: ServerApiOptions<T>): Promise<T> =>
	serverApiCall<T>(endpoint, { ...options, method: "POST", data });

export const serverPut = <T = any>(endpoint: string, data?: any, options?: ServerApiOptions<T>): Promise<T> =>
	serverApiCall<T>(endpoint, { ...options, method: "PUT", data });

export const serverPatch = <T = any>(endpoint: string, data?: any, options?: ServerApiOptions<T>): Promise<T> =>
	serverApiCall<T>(endpoint, { ...options, method: "PATCH", data });

export const serverDelete = <T = any>(endpoint: string, options?: ServerApiOptions<T>): Promise<T> =>
	serverApiCall<T>(endpoint, { ...options, method: "DELETE" });

export const getCurrentUser = async () => {
	const session = await getServerSession(authOptions);
	return session?.user;
};

export { serviceClient, serviceClientNonAuthentifie };
