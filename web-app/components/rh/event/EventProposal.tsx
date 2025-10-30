import { cn } from "@/utils/lib";
import { Button } from "@/components/ui/hero-ui/Button";
import { Play } from "@/components/ui/icons/Play";
import { mapIcon, resolveAccent } from "@/components/ui/modal-choice/ModalChoice";

export default function EventProposal({
	title,
	subtitle,
	onStartEvent,
	color,
	icon,
	isLoading,
	isDisabled,
}: {
	title: string;
	subtitle: string;
	onStartEvent: () => void;
	color: string;
	icon: string;
	isLoading: boolean;
	isDisabled: boolean;
}) {
	const { bg, text } = resolveAccent(color);

	return (
		<div className="flex items-center justify-between border-b border-gray-100 bg-white px-8 py-6 first:rounded-t-xl last:rounded-b-xl last:border-b-0">
			<div className="flex gap-8">
				<div className={cn("rounded-lg p-3 [&_*]:size-7", bg, text)}>{mapIcon(icon)}</div>
				<div className="flex flex-col gap-1">
					<h2 className="text-sm font-medium leading-5 tracking-normal text-gray-900">{title}</h2>
					<p className="text-sm font-normal leading-5 tracking-normal text-gray-500">{subtitle}</p>
				</div>
			</div>
			<Button
				intent="outline"
				endContent={<Play className="size-5" />}
				onPress={onStartEvent}
				isLoading={isLoading}
				isDisabled={isDisabled}
			>
				Commencer
			</Button>
		</div>
	);
}
