<template>
  <i class="iconfont" :class="'icon-' + name" v-on="$listeners" :style="{ color }" />
</template>

<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator'
@Component({})
export default class AppIcon extends Vue {
  @Prop({
    type: String,
    required: true,
    default: ''
  })
  private name!: string
  @Prop({
    type: String,
    default: ''
  })
  private color!: string
}
</script>

<style scoped lang="scss">
.iconfont {
  font-size: $font-size-medium;
}
</style>
