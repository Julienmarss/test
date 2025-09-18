import Link from "next/link";
import {AccountCreated} from "./AccountCreated";

export default async function Page({searchParams}: { searchParams: { email?: string }; }) {
    const { email } = searchParams;

    return (
        <div className="min-h-screen bg-sky-900 flex items-center p-2">

            <div className="flex-1 flex flex-col justify-space-between items-start p-8 bg-white h-[98vh] rounded-lg overflow-y-auto">
                <div className="flex flex-row justify-between mb-4 mt-8 w-full">
                    <div className="flex items-center space-x-3">
                        <img src="/logo-legipilot.svg" alt="Logo Legipilot"/>
                    </div>
                    <Link href="/" className="text-slate-600 hover:text-slate-800 font-medium underline">
                        Se connecter
                    </Link>
                </div>

                <AccountCreated email={email}/>
            </div>

            {/* Right Panel - Branding */}
            <div className="flex-1 text-center">
                <div className="flex items-center justify-center space-x-4">
                    <img src="/logo-legipilot-negatif.svg" alt="Logo de Legipilot"/>
                </div>
            </div>
        </div>
    );
}
