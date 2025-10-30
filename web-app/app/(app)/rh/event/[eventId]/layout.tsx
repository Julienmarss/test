import { getEvent } from "@/api/event/events.api";
import HeaderBar from "@/components/HeaderBar";
import EventBreadcrumb from "@/components/rh/event/EventBreadCrumb";
import { EventProvider } from "@/components/utils/EventProvider";

export default async function EventLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ eventId: string }>;
}) {
	const { eventId } = await params;
	const event = await getEvent(eventId);

	return (
		<EventProvider event={event}>
			<div className="h-[calc(100vh_-16px)] overflow-hidden border border-gray-200 bg-gray-100">
				<HeaderBar breadcrumb={<EventBreadcrumb />} searchbar={<p>Searchbar</p>} className="sticky top-0 z-30" />
				<main className="relative flex h-full justify-center">{children}</main>
			</div>
		</EventProvider>
	);
}
