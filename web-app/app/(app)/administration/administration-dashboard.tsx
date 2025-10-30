"use client";

import { useDeleteAdministrator } from "@/api/administrator/administrators.api";
import { useAdministrators, useExportAdministrators } from "@/api/administration/administration.api";
import { OutlineButton } from "@/components/ui/buttons/OutlineButton";

export default function AdministrationDashboard() {
	const { data: administrators } = useAdministrators();
	const { mutate: deleteAdministrator } = useDeleteAdministrator();
	const { mutate: exportAdministrators } = useExportAdministrators();

	return (
		<article className="bg-sky-50">
			<div className="min-h-[89vh] overflow-x-auto bg-gray-50 p-8">
				<h1 className="my-5 text-2xl text-gray-900">Administration</h1>

				<section className="mb-4 flex items-center justify-between border-t border-gray-200 pt-4">
					<p className="text-md text-sky-600">
						Il y a actuellement {administrators?.length} administrateur(s) sur la plateforme.
					</p>
					<OutlineButton onClick={() => exportAdministrators()}>Exporter</OutlineButton>
				</section>

				<table className="w-full">
					<thead className="rounded-t-lg border border-gray-100">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-bold">Prénom Nom</th>
							<th className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-900">Email</th>
							<th className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-900">Téléphone</th>
							<th className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-900">Fonction</th>
							<th className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-900">Rôles</th>
							<th className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-900">Entreprises</th>
							<th className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-900">Actions</th>
						</tr>
					</thead>
					<tbody className="bg-white">
						{administrators?.map((collaborator) => (
							<tr key={collaborator.id}>
								<td className="whitespace-nowrap px-6 py-4">
									<div className="text-sm text-gray-900">
										{collaborator.firstname} {collaborator.lastname}
									</div>
								</td>
								<td className="whitespace-nowrap px-6 py-4">
									<div className="text-sm text-gray-900">{collaborator.email}</div>
								</td>
								<td className="whitespace-nowrap px-6 py-4">
									<div className="text-sm text-gray-900">{collaborator.phone}</div>
								</td>
								<td className="whitespace-nowrap px-6 py-4">
									<div className="text-sm text-gray-900">{collaborator.fonction}</div>
								</td>
								<td className="whitespace-nowrap px-6 py-4">
									<div className="text-sm text-gray-900">{collaborator.roles.join(", ")}</div>
								</td>
								<td className="whitespace-nowrap px-6 py-4">
									<div className="text-sm text-gray-900">
										{collaborator.companies.map((company) => company.name).join(", ")}
									</div>
								</td>
								<td className="flex whitespace-nowrap px-6 py-4">
									{/*<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 cursor-pointer text-blue-500">*/}
									{/*    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />*/}
									{/*</svg>*/}

									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6 cursor-pointer text-red-500"
										onClick={() => deleteAdministrator(collaborator.id)}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
										/>
									</svg>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</article>
	);
}
