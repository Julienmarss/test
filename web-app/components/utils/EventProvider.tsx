"use client";

import { createContext, useContext, useState } from "react";
import { CollaboratorEvent } from "@/api/event/events.dto";

type EventContextType = {
	event: CollaboratorEvent;
	setEvent: React.Dispatch<React.SetStateAction<CollaboratorEvent>>;
};

const EventContext = createContext<EventContextType | null>(null);

export const useEvent = () => {
	const ctx = useContext(EventContext);
	if (!ctx) throw new Error("useEvent must be used within EventProvider");
	return ctx;
};

export const EventProvider = ({ event, children }: { event: CollaboratorEvent; children: React.ReactNode }) => {
	const [eventInfo, setEventInfo] = useState<CollaboratorEvent>(event);

	return <EventContext.Provider value={{ event: eventInfo, setEvent: setEventInfo }}>{children}</EventContext.Provider>;
};
