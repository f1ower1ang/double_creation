<template lang="pug">
  .login-page
    h1.login-page__title AMOM人工智能实验室
    Form.login-page__form-wrapper(:model="loginForm" label-position="top" :rules="ruleValidate" ref="form")
      FormItem(prop="email")
        Input.login-page__form-wrapper__input(v-model="loginForm.email" placeholder="邮箱" size="large")
          Icon(type="ios-person-outline" slot="prepend" size="20")
      FormItem(prop="password")
        Input.login-page__form-wrapper__input(v-model="loginForm.password" type="password" password placeholder="密码" size="large" @keyup.enter.native="handleLogin")
          Icon(type="ios-lock-outline" slot="prepend" size="20")
      p.color-red(v-if="loginFail" style="margin-top: -20px;padding-bottom: 5px; text-align: right") 邮箱或密码不正确
      Button(type="primary" @click="handleLogin" v-if="!logining") 登录
      Button(type="primary" disabled v-else) 登录中...
      .login-page__form-wrapper__footer
        p.text-weak 没有账号？
          router-link(to="/register") 注册
        a(@click="modal = true") 忘记密码
    Modal(v-model="modal" footer-hide style="text-align: center" width="400px")
      h2 忘记密码
      Form(:model="forgetForm" :rules="ruleValidate" style="padding:0 10px")
        FormItem(prop="email" label="邮箱")
          Input.login-page__form-wrapper__input(v-model="forgetForm.email" placeholder="请输入账号邮箱" size="large")
        FormItem
          Button(type="primary" style="margin-right: 20px" @click="submitEmail") 验证
          Button(@click="modal = false") 取消
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Form } from 'view-design'
import { sendForgetEmail } from '@/api/user'

@Component
export default class Register extends Vue {
  public $refs!: {
    form: Form
  }

  private loginForm = {
    email: '',
    password: ''
  }
  private ruleValidate = {
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  }
  private forgetForm = {
    email: ''
  }
  private loginFail: boolean = false
  private logining: boolean = false
  private modal: boolean = false

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
                content: e,
                duration: 3
              })
              this.logining = false
            }
          })
      }
    })
  }
  private submitEmail() {
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
}
</script>

<style scoped lang="scss">
@import 'index';
</style>
