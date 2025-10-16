"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext({
	isCollapsed: false,
	setIsCollapsed: (value: boolean) => {},
	toggleSidebar: () => {},
});

export function SidebarProvider({
	children,
	initialCollapsed = false,
}: {
	children: React.ReactNode;
	initialCollapsed?: boolean;
}) {
	const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

	useEffect(() => {
		const saved = localStorage.getItem("sidebar-collapsed");
		if (saved !== null) {
			setIsCollapsed(JSON.parse(saved));
		}
	}, []);

	function toggleSidebar() {
		setIsCollapsed(!isCollapsed);
		localStorage.setItem("sidebar-collapsed", JSON.stringify(!isCollapsed));
	}

	return (
		<SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, toggleSidebar }}>{children}</SidebarContext.Provider>
	);
}

export const useSidebar = () => useContext(SidebarContext);
