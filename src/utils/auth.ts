import Cookies from 'js-cookie'

const TokenKey = 'AILab_Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token, { expires: 1})
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
