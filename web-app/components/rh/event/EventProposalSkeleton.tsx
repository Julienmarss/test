import { Button } from "@/components/ui/hero-ui/Button";
import { Skeleton } from "@/components/ui/hero-ui/Skeleton";
import { Play } from "@/components/ui/icons/Play";
import { mapIcon, resolveAccent } from "@/components/ui/modal-choice/ModalChoice";
import { cn } from "@/utils/lib";

export default function EventProposalSkeleton({ icon, color }: { icon: string; color: string }) {
	const { bg, text } = resolveAccent(color);

	return (
		<div className="flex items-center justify-between border-b border-gray-100 bg-white px-8 py-6 first:rounded-t-xl last:rounded-b-xl last:border-b-0">
			<div className="flex w-full gap-8">
				<div className={cn("rounded-lg p-3 [&_*]:size-7", bg, text)}>{mapIcon(icon)}</div>
				<div className="flex w-full flex-col gap-1">
					<Skeleton className="h-5 w-1/3 rounded-full" />
					<Skeleton className="h-5 w-1/2 rounded-full" />
				</div>
			</div>
			<Button intent="outline" isLoading endContent={<Play className="size-5" />} isDisabled>
				Commencer
			</Button>
		</div>
	);
}
