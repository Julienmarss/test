import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import { SparklesSvg } from "@/app/admin/components/SparklesSvg";

type Props = {
	searchQuery: string;
	setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

export const MyCollaboratorsHeader = ({ searchQuery, setSearchQuery }: Props) => {
	return (
		<div className="flex min-h-[36vh] flex-col items-center justify-center gap-8">
			<h1 className="text-center text-4xl text-sky-950 md:text-start md:text-4xl">Rechercher un collaborateur</h1>

			<form className="flex w-full flex-row items-center justify-center">
				<div className="search-shadow relative rounded-lg">
					<div className="absolute left-6 top-1/2 z-10 -translate-y-1/2">
						<SparklesSvg />
					</div>

					<div className="relative w-auto rounded-lg bg-[conic-gradient(from_31.78deg_at_50%_50%,_#2B7FFF_0deg,_#00A6F4_90deg,_#00B8DB_180deg,_#00A6F4_270deg,_#2B7FFF_360deg)] p-[1px] md:h-[72px] md:w-[42rem]">
						<Input
							type="text"
							placeholder="Nom, fonction, responsable, type de contrat, mots-clés, ..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="h-[70px] w-full rounded-lg py-4 pl-16"
						/>
					</div>

					<button
						type="submit"
						className="search-collaborator absolute right-4 top-4 w-10 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
					>
						<Search className="h-5 w-5 justify-self-center text-sky-600" />
					</button>
				</div>
			</form>
		</div>
	);
};
