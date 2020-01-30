import { post, put, get } from '@/utils/http'
import path from '@/utils/path'

export function verifyCode(data: object) {
  return post(path.code.verifyCode, data)
}

export function emailCode(data: object) {
  return put(path.code.emailCode, data)
}

export function getCode() {
  return get(path.code.default)
}

export function verifyEmailCode(data: object) {
  return post(path.code.verifyEmailCode, data)
}
