export function fetchEnvironment(environmentId: number, token: string) {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/environments/${environmentId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
