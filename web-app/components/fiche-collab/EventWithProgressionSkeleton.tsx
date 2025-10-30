import { Button } from "../ui/hero-ui/Button";
import { Skeleton } from "../ui/hero-ui/Skeleton";

export default function EventWithProgressionSkeleton() {
	return (
		<section className="flex w-full items-center justify-between gap-5 border-x border-t border-gray-100 bg-white px-5 py-6 first:rounded-t-lg last:rounded-b-lg last:border-b odd:bg-gray-50">
			<Skeleton className="size-11 rounded-full" />
			<div className="flex flex-1 flex-col gap-1">
				<Skeleton className="h-4 w-1/3 rounded-lg" />
				<Skeleton className="h-4 w-1/2 rounded-lg" />
			</div>
			<Button intent="outline" isLoading>
				Accéder à la page
			</Button>
		</section>
	);
}
