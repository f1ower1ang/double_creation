<template lang="pug">
  div(class="course-item" @click="enterCourse")
    div.course-item__top
      img(v-lazy="course.imgUrl" width="100%" height="100%")
    div.course-item__bottom
      p.no-wrap {{ course.title }}
</template>

<script lang="ts">
interface Course {
  title: string
  time: string
  date: string
  imgUrl: string
  id: string
}
import { Vue, Component, Prop } from 'vue-property-decorator'
import AppIcon from '@/base/appIcon.vue'

@Component({
  components: { AppIcon }
})
export default class CourseItem extends Vue {
  @Prop({
    type: Object
  })
  course!: Course
  private enterCourse() {
    let routeUrl = this.$router.resolve(`/course/${this.course.id}`)
    open(routeUrl.href)
  }
}
</script>

<style scoped lang="scss">
.course-item {
  margin: 0 auto;
  height: 210px;
  width: 100%;
  transition: all .3s;
  padding: 10px;
  background: #fff;
  &__top {
    width: 100%;
    height: 160px;
    background: #e9e9e9;
    padding: 5%;
    box-sizing: border-box;
  }
  &__bottom {
    width: 100%;
    p {
      line-height: 30px;
      text-align: center;
    }
  }
  &:hover {
    cursor: pointer;
    box-shadow: 0 5px 8px rgba(0,0,0,.15);
    transform: translateY(-5px);
  }

  h1 {
    font-size: $font-size-medium-x;
  }
}
</style>
