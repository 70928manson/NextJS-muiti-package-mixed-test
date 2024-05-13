import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prismadb from "@/libs/prismadb";
import bcrypt from "bcrypt"

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
        })
    ],
    secret: process.env.NEXTAUTH_SECRET
}