<template lang="pug">
  .login-page
    h1.login-page__title AMOM人工智能实验室
    Form.login-page__form-wrapper(:model="loginForm" label-position="top" :rules="ruleValidate" ref="form" @keyup.enter.native="login")
      FormItem(prop="email")
        Input.login-page__form-wrapper__input(v-model="loginForm.email" placeholder="邮箱" size="large")
          Icon(type="ios-person-outline" slot="prepend" size="20")
      FormItem(prop="password")
        Input.login-page__form-wrapper__input(v-model="loginForm.password" type="password" password placeholder="密码" size="large")
          Icon(type="ios-lock-outline" slot="prepend" size="20")
      p.color-red(v-if="loginFail" style="margin-top: -20px;padding-bottom: 5px; text-align: right") 邮箱或密码不正确
      Button(type="primary" @click="login") 登录
      .login-page__form-wrapper__footer
        p.text-weak 没有账号？
          router-link(to="/register") 注册
        router-link(to="/forgetpwd") 忘记密码
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Form } from 'view-design'
import { login } from '@/api/user'

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
  private loginFail: boolean = false

  private login() {
    this.$refs['form'].validate((valid: boolean | any) => {
      if (valid) {
        login(this.loginForm)
          .then((res: any) => {
            if (res.errCode !== 200) {
              if (res.errMsg !== '账号密码不对') {
                this.$Message.error({
                  content: res.errMsg,
                  duration: 10
                })
                this.loginFail = false
              } else {
                this.loginFail = true
              }
            } else {
              localStorage.token = res.token
              this.loginFail = false
              this.$router.push('/')
              window.location.reload()
            }
          })
          .catch(() => {
            this.loginFail = true
          })
      }
    })
  }
}
</script>

<style scoped lang="scss">
@import 'index';
</style>
