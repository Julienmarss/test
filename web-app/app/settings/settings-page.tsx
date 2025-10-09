"use client";

import {
    ModifyAdministratorRequest,
    ROLE_OPTIONS,
    RoleOption,
    useAdministrator,
    useDeleteAdministrator,
    useModifyAdministrator,
    useModifyAdministratorPicture,
} from "@/api/administrator/administrators.api";
import { useForgottenPassword } from "@/api/administrator/administrators.auth.api";
import { useModifyCompanyPicture } from "@/api/company/company.api";
import { useMyRights } from "@/api/company/right.api";
import { Header } from "@/app/admin/components/Header";
import { DeleteAccountModal } from "@/app/settings/DeleteAccountModal";
import { FonctionRequest } from "@/app/signup/signup.service";
import ManageRight from "@/components/settings/ManageRight";
import { OutlineButton } from "@/components/ui/buttons/OutlineButton";
import { PageSpinner } from "@/components/ui/icons/Spinner";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useCompany } from "@/components/utils/CompanyProvider";
import { CONVENTIONS_COLLECTIVES, getConventionCollectiveByIDCC } from "@/data/conventions-collectives";
import _ from "lodash";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CompanyDto } from "../api/pappers/route";
import CompanySearch from "../signup/components/CompanySearch";

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const { company } = useCompany();
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
    const debounceTimeout = useRef<NodeJS.Timeout>(null);

    // ✅ Récupérer les droits de l'utilisateur actuel pour l'entreprise sélectionnée
    const { data: myRights, isLoading: rightsLoading } = useMyRights(company?.id || "");
    const isReadOnly = myRights?.right === "READONLY";
    const isOwner = myRights?.right === "OWNER";
    const isManager = myRights?.right === "MANAGER";
    const canEditCompany = isOwner;
    const canManageRights = isOwner || isManager;

    const roleOptions: RoleOption[] = useMemo(
        () => ROLE_OPTIONS.map(({ value, label }) => ({ value, label })),
        [],
    );

    useEffect(() => {
        if (existingAdministrator && company) {

            setAdmin({
                ..._.omit(existingAdministrator, ["companies"]),
                idCompany: company.id,
                companyName: company.name || "",
                siren: company.siren || "",
                siret: company.siret || "",
                legalForm: company.legalForm || "",
                nafCode: company.nafCode || "",
                principalActivity: "",
                activityDomain: company.activityDomain || "",
                collectiveAgreement: company.collectiveAgreement?.titre || "",
                idcc: company.collectiveAgreement?.idcc || "",
                companyPicture: company.picture || "",
            });
        }
    }, [existingAdministrator, company]);

    const modifyAdmin = (payload: ModifyAdministratorRequest) => {
        setAdmin({ ...admin, ...payload });
    };

    const handleCompanySelect = (companyDto: CompanyDto) => {
        const idcc = companyDto.conventions_collectives?.[0]?.idcc || "";
        const conventionCollective = idcc ? getConventionCollectiveByIDCC(idcc) : "";

        setAdmin({
            ...admin,
            companyName: companyDto.nom_entreprise || companyDto.denomination || "",
            siren: companyDto.siren,
            siret: companyDto.siege.siret,
            nafCode: companyDto.code_naf,
            principalActivity: companyDto.libelle_code_naf,
            legalForm: companyDto.forme_juridique,
            activityDomain: companyDto.domaine_activite,
            idcc: `${idcc}`,
            collectiveAgreement: conventionCollective,
        });
    };

    useEffect(() => {
        if (!adminId || !admin || isReadOnly) return;

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            modify({
                id: adminId,
                request: admin,
            });
        }, 2000);

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [admin, isReadOnly, adminId, modify]);

    if (status === "loading" || isPending || rightsLoading || !admin || !adminId) {
        return <PageSpinner />;
    }

    // ✅ Vérifier qu'on a bien les droits chargés
    if (!myRights && company?.id) {
        return <PageSpinner />;
    }

    return (
        <article className="h-full w-full bg-gray-50">
            <Header />

            <article className="flex flex-col bg-gray-50 px-[10vw]">
                <h1 className="my-5 text-2xl text-gray-900">Réglages</h1>

                {/* ✅ Message d'information en mode ReadOnly */}
                {isReadOnly && (
                    <div className="mb-5 rounded-lg bg-blue-50 border border-blue-200 p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Mode Observateur :</strong> Vous disposez de droits en lecture seule. Vous ne pouvez pas
                            modifier les informations.
                        </p>
                    </div>
                )}

                {isManager && (
                    <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm text-amber-800">
                            <strong>Mode Responsable :</strong> Vous pouvez gérer les utilisateurs mais pas modifier les informations de
                            l'entreprise.
                        </p>
                    </div>
                )}

                {/* Section Informations personnelles */}
                <section className="flex w-full flex-col border-t border-gray-200 pt-5 md:flex-row">
                    <div className="mb-4 flex w-full flex-col text-center md:mb-0 md:w-1/2 md:text-start">
                        <h2 className="text-gray-900">Informations sur le collaborateur</h2>
                    </div>

                    <div className="flex w-full flex-col md:w-1/2">
                        {/* Photo de profil */}
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
                                disabled={isReadOnly}
                            />
                            <OutlineButton onClick={() => fileAdminInputRef.current?.click()} disabled={modifyPicturePending || isReadOnly}>
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

                        {/* Champs personnels */}
                        <div className="mt-4 flex w-full flex-col gap-4 md:flex-row md:gap-0 md:space-x-4">
                            <Input
                                label="Nom"
                                value={admin.lastname}
                                placeholder={"Saisissez votre nom"}
                                onChange={(e) => modifyAdmin({ lastname: e.target.value })}
                                disabled={modifyPending || isReadOnly}
                            />
                            <Input
                                label="Prénom"
                                value={admin.firstname}
                                placeholder={"Saisissez votre prénom"}
                                onChange={(e) => modifyAdmin({ firstname: e.target.value })}
                                disabled={modifyPending || isReadOnly}
                            />
                        </div>

                        <Select
                            label="Rôle"
                            placeholder="Votre rôle dans l'entreprise"
                            value={admin.fonction}
                            onChange={(value) => modifyAdmin({ fonction: value as FonctionRequest })}
                            options={roleOptions}
                            classNameLabel="mt-4"
                            isClearable={false}
                            disabled={modifyPending || isReadOnly}
                        />

                        <Input
                            label="Email"
                            value={admin.email}
                            placeholder={"Saisissez votre email"}
                            classNameLabel="mt-4"
                            onChange={(e) => modifyAdmin({ email: e.target.value })}
                            disabled={modifyPending || isReadOnly}
                        />

                        <Input
                            type="tel"
                            label="Téléphone"
                            value={admin.phone}
                            placeholder={"Ex: (+33) 6 00 00 00 00"}
                            classNameLabel="mt-4"
                            onChange={(e) => modifyAdmin({ phone: e.target.value })}
                            disabled={modifyPending || isReadOnly}
                        />
                    </div>
                </section>

                {/* Section entreprise - Version MODIFIABLE uniquement pour OWNER */}
                {canEditCompany && (
                    <section className="mt-5 flex w-full flex-col gap-5 border-t border-gray-200 pt-5">
                        <div className="flex flex-col md:flex-row">
                            <div className="mb-4 flex w-full flex-col text-center md:mb-0 md:w-1/2 md:text-start">
                                <h2 className="text-gray-900">Informations sur l'entreprise</h2>
                                {existingAdministrator?.companies && existingAdministrator.companies.length > 1 && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Entreprise actuellement sélectionnée : <strong>{company?.name}</strong>
                                    </p>
                                )}
                            </div>

                            <div className="flex w-full flex-col md:w-1/2">
                                {/* Photo entreprise */}
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
                                    <OutlineButton onClick={() => fileInputRef.current?.click()} disabled={modifyPictureCompanyPending}>
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
                                    <CompanySearch
                                        onCompanySelect={handleCompanySelect}
                                        placeholder="Le nom de votre entreprise"
                                        value={admin.companyName}
                                    />
                                </div>

                                <div className="mt-4 flex w-full flex-col gap-4 md:flex-row md:gap-0 md:space-x-4">
                                    <Input
                                        label="SIREN"
                                        value={admin.siren}
                                        placeholder={"Saisissez votre SIREN"}
                                        onChange={(e) => modifyAdmin({ siren: e.target.value })}
                                        disabled={modifyPending}
                                    />
                                    <Input
                                        label="SIRET (siége)"
                                        value={admin.siret}
                                        placeholder={"Saisissez votre SIRET"}
                                        onChange={(e) => modifyAdmin({ siret: e.target.value })}
                                        disabled={modifyPending}
                                    />
                                </div>

                                <Input
                                    label="Forme juridique"
                                    value={admin.legalForm}
                                    placeholder={"Saisissez votre forme juridique"}
                                    onChange={(e) => modifyAdmin({ legalForm: e.target.value })}
                                    classNameLabel="mt-4"
                                    disabled={modifyPending}
                                />

                                <Input
                                    label="Activité principale"
                                    value={admin.principalActivity}
                                    placeholder={"Saisissez votre activité principale"}
                                    onChange={(e) => modifyAdmin({ principalActivity: e.target.value })}
                                    classNameLabel="mt-4"
                                    disabled={modifyPending}
                                />

                                <div className="mt-4 flex w-full flex-col gap-4 md:flex-row md:gap-0 md:space-x-4">
                                    <Input
                                        label="Code NAF ou APE"
                                        value={admin.nafCode}
                                        placeholder={"Saisissez votre code NAF ou APE"}
                                        onChange={(e) => modifyAdmin({ nafCode: e.target.value })}
                                        disabled={modifyPending}
                                    />
                                    <Input
                                        label="Domaine d'activité"
                                        value={admin.activityDomain}
                                        placeholder={"Saisissez votre domaine d'activité"}
                                        onChange={(e) => modifyAdmin({ activityDomain: e.target.value })}
                                        disabled={modifyPending}
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
                                    disabled={modifyPending}
                                    isSearchable={true}
                                />
                            </div>
                        </div>

                    </section>
                )}

                {/* Section entreprise - Version LECTURE SEULE pour MANAGER & READONLY */}
                {!canEditCompany && (
                    <section className="mt-5 flex w-full flex-col gap-5 border-t border-gray-200 pt-5">
                        <div className="flex flex-col md:flex-row">
                            <div className="mb-4 flex w-full flex-col text-center md:mb-0 md:w-1/2 md:text-start">
                                <h2 className="text-gray-900">Informations sur l'entreprise</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    {isReadOnly ? "Lecture seule" : "Consultation uniquement"}
                                </p>
                            </div>

                            <div className="flex w-full flex-col md:w-1/2">
                                {/* Photo entreprise (non modifiable) */}
                                <div className="flex w-full flex-col items-center gap-2 md:flex-row md:gap-0">
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
                                </div>

                                <Input label="Nom de l'entreprise" value={admin.companyName} classNameLabel="mt-4" disabled={true} />

                                <div className="mt-4 flex w-full flex-col gap-4 md:flex-row md:gap-0 md:space-x-4">
                                    <Input label="SIREN" value={admin.siren} disabled={true} />
                                    <Input label="SIRET (siége)" value={admin.siret} disabled={true} />
                                </div>

                                <Input label="Forme juridique" value={admin.legalForm} classNameLabel="mt-4" disabled={true} />
                                <Input label="Activité principale" value={admin.principalActivity} classNameLabel="mt-4" disabled={true} />

                                <div className="mt-4 flex w-full flex-col gap-4 md:flex-row md:gap-0 md:space-x-4">
                                    <Input label="Code NAF ou APE" value={admin.nafCode} disabled={true} />
                                    <Input label="Domaine d'activité" value={admin.activityDomain} disabled={true} />
                                </div>

                                <Input label="Convention collective" value={admin.collectiveAgreement} classNameLabel="mt-4" disabled={true} />
                            </div>
                        </div>
                    </section>
                )}

                {canManageRights && (
                    <div className="mt-5 border-t border-gray-200 pt-5">
                        <ManageRight />
                    </div>
                )}

                {/* Section mot de passe - Cachée pour ReadOnly */}
                {!isReadOnly && (
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
                )}

                {/* Section suppression de compte - Cachée pour ReadOnly et OWNER */}
                {!isReadOnly && !isOwner && (
                    <section className="mb-5 mt-5 flex w-full flex-col items-center border-t border-gray-200 pt-5 md:flex-row">
                        <div className="mb-4 flex w-full flex-col text-center md:mb-0 md:w-1/2 md:text-start">
                            <h2 className="text-red-900">Supprimer votre compte LegiPilot</h2>
                        </div>

                        <DeleteAccountModal adminId={adminId} deleteAdmin={deleteAdmin} />
                    </section>
                )}

                {/* Message pour OWNER - Explique pourquoi il ne peut pas se supprimer */}
                {isOwner && (
                    <section className="mb-5 mt-5 flex w-full flex-col border-t border-gray-200 pt-5">
                        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                            <p className="text-sm text-amber-800">
                                <strong>Vous êtes propriétaire de cette entreprise.</strong> Vous ne pouvez pas supprimer votre compte tant
                                que vous détenez ce rôle. Pour supprimer votre compte, vous devez d'abord transférer la propriété de
                                l'entreprise à un autre administrateur.
                            </p>
                        </div>
                    </section>
                )}
            </article>
        </article>
    );
}