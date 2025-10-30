import Sidebar from "@/components/Sidebar";
import { CompanyProvider } from "@/components/utils/CompanyProvider";
import { getCompany } from "@/api/company/company.api";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SidebarProvider } from "@/components/utils/SidebarProvider";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { cookies } from "next/headers";
import { serverGet } from "@/api/server.api";
import { CompanyResponse } from "@/api/company/company.api";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const session = await getServerSession(authOptions);
	if (!session?.accessToken) {
		redirect("/signin");
	}

	const cookieStore = await cookies();
	const selectedCompanyId = cookieStore.get("selected-company-id")?.value;
	let defaultCompany: CompanyResponse;

	if (selectedCompanyId) {
		try {
			defaultCompany = await serverGet<CompanyResponse>(`/companies/${selectedCompanyId}`);
		} catch (error) {
			defaultCompany = await getCompany();
		}
	} else {
		defaultCompany = await getCompany();
	}

	return (
		<ErrorBoundary>
			<CompanyProvider initialCompany={defaultCompany}>
				<SidebarProvider>
					<div className="flex h-screen overflow-hidden bg-sky-950">
						<Sidebar />
						<Toaster />
						<main className="m-2 ml-0 flex-1 overflow-auto rounded-2xl border-sky-950 bg-white">{children}</main>
					</div>
				</SidebarProvider>
			</CompanyProvider>
		</ErrorBoundary>
	);
}
