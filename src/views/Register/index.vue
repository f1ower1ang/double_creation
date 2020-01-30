<template lang="pug">
  .register-page
    h1.register-page__title AMOM人工智能实验室
    Form.register-page__form-wrapper(:model="registerForm" label-position="top" :rules="ruleValidate" @keyup.enter.native="register" ref="form")
      FormItem(prop="account")
        Input(v-model="registerForm.account" placeholder="用户名" size="large")
          Icon(type="ios-person-outline" slot="prepend" size="20")
      FormItem(prop="email")
        Input(v-model="registerForm.email" placeholder="邮箱" size="large")
          Icon(type="ios-mail-outline" slot="prepend" size="20")
      FormItem(prop="phone")
        Input(v-model="registerForm.phone" placeholder="手机" size="large")
          Icon(type="ios-call-outline" slot="prepend" size="20")
      FormItem(prop="password")
        Input(v-model="registerForm.password" type="password" password placeholder="密码" size="large")
          Icon(type="ios-lock-outline" slot="prepend" size="20")
      FormItem(prop="confirmPassword")
        Input(v-model="registerForm.confirmPassword" type="password" password placeholder="确认密码" size="large")
          Icon(type="ios-lock-outline" slot="prepend" size="20")
      FormItem
        Row
          Col(span="14")
            Input(v-model="registerForm.code" placeholder="验证码" size="large" @on-blur="validateCode")
          Col(span="9" offset="1" style="height: 40px")
            img(:src="codeImg" height="100%" width="100%" @click="getCode")
      p.color-red(v-if="!valid && showTip" style="margin-top: -20px; padding-bottom: 5px") 验证码错误

      Button(type="primary" @click="register") 注册
      .register-page__form-wrapper__footer
        p.text-weak 已有账号？
          router-link(to="/login") 登录
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Form } from 'view-design'
import { register } from '@/api/user'
import { getCode, verifyCode, emailCode } from '@/api/code'

@Component
export default class Register extends Vue {
  validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入密码'))
      // eslint-disable-next-line no-useless-escape
    } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)(?![_~@#\$\^]+$)[0-9A-Za-z_~@#\$\^]{8,16}$/.test(value)) {
      callback(new Error('密码长度为8-18，且至少包含字母数字'))
    } else {
      if (this.registerForm.confirmPassword !== '') {
        // 对第二个密码框单独验证
        this.$refs.form.validateField('confirmPassword')
      }
      callback()
    }
  }
  validatePassCheck = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请再次输入密码'))
    } else if (value !== this.registerForm.password) {
      callback(new Error('两次输入的密码不相同'))
    } else {
      callback()
    }
  }
  validatePhone = (rule: any, value: any, callback: any) => {
    if (value.length > 0 && !/^1[34578]\d{9}$/.test(value)) {
      callback('手机号格式不正确')
    } else {
      callback()
    }
  }

  public $refs!: {
    form: Form
  }

  private registerForm: any = {
    account: '',
    email: '',
    password: '',
    confirmPassword: '',
    code: '',
    phone: ''
  }
  private ruleValidate: object = {
    account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ validator: this.validatePass, trigger: 'blur' }],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
    ],
    phone: [{ validator: this.validatePhone, trigger: 'blur' }],
    confirmPassword: [{ validator: this.validatePassCheck, trigger: 'blur' }],
    code: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
  }
  private loading: boolean = false
  private time: number = 60
  private timer: any = null
  private codeImg: string = ''
  private codeToken: string = ''
  private valid: boolean = false
  private showTip: boolean = false

  private created() {
    this.getCode()
  }

  private register() {
    this.$refs['form'].validate((valid: boolean | any) => {
      if (valid && this.registerForm.code.length > 0) {
        if (this.valid) {
          const data = Object.assign({}, this.registerForm, {
            name: this.registerForm.account,
            sex: 0,
            phone: ''
          })
          register(data)
            .then((res: any) => {
              if (res.errCode !== 200) {
                this.$Message.error({
                  content: '邮箱或用户名已被注册',
                  duration: 5
                })
              } else {
                emailCode({
                  email: this.registerForm.email
                }).then((res: any) => {
                  if (res.errCode === 200) {
                    setTimeout(() => {
                      this.$router.push('/login')
                      window.location.reload()
                    }, 1000)
                    this.$Message.success({
                      content: '注册成功，请先前往邮箱激活账号',
                      duration: 5
                    })
                  }
                })
              }
              // this.$router.push('/')
            })
            .catch(() => {
              this.$Message.error('检查注册信息是否完整')
            })
        }
      } else {
        this.$Message.error('将表单填写完整')
      }
    })
  }
  private getCode() {
    getCode().then((res: any) => {
      this.codeImg = 'data:images/jpeg;base64,' + res.data.img
      this.codeToken = res.data.sToken
    })
  }
  private validateCode() {
    verifyCode({ sToken: this.codeToken, textStr: this.registerForm.code })
      .then((res: any) => {
        if (res.errCode !== 200) {
          this.valid = false
          this.showTip = true
          this.getCode()
        } else {
          this.valid = true
          this.showTip = false
        }
      })
      .catch(() => {
        this.getCode()
        this.valid = false
        this.showTip = true
      })
  }
}
</script>

<style scoped lang="scss">
@import 'index';
</style>
