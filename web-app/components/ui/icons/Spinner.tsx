import React from "react";
import { Spinner } from "@heroui/react";

export const PageSpinner = () => {
	return (
		<div className="flex h-full w-full place-content-center">
			<Spinner color="primary" size="lg" />
		</div>
	);
};
