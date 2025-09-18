# Authentification

**Flux de connexion :**

```text

                          ┌───────────────┐
                          │ Utilisateur   │
                          │ clique "Login"│
                          └──────┬────────┘
                                 │
                  ┌──────────────▼────────────────────────────────┐
                  │ signIn("credentials" / "google" / "azure-ad") │
                  └──────────────┬────────────────────────────────┘
                                 │
        ┌────────────────────────▼────────────────────────┐
        │ /api/auth/callback/[provider]                   │
        │ → NextAuth déclenche le provider concerné       │
        └────────────────────────┬────────────────────────┘
                                 │
        ┌────────────────────────▼─────────────────────┐
        │ authorize() (si Credentials)                 │
        │ → retourne un `user`                         │
        └────────────────────────┬─────────────────────┘
                                 │
        ┌────────────────────────▼─────────────────────┐
        │ jwt({ token, user })                         │
        │ → enrichit le token JWT (ex: id, roles, etc) │
        └────────────────────────┬─────────────────────┘
                                 │
        ┌────────────────────────▼────────────────────────┐
        │ Cookie JWT signé (ou session DB si mode session)│
        │ → stocké dans le navigateur                     │
        └────────────────────────┬────────────────────────┘
                                 │
        │   (plus tard, dans une page ou composant)       │
                                 ▼
       ┌────────────────────────────────────────────┐
       │ getServerSession(authOptions)              │
       │ ou                                         │
       │ useSession() (client)                      │
       └────────────────────┬──────────────────────┘
                            ▼
         ┌────────────────────────────────────┐
         │ session({ session, token })        │
         │ → construit session.user           │
         └────────────────────────────────────┘
                            ▼
         🔚 Résultat : `session.user` dispo côté client ou serveur
```

**A savoir** :

✅ Tous les providers suivent le même pipeline :
credentials utilise authorize()
 - google et azure-ad utilisent la redirection OAuth automatiquement
✅ jwt sert à stocker dans le cookie
 - Tu peux y mettre : user.id, user.roles, user.firstname, etc.
✅ session sert à exposer ces infos dans session.user côté React ou Server Component