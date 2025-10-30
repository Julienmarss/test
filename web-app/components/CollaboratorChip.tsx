"use client";

import { CollaboratorResponse } from "@/api/collaborator/collaborators.dto";
import { getStatusBorderColor } from "@/app/(app)/admin/components/table.service";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/hero-ui/Skeleton";

export default function CollaboratorChip({
	collaborator,
	isLoading = false,
}: {
	collaborator?: CollaboratorResponse;
	isLoading?: boolean;
}) {
	const router = useRouter();

	if (!collaborator || isLoading) {
		return <Skeleton className="h-7 w-36 rounded-full" />;
	}

	return (
		<button
			type="button"
			onClick={() => router.push(`/admin/collaborator/${collaborator.id}`)}
			className="flex h-7 cursor-pointer items-center justify-start gap-1 rounded-full border border-gray-200 bg-white pl-1 pr-2 transition hover:bg-gray-100"
		>
			{collaborator.picture && collaborator.picture.length > 0 ? (
				<img
					src={collaborator.picture}
					alt={collaborator.firstname + " " + collaborator.lastname}
					className={`h-[19px] w-[19px] rounded-full ${getStatusBorderColor(collaborator?.status)}`}
				/>
			) : (
				<div
					className={`flex h-[19px] w-[19px] items-center justify-center rounded-full border border-green-300 bg-blue-100 text-blue-700 ${getStatusBorderColor(collaborator?.status)}`}
				>
					<p className={`!text-[8px] font-semibold !leading-[8px] tracking-normal`}>
						{collaborator.firstname.charAt(0).toUpperCase()}
						{collaborator.lastname.charAt(0).toUpperCase()}
					</p>
				</div>
			)}
			<p className="text-xs font-semibold">
				{collaborator.firstname} {collaborator.lastname.toUpperCase()}
			</p>
		</button>
	);
}
