# Connexion à Google et Microsoft pour Authentification

Voici comment configurer **les identifiants Google et Microsoft OAuth** pas à pas pour une application Next.js avec NextAuth.js.


## 1. Créer les identifiants OAuth chez **Google**

### Étapes :

1. Va sur : [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)

2. Crée un **nouveau projet**

3. Dans le menu de gauche : **APIs et services > Écran d'autorisation OAuth**

    * Type d’utilisateur : **Externe**
    * Remplis les champs obligatoires (nom, email, etc.)
    * Ajoute un domaine autorisé si tu es en prod

4. Va ensuite dans **Identifiants > Créer des identifiants > ID client OAuth**

    * Type d'application : **Application Web**
    * Nom : "Legipilot" ou autre
    * **URIs de redirection autorisés** : ajoute :

      ```
      http://localhost:3000/signin/callback/google
      ```

      (et plus tard en prod : `https://app.legipilot.com/signin/callback/google`)

5. Clique sur **Créer**, puis copie :

    * `Client ID`
    * `Client Secret`

6. Place-les dans ton `.env.local` :

```env
GOOGLE_CLIENT_ID=xxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxx
```

---

## 2. Créer les identifiants OAuth chez **Microsoft (Azure AD)**

### Étapes :

1. Va sur : [https://portal.azure.com/](https://portal.azure.com/)

2. Dans le menu de gauche : **Azure Active Directory**

3. Clique sur **Inscriptions d’application > Nouvelle inscription**

    * Nom : "Legipilot"
    * Types de compte : "Comptes dans n'importe quel annuaire" (ou restreint selon ton besoin)
    * URI de redirection : ajoute :

      ```
      http://localhost:3000/signin/callback/azure-ad
      ```

4. Clique sur **S’inscrire**

5. Tu arrives sur la page de l’application :

    * Copie l’**ID de l’application (client)** → `AZURE_AD_CLIENT_ID`
    * Copie l’**ID du répertoire (tenant)** → `AZURE_AD_TENANT_ID`

6. Ensuite, va dans **Certificats et secrets > Nouveau secret client**

    * Donne un nom et une durée (par ex. 12 mois)
    * Clique sur Ajouter
    * Copie **immédiatement** le secret → `AZURE_AD_CLIENT_SECRET`

7. Place tout dans ton `.env.local` :

```env
AZURE_AD_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_AD_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
AZURE_AD_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## 3. Récap des redirections

| Fournisseur | URL de redirection locale                        | URL de redirection en production                     |
| ----------- |--------------------------------------------------|------------------------------------------------------|
| Google      | `http://localhost:3000/signin/callback/google`   | `https://app.legipilot.com/signin/callback/google`   |
| Microsoft   | `http://localhost:3000/signin/callback/azure-ad` | `https://app.legipilot.com/signin/callback/azure-ad` |
