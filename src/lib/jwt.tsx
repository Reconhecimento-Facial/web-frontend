export const getIsTokenValid = (token: string) => {
  if (!token) return false

  const jwtExpireTimestamp = parseJwt(token).exp

  const jwtExpireDateTime = new Date(jwtExpireTimestamp * 1000)

  if (jwtExpireDateTime < new Date()) {
    return false
  }

  return true
}

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}
