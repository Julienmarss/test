import { useModifyAdministrator } from "@/api/administrator/administrators.api";
import { AdministratorResponse } from "@/app/signup/signup.service";
import { Button } from "@/components/ui/buttons/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import _ from "lodash";
import React, { FC, useEffect, useState } from "react";

interface NewPopoverProps {
    administrator?: AdministratorResponse,
    showTitle?: boolean
}

const NewPopover: FC<NewPopoverProps> = ({ administrator, showTitle = true }) => {
    const [open, setOpen] = useState(false);
    const [showBadge, setShowBadge] = useState(false);
    const { mutate: modify, isPending: modifyPending } = useModifyAdministrator();

    const handleOpen = () => {
        if (showBadge && administrator?.id) {
            const company = administrator?.companies?.[0];
            modify({
                id: administrator.id,
                request: {
                    ..._.omit(administrator, ["companies"],
                    ),
                    idCompany: company?.id,
                    companyName: company?.name,
                    siren: company?.siren,
                    siret: company?.siret,
                    legalForm: company?.legalForm,
                    nafCode: company?.nafCode,
                    principalActivity: "",
                    activityDomain: company?.activityDomain,
                    collectiveAgreement: company?.collectiveAgreement?.titre,
                    idcc: company?.collectiveAgreement?.idcc,
                    companyPicture: company?.picture,
                    isNotifViewed: administrator?.isNotifViewed,
                    isNewsViewed: true
                }
            })
        }
        setShowBadge(false)
    }

    useEffect(() => {
        if (administrator?.id) {
            setShowBadge(!Boolean(administrator?.isNewsViewed))
        }
    }, [administrator])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="w-full">
                <Button
                    className={`flex w-full items-center space-x-2 justify-start px-3 py-2 rounded-lg text-slate-300 ${open ? "bg-sky-800" : 'bg-transparent'} hover:bg-slate-700 hover:text-white transition-colors relative`}
                    onClick={handleOpen}
                >
                    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" className="size-5 text-white"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M8.13213 0.883674C8.45323 0.111675 9.54636 0.111709 9.86749 0.883674L11.6985 5.28504L16.4505 5.6659C17.2838 5.73271 17.6223 6.77326 16.9876 7.31727L13.3665 10.4188L14.473 15.0555C14.6669 15.8688 13.7822 16.5117 13.0687 16.0761L9.0003 13.5907L4.93194 16.0761C4.21838 16.5119 3.33364 15.8689 3.52764 15.0555L4.63311 10.4188L1.01299 7.31727C0.377987 6.77332 0.71567 5.73272 1.54913 5.6659L6.30108 5.28504L8.13213 0.883674Z"
                            fill="white" />
                    </svg>
                    {showBadge && !showTitle &&
                        <div className="w-[4px] h-[4px] bg-[#FF6467] rounded-full absolute top-[5px] right-[8px]" />}
                    {showTitle &&
                        <div className="flex justify-between w-full">
                            <span className="text-[16px]">Nouveautés</span>
                            {showBadge && <div
                                className="bg-[#FF6467] w-[16px] h-[16px] flex items-center justify-center rounded-full">1</div>}
                        </div>
                    }
                </Button>
            </PopoverTrigger>
            <PopoverContent side="right" className="z-[100] w-[250px] md:w-[350px]">
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm">Nouveautés</h3>
                    <Separator className="bg-gray-200" />
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm md:text-justify">Bienvenue dans l’espace <strong>Nouveautés</strong> !<br /> Vous y trouverez toutes les dernières évolutions, fonctionnalités et améliorations de LégiPilot.</span>
                            {/* <span className="text-xs text-gray-500">3 heures</span> */}
                        </div>
                        {/* <div className="flex justify-center w-4">
                            <div className="w-[4px] h-[4px] bg-[#E7000B] rounded-full"></div>
                        </div> */}
                    </div>
                    <Separator className="bg-gray-200" />
                </div>
            </PopoverContent>
        </Popover>
    )
}
export default NewPopover;