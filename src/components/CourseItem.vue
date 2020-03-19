<template lang="pug">
  Row.course-item
    .course-item__img(@click="goTo")
      img(:src="course.imgUrl" width="100%" height="100%")
    .course-item__text.no-wrap
      p.top.no-wrap {{ course.title }}
      p.bottom.no-wrap
        span(v-if="!collected") 学习时间
        span(v-else) 收藏时间
        span {{ course.date.split(' ')[0] }}
    .course-item__option
      Poptip.top(width="70" trigger="hover" @click.stop)
        span(style="cursor: pointer") 更多
        p(slot="content" style="text-align: center; cursor: pointer" @click="removeItem") 删除
      Button.bottom(type="success" shape="circle" @click.stop="enterCourse") 继续实验
    Spin(size="large" fix v-if="spinShow")
    Modal(v-model="modal" :closable="false" :mask-closable="false" class-name="vertical-center-modal" width="350px" footer-hide)
      p(style="text-align: center; margin-top: 20px") 项目环境已经启动
      div(style="text-align: center; margin: 30px 0 20px 0")
        Button(type="primary" style="margin-right: 20px" @click="enterLab") 进入
        Button(@click="modal = false") 取消
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Course } from '@/utils/formatData'
import { addUserCourse } from '@/api/user'
import { checkContainer, startContainer } from '@/api/courses'
import { Getter } from 'vuex-class'

@Component
export default class CourseItem extends Vue {
  @Prop() private course!: Course
  @Prop() private collected: boolean | undefined
  @Getter userInfo: any
  private spinShow: boolean = false
  private modal: boolean = false
  private courseUrl: string = ''

  private removeItem() {
    this.$Modal.confirm({
      title: '确定移除本实验？',
      onOk: () => {
        this.$emit('remove')
      }
    })
  }
  private goTo() {
    this.$router.push(`/course/${this.course.id}`)
  }
  private async enterCourse() {
    try {
      if (this.collected) {
        await addUserCourse(this.course.id)
      }
      this.spinShow = true
      const res: any = await startContainer({ courseId: this.course.id, userId: this.userInfo.id })
      if (res.code >= 200 && res.code < 300) {
        const res: any = await checkContainer({ courseId: this.course.id, userId: this.userInfo.id })
        if (res.code !== 200) {
          let timer = setInterval(async() => {
            const res: any = await checkContainer({ courseId: this.course.id, userId: this.userInfo.id })
            if (res.code === 200) {
              clearInterval(timer)
              this.courseUrl = res.data.jumpUrl
              this.spinShow = false
              this.modal = true
            }
          }, 5000)
        } else {
          this.spinShow = false
          this.courseUrl = res.data.jumpUrl
          this.modal = true
        }
      }
    } catch (e) {
      this.spinShow = false
    }
  }
  private enterLab() {
    this.modal = false
    open(this.courseUrl)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "src/assets/styles/util.scss";
  .course-item {
    width: calc(100% - 45px);
    margin: 0 30px 0 15px;
    border-bottom: 1px solid #e8eaec;
    display: flex;
    height: 173px;
    padding: 15px 0;
    &__img {
      cursor: pointer;
      width: 243px;
      height: 143px;
      position: relative;
      img {
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    &__text, &__option{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20px;
      .top {
        margin-top: 10px;
      }
      .bottom {
        margin-bottom: 10px;
      }
    }
    &__text {
      flex: 1;
      .top {
        font-size: $font-size-medium;
      }
      .bottom {
        font-size: $font-size-small-x;
        span:last-child {
          padding-left: 5px;
          color: $color-pl
        }
      }
    }
    &__option {
      text-align: right;
      .bottom {
        width: 130px;
      }
    }
  }
</style>
