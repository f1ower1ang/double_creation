export default {
  token: (state: {user: any}) => state.user.token,
  userInfo: (state: {user: any}) => state.user.userInfo,
  favoriteList: (state: any) => state.course.favoriteList
}
