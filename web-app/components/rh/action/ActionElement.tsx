"use client";

import { ActionDto, ActionStatus } from "@/api/event/events.dto";
import { Button } from "@/components/ui/hero-ui/Button";
import { Skeleton } from "@/components/ui/hero-ui/Skeleton";
import { Check } from "@/components/ui/icons/Check";
import { cn } from "@/utils/lib";
import { usePathname, useRouter } from "next/navigation";

function mapStatus(state?: string | null): ActionStatus {
	if (!state) return ActionStatus.IN_PROGRESS;
	switch (state) {
		case "PENDING":
			return ActionStatus.PENDING;
		case "COMPLETED":
			return ActionStatus.COMPLETED;
		default:
			return ActionStatus.IN_PROGRESS;
	}
}

export default function ActionElement({
	action,
	index,
	isLoading = false,
}: {
	action?: ActionDto;
	index?: number;
	isLoading?: boolean;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const status = mapStatus(action?.state);

	return (
		<li className="flex w-full items-center gap-8 pl-8 [&>article]:last:border-b-0 [&>div>.first-stroke]:first:opacity-0 [&>div>.last-stroke]:last:opacity-0">
			<div className="flex h-[104px] flex-col items-center justify-between">
				<span className="first-stroke h-5 w-[1px] bg-gray-200"></span>
				{action && (
					<span
						className={cn(
							"flex h-12 w-12 items-center justify-center",
							"rounded-full bg-sky-50 p-3 text-base font-bold",
							"leading-6 tracking-normal text-sky-900",
							status === ActionStatus.PENDING && "bg-gray-100 text-gray-500",
							status === ActionStatus.COMPLETED && "bg-green-50 text-green-900",
						)}
					>
						{status === ActionStatus.COMPLETED ? <Check className="size-6" /> : index}
					</span>
				)}
				{isLoading && <Skeleton className="h-12 w-12 rounded-full" />}
				<span className="last-stroke h-5 w-[1px] bg-gray-200"></span>
			</div>
			<article className="flex w-full justify-between gap-8 border-b border-gray-200 py-8 pr-8">
				<header className="flex flex-col gap-1">
					<p className="text-xs font-medium leading-4 tracking-normal text-sky-600">Étape {index}</p>
					{action && <h2 className="text-sm font-medium leading-5 tracking-normal text-gray-900">{action.title}</h2>}
					{isLoading && <Skeleton className="h-5 w-80 rounded-md" />}
				</header>
				<Button
					isDisabled={status === ActionStatus.PENDING || isLoading}
					intent={status === ActionStatus.COMPLETED ? "outline" : "default"}
					isLoading={isLoading}
					onPress={() => router.push(`${pathname.replace(/\/$/, "")}/action/${action?.id}`)}
				>
					{status === ActionStatus.COMPLETED ? "Voir les détails" : "Valider l'étape"}
				</Button>
			</article>
		</li>
	);
}
