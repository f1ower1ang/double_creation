<template lang="pug">
  .home-page.text-dark
    .home__bg(ref="bg")
      img(:src="require('../../assets/home.png')")
      Button(size="large" type="default" shape="circle" @click="goTo") 立即体验
      Icon(type="ios-arrow-down")
    .home__wrapper
      .home__recommend
        h1.home__recommend__title {{ title }}
        .home__recommend__item
          div.header
            h2 amomlabs
            router-link(to="/courses") 更多 >
          Row(:gutter="20")
            Spin(size="large" fix v-show="spinShow")
            Col(:xs="24" :sm="24" :md="12" v-for="(course, index) in courseList" :key="index")
              course(:course="course")
</template>

<script lang="ts">
import course from '@/base/courseItem.vue'
import example from '@/base/exampleItem.vue'
import introduction from '@/components/Home/introduction.vue'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Course, formatCourse, User } from '@/utils/formatData'
import { getRecCourse } from '@/api/courses'

@Component({
  components: { introduction, course, example }
})
export default class Home extends Vue {
  private courseList: Array<Course> = []
  private spinShow: boolean = false
  public $refs!: {
    bg: HTMLBaseElement
  }

  @Getter userInfo: User | undefined

  @Watch('userInfo')
  resetCourse() {
    this.getRecCourse()
  }

  private created() {
    this.getRecCourse()
  }

  private mounted() {
    const { offsetHeight, offsetWidth } = this.$refs.bg
    if (offsetWidth < offsetHeight) {
      const img: HTMLBaseElement = this.$refs.bg.firstChild as HTMLBaseElement
      img.style.height = 'auto'
      img.style.width = '100%'
    }
  }
  private get title(): string {
    return this.userInfo ? '个性化推荐' : '热门推荐'
  }
  private goTo() {
    if (this.userInfo) {
      this.$router.push('/courses')
    } else {
      this.$router.push('/login?redirect=/')
    }
  }
  private getRecCourse() {
    this.spinShow = true
    const login = !!this.userInfo
    this.courseList = []
    getRecCourse(login).then((res: any) => {
      const courses = JSON.parse(res.data)
      this.spinShow = false
      courses.forEach((item: any) => {
        this.courseList.push(formatCourse(item))
      })
    }).catch(() => {
      this.spinShow = false
    })
  }
}
</script>

<style scoped lang="scss">
@import 'Home';
</style>
