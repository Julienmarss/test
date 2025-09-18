package com.legipilot.service.shared.infra.out.local;

import com.legipilot.service.shared.domain.model.DocumentText;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.InputStream;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

class TikaDocumentReaderAdapterTest {

    private final TikaDocumentReaderAdapter tikaDocumentReaderAdapter = new TikaDocumentReaderAdapter();

    @Test
    void read_csv_file() {
        try (InputStream is = getClass().getResourceAsStream("/files/collab-import.csv")) {
            MockMultipartFile multipartFile = new MockMultipartFile(
                    "file",
                    "test.csv",
                    "text/csv",
                    is
            );

            DocumentText documentText = tikaDocumentReaderAdapter.read(multipartFile);

            assertThat(documentText).isNotNull();
            assertThat(documentText.text())
                    .contains("\"EMP001\";\"Dupont\";\"Jean\";\"jean.dupont@entreprise.com\";\"+33612345678\";\"1985-04-15\";\"Française\";\"12 Rue de la Paix\";\"Appt 3B\";\"Paris\";\"75002\";\"France\";\"Marié(e)\";2;\"Master\";\"123456789012345\";\"2010-09-01\";\"\";\"CDI\";\"Développeur Senior\";\"IT\";\"EMP005\";55000;\"EUR\";\"BNP Paribas\";\"FR76XXXXXXXXXXXXX\";\"BNPAFRPPXXX\";100;\"10\";\"25\";\"2024-01-01\";\"Performance\";\"Excellent\";\"2024-03-15\";\"Java, Spring, SQL\";\"Français (Natif), Anglais (Courant)\";\"2023-11-20\";\"Formation Java Avancé\";\"Employé très fiable et moteur de l'équipe.\"");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void read_dsn_file() {
        try (InputStream is = getClass().getResourceAsStream("/files/DSN_05_2025.txt")) {
            MockMultipartFile multipartFile = new MockMultipartFile(
                    "file",
                    "DSN_05_2025.txt",
                    "text/plain",
                    is
            );

            DocumentText documentText = tikaDocumentReaderAdapter.read(multipartFile);

            assertThat(documentText).isNotNull();
            assertThat(documentText.text())
                    .contains("""
                            S10.G00.00.002,'PayFit'
                            S10.G00.00.005,'02'
                            S10.G00.00.006,'P25V01'
                            S10.G00.00.007,'01'
                            S10.G00.00.008,'01'
                            S10.G00.01.001,'813487899'
                            """);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void read_xlsx_file() {
        try (InputStream is = getClass().getResourceAsStream("/files/collab-import.xlsx")) {
            MockMultipartFile multipartFile = new MockMultipartFile(
                    "file",
                    "collab-import.xlsx",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    is
            );

            DocumentText documentText = tikaDocumentReaderAdapter.read(multipartFile);

            assertThat(documentText).isNotNull();
            assertThat(documentText.text())
                    .contains("""
                            example
                            	ID Employé	Nom	Prénom	Email Professionnel	Téléphone Professionnel	Date de Naissance	Nationalité	Adresse (Ligne 1)	Adresse (Ligne 2)	Ville	Code Postal	Pays	Statut Marital	Nombre d'Enfants	Niveau d'Éducation	Numéro de Sécurité Sociale	Date d'Embauche	Date de Fin de Contrat (si CDD)	Type de Contrat	Poste	Département	Manager (ID Employé)	Salaire Brut Annuel (EUR)	Devise Salaire	Banque	IBAN	BIC/SWIFT	Temps de Travail (en %)	RTT Restants	Congés Payés Restants	Date de Dernière Augmentation	Motif Dernière Augmentation	Évaluations de Performance (dernière)	Date Dernière Évaluation	Compétences Clés	Langues Parlées	Date de Dernière Formation	Type de Formation	Notes Internes
                            	EMP001	Dupont	Jean	jean.dupont@entreprise.com	+33612345678	1985-04-15	Française	12 Rue de la Paix	Appt 3B	Paris	75002	France	Marié(e)	2	Master	123456789012345	2010-09-01		CDI	Développeur Senior	IT	EMP005	55000	EUR	BNP Paribas	FR76XXXXXXXXXXXXX	BNPAFRPPXXX	100	10	25	2024-01-01	Performance	Excellent	2024-03-15	Java, Spring, SQL	Français (Natif), Anglais (Courant)	2023-11-20	Formation Java Avancé	Employé très fiable et moteur de l'équipe.
                            	EMP002	Martin	Sophie	sophie.martin@entreprise.com	+33798765432	1990-11-22	Française	25 Avenue des Champs		Lyon	69006	France	Célibataire	0	Licence	198765432109876	2015-03-10		CDI	Chef de Projet Marketing	Marketing	EMP006	48000	EUR	Crédit Agricole	FR76YYYYYYYYYYYYY	CACCFRPPXXX	100	8	23	2023-07-01	Reconnaissance	Très Bien	2023-09-30	Gestion de projet, Communication, SEO	Français (Natif), Anglais (Bon niveau)	2024-02-10	Certif PMP
                            	EMP003	Petit	Marc	marc.petit@entreprise.com	+33601020304	1992-07-01	Belge	3 Rue de la Liberté		Marseille	13001	France	Pacsé(e)	1	Doctorat	123456789098765	2018-01-20		CDI	Chercheur R&D	Recherche et Développement	EMP005	62000	EUR	Société Générale	FR76ZZZZZZZZZZZZZ	SOGEFRPPXXX	100	12	26	2024-04-01	Promotion	En cours		Intelligence Artificielle, Python, Statistique	Français (Bilingue), Anglais (Courant), Néerlandais (Basique)			Expert en ML.
                            	EMP004	Bernard	Laura	laura.bernard@entreprise.com	+33711223344	1995-02-28	Italienne	8bis Boulevard Victor Hugo		Toulouse	87000"	France	Célibataire	0	BTS	123456789011122	2022-09-15		CDD	Assistant Administratif	Administration	EMP006	28000	EUR	La Banque Postale	FR76AAAAAAAAAAAAA	BPSTFRPPXXX	80	0	10			Satisfaisant	2024-01-20	Suite Office, Classement	Français (Courant), Italien (Natif)	2023-05-01	Formation Excel	Contrat jusqu'au 31/12/2025
                            	EMP005	Dubois	Paul	paul.dubois@entreprise.com	+33655667788	1978-10-03	Française	20 Place de la Comédie		Bordeaux	33000	France	Marié(e)	3	Master	123456789000001	2005-06-01		CDI	Directeur IT	Direction		120000	EUR	CIC	FR76BBBBBBBBBBBBB	CMCIFRPPXXX	100	15	30	2023-01-01	Annuelle	Excellent	2024-02-01	Leadership, Stratégie, Cloud	Français (Natif), Anglais (Bilingue)	2024-01-10	Conférence Lead Tech	Responsable de l'équipe IT.""");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}