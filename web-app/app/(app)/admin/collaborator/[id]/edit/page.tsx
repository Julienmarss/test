import { getCompany } from "@/api/company/company.api";
import { CollaboratorEditionClient } from "@/app/(app)/admin/collaborator/[id]/edit/CollaboratorEditionClient";

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

	return <CollaboratorEditionClient company={company} collaboratorId={id} />;
}
