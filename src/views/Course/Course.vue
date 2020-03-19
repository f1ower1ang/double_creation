<template lang="pug">
  .course-page
    .course-page__left
      .common-content
        h2.course-title {{ course.title }}
        p.info-meta
          span {{ course.counts }} 人加入过
          span {{ collected }} 人关注
          span 作者：{{ creator }}
        p.info-desc(v-html="course.detail")
      section.common-content
        h2.section-title 实验内容
    .course-page__right
        .bg(:style="{backgroundImage: `url(${course.imgUrl})`}")
        .wrapper
          Button(type="primary" @click="addCourse" size="large" long) 开始上机
          Button(type="text" size="small" long @click="addRate") 喜欢本实验？给个评分吧
        p.btn(v-if="!favor" @click="toggleFav")
          Icon(type="ios-star-outline")
          span 收藏
        p.btn(v-if="favor" @click="toggleFav")
          Icon(type="ios-star")
          span 已收藏
    transition(name="fade")
      .run-loading(v-show="loading")
        .message
          Icon(type="ios-loading")
          p 启动实验环境需要一些时间, 请耐心等待...
    Modal(v-model="modal" :closable="false" :mask-closable="false" class-name="vertical-center-modal" width="350px" footer-hide)
      p(style="text-align: center; margin-top: 20px") 项目环境已经启动
      div(style="text-align: center; margin: 30px 0 20px 0")
        Button(type="primary" style="margin-right: 20px" @click="enterLab") 进入
        Button(@click="modal = false") 取消
    Modal(v-model="rateModal" :closable="false" width="250px" footer-hide style="text-align: center")
      Rate(v-model="rate" show-text allow-half style="margin-top: 20px")
        span(style="color: #f5a623") {{ rate }}
      div(style="text-align: center; margin: 30px 0 20px 0")
        Button(type="primary" style="margin-right: 20px" @click="submitRate") 提交
        Button(@click="rateModal = false") 取消
    p#md-text(style="display: none")
</template>

<script lang="ts">
import { Course, formatCourse } from '@/utils/formatData'
import { getCourseDetail, startContainer, checkContainer, commitRate } from '@/api/courses'
import { Getter } from 'vuex-class'
import { Vue, Component } from 'vue-property-decorator'
import AppIcon from '@/base/appIcon.vue'
import MdToHtml from '@/utils/markdownToHtml'
import 'tui-editor/dist/tui-editor-contents.css' // editor content
import 'codemirror/lib/codemirror.css'
import { addFavorite, addUserCourse, deleteFavorite } from '@/api/user' // codemirror

@Component({
  components: { AppIcon }
})
export default class CourseDetail extends Vue {
  private course: any = { title: '', id: '', time: '', date: '', detail: '' }
  private mdToHtml: MdToHtml | null = null
  private loading: Boolean = false
  private courseUrl: string = ''
  private modal: Boolean = false
  private rateModal: Boolean = false
  private rate: number = 0
  private creator: String = ''
  private collected: number = 0

  get favor(): Boolean {
    const index = this.favoriteList.findIndex((item: Course) => parseInt(item.id) === parseInt(this.$route.params.id))
    return index > -1
  }

  @Getter token: string | undefined
  @Getter userInfo: any
  @Getter favoriteList: any

  private mounted() {
    this.mdToHtml = new MdToHtml('#md-text')
    if (this.course.detail) {
      this.mdToHtml.setValue(this.course.detail)
      this.course.detail = this.mdToHtml.getHtml()
    }
  }

  private created() {
    getCourseDetail(this.$route.params.id).then((res: any) => {
      this.course = formatCourse(res.data.course)
      this.creator = res.data.createrName
      this.collected = res.data.userCollectionNumber
      if (this.mdToHtml) {
        this.mdToHtml.setValue(this.course.detail)
        this.course.detail = this.mdToHtml.getHtml()
      }
    })
  }

  private async addCourse() {
    if (this.token) {
      await addUserCourse(this.course.id)
      this.loading = true
      const res: any = await startContainer({ courseId: this.course.id, userId: this.userInfo.id })
      if (res.code >= 200 && res.code < 300) {
        const res: any = await checkContainer({ courseId: this.course.id, userId: this.userInfo.id })
        if (res.code !== 200) {
          let timer = setInterval(async() => {
            const res: any = await checkContainer({ courseId: this.course.id, userId: this.userInfo.id })
            if (res.code === 200) {
              clearInterval(timer)
              this.courseUrl = res.data.jumpUrl
              this.loading = false
              this.modal = true
            }
          }, 5000)
        } else {
          this.loading = false
          this.courseUrl = res.data.jumpUrl
          this.modal = true
        }
      } else {
        this.loading = false
        this.$Message.warning('启动失败，尝试刷新页面')
      }
    } else {
      this.$Message.warning('请先登录')
      this.$router.push(`/login?redirect=${this.$route.path}`)
    }
  }
  private enterLab() {
    this.modal = false
    open(this.courseUrl)
  }
  private toggleFav() {
    if (this.token) {
      if (this.favor) {
        deleteFavorite(this.course.id).then(res => {
          this.$Message.success('取消收藏成功')
          this.$store.dispatch('course/deleteFavorite', this.course)
        })
      } else {
        addFavorite(this.course.id).then(res => {
          this.$Message.success('收藏成功')
          this.$store.dispatch('course/addFavorite', this.course)
        })
      }
    } else {
      this.$Message.warning('请先登录')
      this.$router.push(`/login?redirect=${this.$route.path}`)
    }
  }
  private addRate() {
    if (this.token) {
      this.rateModal = true
    } else {
      this.$Message.warning('请先登录')
      this.$router.push(`/login?redirect=${this.$route.path}`)
    }
  }
  private submitRate() {
    commitRate({
      courseid: this.course.id,
      rate: this.rate
    }).then((res: any) => {
      if (res.errCode === 200) {
        this.$Message.success('评分成功')
      } else {
        this.$Message.warning(res.errMsg)
      }
    })
    this.rateModal = false
  }
}
</script>

<style scoped lang="scss">
@import 'Course';
</style>
