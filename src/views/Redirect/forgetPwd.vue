<template lang="pug">
  .forget-pwd-page
    h1.forget-pwd-page__title AMOM人工智能实验室
    Form.forget-pwd-page__form-wrapper(:model="forgetPwdForm" label-position="top" :rules="ruleValidate" ref="form")
      FormItem(prop="newPassword")
        Input.login-page__form-wrapper__input(v-model="forgetPwdForm.newPassword" type="password" placeholder="请输入新密码" size="large")
          Icon(type="ios-lock-outline" slot="prepend" size="20")
      FormItem(prop="confirmNewPassword")
        Input.login-page__form-wrapper__input(v-model="forgetPwdForm.confirmNewPassword" type="password" password placeholder="请再次输入密码" size="large" @keyup.enter.native="changePwd")
          Icon(type="ios-lock-outline" slot="prepend" size="20")
      Button(type="primary" @click="changePwd") 确认修改
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Form } from 'view-design'
import { verifyToken } from '@/api/user'
@Component
export default class ForgetPwd extends Vue{
  public $refs!: {
    form: Form
  }
  private forgetPwdForm = {
    newPassword: '',
    confirmNewPassword: '',
    token: 'null'
  }
  private created() {
    if (this.$route.query.token) {
      this.forgetPwdForm.token = this.$route.query.token as string
    }
  }
  validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入密码'))
      // eslint-disable-next-line no-useless-escape
    } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)(?![_~@#\$\^]+$)[0-9A-Za-z_~@#\$\^]{8,16}$/.test(value)) {
      callback(new Error('密码长度为8-18，且至少包含字母数字'))
    } else {
      if (this.forgetPwdForm.confirmNewPassword !== '') {
        // 对第二个密码框单独验证
        this.$refs.form.validateField('confirmNewPassword')
      }
      callback()
    }
  }
  validatePassCheck = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请再次输入密码'))
    } else if (value !== this.forgetPwdForm.newPassword) {
      callback(new Error('两次输入的密码不相同'))
    } else {
      callback()
    }
  }

  private ruleValidate = {
    newPassword: [{ validator: this.validatePass, trigger: 'blur' }],
    confirmNewPassword: [{ validator: this.validatePassCheck, trigger: 'blur' }],
  }

  private changePwd() {
    this.$refs['form'].validate((valid: boolean | any) => {
      if (valid) {
        verifyToken(this.forgetPwdForm).then((res: any) => {
          if (res.errCode === 200) {
            setTimeout(() => {
              this.$router.push('/login')
            }, 3000)
            this.$Message.success({
              content: '修改成功，3s后跳转至登陆页',
              duration: 3
            })
          } else {
            this.$Message.error({
              content: '当前链接已失效，请重新申述',
              duration: 3
            })
            setTimeout(() => {
              this.$router.push('/')
            }, 3000)
          }
        })
      }
    })
  }
}
</script>

<style scoped lang="scss">
.forget-pwd-page {
  width: 100%;
  &__title {
    text-align: center;
    width: 100%;
    font-size: 2.6rem;
    font-weight: 600;
    margin-top: 40px;
  }
  &__form-wrapper {
    max-width: 400px;
    margin: 50px auto;
    box-shadow: 0 2px 12px 0 $color-weak;
    background: $color-white;
    width: 100%;
    padding: 2rem 1.5rem;

    button {
      width: 100%;
      line-height: 40px;
      height: 40px;
    }
  }
}
</style>