import { NextRequest, NextResponse } from 'next/server';

export interface CompanyDto {
    siren: string
    nom_entreprise: string
    denomination: string | null
    code_naf: string
    libelle_code_naf: string
    domaine_activite: string
    forme_juridique: string
    date_creation: string
    conventions_collectives: {
        idcc: string
        nom: string
    }[]
    siege: {
        siret: string
        numero_voie: number | string
        type_voie: string
        libelle_voie: string
        code_postal: string
        ville: string
    }
}

export interface CompanySearchDto {
    resultats: CompanyDto[]
}

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('q');
    if (!query || query.length < 2) {
        return NextResponse.json({ results: [] });
    }

    const apiKey = process.env.PAPPERS_API_KEY;
    const url = `https://api.pappers.fr/v2/recherche?q=${encodeURIComponent(query)}`;

    try {
        const res = await fetch(url, {
                headers: {
                    'api-key' : apiKey,
                } as HeadersInit
            }
        );

        if (!res.ok) {
            console.error('Erreur API Pappers:', res.status, await res.text());
            return NextResponse.json({ results: [], error: `API error ${res.status}` }, { status: res.status });
        }

        const data: CompanySearchDto = await res.json();

        return NextResponse.json(data.resultats || []);
    } catch (e) {
        console.error('Erreur appel Pappers :', e);
        return NextResponse.json({ results: [], error: 'Erreur serveur' }, { status: 500 });
    }
}