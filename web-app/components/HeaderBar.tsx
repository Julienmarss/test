import { cn } from "@/utils/lib";
import { ReactNode } from "react";

export default function HeaderBar({
	breadcrumb,
	searchbar,
	className,
}: {
	breadcrumb: ReactNode;
	searchbar: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("border-b border-slate-200 bg-white py-1 pl-6 pr-2", className)}>
			<div className="flex items-center">
				<div className="flex items-center space-x-2 text-xs text-slate-600">{breadcrumb}</div>
				<div className="mx-4 h-14 w-px bg-slate-200"></div>
				<div className="flex-1">{searchbar}</div>
			</div>
		</div>
	);
}
