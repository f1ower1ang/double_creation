<template lang="pug">
  .login
    h1.login__title.ml15 注册/登陆
    .login__form.mt15.ml15
      input.login__form__input(placeholder="输入手机号" v-model="phone")
      .login__form__protocol.mt15
        .login__form__protocol__tips.dib.text-weak 注册或登录即表示同意
        .login__form__protocol__name.dib.color-orange 《用户协议》
      button.mt15(size="large"
        :disabled="phone.length !== 11"
        @click="handleSubmit"
      ) 下一步
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string
  private phone = ''
  private handleSubmit() {
    console.log(1)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
