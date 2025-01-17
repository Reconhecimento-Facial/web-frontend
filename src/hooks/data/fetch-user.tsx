export function fetchUser(userId: number, token: string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
