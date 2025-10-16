import { CollaboratorClient } from "@/app/admin/collaborator/[id]/CollaboratorClient";
import AppLayout from "@/app/AppLayout";
import { getCompany } from "@/api/company/company.api";

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
			<CollaboratorClient company={company} collaboratorId={id} />
		</AppLayout>
	);
}
