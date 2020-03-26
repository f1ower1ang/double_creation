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

export function resendPhoneCode(data: object) {
  return axios.put(path.code.resendPhoneCode, data).then((res: any) => Promise.resolve(res.data))
}

export function getPhoneCode(data: object) {
  return post(path.code.phoneCode, data)
}

export function checkBeforeBindCode(checkCode: string) {
  return post(path.code.beforePhoneCode, { checkCode })
}

export function checkBindCode(data: object) {
  return put(path.code.checkPhoneCode, data)
}

export function getForgetCode(mobile: string) {
  return post(path.code.forgetCode + '?mobile=' + mobile)
}

export function checkForgetCode(data: object) {
  return post(path.code.checkForgetCode, data)
}

export function getLoginCode(mobile: string) {
  return post(path.code.loginCode + '?mobile=' + mobile)
}

export function checkLoginCode(data: object) {
  return post(path.code.checkLoginCode, data)
}
