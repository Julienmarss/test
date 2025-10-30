"use client";

import { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import { Skeleton } from "@/components/ui/hero-ui/Skeleton";
import { EventDocData } from "@/api/event/events.dto";

type Props = {
	data?: EventDocData;
	isPending: boolean;
	isError: boolean;
	className?: string;
	height?: string;
};

export default function EventDocViewer({ data, isPending, isError, className, height = "90vh" }: Props) {
	const docRef = useRef<HTMLDivElement>(null);
	const viewportRef = useRef<HTMLDivElement>(null);
	const [renderError, setRenderError] = useState<string | null>(null);
	const [zoom, setZoom] = useState(1);

	const isDocx =
		!!data?.mimeType?.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
		!!data?.fileName?.toLowerCase().endsWith(".docx");

	// Rendu du .docx
	useEffect(() => {
		let aborted = false;
		setRenderError(null);

		if (data?.arrayBuffer && isDocx && docRef.current) {
			docRef.current.innerHTML = "";

			renderAsync(data.arrayBuffer, docRef.current, undefined, {
				className: "docx",
				inWrapper: true,
			}).catch((e) => {
				if (!aborted) setRenderError(e?.message || "Rendu .docx impossible");
			});
		}

		return () => {
			aborted = true;
			if (docRef.current) docRef.current.innerHTML = "";
		};
	}, [data?.arrayBuffer, isDocx]);

	useEffect(() => {
		const el = viewportRef.current;
		if (!el) return;

		function onWheel(e: WheelEvent) {
			if (!e.ctrlKey) return;

			e.preventDefault();

			setZoom((z) => {
				const next = z * (e.deltaY < 0 ? 1.1 : 0.9); // +10% ou -10%
				// on borne un peu pour pas exploser
				return Math.min(4, Math.max(0.3, next));
			});
		}

		el.addEventListener("wheel", onWheel, { passive: false });
		return () => {
			el.removeEventListener("wheel", onWheel);
		};
	}, []);

	if (isPending) {
		return (
			<div className="prose max-w-none overflow-scroll rounded border p-4" style={{ height }}>
				<div className="flex h-full justify-center bg-[gray] p-[30px] pb-0">
					<section className="h-full w-[595.45pt] bg-white p-[72pt] shadow-[0_0_10px_rgba(0,0,0,0.5)]">
						<Skeleton className="mb-3 h-4 w-60 rounded-sm" />
						<Skeleton className="mb-3 h-4 w-52 rounded-sm" />
						<Skeleton className="mb-10 h-4 w-60 rounded-sm" />
						<Skeleton className="mb-3 h-4 w-full rounded-sm" />
						<Skeleton className="mb-3 h-4 w-full rounded-sm" />
						<Skeleton className="mb-10 h-4 w-52 rounded-sm" />
						<Skeleton className="mb-3 h-4 w-full rounded-sm" />
						<Skeleton className="mb-3 h-4 w-60 rounded-sm" />
					</section>
				</div>
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className={`rounded border p-4 text-sm text-red-600 ${className ?? ""}`}>
				Impossible de charger le document.
			</div>
		);
	}

	// Cas non-docx
	if (!isDocx) {
		const urlForIframe = data.url
			? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(data.url)}`
			: undefined;

		if (!urlForIframe) {
			return (
				<div className="rounded border bg-amber-50 p-4 text-sm text-amber-700">
					Format non supporté en rendu direct et aucune URL publique disponible.
				</div>
			);
		}

		return (
			<div ref={viewportRef} className={`overflow-auto rounded border ${className ?? ""}`} style={{ height }}>
				<div
					style={{
						transform: `scale(${zoom})`,
						transformOrigin: "top left",
						width: "100%",
					}}
					className="origin-top-left"
				>
					<iframe src={urlForIframe} title="Document" className="w-full border-0" style={{ height }} />
				</div>
			</div>
		);
	}

	// Cas DOCX rendu en HTML
	return (
		<div ref={viewportRef} className={`overflow-auto rounded border p-4 ${className ?? ""}`} style={{ height }}>
			<div
				style={{
					transform: `scale(${zoom})`,
					transformOrigin: "top left",
				}}
				className="origin-top-left"
			>
				<div ref={docRef} className="prose max-w-none">
					{renderError && (
						<div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{renderError}</div>
					)}
				</div>
			</div>
		</div>
	);
}
