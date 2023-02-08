import { api } from "@/services/api";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

interface IUserResponse{
    id: string,
    tokenJwt: string,
    name: string,

}

interface IResponseData {
    data: {
        token: string,
        user: {
            id: string,
            name: string
        }
    }
}

export default NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
      },
    providers: [
    CredentialsProvider({
        name: "Credentials",

        credentials: {
            email: { label: "Email", type: "email", placeholder: "email" },
            password: { label: "Password", type: "password" }
        },

        async authorize(credentials, req) {
            const response: IResponseData= await api.post("/login", {
                email: credentials?.email,
                password: credentials?.password
            })

            const { token, user: { id, name} } = response.data;

            if (!token || !id || !name) {
                return null
            }

            return {
                id: id,
                jwt: token,
                name: name,
             }
        }
    })
    ],

    callbacks: {
        jwt: async ({token, user}) => {
            if(user?.id || user?.name) {
                token.user = user;
            }

            return Promise.resolve(token)
        },
        session: async ({session, token}) => {
            if(token.user) {
                session.user = token.user;
            }

            return Promise.resolve({...session})
        }
    }

})
