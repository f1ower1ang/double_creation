<template lang="pug">
  nav.app-header(@click.stop)
    router-link.app-header__logo(to="/" tag="p")
      img(:src="require('../../assets/header.png')" height="150%" style="margin-top: -10px; margin-left: -40px")
    ul.app-header__menu(:class="{open: flag}")
      router-link(to="/" tag="li" class="item") 首页
      router-link(to="/courses" tag="li" class="item") amomlabs
      template(v-if="!userInfo")
        router-link(to="/login" tag="li" class="item") 登录
        router-link(to="/register" tag="li" class="item") 注册
      template(v-else)
        li(class="item hidden" :class="{'router-link-exact-active': this.$route.path.indexOf('/user') > -1}")
          dropdown
            p 你好，{{ userInfo.name }}
              icon(type="ios-arrow-down")
            dropdown-menu(slot="list")
              dropdown-item
                router-link(to="/user" tag="p") 我的主页
              dropdown-item
                router-link(to="/user/profile" tag="p") 个人设置
              dropdown-item
                p(@click="logout") 登出
        router-link(to="/user" tag="li" class="item user show") 我的主页
        router-link(to="/user/profile" tag="li" class="item user show") 个人设置
        li(class="item user show" @click="logout") 登出
    div.app-header__burger(
      @click="toggleFlag"
      :class="{active: flag}"
    )
      p.top-line
      p.center-line
      p.bottom-line
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

@Component
export default class AppHeader extends Vue {
  private flag: boolean = false
  private login: boolean = false
  @Getter userInfo: any

  @Watch('$route')
  onRouterChange() {
    if (this.flag) {
      this.toggleFlag()
    }
  }

  private toggleFlag() {
    this.flag = !this.flag
  }
  private logout() {
    this.$store.dispatch('user/logout').then(() => {
      if (this.$route.path.indexOf('user') > -1) {
        this.$router.push(`/login?redirect=${this.$route.path}`)
      } else {
        location.reload()
      }
    })
  }
}
</script>

<style lang="scss">
@import 'appHeader';
</style>
