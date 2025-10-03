import RightToAdminList from "./admin-list/RightToAdminContainer";
import Invitation from "./invitation/Invitation";

export default function ManageRole() {
	return (
		<section className="grid grid-cols-1 gap-y-6 lg:grid-cols-2 lg:[&>*]:col-start-2">
			<Invitation />
			<RightToAdminList />
		</section>
	);
}
