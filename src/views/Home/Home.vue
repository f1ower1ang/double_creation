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
            Col(:xs="24" :sm="24" :md="12" v-for="(course, index) in courseList" :key="index")
              course(:course="course")
</template>

<script lang="ts">
import course from '@/base/courseItem.vue'
import example from '@/base/exampleItem.vue'
import introduction from '@/components/Home/introduction.vue'
import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Course, formatCourse, User } from '@/utils/formatData'
import { getRecCourse } from '@/api/courses'

interface IntroductionCard {
  title: string
  imgUrl: string
  statement: string
}
interface Example {
  imgUrl: string
  title: string
  date: string
  user: string
  id: string
}

@Component({
  components: { introduction, course, example }
})
export default class Home extends Vue {
  private courseList: Array<Course> = []
  public $refs!: {
    bg: HTMLBaseElement
  }

  @Getter userInfo: User | undefined

  private created() {
    getRecCourse().then((res: any) => {
      res.data.forEach((item: any) => {
        this.courseList.push(formatCourse(item))
      })
    })
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
}
</script>

<style scoped lang="scss">
@import 'Home';
</style>
