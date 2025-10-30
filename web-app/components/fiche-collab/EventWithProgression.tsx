import { ActionDto, EventOverview } from "@/api/event/events.dto";
import { Button } from "../ui/hero-ui/Button";
import { CircularProgress } from "../ui/hero-ui/CircularProgress";
import { cn } from "@/utils/lib";
import { useRouter } from "next/navigation";

const STROKES = {
	low_0_24: "stroke-[#E7000B]", // 0–24
	mid_25_49: "stroke-[#F54A00]", // 25–49
	mid_50_74: "stroke-[#FF8904]", // 50–74
	high_75_100: "stroke-[#00A63E]", // 75–100
};

function progressClass(value: number) {
	const v = Math.max(0, Math.min(100, Math.round(value)));
	if (v >= 75) return STROKES.high_75_100;
	if (v >= 50) return STROKES.mid_50_74;
	if (v >= 25) return STROKES.mid_25_49;
	return STROKES.low_0_24;
}

export default function EventWithProgression({ event }: { event: EventOverview }) {
	const router = useRouter();

	const progressValue = event.actions?.length
		? (event.actions.filter((a) => a.state === "COMPLETED").length / event.actions.length) * 100
		: 0;

	return (
		<section className="flex w-full items-center justify-between gap-5 border-x border-t border-gray-100 bg-white px-5 py-6 first:rounded-t-lg last:rounded-b-lg last:border-b odd:bg-gray-50">
			<CircularProgress
				aria-label="Pourcentage de complétion"
				value={progressValue}
				showValueLabel
				classNames={{
					svg: "w-11 h-11",
					indicator: cn(progressClass(progressValue), "![stroke-linecap:square]"),
					value: cn(
						"font-black leading-4 text-[10px] tracking-normal text-gray-500",
						progressValue === 100 && "text-[#0D542B]",
					),
				}}
			/>
			<div className="flex-1">
				<p className="text-sm font-medium leading-5 tracking-normal text-gray-900">{event.title}</p>
				<p className="text-sm font-normal leading-5 tracking-normal text-gray-500">{event.subtitle}</p>
			</div>
			<Button intent="outline" onPress={() => router.push(`/rh/event/${event.id}`)}>
				Accéder à la page
			</Button>
		</section>
	);
}
