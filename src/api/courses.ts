import { get } from '@/utils/http'
import path from '@/utils/path'

export function getAllCourse(params: object) {
  return get(path.course.default, params)
}

export function getRecCourse() {
  return get(path.course.recommend)
}

export function getCourseDetail(params: object) {
  return get(path.course.detail, params)
}
