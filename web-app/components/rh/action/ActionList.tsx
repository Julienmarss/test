import { ActionDto } from "@/api/event/events.dto";
import ActionElement from "./ActionElement";

export default function ActionList({
	actions,
	isLoading = false,
}: {
	actions?: ActionDto[];
	isLoading?: boolean;
}) {
	return (
		<ol className="rounded-xl border border-gray-200 bg-white" aria-label="Étapes de l'évènements">
			{isLoading && (
				<>
					<ActionElement key={`action-1`} isLoading />
					<ActionElement key={`action-2`} isLoading />
					<ActionElement key={`action-3`} isLoading />
				</>
			)}
			{actions &&
				actions.map((action, index /* Commence à 0 */) => (
					<ActionElement key={`action-${action.id}`} action={action} index={index + 1} />
				))}
		</ol>
	);
}
