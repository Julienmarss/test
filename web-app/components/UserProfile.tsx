import Link from "next/link";
import { Accordion, AccordionItem } from "./ui/accordion/Accordion";
import { Session } from "next-auth";
import { ChevronUpDown } from "./ui/icons/ChevronUpDown";
import { SignOut } from "./SignOut";
import { AdministratorResponse } from "@/app/signup/signup.service";
import NotificationPopover from "@/app/(app)/admin/components/NotificationPopover";
import NewPopover from "@/app/(app)/admin/components/NewPopover";
import { Avatar } from "./ui/hero-ui/Avatar";

export default function UserProfile({
	isCollapsed,
	administrator,
	session,
}: {
	isCollapsed: boolean;
	administrator?: AdministratorResponse;
	session: Session;
}) {
	const roles = session?.user?.roles;

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

	return (
		<Accordion
			defaultExpandedKeys={["down-menu"]}
			variant="light"
			className="bg-transparent px-0"
			itemClasses={{
				trigger: "p-[6px] pr-2 transition hover:bg-sky-900 rounded-lg relative min-h-[36px] min-w-[36px]",
				indicator: "data-[open=true]:-rotate-0 rtl:-rotate-180 rtl:data-[open=true]:-rotate-0 transform-none",
			}}
		>
			<AccordionItem
				key="down-menu"
				indicator={<ChevronUpDown className={`size-5 text-sky-200 ${isCollapsed && "hidden"}`} />}
				aria-label="Menu du bas"
				startContent={
					<Avatar
						src={administrator?.picture}
						size="sm"
						showFallback
						className={`h-6 w-6 border border-sky-700 bg-gray-600 text-white ${isCollapsed && "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}`}
						name={(session?.user.firstname?.[0] ?? "") + (session?.user.lastname?.[0] ?? "")}
					/>
				}
				title={!isCollapsed && <span className="text-white">{session?.user.firstname}</span>}
			>
				{bottomMenuItems.map((item) => {
					if (item.path) {
						return (
							<Link
								key={item.id}
								href={item.path || ""}
								className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white ${isCollapsed ? "justify-center" : "justify-start"}`}
								target={item.external ? "_blank" : ""}
							>
								{item.icon as any}
								<span className={`flex-1 ${isCollapsed && "hidden"}`}>{item.title}</span>
							</Link>
						);
					}
					return (
						<div key={item.id} className="w-full">
							{item.id === "notifications" ? (
								<NotificationPopover showTitle={!isCollapsed} administrator={administrator} />
							) : (
								<NewPopover showTitle={!isCollapsed} administrator={administrator} />
							)}
						</div>
					);
				})}
				{roles?.includes("SUPER_ADMIN") && (
					<Link
						href="/administration"
						className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white ${isCollapsed ? "justify-center" : "justify-start"}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="size-6 text-white"
						>
							<path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
						</svg>
						<span className={`flex-1 ${isCollapsed && "hidden"}`}>Administration</span>
					</Link>
				)}
				<SignOut isCollapsed={isCollapsed} />
			</AccordionItem>
		</Accordion>
	);
}
