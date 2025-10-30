"use client";

import Link from "next/link";
import { Session } from "next-auth";
import { SignOut } from "@/components/SignOut";
import { useSelectedCompany } from "@/components/utils/CompanyProvider";
import { useSidebar } from "@/components/utils/SidebarProvider";
import { useAdministrator } from "@/api/administrator/administrators.api";
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./ui/icons/Sidebar";
import { Accordion, AccordionItem } from "./ui/accordion/Accordion";
import { ChevronUpDown } from "./ui/icons/ChevronUpDown";
import SoonAvailable from "@/app/(app)/admin/components/SoonAvailable";
import NotificationPopover from "@/app/(app)/admin/components/NotificationPopover";
import NewPopover from "@/app/(app)/admin/components/NewPopover";
import CompanySwitcher from "@/components/utils/CompanySwitcher";
import UserProfile from "./UserProfile";

export default function SidebarClient({ session }: Readonly<{ session: Session }>) {
	const adminId = session?.user?.id;
	const roles = session?.user?.roles;
	const { data: administrator } = useAdministrator(adminId);
	const { isCollapsed, setIsCollapsed } = useSidebar();
	const pathname = usePathname();
	const isMobile = useIsMobile();
	const { toggleSidebar } = useSidebar();

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
				},
				{
					id: "rh",
					path: "/rh",
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
				},
			],
		},
	];

	return (
		<>
			{/* Pour décaler le contenu sur mobile et que décollapse passe par dessus le contenu principal de la page */}
			<div className={`${isMobile ? "h-full w-20" : "hidden"}`}></div>{" "}
			<div
				className={`group absolute z-[50] flex h-screen ${isCollapsed ? "w-20" : "w-72"} flex-col items-center justify-between bg-sky-950 text-white transition-width md:relative`}
			>
				<div className="w-full">
					{/* Header */}
					<div className="flex w-full items-center">
						<div
							className={`mt-2 flex w-full items-center ${isCollapsed ? "justify-center" : "justify-between"} border-b border-black p-4`}
						>
							{!isCollapsed && <img src="/sidebar-logo.svg" alt="Logo de Legipilot" className="w-[150px]" />}
							{isCollapsed ? (
								<div className="relative h-9 w-9 cursor-w-resize rounded-md transition hover:bg-slate-700">
									<img
										src="/picto-legipilot-blanc.svg"
										alt="Logo de Legipilot"
										className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 opacity-0 transition group-hover:opacity-0 sm:opacity-100"
									/>
									<button type="button" onClick={toggleSidebar}>
										<Sidebar
											className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 cursor-w-resize text-white opacity-100 transition group-hover:opacity-100 sm:opacity-0"
											aria-hidden="true"
										/>
									</button>
								</div>
							) : (
								<button
									type="button"
									onClick={toggleSidebar}
									className="flex h-9 w-9 cursor-w-resize items-center justify-center rounded-lg transition hover:bg-slate-700"
								>
									<Sidebar className="size-5 cursor-w-resize text-white" aria-hidden="true" />
								</button>
							)}
						</div>
					</div>

					{/* Navigation Sections */}
					<div>
						{menuSections.map((section) => (
							<div key={section.id} className="p-2">
								<button
									className={`mb-2 w-full text-sm text-slate-400 hover:text-white ${isCollapsed ? "text-center" : "text-start"}`}
								>
									<span className="text-gray-400">{section.title}</span>
								</button>

								<div className="space-y-1">
									{section.items.map((item) =>
										item?.path ? (
											<Link
												key={item.id}
												href={item.path}
												className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${pathname === item.path ? "bg-sky-800" : ""} ${isCollapsed && "flex-col !gap-2"} text-white hover:bg-slate-600`}
											>
												{item.icon}
												{isCollapsed ? (
													<span className="text-xs text-white">{item.title}</span>
												) : (
													<div className="flex-1">
														<div className="font-medium">{item.title}</div>
														<div className="text-xs text-sky-200">{item.subtitle}</div>
													</div>
												)}
											</Link>
										) : (
											<SoonAvailable
												key={item.id}
												title={item.title}
												subtitle={item.subtitle}
												icon={item.icon}
												type={item.type as "Juridique" | "Planning"}
												showTitle={!isCollapsed}
											/>
										),
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* User Profile */}
				<div className="w-full">
					<div className="p-4">
						<UserProfile isCollapsed={isCollapsed} administrator={administrator} session={session} />
					</div>

					<div className="flex items-center justify-center border-t border-black p-4">
						<CompanySwitcher isCollapsed={isCollapsed} />
					</div>
				</div>
			</div>
		</>
	);
}
