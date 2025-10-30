"use client";

import { signOut } from "next-auth/react";

export const SignOut = ({ isCollapsed = false }: { isCollapsed: boolean }) => {
	if (isCollapsed) {
		return (
			<button
				onClick={() => signOut({ callbackUrl: "/signin" })}
				className="flex w-full items-center justify-center rounded-lg stroke-white p-2 transition-colors hover:bg-slate-700 hover:text-white"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
					/>
				</svg>
			</button>
		);
	}

	return (
		<button
			onClick={() => signOut({ callbackUrl: "/signin" })}
			className="flex w-full items-center justify-center space-x-3 rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-6 w-6 text-white"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
				/>
			</svg>
			<span className="flex-1 text-justify">Se déconnecter</span>
		</button>
	);
};
