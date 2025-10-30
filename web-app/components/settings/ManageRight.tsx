import { useMyRights } from "@/api/company/right.api";
import { useSelectedCompany } from "@/components/utils/CompanyProvider";
import RightToAdminList from "./admin-list/RightToAdminContainer";
import Invitation from "./invitation/Invitation";

export default function ManageRole() {
	const { company } = useSelectedCompany();
	const { data: myRights } = useMyRights(company.id);

	const isReadOnly = myRights?.right === "READONLY";

	if (isReadOnly) {
		return null;
	}

	return (
		<section className="grid grid-cols-1 gap-y-6 lg:grid-cols-2 lg:[&>*]:col-start-2">
			<Invitation right={myRights?.right || "READONLY"} />
			<RightToAdminList />
		</section>
	);
}
