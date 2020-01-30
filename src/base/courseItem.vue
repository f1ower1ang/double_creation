<template lang="pug">
  Card(class="course-item" :dis-hover="true")
    h1(slot="title") {{ course.title }}
    div.course-item__body
      p.time
        app-icon(name="time")
        span {{ course.time }}
      p.date {{ course.date }}
    div.course-item__footer
      img(:src="course.logo" width="15%")
      Button(type="warning" @click="enterCourse") 开始
</template>

<script lang="ts">
interface Course {
  title: string
  time: string
  date: string
  logo: string
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
    this.$router.push(`/course/${this.course.id}`)
  }
}
</script>

<style scoped lang="scss">
.course-item {
  margin: 0 auto;
  width: 100%;
  max-width: 400px;
  border-bottom: 4px solid $color-theme;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  &.ivu-card.ivu-card-dis-hover.ivu-card-bordered:hover {
    border-bottom-color: $color-theme;
  }
  h1 {
    font-size: 1.5rem;
    font-weight: bold;
  }
  .course-item__body {
    display: flex;
    justify-content: space-between;
    color: $color-pl;
    align-items: center;
    padding-bottom: 20px;
  }
  .course-item__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
