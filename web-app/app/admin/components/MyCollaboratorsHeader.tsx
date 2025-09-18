import {Input} from "@/components/ui/Input";
import {Search} from "lucide-react";
import {SparklesSvg} from "@/app/admin/components/SparklesSvg";

type Props = {
    searchQuery: string,
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
};

export const MyCollaboratorsHeader = ({searchQuery, setSearchQuery}: Props) => {
    return (
        <div className="flex flex-col items-center justify-between bg-sky-50">
            <h1 className="text-sky-950 mt-4 text-center text-2xl md:text-4xl md:text-start">Rechercher un collaborateur</h1>

            <form className="flex flex-row items-center justify-center w-full mb-16 mt-8">
                <div className="relative">
                    <div className="absolute left-4 top-6 z-10">
                        <SparklesSvg/>
                    </div>

                    <div
                        className="relative w-auto md:w-[40rem] md:h-[72px] rounded-lg p-[1px] bg-[conic-gradient(from_31.78deg_at_50%_50%,_#2B7FFF_0deg,_#00A6F4_90deg,_#00B8DB_180deg,_#00A6F4_270deg,_#2B7FFF_360deg)]">
                        <Input
                            type="text"
                            placeholder="Nom, fonction, responsable, type de contrat, mots-clés, ..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-[70px] rounded-lg pl-12 py-4"
                        />
                    </div>

                    <button type="submit"
                            className="text-white absolute right-2 top-4 bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 w-10">
                        <Search className="w-5 h-5 justify-self-center text-gray-400"/>
                    </button>
                </div>
            </form>
        </div>
    );
};