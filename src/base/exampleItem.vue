<template lang="pug">
  .case-item
    img(:src="example.imgUrl")
    .case-item__wrapper
      h2.case-item__wrapper__title {{ example.title }}
      p.case-item__wrapper__date
        app-icon(name="time")
        span {{ example.date }}
      p.case-item__wrapper__user
        app-icon(name="people")
        span {{ example.user }}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import AppIcon from '@/base/appIcon.vue'
interface Example {
  imgUrl: string
  title: string
  date: string
  user: string
  id: string
}
@Component({
  components: { AppIcon }
})
export default class ExampleItem extends Vue {
  @Prop({
    type: Object,
    default: null
  })
  example!: Example
}
</script>

<style scoped lang="scss">
.case-item {
  border-radius: 5px;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  box-shadow: 0 0 10px 1px $color-pl;
  color: $color-pl;
  transition: 0.3s ease-out;
  &:hover {
    box-shadow: 0 10px 10px $color-pl;
    transform: scale(1.05);
  }
  img {
    width: 100%;
    border-radius: 5px;
  }
  &__wrapper {
    margin-top: 20px;
    padding: 0 20px;
    &__title {
      font-size: 1.3rem;
      font-weight: bold;
      color: $color-deep;
    }
    &__date {
      font-size: 0.8rem;
      padding: 10px 0;
    }
    &__user {
      font-size: 1rem;
      padding: 20px 0;
    }
  }
}
</style>
