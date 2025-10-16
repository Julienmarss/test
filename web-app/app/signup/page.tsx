"use client";

import SignUpPage from "./signup-page";
import { Suspense } from "react";

export default function Page() {
	return (
		<Suspense>
			<SignUpPage />
		</Suspense>
	);
}
