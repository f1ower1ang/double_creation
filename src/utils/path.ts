const docker = 'http://175.24.130.223:2375'
const rec = 'http://120.76.43.212:10011'
export default {
  course: {
    default: '/Course/getCourse',
    recommendWidthLogin: '/userRecommend/getUserRecommend',
    recommend: '/userRecommend/getUserRecommendWithOutToken',
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
    deleteCourse: '/userCourse/deleteUserCourse',
    verifyToken: '/verifity/verityFoegetPassword',
    verifyRegister: '/verifity/SignInEmailVerifity',
    verifyEmail: '/verifity/verityBindEmail',
    beforePhone: '/sms/beforeGetBindPhoneNumber',
  },
  code: {
    emailCode: '/verifity/reSendVerifityEmail',
    default: '/verifity/generator',
    verifyCode: '/verifity/match',
    verifyEmailCode: '/verifity/emailVerifity',
    resendPhoneCode: '/sms/reSendSms',
    phoneCode: '/sms/getBindPhoneNumber',
    beforePhoneCode: '/sms/beforeGetBindPhoneNumberVerify',
    checkPhoneCode: '/sms/getBindPhoneNumberVerify',
    forgetCode: '/sms/sendFPSms',
    checkForgetCode: '/sms/forgiePasswordSmsVerify',
    loginCode: '/sms/sendLoginSms',
    checkLoginCode: '/sms/loginSmsVerify'
  }
}
