"use client";

import { useCollaborator } from "@/api/collaborator/collaborators.api";
import CollaboratorChip from "@/components/CollaboratorChip";
import { useSelectedCompany } from "@/components/utils/CompanyProvider";
import { useEvent } from "@/components/utils/EventProvider";
import { ReactNode } from "react";

export default function EventContainer({
	title,
	children,
	footer,
}: {
	title: string;
	children: ReactNode;
	footer: ReactNode;
}) {
	const { event } = useEvent();
	const { company } = useSelectedCompany();

	const { data: collaborator, isPending: isCollaboratorPending } = useCollaborator(
		company.id,
		String(event.collaboratorId),
	);

	return (
		<div className="h-full w-full">
			<div className="flex h-full max-h-[calc(100vh_-_147px)] w-full justify-center overflow-auto p-10 [scrollbar-gutter:stable]">
				<div className="flex w-full max-w-[896px] flex-col gap-8">
					<div className="flex w-full items-center justify-between">
						<h2 className="text-3xl font-semibold leading-9 tracking-normal text-gray-900">{title}</h2>
						<CollaboratorChip collaborator={collaborator} isLoading={isCollaboratorPending} />
					</div>
					{children}
				</div>
			</div>
			<div className="sticky bottom-0 flex w-full justify-center border border-slate-200 bg-white p-[14px]">
				<div className="flex w-full max-w-[896px] justify-end">{footer}</div>
			</div>
		</div>
	);
}
