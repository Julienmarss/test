import { Button } from "../hero-ui/Button";
import { LockClosed } from "../icons/LockClosed";

export default function CopilotRHLocked({ title }: { title: string }) {
	return (
		// TODO REDIRECT PAGE RH
		<div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-3 rounded-md bg-white p-6 shadow-xl">
			<p className="text-center text-sm font-medium">{title}</p>
			<Button className="shadow-xl" startContent={<LockClosed className="size-4" />}>
				Débloquer le Copilote RH
			</Button>
		</div>
	);
}
