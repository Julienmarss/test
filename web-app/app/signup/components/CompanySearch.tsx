"use client"

import {useEffect, useRef, useState} from "react"
import {Building2, MapPin, Search} from "lucide-react"
import {CompanyDto} from "@/app/api/pappers/route";
import {Input} from "@/components/ui/Input";

interface CompanySearchProps {
    onCompanySelect: (company: CompanyDto) => void
    placeholder?: string
    value?: string
}

export default function CompanySearch({
                                          onCompanySelect,
                                          placeholder = "Saisissez le nom de votre entreprise...",
                                          value = ""
                                      }: CompanySearchProps) {
    const [query, setQuery] = useState(value)
    const [results, setResults] = useState<CompanyDto[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const debounceRef = useRef<number>(0)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const searchCompanies = async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setResults([])
            setShowResults(false)
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch(`/api/pappers?q=${encodeURIComponent(searchQuery)}`)
            const body = await res.json();
            const results: CompanyDto[] = body;
            setResults(results || [])
            setShowResults(true)
        } catch (error) {
            console.error("Erreur lors de la recherche:", error)
            setResults([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value
        setQuery(newQuery)

        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        debounceRef.current = window.setTimeout(() => {
            searchCompanies(newQuery)
        }, 300)
    }

    const handleCompanySelect = (company: CompanyDto) => {
        setQuery(company.nom_entreprise)
        setShowResults(false)
        onCompanySelect(company)
    }

    const formatAddress = (siege: CompanyDto["siege"]) => {
        return `${siege.numero_voie} ${siege.type_voie} ${siege.libelle_voie}, ${siege.code_postal} ${siege.ville}`
    }

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4"/>
                <Input
                    type="text"
                    label="Le nom de votre entreprise"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleInputChange}
                    // onFocus={() => query.length >= 2 && setShowResults(true)}
                    className="rounded-t-md"
                />
                {isLoading && (
                    <div className="absolute right-3 top-1 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>

            {showResults && results.length > 0 && (
                <div
                    className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    {results.map((company) => (
                        <button
                            key={company.siren}
                            onClick={() => handleCompanySelect(company)}
                            className="w-full p-4 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 focus:outline-none focus:bg-slate-50"
                        >
                            <div className="flex items-start space-x-3">
                                <Building2 className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0"/>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-slate-900 truncate">
                                        {company.nom_entreprise}
                                    </div>
                                    <div className="text-sm text-slate-600 flex items-center mt-1">
                                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0"/>
                                        <span className="truncate">{formatAddress(company.siege)}</span>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">
                                        SIREN: {company.siren} • SIRET: {company.siege.siret}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {showResults && query.length >= 2 && results.length === 0 && !isLoading && (
                <div
                    className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-4 text-center text-slate-500">
                    Aucune entreprise trouvée pour "{query}"
                </div>
            )}
        </div>
    )
}
