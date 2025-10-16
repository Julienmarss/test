import { cn } from "@/utils/lib";

export default function AccordionSubtitle({ className, children }: { className?: string; children: React.ReactNode }) {
	return <p className={cn("m-0 p-0 pb-4 text-xs text-sky-600", className)}>{children}</p>;
}
