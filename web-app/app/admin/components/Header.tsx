'use client';

import {ToggleSidebarButton} from "@/app/admin/components/ToggleSidebarButton";

export const Header = () => {
    return (
        <div className="flex items-center sticky top-0 bg-transparent z-50 p-4">
            <ToggleSidebarButton/>
        </div>
    );
};