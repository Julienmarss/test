"use client";

import { HydrationBoundary } from "@tanstack/react-query";
import Providers from "@/components/utils/Providers";
import { ReactNode } from "react";

export default function HydratedQueryProvider({
	children,
	dehydratedState,
}: {
	children: ReactNode;
	dehydratedState: unknown;
}) {
	return (
		<Providers>
			<HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
		</Providers>
	);
}
