<template lang="pug">
  Layout#app
    Header
      app-header
    Content
      transition(name="slideIn")
        keep-alive(v-if="$route.meta.keepAlive")
          router-view
        router-view(v-if="!$route.meta.keepAlive")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import appHeader from '@/base/appHeader/appHeader.vue'

  @Component({
    components: {
      appHeader
    }
  })
export default class App extends Vue {
  private mounted() {
    this.resetFontSize()
    window.addEventListener('resize', this.resetFontSize)
  }

  private resetFontSize() {
    const html: any = document.querySelector('html')
    const width = html.getBoundingClientRect().width
    html.style.fontSize = `${(Math.min(width, 500) / 500) * 16}px`
  }
}
</script>

<style lang="scss" scoped>
  #app {
    width: 100%;
    height: 100%;

    .ivu-layout-header {
      background: $bg-page-light;
      color: $color-deep;
      padding: 0 20px;
      line-height: 60px;
      height: 60px;
      position: fixed;
      top: 0;
      width: 100%;
      box-shadow: 0 0 16px 0 rgba(0,0,0,.18);
      z-index: 10;
    }

    .ivu-layout-content {
      padding: 0 20px;
      margin-top: 60px;
      background-color: $bg-page;
      background-image: url("assets/background.svg");
      background-repeat: no-repeat;
      background-position: center 110px;
      background-attachment: fixed;
      background-size: 100%;
    }

    .ivu-layout-footer {
      background: $bg-page-dark;
      color: $color-white;
      text-align: center;
    }
  }
  .slideIn-enter-active {
    transition: all .4s
  }
  .slideIn-enter {
    transform: translateX(10px);
    opacity: 0;
  }

</style>
