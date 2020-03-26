<template lang="pug">
  .verify-register-page {{ info }}
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { verifyRegister } from '@/api/user'
import { Mutation } from 'vuex-class'
import * as types from '@/store/mutation-types'
import { setToken } from '@/utils/auth'

@Component
export default class VerifyRegister extends Vue{
  @Mutation(`user/${types.SET_TOKEN}`)
  setToken!: ((args: any) => void)
  private verifyInfo = {
    email: 'null',
    token: 'null'
  }
  private info = '正在验证账号信息...'
  public created() {
    const { token, email } = this.$route.query
    if (token && email) {
      this.verifyInfo = {
        email: email as string,
        token: token as string
      }
    }
  }
  private mounted() {
    verifyRegister(this.verifyInfo).then((res: any) => {
      if (res.errCode === 200) {
        this.info = '验证成功'
        setToken(res.data.token)
        this.setToken(res.data.token)
        setTimeout(() => {
          this.$router.push('/')
          this.$Notice.success({ title: '登录成功' })
        }, 1000)
      }
    }).catch((e) => {
      this.info = e.message
      setTimeout(() => {
        this.$router.push('/')
      }, 1000)
    })
  }
}
</script>

<style scoped lang="scss">
  .verify-register-page {
    padding: 40px;
  }
</style>