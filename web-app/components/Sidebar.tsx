import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SidebarClient from "@/components/SidebarClient";

export default async function Sidebar() {
	const session = await getServerSession(authOptions);
	if (!session || !session.accessToken) {
		redirect("/signin");
	}

	return <SidebarClient session={session} />;
}
