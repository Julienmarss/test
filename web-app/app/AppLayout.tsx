import Sidebar from "@/components/Sidebar";
import { CompanyProvider } from "@/components/utils/CompanyProvider";
import { getCompany } from "@/api/company/company.api";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SidebarProvider } from "@/components/utils/SidebarProvider";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/app/ErrorBoundary";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const session = await getServerSession(authOptions);
	if (!session?.accessToken) {
		redirect("/signin");
	}
	const company = await getCompany();

	return (
		<ErrorBoundary>
			<CompanyProvider company={company}>
				<SidebarProvider>
					<div className="flex h-screen bg-sky-950">
						<Sidebar />
						<Toaster />

						<main className="flex-1 overflow-auto rounded-2xl border-8 border-sky-950 bg-white">{children}</main>
					</div>
				</SidebarProvider>
			</CompanyProvider>
		</ErrorBoundary>
	);
}
