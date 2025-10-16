"use client";

import React, { Component, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false };

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: any) {
		console.error("Erreur capturée par ErrorBoundary:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex h-screen w-full flex-col items-center justify-center">
					<h1 className={"text-4xl text-red-600"}>Une erreur s'est produite</h1>
					<span className={"text-gray-500"}>Veuillez nous excuser pour la gêne occasionnée.</span>
					<span className={"text-gray-600"}>Si l'erreur persiste, veuillez nous contacter.</span>
				</div>
			);
		}
		return this.props.children;
	}
}
