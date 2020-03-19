<template lang="pug">
  .all-course-page
    .all-course-page__header
      h1.all-course-page__header__title Codelabs
      p.all-course-page__header__statement 中文名，在线动手实验室，学习者可以在 Codelabs 中实操，通过在云端的在线动手实验室学习或加深开源技术的各个重要知识点，让 TensorFlow 去完成我们可以交给人工智能完成的事情，增强人工智能与现有计算思维的结合，帮助学习者实际使用人工智能！
    Row.all-course-page__course-list
      Col.all-course-page__course-list__item(:xs="24" :sm="24" :md="12" :lg="8" :xl="6" v-for="(course, index) in courseList" :key="index")
        course(:course="course")
      Spin(size="large" fix v-if="spinShow")
    Page.all-course-page__footer(:total="total" :show-total="showTotal" size="small" :show-sizer="showSizer" show-elevator :page-size="limit" :page-size-opts="[6, 8, 12]" @on-change="togglePage" @on-page-size-change="toggleLimit" v-show="limit <= total")
    .fix
    router-view
</template>

<script lang="ts">
import course from '@/base/courseItem.vue'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { getAllCourse } from '@/api/courses'
import { Course, formatCourse } from '@/utils/formatData'

@Component({
  components: { course }
})
export default class AllCourse extends Vue {
  private courseList: Array<Course> = []
  private total: number = 0
  private page: number = 1
  private limit: number = 8
  private showTotal: boolean = true
  private showSizer: boolean = true
  private spinShow: boolean = true

  private mounted() {
    this.windowWidth()
    const that = this
    window.onresize = function() {
      that.windowWidth()
    }
  }

  private created() {
    setTimeout(() => {
      this.getCourse()
    }, 1000)
  }

  private getCourse() {
    getAllCourse({
      pages: this.page,
      size: this.limit
    }).then((res: any) => {
      this.courseList = []
      this.total = res.data.total
      res.data.records.forEach((item: object) => {
        this.courseList.push(formatCourse(item))
      })
      this.spinShow = false
    })
  }
  private togglePage(page: number) {
    this.page = page
    this.spinShow = true
    setTimeout(() => {
      this.getCourse()
    }, 500)
  }
  private toggleLimit(limit: number) {
    this.page = 1
    this.limit = limit
    this.spinShow = true
    setTimeout(() => {
      this.getCourse()
    }, 500)
  }
  private windowWidth() {
    const width = document.documentElement.clientWidth
    if (width < 414) {
      this.showTotal = false
      this.showSizer = false
    } else if (width >= 414 && width < 768) {
      this.showTotal = true
      this.showSizer = false
    } else if (width >= 768) {
      this.showTotal = true
      this.showSizer = true
    }
  }
}
</script>

<style scoped lang="scss">
@import 'AllCourse';
</style>
