"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
	ModifyAdministratorRequest,
	useAdministrator,
	useDeleteAdministrator,
	useModifyAdministrator,
	useModifyAdministratorPicture,
} from "@/api/administrator/administrators.api";
import { PageSpinner } from "@/components/ui/icons/Spinner";
import { FonctionRequest } from "@/app/signup/signup.service";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Header } from "@/app/admin/components/Header";
import { OutlineButton } from "@/components/ui/buttons/OutlineButton";
import { DeleteAccountModal } from "@/app/settings/DeleteAccountModal";
import { CONVENTIONS_COLLECTIVES, getConventionCollectiveByIDCC } from "@/data/conventions-collectives";
import _ from "lodash";
import CompanySearch from "../signup/components/CompanySearch";
import { CompanyDto } from "../api/pappers/route";
import { useModifyCompanyPicture, useMyCompanyRights } from "@/api/company/company.api";
import Link from "next/link";
import { useForgottenPassword } from "@/api/administrator/administrators.auth.api";
import ManageRight from "@/components/settings/ManageRight";
import { ROLE_OPTIONS, RoleOption } from "@/data/roles";

export default function SettingsPage() {
	const { data: session, status } = useSession();
	const fileAdminInputRef = useRef<HTMLInputElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const adminId = session?.user?.id;
	const { data: existingAdministrator, isPending } = useAdministrator(adminId);
	const { mutate: modify, isPending: modifyPending } = useModifyAdministrator();
	const { mutate: modifyPicture, isPending: modifyPicturePending } = useModifyAdministratorPicture();
	const { mutate: modifyPictureCompany, isPending: modifyPictureCompanyPending } = useModifyCompanyPicture();
	const { mutate: forgottenPassword } = useForgottenPassword();
	const { mutate: deleteAdmin } = useDeleteAdministrator();
	const [admin, setAdmin] = useState<ModifyAdministratorRequest>();

	const companyId = existingAdministrator?.companies?.[0]?.id;
	const { data: myRights, isPending: rightsLoading } = useMyCompanyRights(companyId);
	const isOwner = myRights?.right === "OWNER";
	const isManager = myRights?.right === "MANAGER";

	useEffect(() => {
		if (existingAdministrator && myRights) {
			const company = existingAdministrator?.companies?.[0];

			setAdmin({
				..._.omit(existingAdministrator, ["companies"]),
				...(company
					? {
							idCompany: company.id,
							companyName: company.name,
							siren: company.siren,
							siret: company.siret,
							legalForm: company.legalForm,
							nafCode: company.nafCode,
							principalActivity: "",
							activityDomain: company.activityDomain,
							collectiveAgreement: company.collectiveAgreement?.titre,
							idcc: company.collectiveAgreement?.idcc,
							companyPicture: company.picture,
						}
					: {}),
			});
		}
	}, [existingAdministrator, myRights]);

	const debouncedSave = useMemo(
		() =>
			_.debounce((data: ModifyAdministratorRequest) => {
				if (adminId) {
					console.log("💾 Saving data:", data); // Debug
					modify({ id: adminId, request: data });
				}
			}, 2000),
		[adminId, modify],
	);
	const roleOptions: RoleOption[] = useMemo(() => ROLE_OPTIONS.map(({ value, label }) => ({ value, label })), []);

	useEffect(() => {
		return () => {
			debouncedSave.cancel();
		};
	}, [debouncedSave]);

	const modifyAdmin = useCallback(
		(payload: Partial<ModifyAdministratorRequest>) => {
			setAdmin((prev) => {
				if (!prev) return prev;
				const newAdmin = { ...prev, ...payload };
				debouncedSave(newAdmin);
				return newAdmin;
			});
		},
		[debouncedSave],
	);

	const handleCompanySelect = (company: CompanyDto) => {
		if (!isOwner) return;

		const idcc = company.conventions_collectives?.[0]?.idcc || "";
		const conventionCollective = idcc ? getConventionCollectiveByIDCC(idcc) : "";

		modifyAdmin({
			companyName: company.nom_entreprise || company.denomination || "",
			siren: company.siren,
			siret: company.siege.siret,
			nafCode: company.code_naf,
			principalActivity: company.libelle_code_naf,
			legalForm: company.forme_juridique,
			activityDomain: company.domaine_activite,
			idcc: `${idcc}`,
			collectiveAgreement: conventionCollective,
		});
	};

	if (status === "loading" || isPending || rightsLoading || !admin || !adminId) {
		return <PageSpinner />;
	}

	return (
		<article className="h-full w-full bg-gray-50">
			<Header />

			<article className="flex flex-col bg-gray-50 px-[10vw]">
				<h1 className="my-5 text-2xl text-gray-900">Réglages</h1>

				{/* Section Administrateur (tous peuvent modifier) */}
				<section className="flex w-full flex-col border-t border-gray-200 pt-5 md:flex-row">
					<div className="mb-4 flex w-full flex-col text-center md:mb-0 md:w-1/2 md:text-start">
						<h2 className="text-gray-900">Informations sur le collaborateur</h2>
					</div>

					<div className="flex w-full flex-col md:w-1/2">
						<div className="flex w-full flex-col items-center gap-2 space-x-4 md:flex-row md:gap-0">
							{admin.picture && admin.picture.length > 0 ? (
								<img src={admin.picture} alt="Avatar de l'utilisateur" className="h-20 w-20 rounded-full bg-white" />
							) : (
								<div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-600 text-sm font-medium">
									{(session?.user.firstname?.[0] ?? "") + (session?.user.lastname?.[0] ?? "")}
								</div>
							)}
							<input
								type="file"
								className="hidden"
								onChange={(e) => {
									if (e.target.files && e.target.files[0]) modifyPicture({ file: e.target.files[0], id: adminId });
								}}
								ref={fileAdminInputRef}
							/>
							<OutlineButton onClick={() => fileAdminInputRef.current?.click()} disabled={modifyPicturePending}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6 text-gray-500"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
									/>
								</svg>
								Ajouter une photo
							</OutlineButton>
						</div>

						<div className="mt-4 flex w-full flex-col gap-4 md:flex-row md:gap-0 md:space-x-4">
							<Input
								label="Nom"
								value={admin.lastname}
								placeholder={"Saisissez votre nom"}
								onChange={(e) => modifyAdmin({ lastname: e.target.value })}
								disabled={modifyPending}
							/>
							<Input
								label="Prénom"
								value={admin.firstname}
								placeholder={"Saisissez votre prénom"}
								onChange={(e) => modifyAdmin({ firstname: e.target.value })}
								disabled={modifyPending}
							/>
						</div>

						<Select
							label="Rôle"
							placeholder="Votre rôle dans l'entreprise"
							value={admin.fonction}
							onChange={(value) => modifyAdmin({ fonction: value as FonctionRequest })}
							options={[
								{ value: "Dirigeant", label: "Dirigeant" },
								{ value: "RH", label: "Responsable RH" },
								{ value: "Juridique", label: "Juridique" },
								{ value: "Comptabilité", label: "Comptabilité" },
								{ value: "Expert-comptable", label: "Expert-comptable" },
								{ value: "RH Externe", label: "RH Externe" },
							]}
							classNameLabel="mt-4"
							isClearable={false}
							disabled={modifyPending}
						/>

						<Input
							label="Email"
							value={admin.email}
							placeholder={"Saisissez votre email"}
							classNameLabel="mt-4"
							onChange={(e) => modifyAdmin({ email: e.target.value })}
							disabled={modifyPending}
						/>

						<Input
							type="tel"
							label="Téléphone"
							value={admin.phone}
							placeholder={"Ex: (+33) 6 00 00 00 00"}
							classNameLabel="mt-4"
							onChange={(e) => modifyAdmin({ phone: e.target.value })}
							disabled={modifyPending}
						/>
					</div>
				</section>

				{/* Section Company - Visible pour TOUT LE MONDE */}
				{companyId && (
					<section className="mt-5 flex w-full flex-col gap-5 border-t border-gray-200 pt-5">
						<div className="flex flex-col md:flex-row">
							<div className="mb-4 flex w-full flex-col text-center md:mb-0 md:w-1/2 md:text-start">
								<h2 className="text-gray-900">Informations sur l'entreprise</h2>
							</div>

							<div className="flex w-full flex-col md:w-1/2">
								<div className="flex w-full flex-col items-center gap-2 space-x-4 md:flex-row md:gap-0">
									{admin.companyPicture && admin.companyPicture.length > 0 ? (
										<div
											className="h-20 w-20 rounded-full"
											style={{
												backgroundImage: `url(${admin.companyPicture})`,
												backgroundPosition: "center",
												backgroundSize: "cover",
												backgroundRepeat: "no-repeat",
											}}
										/>
									) : (
										<div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-600 text-sm font-medium">
											{admin.companyName?.[0]}
										</div>
									)}
									<input
										type="file"
										className="hidden"
										onChange={(e) => {
											if (e.target.files && e.target.files[0] && admin.idCompany)
												modifyPictureCompany({ file: e.target.files[0], id: admin.idCompany });
										}}
										ref={fileInputRef}
									/>
									<OutlineButton
										onClick={() => fileInputRef.current?.click()}
										disabled={!isOwner || modifyPictureCompanyPending}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="size-6 text-gray-500"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
											/>
										</svg>
										Ajouter une photo
									</OutlineButton>
								</div>

								<div className="mt-4">
									{isOwner ? (
										<CompanySearch
											onCompanySelect={handleCompanySelect}
											placeholder="Le nom de votre entreprise"
											value={admin.companyName}
										/>
									) : (
										<Input
											label="Le nom de votre entreprise"
											value={admin.companyName}
											placeholder="Le nom de votre entreprise"
											disabled={true}
										/>
									)}
								</div>

								<div className="mt-4 flex w-full flex-col gap-4 md:flex-row md:gap-0 md:space-x-4">
									<Input
										label="SIREN"
										value={admin.siren}
										placeholder={"Saisissez votre SIREN"}
										onChange={(e) => modifyAdmin({ siren: e.target.value })}
										disabled={!isOwner || modifyPending}
									/>
									<Input
										label="SIRET (siège)"
										value={admin.siret}
										placeholder={"Saisissez votre SIRET"}
										onChange={(e) => modifyAdmin({ siret: e.target.value })}
										disabled={!isOwner || modifyPending}
									/>
								</div>

								<Input
									label="Forme juridique"
									value={admin.legalForm}
									placeholder={"Saisissez votre forme juridique"}
									onChange={(e) => modifyAdmin({ legalForm: e.target.value })}
									classNameLabel="mt-4"
									disabled={!isOwner || modifyPending}
								/>

								<Input
									label="Activité principale"
									value={admin.principalActivity}
									placeholder={"Saisissez votre activité principale"}
									onChange={(e) => modifyAdmin({ principalActivity: e.target.value })}
									classNameLabel="mt-4"
									disabled={!isOwner || modifyPending}
								/>

								<div className="mt-4 flex w-full flex-col gap-4 md:flex-row md:gap-0 md:space-x-4">
									<Input
										label="Code NAF ou APE"
										value={admin.nafCode}
										placeholder={"Saisissez votre code NAF ou APE"}
										onChange={(e) => modifyAdmin({ nafCode: e.target.value })}
										disabled={!isOwner || modifyPending}
									/>
									<Input
										label="Domaine d'activité"
										value={admin.activityDomain}
										placeholder={"Saisissez votre domaine d'activité"}
										onChange={(e) => modifyAdmin({ activityDomain: e.target.value })}
										disabled={!isOwner || modifyPending}
									/>
								</div>

								<Select
									label="Convention collective"
									value={admin.idcc}
									onChange={(value) => modifyAdmin({ idcc: value as string })}
									placeholder="Selectionnez votre convention collective"
									options={Object.entries(CONVENTIONS_COLLECTIVES).map(([idcc, label]) => ({
										value: idcc,
										label: `${idcc} - ${label}`,
									}))}
									classNameLabel="mt-4"
									disabled={!isOwner || modifyPending}
									isSearchable={isOwner}
								/>
							</div>
						</div>
						{(isOwner || isManager) && <ManageRight />}
					</section>
				)}

				<section className="mt-5 flex w-full flex-col items-center border-t border-gray-200 pt-5 md:flex-row">
					<div className="mb-4 flex w-full flex-col text-center md:mb-0 md:w-1/2 md:text-start">
						<h2 className="text-gray-900">Informations sur votre compte Légipilot</h2>
					</div>

					<Link
						href=""
						onClick={() => {
							if (admin?.email) forgottenPassword({ email: admin.email });
						}}
						className="text-xs underline"
					>
						Mot de passe oublié ?
					</Link>
				</section>

				<section className="mb-5 mt-5 flex w-full flex-col items-center border-t border-gray-200 pt-5 md:flex-row">
					<div className="mb-4 flex w-full flex-col text-center md:mb-0 md:w-1/2 md:text-start">
						<h2 className="text-red-900">Supprimer votre compte LegiPilot</h2>
					</div>

					<DeleteAccountModal adminId={adminId} deleteAdmin={deleteAdmin} />
				</section>
			</article>
		</article>
	);
}
