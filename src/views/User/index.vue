<template lang="pug">
  div.user-page
    div.user-page__header(v-if="userInfo")
      div.user-page__header__avatar
        img(:src="userInfo.avatar" width="100%" height="100%")
      div.user-page__header__right
        h2.title {{ userInfo.name }}
          app-icon(name="edit" @click="editProfile")
        p.time {{ userInfo.joinTime }}
          span  加入AILab
    .user-page__content
      .left
        Card(dis-hover :bordered="false")
          p(slot="title" style="font-weight: bold; color: #666;") 最近来访
          p(style="padding: 15px 10px") 暂无访问记录
      .right
        Tabs.course-list(value="allCourse"  :animated="false")
          TabPane(label="全部课程" name="allCourse")
            Scroll(:on-reach-bottom="handleReachBottom" :height="height")
              Spin(size="large" fix v-if="spinShow")
              .PC
                course-item(v-for="(course, index) in learningList" :key="index" :course="course" @remove="removeRecord(course, index)" :collected="false")
              .mobile
                course-card(v-for="(course, index) in learningList" :key="index" :course="course")
              .no-result(v-if="!spinShow && learningList.length === 0")
                p 还没有相关实验记录~
                router-link(to="/courses") 瞅瞅其他实验
          TabPane(label="收藏课程" name="collectCourse")
            .PC(:style="{height: height + 'px', overflow: 'auto', paddingTop: '20px'}" v-if="favoriteList.length > 0")
              course-item(v-for="(course, index) in favoriteList" :key="index" :course="course" @remove="removeFavor(course)" :collected="true")
            .mobile(:style="{height: height + 'px', overflow: 'auto', paddingTop: '20px'}" v-if="favoriteList.length > 0")
              course-card(v-for="(course, index) in learningList" :key="index" :course="course")
            .no-result(v-if="favoriteList.length === 0" style="padding: 20px 0 270px 0")
              p 还没有相关实验记录~
              router-link(to="/allCourse") 瞅瞅其他实验
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { deleteFavorite, deleteRecord, getUserCourse } from '@/api/user'
import AppIcon from '@/base/appIcon.vue'
import CourseItem from '@/components/CourseItem.vue'
import CourseCard from '@/base/courseItem.vue'
import { Course, formatCourse } from '@/utils/formatData'

const Status = {
  added: 0,
  studying: 1,
  ended: 2
}

@Component({
  components: { AppIcon, CourseItem, CourseCard }
})

export default class User extends Vue{
  @Getter userInfo: any
  @Getter favoriteList: any

  private page: number = 1
  private limit: number = 4
  private learningList: any = []
  private height: number = 500
  private flag: boolean = true
  private spinShow: boolean = true

  private async created() {
    let resultList:any = []
    const { flag, list } = await this.handleCourse()
    this.flag = flag
    this.page++
    resultList.unshift(...list)
    while (resultList.length < this.limit && this.flag) {
      const { flag, list } = await this.handleCourse()
      this.flag = flag
      resultList.unshift(...list)
      this.page++
    }
    this.learningList = this.uniqueList(resultList)
    this.spinShow = false
  }
  private mounted() {
    this.height = document.body.clientHeight - 130 - 50 - 170 - 37
  }

  private async handleCourse() {
    let list: any = []
    const res: any = await getUserCourse({ pages: this.page, size: this.limit })
    if (res.data === '用户没有学习记录') {
      return {
        flag: false,
        list
      }
    }
    const { courses, pages } = res.data
    if (courses.length !== 0) {
      let records = pages.records.filter((item: any) => item.deleted !== 1)
      records.forEach((record: any) => {
        const index = courses.findIndex((course: any) => course.id === record.courseid)
        if (index > -1) {
          let obj = formatCourse(courses[index])
          obj.date = record.replacetime
          obj.recordId = record.id
          list.unshift(obj)
        }
      })
    }
    return {
      flag: true,
      list
    }
  }
  private editProfile() {
    this.$router.push('/user/profile')
  }
  private removeFavor(course: Course) {
    deleteFavorite(course.id).then(() => {
      this.$store.dispatch('course/deleteFavorite', course)
    })
  }
  private removeRecord(course: Course, index: number) {
    deleteRecord(course.recordId).then((res) => {
      console.log(res)
      this.learningList.splice(index, 1)
    })
  }
  private handleReachBottom() {
    return new Promise(async(resolve) => {
      if (this.flag) {
        const { flag, list } = await this.handleCourse()
        this.flag = flag
        const curList = this.learningList.slice()
        curList.unshift(...list)
        this.learningList = this.uniqueList(curList)
        this.page++
      }
      resolve()
    })
  }
  private uniqueList(list: any) {
    let ret: any = []
    for (let i = 0; i < list.length; i++) {
      if (list.findIndex((item: any) => item.id === list[i].id) === i) {
        ret.push(list[i])
      }
    }
    return ret
  }
}
</script>

<style scoped lang="scss">
@import "index";
</style>
