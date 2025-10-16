import MyCollaborators from "./components/MyCollaborators";
import AppLayout from "@/app/AppLayout";

export default async function AdminDashboard() {
	return (
		<AppLayout>
			<MyCollaborators />
		</AppLayout>
	);
}
