import {useSidebar} from "@/components/utils/SidebarProvider";

export function ToggleSidebarButton({color}:{color?:string}) {
    const { toggleSidebar } = useSidebar();

    return (
        <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-sky-200 active:bg-gray-300 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Toggle sidebar"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={color || "currentColor"}
                className="size-6 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z"
                />
            </svg>
        </button>
    );
}