<template lang="pug">
  .course-page
    .course-page__header
      h1.course-page__header__title {{ course.title }}
      ul.course-page__header__desc
        li.item
          app-icon(name="label")
          span 入门
        li.item
          app-icon(name="order")
          span 4个任务
      .fix
      Button.course-page__header__btn(type="primary") 开始上机
    Tabs.course-page__content(value="description")
      TabPane.course-page__content__item(label="实验概述" name="description")
        section
          h3.title 实验内容
          p.statement 实验介绍基本的 Linux 操作和命令，如目录切换、文件操作、进程查看、端口查看、资源占用情况等等，实现从零开始操作 Linux 机器。
        section
          h3.title 实验资源
          p.statement 云服务器
        section
          h3.title 软件环境
          p.statement Centos 7.2 64位

</template>

<script lang="ts">
import { Course, formatCourse } from '@/utils/formatData'
import { getCourseDetail } from '@/api/courses'
import { Vue, Component } from 'vue-property-decorator'
import AppIcon from '@/base/appIcon.vue'
@Component({
  components: { AppIcon }
})
export default class CourseDetail extends Vue {
  private course: Course = { title: '', id: '', time: '', date: '', logo: '' }

  private created() {
    getCourseDetail({ id: this.$route.params.id }).then((res: any) => {
      this.course = formatCourse(res.data)
    })
  }
}
</script>

<style scoped lang="scss">
@import 'Course';
</style>
