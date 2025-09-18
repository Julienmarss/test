import { useRef, useState, useEffect } from "react";
import * as Menubar from "@radix-ui/react-menubar";

type Action = {
    label: string;
    icon: React.ComponentType;
    onClick: () => void;
};

type Props = {
    actions: Action[];
};

export const Ellipsis = ({ actions }: Props) => {
    const [open, setOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (open && ref.current && menuRef.current) {
            const buttonRect = ref.current.getBoundingClientRect();
            const menuHeight = menuRef.current.offsetHeight;
            const spaceBelow = window.innerHeight - buttonRect.bottom;
            const spaceAbove = buttonRect.top;

            setOpenUpward(spaceBelow < menuHeight && spaceAbove > menuHeight);
        }
    }, [open]);

    return (
        <div className="relative" ref={ref}>
            <Menubar.Root className="bg-transparent">
                <Menubar.Menu>
                    {/* Icône qui ouvre le menu */}
                    <Menubar.Trigger className="rounded-full hover:bg-gray-100">
                        <button
                            onClick={() => setOpen((prev) => !prev)}
                            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                className="size-6 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                            </svg>
                        </button>
                    </Menubar.Trigger>

                    {/* Le menu qui s’affiche */}
                    <Menubar.Portal>
                        <Menubar.Content
                            className="min-w-[160px] bg-white border border-gray-200 rounded-xl shadow-lg p-1 z-50"
                            align="end"
                            sideOffset={5}
                        >
                            {actions.map((action, index) => (
                                <Menubar.Item
                                    onClick={() => {
                                        action.onClick();
                                        setOpen(false);
                                    }}
                                    key={action.label}
                                    className="cursor-pointer flex items-center gap-x-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <action.icon />
                                    {action.label}
                                </Menubar.Item>
                            ))}
                        </Menubar.Content>
                    </Menubar.Portal>
                </Menubar.Menu>
            </Menubar.Root>
        </div>
    );
};