import { ReactNode } from "react";
import { Button } from "../hero-ui/Button";
import CopilotRHLocked from "./CopilotRHLocked";
import { cn } from "@/utils/lib";
import { Envelope } from "../icons/Envelope";
import { Paper } from "../icons/Paper";
import { Calendar } from "../icons/Calendar";
import QuestionMarkCircle from "../icons/QuestionMarkCircle";
import UserPlus from "../icons/UserPlus";
import UserMinus from "../icons/UserMinus";

export type IconName = "envelope" | "paper" | "calendar" | "question" | "user-plus" | "user-minus";

export function mapIcon(name?: string): ReactNode {
	const key = (name ?? "").toLowerCase() as IconName;
	switch (key) {
		case "envelope":
			return <Envelope />;
		case "paper":
			return <Paper />;
		case "calendar":
			return <Calendar />;
		case "question":
			return <QuestionMarkCircle />;
		case "user-plus":
			return <UserPlus />;
		case "user-minus":
			return <UserMinus />;
		default:
			// Fallback
			return <Envelope />;
	}
}

export type AccentName = "green" | "blue" | "red" | "amber" | "violet" | "indigo" | "teal" | "gray";

export const ACCENT_STYLES_BY_NAME: Record<AccentName, { bg: string; text: string }> = {
	green: { bg: "bg-green-50", text: "text-green-900" },
	blue: { bg: "bg-blue-50", text: "text-blue-900" },
	red: { bg: "bg-red-50", text: "text-red-900" },
	amber: { bg: "bg-amber-50", text: "text-amber-900" },
	violet: { bg: "bg-violet-50", text: "text-violet-900" },
	indigo: { bg: "bg-indigo-50", text: "text-indigo-900" },
	teal: { bg: "bg-teal-50", text: "text-teal-900" },
	gray: { bg: "bg-gray-50", text: "text-gray-900" },
};

export function resolveAccent(name?: string): { bg: string; text: string } {
	const key = (name ?? "gray").toLowerCase() as AccentName;
	return ACCENT_STYLES_BY_NAME[key] ?? ACCENT_STYLES_BY_NAME.gray;
}

export default function ModalChoice({
	icon,
	title,
	subtitle,
	buttonLabel,
	onClick,
	isLoading = false,
	color = "gray",
	isLocked = false,
}: {
	icon: string;
	title: string;
	subtitle: string;
	buttonLabel: string;
	onClick: () => void;
	isLoading?: boolean;
	color?: string;
	isLocked?: boolean;
}) {
	const { bg, text } = resolveAccent(color);
	return (
		<div className="relative w-[20em]">
			<div
				className={cn(
					"flex flex-col items-center justify-center rounded-lg border bg-white p-6 text-center shadow-sm",
					isLocked && "bg-gray-50 bg-opacity-50 blur-sm",
				)}
			>
				<div className="mb-4">
					<div className={cn("rounded-lg p-3 [&_*]:size-7", bg, text)}>{mapIcon(icon)}</div>
				</div>
				<h3 className={cn("mb-2 text-sm font-medium text-gray-900", isLocked && "opacity-50")}>{title}</h3>
				<p className={cn("mb-4 h-[2lh] text-sm text-gray-500", isLocked && "opacity-50")}>{subtitle}</p>
				<Button onClick={onClick} isLoading={isLoading} isDisabled={isLocked} intent="outline">
					{buttonLabel}
				</Button>
			</div>
			{isLocked && <CopilotRHLocked title={title} />}
		</div>
	);
}
