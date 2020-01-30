import { post, put } from '@/utils/http'
import path from '@/utils/path'

export function login(data: object) {
  return post(path.user.login, data)
}

export function register(data: object) {
  return post(path.user.register, data)
}

export function logout() {
  return post(path.user.logout)
}
