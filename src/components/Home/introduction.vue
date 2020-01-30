<template lang="pug">
  .introduction__card
    .introduction__card__img
      img(:src="card.imgUrl")
      span {{ card.title }}
    .introduction__card__content
      h2.title {{ card.title }}
      p.statement {{ card.statement }}
</template>

<script lang="ts">
interface IntroductionCard {
  title: string
  imgUrl: string
  statement: string
}
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({})
export default class Introduction extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  card!: IntroductionCard
}
</script>

<style scoped lang="scss">
.introduction__card {
  padding: 10px 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
  align-items: center;
  .introduction__card__img {
    width: 16.666%;
    img {
      width: 100%;
      height: auto;
    }
  }
  .introduction__card__content {
    flex: 1;
    padding: 0 10px;
    .title {
      padding: 4px 0 10px 0;
      font-size: 1.5rem;
    }
    .statement {
      line-height: 20px;
    }
  }
  @media screen and (min-width: 610px) {
    .introduction__card__img {
      span {
        display: none;
      }
    }
  }
  @media screen and (max-width: 610px) {
    display: block;
    .introduction__card__img {
      width: 100%;
      img {
        width: 30%;
        vertical-align: baseline;
      }
      span {
        display: inline;
        font-size: 1.5rem;
        padding: 0 5px;
      }
    }
    .introduction__card__content {
      .title {
        display: none;
      }
      .statement {
        margin-top: 5px;
      }
    }
  }
}
</style>
