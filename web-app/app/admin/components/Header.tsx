"use client";

import { ToggleSidebarButton } from "@/app/admin/components/ToggleSidebarButton";

export const Header = () => {
	return (
		<div className="sticky top-0 z-50 flex items-center bg-transparent p-4">
			<ToggleSidebarButton />
		</div>
	);
};
