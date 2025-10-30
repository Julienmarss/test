import CollaboratorChip from "@/components/CollaboratorChip";
import { Skeleton } from "@/components/ui/hero-ui/Skeleton";
import ActionList from "../action/ActionList";

export default function EventClientSkeleton() {
	return (
		<div className="m-10 flex w-full max-w-[896px] flex-col gap-8">
			<div className="flex w-full items-center justify-between">
				<Skeleton className="h-9 w-2/4 rounded-md" />
				<CollaboratorChip isLoading />
			</div>
			<ActionList isLoading />
		</div>
	);
}
