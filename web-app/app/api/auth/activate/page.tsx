import Link from "next/link";
import { UUID } from "node:crypto";
import { AccountValidation } from "@/app/api/auth/activate/AccountValidation";

export default async function Page({ searchParams }: { searchParams: { id?: number; token?: UUID } }) {
	const { id, token } = searchParams;

	return (
		<div className="flex min-h-screen items-center bg-sky-900 p-2">
			<div className="justify-space-between flex h-[98vh] flex-1 flex-col items-center overflow-y-auto rounded-lg bg-white p-8">
				<div className="mb-4 mt-8 flex w-full flex-row justify-between">
					<div className="flex items-center space-x-3">
						<img src="/logo-legipilot.svg" alt="Logo Legipilot" />
					</div>
					<Link href="/" className="font-medium text-slate-600 underline hover:text-slate-800">
						Se connecter
					</Link>
				</div>

				<AccountValidation id={id} token={token} />
			</div>

			{/* Right Panel - Branding */}
			<div className="flex-1 text-center">
				<div className="flex items-center justify-center space-x-4">
					<img src="/logo-legipilot-negatif.svg" alt="Logo de Legipilot" />
				</div>
			</div>
		</div>
	);
}
