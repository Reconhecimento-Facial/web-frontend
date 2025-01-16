import NextAuth, { CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { ServerError } from './app/api/_errors/ServerError'
import { InvalidCredentials } from './app/api/_errors/InvalidCredentials'
import { getIsTokenValid } from './lib/jwt'
import { NextResponse } from 'next/server'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/token`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                username: credentials.email as string,
                password: credentials.password as string,
                grant_type: 'password',
              }).toString(),
            },
          )

          const data = await response.json()

          if (response.status === 400) {
            throw new InvalidCredentials()
          } else if (response.status !== 200) {
            throw new ServerError()
          }

          const token = data.access_token

          const profileResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admins/profile`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                accept: 'application/json',
              },
            },
          )

          if (profileResponse.status !== 200) {
            throw new ServerError()
          }

          user = await profileResponse.json()

          if (!user) {
            throw new Error('Invalid credentials.')
          }

          return { ...user, access_token: token }
        } catch (error) {
          if (error instanceof CredentialsSignin) throw error

          throw new ServerError()
        }
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: req }) {
      const isTokenValid = getIsTokenValid(auth?.access_token || '')

      if (isTokenValid) return true

      const nonProtectedRoutes = ['/login', '/account-recovery']

      if (!auth && !nonProtectedRoutes.includes(req.nextUrl.pathname)) {
        const newUrl = new URL('/login', req.nextUrl.origin)
        return NextResponse.redirect(newUrl)
      }

      if (!isTokenValid) {
        return false
      }
    },
    /*
      This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client)
      token: When event is "signIn" or "signUp", it will be a subset of JWT, Otherwise, it will be the full JWT
      user: Result of Credentials.authorize, available when "signIn" or "signUp".
      
    */
    jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          ...user,
        }
      }

      return token
    },
    /*
      This callback is called whenever a session is checked. (i.e. when invoking the /api/session endpoint, using useSession or getSession)
    */
    session({ session, token }) {
      const isTokenValid = getIsTokenValid((token.access_token as string) || '')

      if (!isTokenValid) return { user: undefined, expires: '' }

      return {
        ...session,
        access_token: token.access_token,
        user: {
          id: token.id,
          name: token.name,
          email: token.email,
          cpf: token.cpf,
          date_of_birth: token.date_of_birth,
          phone_number: token.phone_number,
          super_admin: token.super_admin,
        },
      }
    },
  },
  pages: {
    signIn: '/login',
  },
})
