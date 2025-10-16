import AppLayout from "@/app/AppLayout";
import { getCompany } from "@/api/company/company.api";
import { CollaboratorEditionClient } from "@/app/admin/collaborator/[id]/edit/CollaboratorEditionClient";

interface PageProps {
	params: {
		id: string;
	};
}

export default async function CollaboratorPage({ params }: PageProps) {
	const { id } = await params;
	const company = await getCompany();

	if (!company || !id) {
		return (
			<AppLayout>
				<h1>Collaborateur introuvable</h1>
			</AppLayout>
		);
	}

	return (
		<AppLayout>
			<CollaboratorEditionClient company={company} collaboratorId={id} />
		</AppLayout>
	);
}
