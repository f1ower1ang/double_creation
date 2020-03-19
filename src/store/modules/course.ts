import * as types from '../mutation-types'
import { Course, formatCourse } from '@/utils/formatData'
import { getFavoriteList } from '@/api/user'

interface CourseState {
  favoriteList: any
}

const state = {
  favoriteList: []
}

const mutations = {
  [types.SET_FAVORITE_LIST](state: CourseState, list: any) {
    state.favoriteList = list
  }
}

const actions = {
  addFavorite(context: any, course: Course) {
    let list = context.state.favoriteList.slice()
    list.push(course)
    context.commit(types.SET_FAVORITE_LIST, list)
  },
  deleteFavorite(context: any, course: Course) {
    let list = context.state.favoriteList.slice()
    const index = list.findIndex((item: Course) => item.id === course.id)
    if (index > -1) {
      list.splice(index, 1)
    }
    context.commit(types.SET_FAVORITE_LIST, list)
  },
  getFavoriteList(context: any) {
    return new Promise((resolve, reject) => {
      getFavoriteList({ pages: 1, size: 99999 }).then((res: any) => {
        resolve(res)
        const { data } = res
        if (data === '用户没有收藏') {
          context.commit(types.SET_FAVORITE_LIST, [])
        } else {
          const courses: any = []
          data.Course.forEach((item: any) => {
            courses.push(formatCourse(item))
          })
          context.commit(types.SET_FAVORITE_LIST, courses)
        }
      }).catch(e => {
        reject(e)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
