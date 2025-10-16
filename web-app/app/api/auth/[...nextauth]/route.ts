import NextAuth, { Account, Profile, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import MicrosoftProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { serviceClientNonAuthentifie } from "@/api/server.api";

export type Administrator = {
	id: number;
	email: string;
	firstname: string;
	lastname: string;
	roles: string[];
	accessToken: string;
};

type CustomToken = JWT & {
	id?: string;
	firstname?: string;
	lastname?: string;
	expiration?: string;
	roles?: string[];
};

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		MicrosoftProvider({
			clientId: process.env.AZURE_AD_CLIENT_ID!,
			clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
			tenantId: "common",
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try {
					const response = await serviceClientNonAuthentifie.post("/public/signin", credentials);
					const administrator: Administrator = response.data;

					if (administrator)
						return {
							id: `${administrator.id}`,
							email: administrator.email,
							firstname: administrator.firstname,
							lastname: administrator.lastname,
							roles: administrator.roles,
							accessToken: administrator.accessToken,
						};
					return null;
				} catch (e: any) {
					throw new Error(JSON.stringify(e.response.data));
				}
			},
		}),
	],
	session: {
		strategy: "jwt" as const,
	},
	jwt: {
		secret: process.env.NEXTAUTH_SECRET!,
	},
	pages: {
		signIn: "/signin",
		// error: `/signin?error=${encodeURIComponent("Une erreur est survenue lors de la connexion.")}`,
	},
	callbacks: {
		async signIn({ user, account }: { user: User; account: Account; profile: Profile }) {
			if (account.provider === "google" || account.provider === "azure-ad") {
				const tenant =
					account.provider === "google" ? "GOOGLE" : account.provider === "azure-ad" ? "MICROSOFT" : "LEGIPILOT";

				try {
					const response = await serviceClientNonAuthentifie.post("/public/oauth-signin", { username: user.email });
					if (!response.data) {
						return `/signup?email=${encodeURIComponent(user.email!)}&tenant=${tenant}&sub=${encodeURIComponent(user.id)}&firstname=${encodeURIComponent(user.name!.split(" ")[0])}&lastname=${encodeURIComponent(user.name!.split(" ")[1])}&picture=${encodeURIComponent(user.image ?? "")}`;
					}

					user.id = response.data.id;
					user.firstname = response.data.firstname;
					user.lastname = response.data.lastname;
					user.roles = response.data.roles;
					user.accessToken = response.data.accessToken;
					user.expiration = response.data.expiration;

					return true;
				} catch (e: any) {
					if (e && e.response && e.response.data && e.response.data.message && e.response.data.message.length > 0) {
						if (e.response.data.message.includes("Administrateur avec email")) {
							return `/signup?email=${encodeURIComponent(user.email!)}&tenant=${tenant}&sub=${encodeURIComponent(user.id)}&firstname=${encodeURIComponent(user.name!.split(" ")[0])}&lastname=${encodeURIComponent(user.name!.split(" ")[1])}&picture=${encodeURIComponent(user.image ?? "")}`;
						}
						return `/signin?error=${encodeURIComponent(e.response.data.message)}`;
					}
					return `/signup?email=${encodeURIComponent(user.email!)}&tenant=${tenant}&sub=${encodeURIComponent(user.id)}&firstname=${encodeURIComponent(user.name!.split(" ")[0])}&lastname=${encodeURIComponent(user.name!.split(" ")[1])}&picture=${encodeURIComponent(user.image ?? "")}`;
				}
			}

			return true;
		},

		async jwt({ token, user }: { token: CustomToken; user?: User }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.roles = user.roles;
				token.firstname = user.firstname;
				token.lastname = user.lastname;
				token.accessToken = user.accessToken;
				token.expiration = user.expiration;
			}
			return token;
		},
		async session({ session, token }: { session: Session; token: CustomToken }) {
			if (token) {
				session.user.id = token.id;
				session.user.name = token.firstname + " " + token.lastname;
				session.user.email = token.email;
				session.user.firstname = token.firstname;
				session.user.lastname = token.lastname;
				session.user.picture = token.picture;
				session.user.roles = token.roles;
				session.accessToken = token.accessToken;
				session.expiration = token.expiration;
			}
			return session;
		},
	},
	debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
