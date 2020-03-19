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
        router-link(to="/forgetpwd") 忘记密码
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Form } from 'view-design'

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
  private logining: boolean = false

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
}
</script>

<style scoped lang="scss">
@import 'index';
</style>
