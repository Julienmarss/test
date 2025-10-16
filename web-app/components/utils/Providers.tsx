"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HeroUIProvider } from "@heroui/react";

export default function Providers({ children }: { children: ReactNode }) {
	const router = useRouter();
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
						retry: 3,
					},
				},
			}),
	);

	useEffect(() => {
		const handleUnauthorized = () => {
			// Nettoyer le cache avant de rediriger
			queryClient.clear();
			router.push("/signin");
		};

		window.addEventListener("unauthorized", handleUnauthorized);

		return () => {
			window.removeEventListener("unauthorized", handleUnauthorized);
		};
	}, [router, queryClient]);

	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>
				<HeroUIProvider>
					{children}
					{/*<ReactQueryDevtools initialIsOpen={false} />*/}
				</HeroUIProvider>
			</QueryClientProvider>
		</SessionProvider>
	);
}
