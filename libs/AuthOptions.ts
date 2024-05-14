import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prismadb from "@/libs/prismadb";
import bcrypt from "bcrypt";
import GithubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // 無信箱或密碼
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing crendentials");
                };

                const user = await prismadb.user.findFirst({
                    where: {
                        email: credentials.email
                    }
                });

                // 無此用戶
                if (!user || !user.id || !user.hashedPassword) {
                    throw new Error("User not registered");
                };

                const hashedPassword = await bcrypt.hash(credentials.password, 12);

                // 密碼錯誤
                if (hashedPassword === user.hashedPassword) {
                    throw new Error("Invalid crendentials");
                }

                return user;
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            token: 'https://github.com/login/oauth/access_token',
            authorization: {
                params: {
                    scope: "repo"
                }
            }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    debug: process.env.NODE_ENV !== "production",
    
    // TODO: 第三方登入 OAuth
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token = Object.assign({}, token, { access_token: account.access_token });
            };
            return token;
        },
        async session({ session, token }) {
            if (session) {
                session = Object.assign({}, session, { access_token: token.access_token })
            };
            return session;
        }
    }
}