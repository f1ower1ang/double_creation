<template lang="pug">
  div.profile-page(v-if="userInfo")
    div.profile-page__navbar
      ul.verticalMenu
        li(:class="{active: name === 'primary-info'}" @click="setName('primary-info')") 基本信息
        li(:class="{active: name === 'account-info'}" @click="setName('account-info')") 账号密码
      Menu(mode="horizontal" :active-name="name" class="horizonMenu" @on-select="setName")
        MenuItem(name="primary-info") 基本信息
        MenuItem(name="account-info") 账号密码
    div.profile-page__body
      Form(:model="primaryInfo" label-position="left" :label-width="60" v-show="name=== 'primary-info'")
        FormItem(label="头像" style="height: 120px; margin-bottom: 50px")
          div.avatar
            img(:src="avatar" height="100" width="100")
          Upload(
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            action="hhh"
            :before-upload="handleBeforeUpload "
          )
            div(style="")
              Icon(type="ios-camera" size="20")
          p.text-weak.no-wrap 只能上传jpg/png/jpeg文件，且不超过1Mb
        FormItem(label="账户名")
          Input(v-model="primaryInfo.account" readonly)
        FormItem(label="性别")
          RadioGroup(v-model="primaryInfo.sex")
            Radio(:label="1") 男
            Radio(:label="0") 女
        FormItem(label="昵称")
          Input(v-model="primaryInfo.name")
        FormItem
          Button(type="primary" @click="saveEdit") 保存
      ul.profile-page__body__account(v-show="name === 'account-info'")
        li.item
          label 手机
          p.info.no-wrap {{ accountInfo.phone }}
          a.btn(@click="beforeBind") 点击修改
        li.item
          label 邮箱
          p.info.no-wrap(:title="accountInfo.email") {{ accountInfo.email }}
          a.btn(@click="modal2 = true") 点击修改
        li.item
          label 密码
          p.info.no-wrap ******
          a.btn(@click="modal3 = true") 点击修改

    Modal(v-model="modal1" @on-ok="changePhone"  title="修改手机" :loading="true" ref="modal1" footer-hide width="400px" :mask-closable="false" :closable="false")
      Form(:model="beforeBindForm" v-if="step === 'beforeBind'")
        FormItem(prop="code")
          Row(:gutter="20")
            Col(span="16")
              Input(v-model="beforeBindForm.code" placeholder="短信验证码")
                Icon(type="ios-text-outline" slot="prepend" size="20")
            Col(span="8")
              Button(@click="beforeBind" style="width: 100%" v-if="beforeBindForm.time === 60") 点击获取
              Button(disabled style="width: 100%" v-else) {{ beforeBindForm.time }} s
        FormItem(style="text-align: right; margin-bottom: 0")
          Button(style="margin-right: 10px" @click="cancelBind") 取消
          Button(type="primary" @click="beforeBindValidate") 下一步
      Form(:model="phoneForm" v-else)
        FormItem(prop="phone")
          Input(v-model="phoneForm.phone" placeholder="手机")
            Icon(type="ios-call-outline" slot="prepend" size="20")
        FormItem(prop="code")
          Row(:gutter="20")
            Col(span="16")
              Input(v-model="phoneForm.code" placeholder="验证码")
                Icon(type="ios-text-outline" slot="prepend" size="20")
            Col(span="8")
              Button(@click="getPhoneCode" style="width: 100%" v-if="phoneForm.time === 60") 点击获取
              Button(disabled style="width: 100%" v-else) {{ phoneForm.time }} s
        FormItem(style="text-align: right; margin-bottom: 0")
          Button(style="margin-right: 10px" @click="cancelBind") 取消
          Button(type="primary" @click="confirmAmend") 确认修改
    Modal(v-model="modal2" @on-ok="changeEmail"  title="修改邮箱" :loading="true" ref="modal2" width="400px")
      Form(:model="emailForm" :rules="emailRule" ref="emailForm")
        FormItem(label="邮箱" prop="email")
          Input(type="email" v-model="emailForm.email")
    Modal(v-model="modal3" @on-ok="changePwd" title="修改密码" :loading="true" ref="modal3" width="400px")
      Form(:model="pwdForm" label-position="top" :rules="pwdRule" ref="pwdForm")
        FormItem(label="当前密码" prop="oldPassword")
          Input(type="password" v-model="pwdForm.oldPassword")
        FormItem(label="新密码" prop="newPassword")
          Input(type="password" v-model="pwdForm.newPassword")
        FormItem(label="确认密码" prop="confirmNewPassword")
          Input(type="password" v-model="pwdForm.confirmNewPassword")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { defaultBaseUrl } from '@/utils/http'
import path from '@/utils/path'
import { uploadAvatar, editInfo, resetPwd, resetEmail, beforeBindPhone } from '@/api/user'
import code, { checkBeforeBindCode, checkBindCode, getPhoneCode } from '@/api/code'
import { checkImage } from '@/utils/image'
import { Form } from 'view-design'
import { User } from '@/utils/formatData'

@Component
export default class Profile extends Vue{
  private primaryInfo: any = {
    name: '',
    account: '',
    sex: 0
  }
  private accountInfo: any = {
    phone: '',
    email: ''
  }
  private name: string = 'primary-info'
  private avatar: string = ''
  private uploadUrl: string = defaultBaseUrl + path.user.uploadImg
  private uploadFile: File | null = null
  private imageTypes: string[] = ['jpg', 'jpeg', 'png']

  public $refs!: {
    pwdForm: Form,
    emailForm: Form,
    phoneForm: Form,
    modal1: any,
    modal3: any,
    modal2: any
  }
  private modal1: boolean = false
  private modal2: boolean = false
  private modal3: boolean = false


  validatePass(rule: any, value: any, callback: any) {
    if (value === '') {
      return callback(new Error('请输入新密码'));
    }
    if (this.pwdForm.confirmNewPassword.length > 0) {
      // 对第二个密码框单独验证
      this.$refs.pwdForm.validateField('confirmNewPassword');
    }
    callback()
  }
  validatePassCheck(rule: any, value: any, callback: any){
    if (value === '') {
      callback(new Error('请输入密码'));
    } else if (value !== this.pwdForm.newPassword) {
      callback(new Error('两次输入密码不一致'));
    } else {
      callback();
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

  private pwdForm: any = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  }
  private pwdRule: any = {
    oldPassword: [
      { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    newPassword: [
      { required: true, validator: this.validatePass, trigger: 'blur' }
    ],
    confirmNewPassword: [
      { required: true, validator: this.validatePassCheck, trigger: 'blur' }
    ]
  }
  private emailForm: any = {
    email: ''
  }
  private emailRule: any = {
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '邮箱地址不正确', trigger: 'blur' }
    ]
  }
  private phoneForm: any = {
    phone: '',
    code: '',
    time: 60
  }
  private phoneRule: any = {
    phone: [{ validator: this.validatePhone, trigger: 'blur', required: true }],
    code: [{ required: true, message: '请输入验证码', trigger: 'blur'}]
  }

  private beforeBindForm: any = {
    code: '',
    time: 60,
    token: ''
  }
  private step: string = 'beforeBind'

  @Getter userInfo: User | undefined | null

  mounted() {
    if (this.userInfo) {
      this.primaryInfo = {
        name: this.userInfo.name,
        account: this.userInfo.account,
        sex: this.userInfo.sex
      }
      this.avatar = this.userInfo.avatar
      this.accountInfo = {
        phone: this.userInfo.phone,
        email:this.userInfo.email
      }
    }
  }

  private setName(name: string) {
    this.name = name
  }
  private handleBeforeUpload(file: File) {
    this.uploadFile = file
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const _base64 = reader.result
      this.avatar = _base64  as string //将_base64赋值给图片的src，实现图片预览
    }
    return false
  }
  private async saveEdit() {
    try {
      if (this.uploadFile) {
        if (checkImage(this.uploadFile, this.imageTypes, 1)) {
          const res: any = await uploadAvatar(this.uploadFile)
          if (res.errMsg !== '成功') {
            this.$Message.warning('图片类型或大小不符合')
            return
          }
        } else {
          this.$Message.warning('图片类型或大小不符合')
          return
        }
      }
      await editInfo({ sex: this.primaryInfo.sex, name: this.primaryInfo.name })
      await this.$store.dispatch('user/getInfo')
      this.$Message.success('更新成功')
    } catch (e) {
      console.error(e)
    }
  }

  private beforeBind() {
    beforeBindPhone().then((res: any) => {
      if (res.errCode === 200) {
        this.$Message.warning({
          content: '验证短信发送成功'
        })
        this.modal1 = true
        this.beforeBindForm.time = 59
        let timer = setInterval(() => {
          this.beforeBindForm.time -= 1
          if (this.beforeBindForm.time === 0) {
            clearInterval(timer)
            this.beforeBindForm.time = 60
          }
        }, 1000)
      }
    })
  }
  beforeBindValidate() {
    checkBeforeBindCode(this.beforeBindForm.code).then((res: any) => {
      if (res.errCode === 200) {
        this.step = 'bindPhone'
        this.beforeBindForm.token = res.data.token
      } else {
        this.$Message.error('验证码错误')
      }
    })
  }
  private cancelBind() {
    this.modal1 = false
    this.step = 'beforeBind'
    this.beforeBindForm = {
      code: '',
      time: 60,
      token: ''
    }
    this.phoneForm = {
      phone: '',
      code: '',
      time: 60
    }
  }

  private changePhone() {
    this.$refs['modal1'].buttonLoading = false
    this.$refs['phoneForm'].validate((valid: boolean | any) => {
      if (valid) {
        this.modal3 = false
      }
    })
  }
  private changeEmail() {
    this.$refs['modal2'].buttonLoading = false
    this.$refs['emailForm'].validate((valid: boolean | any) => {
      if (valid) {
        this.modal2 = false
        this.emailForm.email = ''
        resetEmail(this.emailForm).then((res: any) => {
          if (res.errCode === 200) {
            this.$Message.success({
              content: '验证邮件发送成功，请前往邮箱验证',
              duration: 3
            })
          } else {
            this.$Message.warning({
              content: res.errMsg,
              duration: 3
            })
          }
        }).catch((e: any) => {
          this.$Message.error(e.message)
        })
      }
    })
  }
  private changePwd() {
    this.$refs['modal3'].buttonLoading = false
    this.$refs['pwdForm'].validate((valid: boolean | any) => {
      if (valid) {
        this.modal3 = false
        this.pwdForm = {
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }
        resetPwd(this.pwdForm).then((res: any) => {
          if (res.errCode !== 200) {
            this.$Message.error(res.errMsg)
          } else {
            this.$Message.success('修改成功，将跳转至登录页面')
            setTimeout(() => {
              this.$router.push(`/login?redirect=${this.$route.path}`)
              this.$store.dispatch('user/removeUser')
            }, 1500)
          }
        }).catch(() => {
          this.$Message.error('修改失败')
        })
      }
    })
  }

  private getPhoneCode() {
    if (this.phoneForm.phone === '') {
      this.$Message.error('请输入手机号码')
    } else if (!/^1[34578]\d{9}$/.test(this.phoneForm.phone)) {
      this.$Message.error('请输入正确的手机号码')
    } else {
      getPhoneCode({
        phoneNumber: this.phoneForm.phone,
        token: this.beforeBindForm.token
      }).then((res) => {
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
  private confirmAmend() {
    if (this.phoneForm.phone === '' || this.phoneForm.code === '') {
      this.$Message.error('请将表单信息填写完整')
    } else if (!/^1[34578]\d{9}$/.test(this.phoneForm.phone)) {
      this.$Message.error('请输入正确的手机号码')
    } else {
      checkBindCode({
        phoneNumber: this.phoneForm.phone,
        checkCode: this.phoneForm.code
      }).then((res: any) => {
        if (res.errCode === 200) {
          this.$Message.success('绑定成功')
        } else {
          this.$Message.error(res.errMsg)
        }
      }).catch(() => {
        this.$Message.error('绑定失败, 检查验证码是否正确')
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "profile";
</style>
