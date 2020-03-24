import { post, put, get } from '@/utils/http'
import path from '@/utils/path'
import axios from 'axios'

export default {
  register: 'SMS_183241161',
  login: 'SMS_183246125',
  forgetPwd: 'SMS_183267318',
  bindPhone: 'SMS_183247604'
}

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

export function getPhoneCode(data: object) {
  return axios.put(path.code.phoneCode, data).then((res: any) => Promise.resolve(res.data))
}
