import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight, Copy } from "lucide-react";
import { getCode, getSeniority, SERVICES } from "@/app/admin/collaborator/collaborator.service";
import React, { useState } from "react";
import { cn } from "@/utils/lib";
import { copyToClipboard } from "@/components/utils/user-actions";
import { CollaboratorResponse } from "@/api/collaborator/collaborators.dto";
import ViewCollaboratorIntern from "./ViewCollaboratorIntern";
import ViewCollaboratorExtern from "./ViewCollaboratorExtern";
import "./ViewCollaborator.scss";

type Props = {
	collaborator: CollaboratorResponse;
};

export const InfoField = ({
	label,
	value,
	copyable = true,
	isAmount = false,
	className,
}: {
	label: string;
	value?: string | number;
	copyable?: boolean;
	isAmount?: boolean;
	className?: string;
}) => {
	const [isSpinning, setIsSpinning] = useState(false);

	const handleCopy = () => {
		copyToClipboard(String(value));
		setIsSpinning(true);

		// retirer la classe après la durée de l'animation
		setTimeout(() => setIsSpinning(false), 600);
	};

	return (
		<div
			className={cn(
				"grid grid-cols-2 items-center gap-x-1 border-b border-slate-100 px-2 py-4 last:border-b-0 odd:bg-gray-50",
				className,
			)}
		>
			<span className="text-sm text-slate-600">{label}</span>
			<div className="flex min-w-0 items-center justify-between space-x-2">
				<div className="flex flex-row gap-x-2 truncate">
					{label === "Nationalité" && value && typeof value === "string" && (
						<div className="flex items-center gap-2">
							<img
								src={`https://flagcdn.com/w40/${getCode(value)?.toLowerCase()}.png`}
								alt={`${value}`}
								className="h-4 w-6 rounded-sm border object-cover"
							/>
						</div>
					)}
					<span className="truncate text-wrap text-sm font-medium text-slate-900">
						{value !== undefined && value !== null ? value + `${isAmount ? " €" : ""}` : "--"}
					</span>
				</div>
				{copyable && value !== undefined && value !== null && value !== "--" && (
					<button onClick={handleCopy} className="shrink-0 text-slate-400 hover:text-slate-600">
						<span className={cn("inline-block", isSpinning && "spin-once")}>
							<Copy className="h-4 w-4" />
						</span>
					</button>
				)}
			</div>
		</div>
	);
};

export const ViewCollaborator = ({ collaborator }: Props) => {
	return (
		<>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{collaborator?.professionalSituation?.contractType === "EXT" ? (
					<ViewCollaboratorExtern collaborator={collaborator} />
				) : (
					<ViewCollaboratorIntern collaborator={collaborator} />
				)}
			</div>

			{/* Recommandation de services */}
			{collaborator?.professionalSituation?.contractType === "EXT" && (
				<Card className="rounded-xl border border-slate-200">
					<CardHeader className="cursor-pointer">
						<CardTitle className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6 text-gray-400"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
									/>
								</svg>
								<span className="text-lg font-medium text-gray-900">Recommandation de services</span>
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent className="flex min-h-[17rem] flex-col justify-between">
						{" "}
						{/* ← adapte la hauteur */}
						<div className="overflow-x-auto">
							<table className="w-max md:w-full">
								<tbody>
									{SERVICES.map((service) => (
										<tr key={service.name} className="border border-slate-200">
											<td className="p-4">
												<img className="h-6 w-6 rounded" src={service.logo} alt={`Logo de ${service.name}`} />
											</td>
											<td>
												<div className="flex flex-col">
													<span className="text-sm font-medium text-gray-900">{service.name}</span>
													<span className="text-sm font-medium text-gray-500">{service.description}</span>
												</div>
											</td>
											<td>
												<a className="text-sm font-medium text-sky-700" href={service.link} target="_blank">
													Découvrir
												</a>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="mt-4 flex items-center justify-between">
							<span className="text-sm font-medium text-gray-700">Publicité</span>
							<a className="text-sm font-medium text-sky-700" href="mailto:marin@legipilot.com" target="_blank">
								En savoir plus
							</a>
						</div>
					</CardContent>
				</Card>
			)}
		</>
	);
};
