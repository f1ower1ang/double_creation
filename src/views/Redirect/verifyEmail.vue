<template lang="pug">
  .verify-email-page(style="padding: 40px;") {{ info }}
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { verifyEmail } from '@/api/user'

@Component
export default class VerifyEmail extends Vue{
  @Getter userInfo: any
  private token: string = 'null'
  private info: string = '正在验证...'

  private mounted() {
    if (this.$route.query.token) {
      this.token = this.$route.query.token as string
    }
  }
  private activated() {
    if (!this.userInfo) {
      this.$Message.warning('当前未登陆，请先登陆')
      this.$router.push('/login?redirect=' + this.$route.path)
    } else {
      this.$nextTick(() => {
        verifyEmail({
          token: this.token
        }).then((res: any) => {
          if (res.errCode === 200) {
            this.info = '验证成功。3秒后跳转至首页'
          } else {
            this.info = res.errMsg
          }
          setTimeout(() => {
            this.$router.push('/')
          }, 3000)
        }).catch((e: any) => {
          this.info = e.message
          setTimeout(() => {
            this.$router.push('/')
          }, 3000)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>