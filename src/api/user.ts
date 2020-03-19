import { post, put, get, del } from '@/utils/http'
import path from '@/utils/path'
// @ts-ignore
import Qs from 'qs'

export function login(data: object) {
  return post(path.user.login, data)
}

export function register(data: object) {
  return post(path.user.register, data)
}

export function logout() {
  return post(path.user.logout)
}

export function getInfo() {
  return get(path.user.info)
}

export function uploadAvatar(file: File) {
  const form = new FormData()
  form.append('file', file)
  return post(path.user.uploadImg, form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function editInfo(data: object) {
  return put(path.user.updateInfo, data)
}

export function resetPwd(data: object) {
  return put(path.user.resetPwd, data)
}

export function resetEmail(data: object) {
  return post(path.user.resetEmail, data)
}

export function getUserCourse(data: object) {
  return get(path.user.personalCourse, data)
}

export function addUserCourse(courseId: string) {
  return post(path.user.addCourse, {
    courseId
  })
}

export function getFavoriteList(params: object) {
  return get(path.user.favoriteList, params)
}

export function addFavorite(courseId: Number) {
  return post(path.user.addFavorite + '?courseId=' + courseId)
}

export function deleteFavorite(courseId: string) {
  return del(path.user.deleteFavorite + '?courseId=' + courseId)
}

export function deleteRecord(recordId: number) {
  return del(path.user.deleteCourse, {
    id: recordId
  })
}
