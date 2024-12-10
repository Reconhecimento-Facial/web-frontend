import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null

        const headers = new Headers()

        headers.append('Content-Type', 'application/x-www-form-urlencoded')

        const body = new URLSearchParams({
          username: credentials.email as string,
          password: credentials.password as string,
          grant_type: 'password',
        }).toString()

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/token`,
          {
            method: 'POST',
            headers,
            body,
          },
        )

        const data = await response.json()

        if (response.status !== 200) {
          throw new Error('Invalid credentials.')
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

        user = await profileResponse.json()

        console.log('USER ================ ', user)

        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error('Invalid credentials.')
        }

        // return user object with their profile data
        return user
      },
    }),
  ],
  callbacks: {
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
})
