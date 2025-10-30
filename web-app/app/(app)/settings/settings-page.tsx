"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	ModifyAdministratorRequest,
	useAdministrator,
	useDeleteAdministrator,
	useModifyAdministrator,
	useModifyAdministratorPicture,
} from "@/api/administrator/administrators.api";
import { CONVENTIONS_COLLECTIVES } from "@/data/conventions-collectives";
import {
	ModifyCompanyRequest,
	useModifyCompany,
	useModifyCompanyPicture,
	useMyCompanyRights,
} from "@/api/company/company.api";
import _ from "lodash";
import { FonctionRequest } from "@/app/signup/signup.service";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { OutlineButton } from "@/components/ui/buttons/OutlineButton";
import { DeleteAccountModal } from "@/app/(app)/settings/DeleteAccountModal";
import Link from "next/link";
import { useForgottenPassword } from "@/api/administrator/administrators.auth.api";
import ManageRight from "@/components/settings/ManageRight";
import { useSelectedCompany } from "@/components/utils/CompanyProvider";
import { Button } from "@/components/ui/hero-ui/Button";

export default function SettingsPage() {
	const { data: session, status } = useSession();
	const { company: selectedCompany } = useSelectedCompany();
	const fileAdminInputRef = useRef<HTMLInputElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const adminId = session?.user?.id;
	const { data: existingAdministrator, isPending } = useAdministrator(adminId);
	const { mutate: modifyAdminMutation, isPending: modifyPending } = useModifyAdministrator();
	const { mutate: modifyPicture, isPending: modifyPicturePending } = useModifyAdministratorPicture();
	const { mutate: forgottenPassword } = useForgottenPassword();
	const { mutate: deleteAdmin } = useDeleteAdministrator();
	const [admin, setAdmin] = useState<ModifyAdministratorRequest | null>(null);

	const companyId = selectedCompany?.id;
	const { data: myRights, isPending: rightsLoading } = useMyCompanyRights(companyId);
	const { mutate: modifyCompanyMutation, isPending: modifyCompanyPending } = useModifyCompany();
	const { mutate: modifyPictureCompany, isPending: modifyPictureCompanyPending } = useModifyCompanyPicture();
	const [company, setCompany] = useState<ModifyCompanyRequest | null>(null);

	const isOwner = myRights?.right === "OWNER";
	const isManager = myRights?.right === "MANAGER";

	useEffect(() => {
		if (existingAdministrator) {
			setAdmin({
				firstname: existingAdministrator.firstname,
				lastname: existingAdministrator.lastname,
				email: existingAdministrator.email,
				phone: existingAdministrator.phone,
				fonction: existingAdministrator.fonction,
				isNewsViewed: existingAdministrator.isNewsViewed,
				isNotifViewed: existingAdministrator.isNotifViewed,
			});
		}
	}, [existingAdministrator]);

	useEffect(() => {
		if (selectedCompany) {
			setCompany({
				id: selectedCompany.id,
				companyName: selectedCompany.name,
				siren: selectedCompany.siren,
				siret: selectedCompany.siret,
				legalForm: selectedCompany.legalForm,
				nafCode: selectedCompany.nafCode,
				principalActivity: selectedCompany.principalActivity,
				activityDomain: selectedCompany.activityDomain,
				collectiveAgreementTitle: selectedCompany.collectiveAgreement.titre,
				idcc: selectedCompany.collectiveAgreement.idcc,
			});
		}
	}, [selectedCompany]);

	const debouncedSaveAdmin = useMemo(
		() =>
			_.debounce((data: ModifyAdministratorRequest) => {
				if (adminId) {
					modifyAdminMutation({ id: adminId, request: data });
				}
			}, 2000),
		[adminId, modifyAdminMutation],
	);

	useEffect(() => {
		return () => {
			debouncedSaveAdmin.cancel();
		};
	}, [debouncedSaveAdmin]);

	const modifyAdmin = useCallback(
		(payload: Partial<ModifyAdministratorRequest>) => {
			setAdmin((prev) => {
				if (!prev) return prev;
				const newAdmin = { ...prev, ...payload };
				debouncedSaveAdmin(newAdmin);
				return newAdmin;
			});
		},
		[debouncedSaveAdmin],
	);

	const modifyCompany = useCallback((payload: Partial<ModifyCompanyRequest>) => {
		setCompany((prev) => {
			if (!prev) return prev;
			return { ...prev, ...payload };
		});
	}, []);

	const handleSaveCompany = useCallback(() => {
		if (company && isOwner) {
			modifyCompanyMutation(company);
		}
	}, [company, isOwner, modifyCompanyMutation]);

	return (
		<article className="h-full w-full bg-gray-50">
			<article className="flex flex-col bg-gray-50 px-[10vw]">
				<h1 className="my-5 text-2xl text-gray-900">Réglages</h1>

				{/* ============================================ */}
				{/* SECTION ADMINISTRATEUR                       */}
				{/* ============================================ */}
				<section className="flex w-full flex-col border-t border-gray-200 pt-5 md:flex-row">
					<div className="mb-4 flex w-full flex-col text-center md:mb-0 md:w-1/2 md:text-start">
						<h2 className="text-gray-900">Informations sur le collaborateur</h2>
					</div>

					<div className="flex w-full flex-col md:w-1/2">
						<div className="flex w-full flex-col items-center gap-2 space-x-4 md:flex-row md:gap-0">
							{existingAdministrator?.picture && existingAdministrator.picture.length > 0 ? (
								<img
									src={existingAdministrator.picture}
									alt="Avatar de l'utilisateur"
									className="h-20 w-20 rounded-full bg-white"
								/>
							) : (
								<div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-600 text-sm font-medium">
									{(session?.user.firstname?.[0] ?? "") + (session?.user.lastname?.[0] ?? "")}
								</div>
							)}
							<input
								type="file"
								className="hidden"
								onChange={(e) => {
									if (e.target.files && e.target.files[0]) modifyPicture({ file: e.target.files[0], id: adminId! });
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
								value={admin ? admin.lastname : ""}
								placeholder="Saisissez votre nom"
								onChange={(e) => modifyAdmin({ lastname: e.target.value })}
								disabled={modifyPending}
							/>
							<Input
								label="Prénom"
								value={admin ? admin.firstname : ""}
								placeholder="Saisissez votre prénom"
								onChange={(e) => modifyAdmin({ firstname: e.target.value })}
								disabled={modifyPending}
							/>
						</div>

						<Select
							label="Rôle"
							placeholder="Votre rôle dans l'entreprise"
							value={admin ? admin.fonction : ""}
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
							value={admin ? admin.email : ""}
							placeholder="Saisissez votre email"
							classNameLabel="mt-4"
							onChange={(e) => modifyAdmin({ email: e.target.value })}
							disabled={modifyPending}
						/>

						<Input
							type="tel"
							label="Téléphone"
							value={admin ? admin.phone : ""}
							placeholder="Ex: (+33) 6 00 00 00 00"
							classNameLabel="mt-4"
							onChange={(e) => modifyAdmin({ phone: e.target.value })}
							disabled={modifyPending}
						/>
					</div>
				</section>

				{/* ============================================ */}
				{/* SECTION ENTREPRISE                           */}
				{/* ============================================ */}
				{companyId && company && (
					<section className="mt-5 flex w-full flex-col gap-5 border-t border-gray-200 pt-5">
						<div className="flex flex-col md:flex-row">
							<div className="mb-4 flex w-full flex-col text-center md:mb-0 md:w-1/2 md:text-start">
								<h2 className="text-gray-900">Informations sur l'entreprise</h2>
							</div>

							<div className="flex w-full flex-col md:w-1/2">
								<div className="flex w-full flex-col items-center gap-2 space-x-4 md:flex-row md:gap-0">
									{selectedCompany?.picture && selectedCompany.picture.length > 0 ? (
										<div
											className="h-20 w-20 rounded-full"
											style={{
												backgroundImage: `url(${selectedCompany.picture})`,
												backgroundPosition: "center",
												backgroundSize: "cover",
												backgroundRepeat: "no-repeat",
											}}
										/>
									) : (
										<div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-600 text-sm font-medium">
											{company.companyName?.[0]}
										</div>
									)}
									<input
										type="file"
										className="hidden"
										onChange={(e) => {
											if (e.target.files && e.target.files[0] && company.id)
												modifyPictureCompany({ file: e.target.files[0], id: company.id });
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

								<Input
									label="Le nom de votre entreprise"
									value={company.companyName}
									placeholder="Le nom de votre entreprise"
									onChange={(e) => modifyCompany({ companyName: e.target.value })}
									classNameLabel="mt-4"
									disabled={!isOwner || modifyCompanyPending}
								/>

								<div className="mt-4 flex w-full flex-col gap-4 md:flex-row md:gap-0 md:space-x-4">
									<Input
										label="SIREN"
										value={company.siren}
										placeholder="Saisissez votre SIREN"
										onChange={(e) => modifyCompany({ siren: e.target.value })}
										disabled={!isOwner || modifyCompanyPending}
									/>
									<Input
										label="SIRET (siège)"
										value={company.siret}
										placeholder="Saisissez votre SIRET"
										onChange={(e) => modifyCompany({ siret: e.target.value })}
										disabled={!isOwner || modifyCompanyPending}
									/>
								</div>

								<Input
									label="Forme juridique"
									value={company.legalForm}
									placeholder="Saisissez votre forme juridique"
									onChange={(e) => modifyCompany({ legalForm: e.target.value })}
									classNameLabel="mt-4"
									disabled={!isOwner || modifyCompanyPending}
								/>

								<Input
									label="Activité principale"
									value={company.principalActivity}
									placeholder="Saisissez votre activité principale"
									onChange={(e) => modifyCompany({ principalActivity: e.target.value })}
									classNameLabel="mt-4"
									disabled={!isOwner || modifyCompanyPending}
								/>

								<div className="mt-4 flex w-full flex-col gap-4 md:flex-row md:gap-0 md:space-x-4">
									<Input
										label="Code NAF ou APE"
										value={company.nafCode}
										placeholder="Saisissez votre code NAF ou APE"
										onChange={(e) => modifyCompany({ nafCode: e.target.value })}
										disabled={!isOwner || modifyCompanyPending}
									/>
									<Input
										label="Domaine d'activité"
										value={company.activityDomain}
										placeholder="Saisissez votre domaine d'activité"
										onChange={(e) => modifyCompany({ activityDomain: e.target.value })}
										disabled={!isOwner || modifyCompanyPending}
									/>
								</div>

								<Select
									label="Convention collective"
									value={company.idcc}
									onChange={(value) => {
										const selectedConvention = CONVENTIONS_COLLECTIVES[value.toString()];
										modifyCompany({
											idcc: value.toString(),
											collectiveAgreementTitle: selectedConvention,
										});
									}}
									placeholder="Sélectionnez votre convention collective"
									options={Object.entries(CONVENTIONS_COLLECTIVES).map(([idcc, label]) => ({
										value: idcc,
										label: `${idcc} - ${label}`,
									}))}
									classNameLabel="mt-4"
									disabled={!isOwner || modifyCompanyPending}
									isSearchable={isOwner}
								/>

								{isOwner && (
									<div className="mt-6 flex justify-end">
										<Button onPress={handleSaveCompany} isDisabled={modifyCompanyPending}>
											{modifyCompanyPending ? "Enregistrement..." : "Mettre à jour l'entreprise"}
										</Button>
									</div>
								)}
							</div>
						</div>
						{(isOwner || isManager) && <ManageRight />}
					</section>
				)}

				{/* ============================================ */}
				{/* SECTION COMPTE                               */}
				{/* ============================================ */}
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

				{/* ============================================ */}
				{/* SECTION SUPPRESSION                          */}
				{/* ============================================ */}
				<section className="mb-5 mt-5 flex w-full flex-col items-center border-t border-gray-200 pt-5 md:flex-row">
					<div className="mb-4 flex w-full flex-col text-center md:mb-0 md:w-1/2 md:text-start">
						<h2 className="text-red-900">Supprimer votre compte LegiPilot</h2>
					</div>

					<DeleteAccountModal adminId={adminId!} deleteAdmin={deleteAdmin} />
				</section>
			</article>
		</article>
	);
}
