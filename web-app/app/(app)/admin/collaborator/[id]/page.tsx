import { CollaboratorClient } from "@/app/(app)/admin/collaborator/[id]/CollaboratorClient";
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
		return <h1>Collaborateur introuvable</h1>;
	}

	return <CollaboratorClient company={company} collaboratorId={id} />;
}
