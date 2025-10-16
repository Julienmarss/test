"use client";

import { CloudArrow } from "@/components/ui/icons/CloudArrow";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function isFileDrag(e: DragEvent) {
	return Array.from(e.dataTransfer?.types ?? []).includes("Files");
}

export function DropAnywhereUploader({
	onFiles,
	acceptedExt,
}: {
	onFiles: (files: File[]) => void;
	acceptedExt: Set<string>;
}) {
	const [dragDepth, setDragDepth] = useState(0);
	const [visible, setVisible] = useState(false);

	function fileAccepted(f: File) {
		if (f.type.startsWith("image/")) return true;
		const ext = f.name.split(".").pop()?.toLowerCase();
		return !!ext && acceptedExt.has(ext);
	}

	useEffect(() => {
		const onDragOver = (e: DragEvent) => {
			if (!isFileDrag(e)) return;
			e.preventDefault();
		};

		const onDragEnter = (e: DragEvent) => {
			if (!isFileDrag(e)) return;
			e.preventDefault();
			setDragDepth((d) => d + 1);
			setVisible(true);
		};

		const onDragLeave = (e: DragEvent) => {
			if (!isFileDrag(e)) return;
			e.preventDefault();
			setDragDepth((d) => {
				const next = d - 1;
				if (next <= 0) {
					setVisible(false);
					return 0;
				}
				return next;
			});
		};

		const onDrop = (e: DragEvent) => {
			if (!isFileDrag(e)) return;
			e.preventDefault();
			const files = Array.from(e.dataTransfer?.files ?? []).filter(fileAccepted);
			setDragDepth(0);
			setVisible(false);
			if (files.length) onFiles(files);
		};

		window.addEventListener("dragover", onDragOver);
		window.addEventListener("dragenter", onDragEnter);
		window.addEventListener("dragleave", onDragLeave);
		window.addEventListener("drop", onDrop);

		return () => {
			window.removeEventListener("dragover", onDragOver);
			window.removeEventListener("dragenter", onDragEnter);
			window.removeEventListener("dragleave", onDragLeave);
			window.removeEventListener("drop", onDrop);
		};
	}, [onFiles]);

	if (!visible) return null;

	// Overlay sur tout l'écran
	return createPortal(
		<div className="fixed inset-0 z-[1000] flex items-center justify-center bg-sky-900/30 backdrop-blur-sm">
			<div className="pointer-events-none flex flex-col items-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-8 py-6 shadow-2xl">
				<CloudArrow className="size-10" />
				<p className="text-sm text-gray-700">Déposez vos fichiers ici</p>
				<p className="text-xs text-gray-500">PNG, JPG, PDF, DOC, XLS, PPT…</p>
			</div>
		</div>,
		document.body,
	);
}
