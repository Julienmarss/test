import { useModifyAdministrator } from "@/api/administrator/administrators.api";
import { AdministratorResponse } from "@/app/signup/signup.service";
import { Button } from "@/components/ui/buttons/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import _ from "lodash";
import React, { FC, useEffect, useState } from "react";

interface NotificationPopoverProps {
	administrator?: AdministratorResponse;
	showTitle?: boolean;
}

const NotificationPopover: FC<NotificationPopoverProps> = ({ administrator, showTitle = true }) => {
	const [open, setOpen] = useState(false);
	const [showBadge, setShowBadge] = useState(false);
	const { mutate: modify, isPending: modifyPending } = useModifyAdministrator();

	const handleOpen = () => {
		if (showBadge && administrator?.id) {
			const company = administrator?.companies?.[0];
			modify({
				id: administrator.id,
				request: {
					..._.omit(administrator, ["companies"]),
					idCompany: company?.id,
					companyName: company?.name,
					siren: company?.siren,
					siret: company?.siret,
					legalForm: company?.legalForm,
					nafCode: company?.nafCode,
					principalActivity: "",
					activityDomain: company?.activityDomain,
					collectiveAgreement: company?.collectiveAgreement?.titre,
					idcc: company?.collectiveAgreement?.idcc,
					companyPicture: company?.picture,
					isNotifViewed: true,
				},
			});
		}
		setShowBadge(false);
	};

	useEffect(() => {
		if (administrator?.id) {
			setShowBadge(!Boolean(administrator?.isNotifViewed));
		}
	}, [administrator]);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger className="w-full">
				<Button
					className={`flex w-full items-center ${showTitle ? "justify-start" : "justify-center"} space-x-2 rounded-lg px-3 py-2 text-slate-300 ${open ? "bg-sky-800" : "bg-transparent"} relative transition-colors hover:bg-slate-700 hover:text-white`}
					onClick={handleOpen}
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						className="size-5 text-white"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M7.99997 0C4.68626 0 1.99997 2.68629 1.99997 6C1.99997 7.88663 1.54624 9.6651 0.742604 11.2343C0.635913 11.4426 0.632601 11.6888 0.733648 11.9C0.834695 12.1111 1.02851 12.2629 1.25769 12.3105C2.32537 12.5322 3.41181 12.7023 4.51426 12.818C4.67494 14.602 6.17421 16 8 16C9.82579 16 11.3251 14.602 11.4857 12.818C12.5882 12.7023 13.6746 12.5322 14.7422 12.3105C14.9714 12.2629 15.1652 12.1111 15.2663 11.9C15.3673 11.6888 15.364 11.4426 15.2573 11.2343C14.4537 9.6651 14 7.88663 14 6C14 2.68629 11.3137 0 7.99997 0ZM6.0493 12.9433C6.69477 12.9809 7.34517 13 7.99997 13C8.65478 13 9.3052 12.9809 9.9507 12.9433C9.74903 13.8345 8.95223 14.5 8 14.5C7.04777 14.5 6.25097 13.8345 6.0493 12.9433Z"
							fill="white"
						/>
					</svg>
					{showBadge && !showTitle && (
						<div className="absolute right-[8px] top-[5px] h-[4px] w-[4px] rounded-full bg-[#FF6467]" />
					)}
					{showTitle && (
						<div className="flex w-full justify-between">
							<span className="text-[16px]">Notifications</span>
							{showBadge && (
								<div className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#FF6467]">1</div>
							)}
						</div>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent side="right" className="z-[100] w-[250px] md:w-[350px]">
				<div className="flex flex-col gap-3">
					<h3 className="text-sm">Notifications</h3>
					<Separator className="bg-gray-200" />
					<div className="flex items-center gap-2">
						<div className="flex gap-4">
							<img src="/picto-legipilot.svg" alt="Logo de Legipilot" className="h-8 w-8" />
							{/* <img src="https://s3.fr-par.scw.cloud/legipilot-documents/public/prod/administrators/13790c42-907f-4639-a192-9b263aa1abc7_iche_nour_el_yakine/photo.jpeg" alt="Avatar de l'utilisateur"
                                className="w-[40px] h-[40px] rounded-full bg-white" /> */}
							<div className="flex flex-col justify-between gap-1">
								<span className="text-sm md:text-justify">
									Bienvenue sur LégiPilot !<br /> Votre compte a été créé avec succès. L’onglet{" "}
									<strong>notifications</strong> vous accompagne au quotidien avec les rappels, échéances et actions à
									réaliser, pour vous guider dans votre gestion RH et juridique.
								</span>
								{/* <span className="text-xs text-gray-500">3 heures</span> */}
							</div>
						</div>
						{/* <div className="flex justify-center w-4">
                            <div className="w-[4px] h-[4px] bg-[#E7000B] rounded-full"></div>
                        </div> */}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};
export default NotificationPopover;
