<template lang="pug">
  Layout#app
    Header
      app-header
    Content
      router-view
    Footer 尾部
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

<style scoped lang="scss">
#app {
  width: 100%;
  height: 100%;

  .ivu-layout-header {
    background: $bg-page-dark;
    color: $color-white;
    padding: 0 20px;
    line-height: 60px;
    height: 60px;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
  }

  .ivu-layout-content {
    padding: 0 20px;
    margin-top: 60px;
    background: $bg-page;
  }

  .ivu-layout-footer {
    background: $bg-page-dark;
    color: $color-white;
    text-align: center;
  }
}
</style>
