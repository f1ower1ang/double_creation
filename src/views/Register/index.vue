<template lang="pug">
  .register-page
    h1.register-page__title AMOM人工智能实验室
    Form.register-page__form-wrapper(:model="registerForm" label-position="top" :rules="ruleValidate" ref="form")
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
            Input(v-model="registerForm.code" placeholder="验证码" size="large" @on-blur="validateCode('Register')")
          Col(span="9" offset="1" style="height: 40px")
            img(:src="codeImg" height="100%" width="100%" @click="getCode")
      p.color-red(v-if="!validRegister && showTipRegister" style="margin-top: -20px; padding-bottom: 5px") 验证码错误

      Button(type="primary" @click="register") 注册
      .register-page__form-wrapper__footer
        p.text-weak 已有账号？
          router-link(to="/login") 登录
        a(@click="showModal") 已注册？没有验证邮件
    Modal(v-model="modal" @on-ok="resendEmail"  title="重发验证邮件" :loading="true" width="400px" class-name="vertical-center-modal" ok-text="发送" :closable="false" :mask-closable="false" @on-cancel="cancelResend")
      Form(:model="resendForm" :rules="ruleValidate" ref="resendForm")
        FormItem(prop="email")
          Input(type="email" v-model="resendForm.email" size="large" placeholder="邮箱")
            Icon(type="ios-mail-outline" slot="prepend" size="20")
        FormItem
          Row
            Col(span="14")
              Input(v-model="resendForm.code" placeholder="验证码" size="large" @on-blur="validateCode('Resend')")
            Col(span="9" offset="1" style="height: 40px")
              img(:src="codeImg" height="100%" width="100%" @click="getCode")
        p.color-red(v-if="!validResend && showTipResend" style="margin-top: -20px; padding-bottom: 5px") 验证码错误
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
    if (value === '') {
      callback(new Error('请输入手机号'))
    } else if (value.length > 0 && !/^1[34578]\d{9}$/.test(value)) {
      callback('手机号格式不正确')
    } else {
      callback()
    }
  }
  validateUsername = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入用户名'))
    } else if (value.length < 6 || value.length > 15) {
      callback(new Error('长度必须在6和15之间'))
    } else {
      callback()
    }
  }

  public $refs!: {
    form: Form,
    resendForm: Form
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
    account: [{ validator: this.validateUsername, trigger: 'blur' }],
    password: [{ validator: this.validatePass, trigger: 'blur' }],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
    ],
    phone: [{ validator: this.validatePhone, trigger: 'blur', required: true }],
    confirmPassword: [{ validator: this.validatePassCheck, trigger: 'blur' }],
    code: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
  }
  private loading: boolean = false
  private time: number = 60
  private timer: any = null
  private codeImg: string = ''
  private codeToken: string = ''
  private validRegister: boolean = false
  private showTipRegister: boolean = false
  private resendForm = {
    email: '',
    code: ''
  }
  private modal = false
  private validResend: boolean = false
  private showTipResend: boolean = false

  private created() {
    this.getCode()
  }

  private register() {
    this.$refs['form'].validate((valid: boolean | any) => {
      if (valid && this.registerForm.code.length > 0) {
        if (this.validRegister) {
          const data = Object.assign({}, this.registerForm, {
            name: this.registerForm.account,
            sex: 0
          })
          register(data)
            .then((res: any) => {
              if (res.errCode !== 200) {
                this.$Message.error({
                  content: '邮箱或用户名已被注册',
                  duration: 5
                })
              } else {
                this.$Message.success('注册成功')
                emailCode({
                  email: this.registerForm.email
                }).then((res: any) => {
                  if (res.errCode === 200) {
                    setTimeout(() => {
                      this.$router.push('/')
                    }, 3000)
                    this.$Message.success('请前往邮箱激活账号')
                  }
                })
              }
            })
            .catch(() => {
              this.$Message.error('检查注册信息是否完整')
            })
        }
      } else {
        this.$Message.error('按照正确格式将表单填写完整')
      }
    })
  }
  private showModal() {
    this.modal = true
    this.getCode()
  }
  private resendEmail() {
    this.$refs['resendForm'].validate((valid: any) => {
      if (valid && this.resendForm.code.length > 0) {
        if (this.validResend) {
          emailCode({
            email: this.resendForm.email
          }).then((res: any) => {
            if (res.errCode === 200) {
              this.$Message.success('验证邮件发送成功')
            } else {
              this.$Message.error(res.errMsg)
            }
          }).catch((e) => {
            this.$Message.error('发送失败，请先注册')
          })
          this.resendForm = {
            email: '',
            code: ''
          }
          this.getCode()
          this.modal = false
        } else {
          this.$Message.warning('验证码填写有误')
        }
      } else {
        this.$Message.warning('补全表单信息')
      }
    })
  }
  private cancelResend() {
    this.modal = false
    this.getCode()
  }
  private getCode() {
    getCode().then((res: any) => {
      this.codeImg = 'data:images/jpeg;base64,' + res.data.img
      this.codeToken = res.data.sToken
    })
  }
  private validateCode(type: string) {
    const textStr = type === 'Resend' ? this.resendForm.code : this.registerForm.code
    verifyCode({ sToken: this.codeToken, textStr })
      .then((res: any) => {
        if (res.errCode !== 200) {
          if (type === 'Resend') {
            this.validResend = false
            this.showTipResend = true
          } else {
            this.validRegister = false
            this.showTipRegister = true
          }
          this.getCode()
        } else {
          if (type === 'Resend') {
            this.validResend = true
            this.showTipResend = false
          } else {
            this.validRegister = true
            this.showTipRegister = false
          }
        }
      })
      .catch(() => {
        this.getCode()
        if (type === 'Resend') {
          this.validResend = false
          this.showTipResend = true
        } else {
          this.validRegister = false
          this.showTipRegister = true
        }
      })
  }
}
</script>

<style scoped lang="scss">
@import 'index';
</style>
