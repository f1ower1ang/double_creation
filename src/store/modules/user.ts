import * as types from '../mutation-types'
import {getInfo, login, logout} from '@/api/user'
import { User } from '@/utils/formatData'
import { removeToken, setToken, getToken } from '@/utils/auth'
import { resetRouter } from '@/router'

interface UserState {
  token: string | undefined,
  userInfo: User | null
}

function getDefaultState(): UserState {
  return {
    token: getToken(),
    userInfo: null
  }
}

const state: UserState = getDefaultState()

const mutations = {
  [types.SET_TOKEN](state: UserState, token: string) {
    state.token = token
  },
  [types.SET_USER_INFO](state: UserState, info: User) {
    state.userInfo = info
  },
  [types.RESET_USER](state: UserState) {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  // user login
  login(context: any, userForm: any) {
    return new Promise((resolve, reject) => {
      login(userForm).then(async(res: any) => {
        if (res.errCode !== 200) {
          reject(res.errMsg)
        } else {
          context.commit(types.SET_TOKEN, res.data.token)
          setToken(res.data.token)
          resolve()
        }
      }).catch((e) => {
        reject(e)
      })
    })
  },

  // get user info
  getInfo(context: any) {
    return new Promise((resolve, reject) => {
      getInfo().then((res: any) => {
        if (res.errCode !== 200) {
          reject(res.errMsg)
        } else {
          resolve()
          const data = res.data
          context.commit(types.SET_USER_INFO, {
            id: data.id,
            name: data.name,
            account: data.account,
            phone: data.phone,
            sex: data.sex,
            joinTime: data.createtime.split(' ')[0],
            avatar: data.avatar,
            email: data.email
          })
        }
      }).catch(e => {
        reject(e)
      })
    })
  },

  // user logout
  logout(context: any) {
    return new Promise((resolve, reject) => {
      logout().then((res: any) => {
        context.dispatch('removeUser').then(() => {
          resolve(res)
        })
      }).catch((e) => {
        reject(e)
      })
    })
  },

  // remove user
  removeUser(context: any) {
    return new Promise(resolve => {
      removeToken()
      resetRouter()
      context.commit(types.RESET_USER)
      resolve()
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
