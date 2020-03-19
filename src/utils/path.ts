const docker = 'http://175.24.130.223:2375'
export default {
  course: {
    default: '/Course/getCourse',
    recommend: '/course/recommend',
    detail: '/Course/getCourse',
    startContainer: '/docker/startContainer',
    // checkContainer: '/docker/testUploadImageCallBack'
    // startContainer: docker + '/services/run',
    checkContainer: docker + '/services/check',
    rate: '/Course/addCourseRate'
  },
  user: {
    login: '/login',
    register: '/signup',
    logout: '/logout',
    forget: '/forgetPassword',
    info: '/user/info',
    uploadImg: '/upload/userAvater',
    updateInfo: '/user/updateUserInfo',
    resetPwd: '/user/changepw',
    resetEmail: '/verifity/bindEmail',
    personalCourse: '/userCourse/getUserCourse',
    addCourse: '/userCourse/addUserCourse',
    favoriteList: '/userCollection/getUserCollections',
    addFavorite: '/userCollection/addUserCollection',
    deleteFavorite: '/userCollection/deleteCollection',
    deleteCourse: '/userCourse/deleteUserCourse'
  },
  code: {
    emailCode: '/verifity/reSendVerifityEmail',
    default: '/verifity/generator',
    verifyCode: '/verifity/match',
    verifyEmailCode: '/verifity/emailVerifity'
  }
}
