<template lang="pug">
  .login-page
    h1.login-page__title AMOM人工智能实验室
    .login-page__form-wrapper
      .login-page__form-wrapper__header
        .left(:class="{active: forgetEmail}" @click="forgetEmail = true")
          Icon(type="ios-contact-outline" size="20")
          span 密码登录
        .right(:class="{active: !forgetEmail}" @click="forgetEmail = false")
          Icon(type="ios-text-outline" slot="prepend" size="20")
          span 短信登录
      .login-page__form-wrapper__content
        Form(:model="loginForm" :rules="ruleValidate" ref="form" v-if="forgetEmail")
          FormItem(prop="email")
            Input.login-page__form-wrapper__input(v-model="loginForm.email" placeholder="邮箱" size="large")
              Icon(type="ios-mail-outline" slot="prepend" size="20")
          FormItem(prop="password")
            Input.login-page__form-wrapper__input(v-model="loginForm.password" type="password" password placeholder="密码" size="large" @keyup.enter.native="handleLogin")
              Icon(type="ios-lock-outline" slot="prepend" size="20")
          p.color-red(v-if="loginFail" style="margin-top: -20px;padding-bottom: 5px; text-align: right") 邮箱或密码不正确
          Button(type="primary" @click="handleLogin" v-if="!logining") 登录
          Button(type="primary" disabled v-else) 登录中...

        Form(:model="loginPhoneForm" :rules="ruleValidate" ref="loginPhoneForm" v-else)
          FormItem(prop="phoneNumber")
            Input(v-model="loginPhoneForm.phoneNumber" placeholder="请输入手机号" size="large")
              Icon(type="ios-call-outline" slot="prepend" size="20")
          FormItem(prop="checkCode")
            Row(:gutter="20")
              Col(span="16")
                Input(v-model="loginPhoneForm.checkCode" placeholder="验证码" size="large")
                  Icon(type="ios-text-outline" slot="prepend" size="20")
              Col(span="8")
                Button(@click="sendLoginCode" style="width: 100%" v-if="loginPhoneForm.time === 60" size="large") 点击获取
                Button(disabled style="width: 100%" v-else size="large") {{ loginPhoneForm.time }} s
          Button(type="primary" @click="submitPhoneLogin" v-if="!loginPhoneForm.loading") 登录
          Button(type="primary" disabled v-else) 登录中...
      .login-page__form-wrapper__footer
        p.text-weak 没有账号？
          router-link(to="/register") 注册
        a(@click="modal = true") 忘记密码
    Modal(v-model="modal" footer-hide width="400px" title="重设密码" class-name="vertical-center-modal")
      Form(:model="forgetForm" :rules="ruleValidate" ref="email" style="padding:0 10px" v-if="forgetEmail")
        FormItem(prop="email")
          Input(v-model="forgetForm.email" placeholder="请输入账号邮箱" size="large")
            Icon(type="ios-mail-outline" slot="prepend" size="20")
        FormItem(style="text-align: right; margin-bottom: 0")
          Button(@click="cancelAmend" style="margin-right: 10px" ) 取消
          Button(type="primary" @click="submitEmail") 确定

      Form(:model="phoneForm" :rules="ruleValidate" ref="phone" style="padding:0 10px" v-else)
        FormItem(prop="phoneNumber")
          Input(v-model="phoneForm.phoneNumber" placeholder="请输入手机号" size="large")
            Icon(type="ios-call-outline" slot="prepend" size="20")
        FormItem(prop="checkCode")
          Row(:gutter="20")
            Col(span="16")
              Input(v-model="phoneForm.checkCode" placeholder="验证码" size="large")
                Icon(type="ios-text-outline" slot="prepend" size="20")
            Col(span="8")
              Button(@click="sendPhoneCode" style="width: 100%" v-if="phoneForm.time === 60" size="large") 点击获取
              Button(disabled style="width: 100%" v-else size="large") {{ phoneForm.time }} s
        FormItem(prop="newPassword")
          Input(v-model="phoneForm.newPassword" type="password" password placeholder="密码" size="large")
            Icon(type="ios-lock-outline" slot="prepend" size="20")
        FormItem(prop="confrimNewPassword")
          Input(v-model="phoneForm.confrimNewPassword" type="password" password placeholder="确认密码" size="large")
            Icon(type="ios-lock-outline" slot="prepend" size="20")
        FormItem(style="text-align: right; margin-bottom: 0")
          Button(@click="cancelAmend" style="margin-right: 10px" size="large") 取消
          Button(type="primary" @click="submitPhone" size="large") 确定
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Form } from 'view-design'
import { sendForgetEmail } from '@/api/user'
import { checkForgetCode, checkLoginCode, getForgetCode, getLoginCode } from '@/api/code'
import { setToken } from '@/utils/auth'
import { Mutation } from 'vuex-class'

@Component
export default class Register extends Vue {
  validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入密码'))
      // eslint-disable-next-line no-useless-escape
    } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)(?![_~@#\$\^]+$)[0-9A-Za-z_~@#\$\^]{8,16}$/.test(value)) {
      callback(new Error('密码长度为8-18，且至少包含字母数字'))
    } else {
      if (this.phoneForm.confrimNewPassword !== '') {
        // 对第二个密码框单独验证
        this.$refs.phone.validateField('confrimNewPassword')
      }
      callback()
    }
  }
  validatePassCheck = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请再次输入密码'))
    } else if (value !== this.phoneForm.newPassword) {
      callback(new Error('两次输入的密码不相同'))
    } else {
      callback()
    }
  }
  validatePhone = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入手机号'))
    } else if (value.length > 0 && !/^1[34578]\d{9}$/.test(value)) {
      callback('手机号格式不正确')
    } else {
      callback()
    }
  }
  public $refs!: {
    form: Form,
    email: Form,
    phone: Form,
    loginPhoneForm: Form
  }

  private loginForm = {
    email: '',
    password: ''
  }
  private loginPhoneForm = {
    phoneNumber: '',
    checkCode: '',
    time: 60,
    loading: false
  }
  private ruleValidate = {
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    phoneNumber: [{ validator: this.validatePhone, trigger: 'blur' }],
    checkCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
    newPassword: [{ validator: this.validatePass, trigger: 'blur' }],
    confrimNewPassword: [{ validator: this.validatePassCheck, trigger: 'blur' }]
  }
  private forgetForm = {
    email: ''
  }
  private loginFail: boolean = false
  private logining: boolean = false
  private modal: boolean = false
  private forgetEmail: boolean = true
  private phoneForm = {
    phoneNumber: '',
    checkCode: '',
    newPassword: '',
    confrimNewPassword: '',
    time: 60
  }

  @Mutation('user/SET_TOKEN') storeToken!: (arg0: string) => void

  private handleLogin() {
    this.$refs['form'].validate((valid: boolean | any) => {
      if (valid) {
        this.logining = true
        this.$store.dispatch('user/login', this.loginForm)
          .then(() => {
            this.$Notice.success({ title: '登录成功' })
            this.$route.query.redirect ?
              this.$router.push(this.$route.query.redirect as string) : this.$router.push('/')
            this.loginFail = false
            this.logining = false
          })
          .catch((e) => {
            if (e === '账号密码不对') {
              this.loginFail = true
              this.logining = false
            } else {
              this.loginFail = false
              this.$Message.error({
                content: '账号不存在',
                duration: 3
              })
              this.logining = false
            }
          })
      }
    })
  }
  private submitEmail() {
    this.$refs.email.validate((valid: boolean | any) => {
      if (valid) {
        this.modal = false
        sendForgetEmail(this.forgetForm).then((res: any) => {
          if (res.errCode === 200) {
            this.$Message.success({
              content: '验证邮件已发送，请查看邮件验证',
              duration: 3
            })
          } else {
            this.$Message.warning({
              content: res.errMsg,
              duration: 3
            })
          }
        })
      }
    })
  }

  private sendLoginCode() {
    if (this.loginPhoneForm.phoneNumber === '') {
      this.$Message.error('请输入手机号码')
    } else if (!/^1[34578]\d{9}$/.test(this.loginPhoneForm.phoneNumber)) {
      this.$Message.error('请输入正确的手机号码')
    } else {
      getLoginCode(this.loginPhoneForm.phoneNumber).then(() => {
        this.loginPhoneForm.time = 59
        let timer = setInterval(() => {
          this.loginPhoneForm.time -= 1
          if (this.loginPhoneForm.time === 0) {
            clearInterval(timer)
            this.loginPhoneForm.time = 60
          }
        }, 1000)
      })
    }
  }
  private sendPhoneCode() {
    if (this.phoneForm.phoneNumber === '') {
      this.$Message.error('请输入手机号码')
    } else if (!/^1[34578]\d{9}$/.test(this.phoneForm.phoneNumber)) {
      this.$Message.error('请输入正确的手机号码')
    } else {
      getForgetCode(this.phoneForm.phoneNumber).then(() => {
        this.phoneForm.time = 59
        let timer = setInterval(() => {
          this.phoneForm.time -= 1
          if (this.phoneForm.time === 0) {
            clearInterval(timer)
            this.phoneForm.time = 60
          }
        }, 1000)
      })
    }
  }
  private submitPhone() {
    this.$refs.phone.validate((valid: boolean | any) => {
      if (valid) {
        checkForgetCode(this.phoneForm).then((res: any) => {
          if (res.errCode === 200) {
            this.$Message.success('修改成功')
          } else {
            this.$Message.error(res.errMsg)
          }
        }).catch(() => {
          this.$Message.error('验证码失效')
        })
        this.modal = false
      }
    })
  }
  private submitPhoneLogin() {
    this.$refs.loginPhoneForm.validate((valid: boolean | any) => {
      if (valid) {
        this.loginPhoneForm.loading = true
        checkLoginCode(this.loginPhoneForm).then((res: any) => {
          this.loginPhoneForm.loading = false
          if (res.errCode === 200) {
            this.storeToken(res.data.token)
            setToken(res.data.token)
            this.$Notice.success({ title: '登录成功' })
            this.$route.query.redirect ?
              this.$router.push(this.$route.query.redirect as string) : this.$router.push('/')
          } else {
            this.$Message.error(res.errMsg)
          }
        }).catch(() => {
          this.$Message.error('验证码失效')
        })
      }
    })
  }
  private cancelAmend() {
    this.phoneForm = {
      phoneNumber: '',
      checkCode: '',
      newPassword: '',
      confrimNewPassword: '',
      time: 60
    }
    this.forgetForm = {
      email: ''
    }
    this.modal = false
  }
}
</script>

<style scoped lang="scss">
@import 'index';
</style>
