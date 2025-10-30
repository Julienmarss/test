import { Tooltip } from "@/components/ui/hero-ui/Tooltip";
import { ReactNode } from "react";

export default function UnavailableTooltip({
	children,
	content,
	hideTooltip,
}: {
	children: ReactNode;
	content: string;
	hideTooltip: boolean;
}) {
	return (
		<Tooltip content={content} className={hideTooltip && "hidden"}>
			<div>{children}</div>
		</Tooltip>
	);
}
