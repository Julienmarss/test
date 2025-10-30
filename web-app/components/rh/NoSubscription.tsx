export default function NoSubscription({ onSubscribe }: { onSubscribe?: () => void }) {
	// TODO temporaire, créé avec ChatGPT pour la forme
	return (
		<section className="flex w-full items-center justify-center px-4 py-16">
			<div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
				<header className="mb-6 text-center">
					<h2 className="text-2xl font-semibold text-slate-900">Abonnement</h2>
					<p className="mt-1 text-sm text-slate-500">Le Copilote RH, au prix le plus simple.</p>
				</header>

				<div className="mb-8 flex items-end justify-center gap-2">
					<span className="text-5xl font-bold leading-none text-slate-900">5€</span>
					<div className="pb-1 text-sm text-slate-500">
						<span className="block">par collaborateur</span>
						<span className="block">par mois</span>
					</div>
				</div>

				<ul className="mb-8 space-y-2 text-sm text-slate-700">
					<li className="flex items-center gap-2">
						<span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-600" />
						Gestion RH centralisée
					</li>
					<li className="flex items-center gap-2">
						<span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-600" />
						Conformité et suivi automatisé
					</li>
					<li className="flex items-center gap-2">
						<span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-600" />
						Support prioritaire par e-mail
					</li>
				</ul>

				<button
					type="button"
					onClick={onSubscribe}
					className="group inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-white transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200 active:bg-sky-800"
				>
					Souscrire
					<svg
						className="ml-2 h-5 w-5 transition group-hover:translate-x-0.5"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M5 12h14M13 5l7 7-7 7"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>

				<p className="mt-3 text-center text-xs text-slate-400">
					Prix HT. Facturation mensuelle selon le nombre de collaborateurs actifs.
				</p>
			</div>
		</section>
	);
}
