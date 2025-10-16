"use client";

import Link from "next/link";
import { Session } from "next-auth";
import { SignOut } from "@/components/SignOut";
import { useCompany } from "@/components/utils/CompanyProvider";
import { useSidebar } from "@/components/utils/SidebarProvider";
import { useAdministrator } from "@/api/administrator/administrators.api";
import { ToggleSidebarButton } from "@/app/admin/components/ToggleSidebarButton";
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, Sparkles } from "lucide-react";
import NotificationPopover from "@/app/admin/components/NotificationPopover";
import { Button } from "./ui/buttons/Button";
import NewPopover from "@/app/admin/components/NewPopover";
import SoonAvailable from "@/app/admin/components/SoonAvailable";

export default function SidebarClient({ session }: Readonly<{ session: Session }>) {
	const adminId = session?.user?.id;
	const roles = session?.user?.roles;
	const { company } = useCompany();
	const { data: administrator } = useAdministrator(adminId);
	const { isCollapsed, setIsCollapsed } = useSidebar();
	const pathname = usePathname();
	const isMobile = useIsMobile();

	useEffect(() => {
		if (isMobile) {
			setIsCollapsed(true);
		}
	}, [isMobile]);

	const menuSections = [
		{
			id: "copilotes",
			title: "Copilotes",
			items: [
				{
					id: "admin",
					path: "/admin",
					title: "Admin",
					subtitle: "Vos collaborateurs",
					icon: (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="size-5 text-white"
						>
							<path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
						</svg>
					),
					active: true,
				},
				{
					id: "rh",
					title: "RH",
					subtitle: "Ressources Humaines",
					type: "RH",
					icon: (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="!size-5 text-white"
						>
							<path
								fillRule="evenodd"
								d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z"
								clipRule="evenodd"
							/>
						</svg>
					),
					active: true,
				},
				{
					id: "juridique",
					title: "Juridique",
					subtitle: "Conformité Légale",
					type: "Juridique",
					icon: (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="!size-5 text-white"
						>
							<path
								fillRule="evenodd"
								d="M10 2a.75.75 0 0 1 .75.75v.258a33.186 33.186 0 0 1 6.668.83.75.75 0 0 1-.336 1.461 31.28 31.28 0 0 0-1.103-.232l1.702 7.545a.75.75 0 0 1-.387.832A4.981 4.981 0 0 1 15 14c-.825 0-1.606-.2-2.294-.556a.75.75 0 0 1-.387-.832l1.77-7.849a31.743 31.743 0 0 0-3.339-.254v11.505a20.01 20.01 0 0 1 3.78.501.75.75 0 1 1-.339 1.462A18.558 18.558 0 0 0 10 17.5c-1.442 0-2.845.165-4.191.477a.75.75 0 0 1-.338-1.462 20.01 20.01 0 0 1 3.779-.501V4.509c-1.129.026-2.243.112-3.34.254l1.771 7.85a.75.75 0 0 1-.387.83A4.98 4.98 0 0 1 5 14a4.98 4.98 0 0 1-2.294-.556.75.75 0 0 1-.387-.832L4.02 5.067c-.37.07-.738.148-1.103.232a.75.75 0 0 1-.336-1.462 32.845 32.845 0 0 1 6.668-.829V2.75A.75.75 0 0 1 10 2ZM5 7.543 3.92 12.33a3.499 3.499 0 0 0 2.16 0L5 7.543Zm10 0-1.08 4.787a3.498 3.498 0 0 0 2.16 0L15 7.543Z"
								clipRule="evenodd"
							/>
						</svg>
					),
					active: true,
				},
				{
					id: "planning",
					title: "Planning",
					subtitle: "Temps & absences",
					type: "Planning",
					icon: (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="!size-5 text-white"
						>
							<path d="M10 9.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V10a.75.75 0 0 0-.75-.75H10ZM6 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H6ZM8 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H8ZM9.25 14a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V14ZM12 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H12ZM12 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H12ZM13.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H14a.75.75 0 0 1-.75-.75V12ZM11.25 10.005c0-.417.338-.755.755-.755h2a.755.755 0 1 1 0 1.51h-2a.755.755 0 0 1-.755-.755ZM6.005 11.25a.755.755 0 1 0 0 1.51h4a.755.755 0 1 0 0-1.51h-4Z" />
							<path
								fillRule="evenodd"
								d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
								clipRule="evenodd"
							/>
						</svg>
					),
					active: true,
				},
			],
		},
	];

	const bottomMenuItems = [
		{
			id: "notifications",
			title: "Notifications",
			icon: (
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					className="size-5 text-white"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M7.99997 0C4.68626 0 1.99997 2.68629 1.99997 6C1.99997 7.88663 1.54624 9.6651 0.742604 11.2343C0.635913 11.4426 0.632601 11.6888 0.733648 11.9C0.834695 12.1111 1.02851 12.2629 1.25769 12.3105C2.32537 12.5322 3.41181 12.7023 4.51426 12.818C4.67494 14.602 6.17421 16 8 16C9.82579 16 11.3251 14.602 11.4857 12.818C12.5882 12.7023 13.6746 12.5322 14.7422 12.3105C14.9714 12.2629 15.1652 12.1111 15.2663 11.9C15.3673 11.6888 15.364 11.4426 15.2573 11.2343C14.4537 9.6651 14 7.88663 14 6C14 2.68629 11.3137 0 7.99997 0ZM6.0493 12.9433C6.69477 12.9809 7.34517 13 7.99997 13C8.65478 13 9.3052 12.9809 9.9507 12.9433C9.74903 13.8345 8.95223 14.5 8 14.5C7.04777 14.5 6.25097 13.8345 6.0493 12.9433Z"
						fill="white"
					/>
				</svg>
			),
		},
		{
			id: "settings",
			path: "/settings",
			title: "Réglages",
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-white">
					<path
						fillRule="evenodd"
						d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
						clipRule="evenodd"
					/>
				</svg>
			),
			external: false,
		},
		{
			id: "nouveautes",
			title: "Nouveautés",
			icon: (
				<svg
					width="18"
					height="17"
					viewBox="0 0 18 17"
					fill="none"
					className="size-5 text-white"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M8.13213 0.883674C8.45323 0.111675 9.54636 0.111709 9.86749 0.883674L11.6985 5.28504L16.4505 5.6659C17.2838 5.73271 17.6223 6.77326 16.9876 7.31727L13.3665 10.4188L14.473 15.0555C14.6669 15.8688 13.7822 16.5117 13.0687 16.0761L9.0003 13.5907L4.93194 16.0761C4.21838 16.5119 3.33364 15.8689 3.52764 15.0555L4.63311 10.4188L1.01299 7.31727C0.377987 6.77332 0.71567 5.73272 1.54913 5.6659L6.30108 5.28504L8.13213 0.883674Z"
						fill="white"
					/>
				</svg>
			),
		},
		{
			id: "aide",
			path: "https://www.legipilot.com/aide-commentaires",
			title: "Aide et commentaires",
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-white">
					<path
						fillRule="evenodd"
						d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
						clipRule="evenodd"
					/>
				</svg>
			),
			external: true,
		},
	];

	if (isCollapsed) {
		return (
			<div className="flex h-screen w-20 flex-col justify-between text-white">
				<section className="flex flex-col">
					<div className="mb-2 self-center p-4">
						<div className="flex h-8 w-8 items-center justify-center">
							<img src="/picto-legipilot-blanc.svg" alt="Logo de Legipilot" />
						</div>
					</div>

					{menuSections.map((section) => (
						<div key={section.id} className="justify-center p-2 text-center">
							<button className="mb-2 flex w-full items-center justify-center text-sm text-slate-400 hover:text-white">
								<span className="text-gray-400">{section.title}</span>
							</button>

							<div className="space-y-1">
								{section.items.map((item) =>
									item.active ? (
										<div key={item.id} className="flex flex-col">
											{item?.path ? (
												<Link
													href={item.path}
													className={`flex flex-col items-center justify-center rounded-lg p-2 transition-colors ${pathname === item.path ? "bg-sky-800" : ""} text-white hover:bg-slate-600`}
												>
													{item.icon}
													<span className="text-xs text-white">{item.title}</span>
												</Link>
											) : (
												<SoonAvailable
													title={item.title}
													icon={item.icon}
													showTitle={false}
													type={item.type as "RH" | "Juridique" | "Planning"}
												/>
											)}
										</div>
									) : (
										<div className="flex flex-col" key={item.id}>
											<div
												className="flex cursor-not-allowed flex-col items-center justify-center rounded-lg bg-slate-800 p-2 text-slate-500 opacity-50"
												aria-disabled="true"
											>
												{item.icon}
												<span className="text-xs text-gray-400">{item.title}</span>
											</div>
										</div>
									),
								)}
							</div>
						</div>
					))}
				</section>

				<div className="align-center items-center justify-center justify-items-center space-y-3 self-center p-4">
					{session && administrator && administrator.picture && administrator.picture.length > 0 ? (
						<img src={administrator.picture} alt="Avatar de l'utilisateur" className="h-8 w-8 rounded-full bg-white" />
					) : (
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 text-sm font-medium">
							{(session?.user.firstname?.[0] ?? "") + (session?.user.lastname?.[0] ?? "")}
						</div>
					)}

					{bottomMenuItems.map((item) => {
						if (item.path) {
							return (
								<Link
									key={item.id}
									href={item.path || ""}
									className="flex items-center justify-center rounded-lg p-2 text-white transition-colors hover:bg-slate-700 hover:text-white"
									target={item.external ? "_blank" : ""}
								>
									{item.icon as any}
								</Link>
							);
						}

						return (
							<div key={item.id} className="w-full">
								{item.id === "notifications" ? (
									<NotificationPopover showTitle={false} administrator={administrator} />
								) : (
									<NewPopover showTitle={false} administrator={administrator} />
								)}
							</div>
						);
					})}

					{roles?.includes("SUPER_ADMIN") && (
						<Link
							href="/administration"
							className="flex items-center justify-center rounded-lg p-2 text-white transition-colors hover:bg-slate-700 hover:text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="size-6 text-white"
							>
								<path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
							</svg>
						</Link>
					)}

					<SignOut isCollapsed={true} />

					{company.picture && company.picture.length > 0 ? (
						<div
							className="h-8 w-8 rounded-full border-t"
							style={{
								backgroundImage: `url(${company.picture})`,
								backgroundPosition: "center",
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
							}}
						/>
					) : (
						<div className="flex h-8 w-8 items-center justify-center rounded-full border-t bg-slate-600">
							<div className="text-center">{company?.name[0]}</div>
						</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="absolute z-[100] flex h-screen w-72 flex-col bg-sky-950 text-white md:relative">
			{/* Header */}
			<div className="flex items-center">
				<div className="w-full border-b border-slate-700 px-6 pb-4 pt-6">
					<img src="/sidebar-logo.svg" alt="Logo de Legipilot" className="h-[32px] w-[168px]" />
				</div>
				{isMobile && <ToggleSidebarButton color="white" />}
			</div>

			{/* Navigation Sections */}
			<div className="flex-1 overflow-y-auto">
				{menuSections.map((section) => (
					<div key={section.id} className="w-full p-4">
						<button className="mb-2 flex w-full items-center justify-between text-sm text-slate-400 hover:text-white">
							<span className="text-gray-400">{section.title}</span>
						</button>

						<div className="space-y-1">
							{section.items.map((item) =>
								item.active ? (
									<React.Fragment key={item.id}>
										{item?.path ? (
											<Link
												href={item.path}
												className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors ${pathname === item.path ? "bg-sky-800" : ""} text-white hover:bg-slate-600`}
											>
												{item.icon}
												<div className="flex-1">
													<div className="font-medium">{item.title}</div>
													<div className="text-xs text-sky-200">{item.subtitle}</div>
												</div>
											</Link>
										) : (
											<SoonAvailable
												title={item.title}
												subtitle={item.subtitle}
												icon={item.icon}
												type={item.type as "RH" | "Juridique" | "Planning"}
											/>
										)}
									</React.Fragment>
								) : (
									<div
										key={item.id}
										className="flex cursor-not-allowed items-center space-x-3 rounded-lg bg-slate-800 px-3 py-2 text-slate-500 opacity-50"
										aria-disabled="true"
									>
										{item.icon}
										<div className="flex-1">
											<div className="font-medium text-slate-400">{item.title}</div>
											<div className="text-xs text-slate-400">{item.subtitle}</div>
										</div>
									</div>
								),
							)}
						</div>
					</div>
				))}
			</div>

			{/* User Profile */}
			<div className="border-t border-slate-700">
				<button className="flex w-full items-center space-x-3 px-6 py-4 transition-colors hover:bg-slate-700">
					{administrator && administrator.picture && administrator.picture.length > 0 ? (
						<img
							src={administrator.picture}
							alt="Avatar de l'utilisateur"
							className="h-8 w-8 self-center rounded-full bg-white"
						/>
					) : (
						<div className="flex h-8 w-8 items-center justify-center self-center rounded-full bg-slate-600 text-sm font-medium">
							{(session?.user.firstname?.[0] ?? "") + (session?.user.lastname?.[0] ?? "")}
						</div>
					)}
					<div className="flex-1 text-left">
						<div className="font-medium">{session?.user.firstname}</div>
					</div>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-6 h-5 w-5 stroke-sky-200"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
					</svg>
				</button>

				<div className="space-y-1 px-4 pb-4">
					{bottomMenuItems.map((item) => {
						if (item.path) {
							return (
								<Link
									key={item.id}
									href={item.path || ""}
									className="flex items-center space-x-3 rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
									target={item.external ? "_blank" : ""}
								>
									{item.icon as any}
									<span className="flex-1">{item.title}</span>
								</Link>
							);
						}
						return (
							<div key={item.id} className="w-full">
								{item.id === "notifications" ? (
									<NotificationPopover administrator={administrator} />
								) : (
									<NewPopover administrator={administrator} />
								)}
							</div>
						);
					})}
					{roles?.includes("SUPER_ADMIN") && (
						<Link
							href="/administration"
							className="flex items-center space-x-3 rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="size-6 text-white"
							>
								<path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
							</svg>
							<span className="flex-1">Administration</span>
						</Link>
					)}
					<SignOut isCollapsed={false} />
				</div>

				{/* Company Info */}
				<div className="border-t border-slate-700 px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							{company.picture && company.picture.length > 0 ? (
								<div
									className="h-8 w-8 rounded-full"
									style={{
										backgroundImage: `url(${company.picture})`,
										backgroundPosition: "center",
										backgroundSize: "cover",
										backgroundRepeat: "no-repeat",
									}}
								/>
							) : (
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600">
									<div className="text-center">{company?.name[0]}</div>
								</div>
							)}
							<div>
								<div className="text-sm font-medium">{company?.name}</div>
								<div className="text-xs text-slate-400">{company?.collaborators.length} collaborateur(s)</div>
							</div>
						</div>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-6 h-5 w-5 stroke-sky-200"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
}
