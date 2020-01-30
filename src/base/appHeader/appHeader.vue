<template lang="pug">
  nav.app-header
    router-link.app-header__logo(to="/" tag="p") amom人工智能实验室
    ul.app-header__menu(:class="{open: flag}")
      router-link(to="/" tag="li" class="item") 首页
      router-link(to="/courses" tag="li" class="item") Codelabs
      template(v-if="!login")
        router-link(to="/login" tag="li" class="item") 登录
        router-link(to="/register" tag="li" class="item") 注册
      template(v-else)
        li(class="item hidden" :class="{'router-link-exact-active': this.$route.path.indexOf('/user') > -1}")
          dropdown
            p 你好，xxx
              icon(type="ios-arrow-down")
            dropdown-menu(slot="list")
              dropdown-item
                router-link(to="/user/profile" tag="p") 个人中心
              dropdown-item
                router-link(to="/user/task" tag="p") 任务管理
              dropdown-item
                router-link(to="/user/logout" tag="p") 登出
        router-link(to="/user/profile" tag="li" class="item user show") 个人中心
        router-link(to="/user/logout" tag="li" class="item user show") 登出
    div.app-header__burger(
      @click="toggleFlag"
      :class="{active: flag}"
    )
      p.top-line
      p.center-line
      p.bottom-line
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class AppHeader extends Vue {
  private flag: boolean = false
  private login: boolean = false
  private toggleFlag() {
    this.flag = !this.flag
  }
}
</script>

<style lang="scss">
@import 'appHeader';
</style>
