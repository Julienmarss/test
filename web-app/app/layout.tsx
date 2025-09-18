import type {Metadata} from 'next'
import '../styles/global.scss'
import Providers from "@/components/utils/Providers";

export const metadata: Metadata = {
    title: 'Legipilot App',
    description: "Pilotez vos ressources humaines de l’embauche à la fin du contrat de travail et garantissez votre conformité juridique avec le copilote de gestion automatisé LégiPilot !",
    icons: {
        icon: './favicon.jpg',
        apple: './favicon_apple.jpg',
    }
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="fr">
        <body>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    )
}
