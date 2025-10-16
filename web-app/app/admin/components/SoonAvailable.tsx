import { Button } from "@/components/ui/buttons/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React, { FC, useState } from "react";

interface SoonAvailableProps {
	title: string;
	subtitle?: string;
	icon: any;
	type: "RH" | "Juridique" | "Planning";
	showTitle?: boolean;
}

const SoonAvailable: FC<SoonAvailableProps> = ({ title, subtitle, icon, type, showTitle = true }) => {
	const [open, setOpen] = useState(false);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger className="w-full">
				{showTitle ? (
					<Button
						className={`flex h-auto w-full items-center space-x-3 rounded-lg px-3 py-2 transition-colors ${open ? "bg-sky-800" : "bg-transparent"} text-white hover:bg-slate-600`}
					>
						{icon}
						<div className="!ml-1 flex-1 text-left">
							<div className="text-[16px] font-medium">{title}</div>
							<div className="text-xs text-sky-200">{subtitle}</div>
						</div>
					</Button>
				) : (
					<Button
						className={`flex h-auto w-full flex-col items-center justify-center rounded-lg p-2 transition-colors ${open ? "bg-sky-800" : "bg-transparent"} text-white hover:bg-slate-600`}
					>
						{icon}
						<span className="text-xs text-white">{title}</span>
					</Button>
				)}
			</PopoverTrigger>
			<PopoverContent side="right" className="z-[100] w-[250px] md:w-[350px]">
				<div className="flex flex-col gap-3">
					<h3 className="text-center text-sm font-semibold">Copilote bientôt disponible !</h3>
					<Separator className="bg-gray-200" />
					{type === "RH" ? (
						<span className="text-sm md:text-justify">
							Pilotez vos ressources humaines de l’embauche à la fin du contrat.
							<br />
							<Link
								href="https://www.legipilot.com/detailcopiloterh"
								target="_blank"
								className="text-[#0084D1] underline"
							>
								En savoir plus
							</Link>{" "}
							sur les fonctionnalités
						</span>
					) : type === "Juridique" ? (
						<span className="text-sm md:text-justify">
							L’accès illimité à une assistance juridique pour garantir votre conformité légale.
							<br />
							<Link
								href="https://www.legipilot.com/detailcopilotejuridique"
								target="_blank"
								className="text-[#0084D1] underline"
							>
								En savoir plus
							</Link>{" "}
							sur les fonctionnalités
						</span>
					) : (
						<span className="text-sm md:text-justify">
							Simplifiez le suivi du temps de travail et des absences de vos salariés.
							<br />
							<Link
								href="https://www.legipilot.com/detailcopiloteplanning"
								target="_blank"
								className="text-[#0084D1] underline"
							>
								En savoir plus
							</Link>{" "}
							sur les fonctionnalités
						</span>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
};
export default SoonAvailable;
