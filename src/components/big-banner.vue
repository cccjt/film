<template>
  <view class="big-banner" @tap="forwardUrl">
    <!-- <img :src="banner.img" v-if="showImg" lazy-load="true" @error="imgOnerror" /> -->
    <img :src="banner" alt="">
  </view>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import PrimaryMixin from '@/common/mixins/PrimaryMixin'

@Component
export default class extends PrimaryMixin {
  // 显示第几个广告图片
  @Prop({ type: Number, required: true, default: 1 })
  readonly bannerId

  private showImg: Boolean = false
  private banner = require('@/assets/image/banner.jpg')

  mounted() {
    // this.$store.dispatch('INIT_DATA').then(res => {
    //   // this.banner = res.ads[this.bannerId]
    //   // if (this.banner) this.showImg = true
    // })
  }

  forwardUrl() {
    console.log(123)
    // this.adReport('click')
    // window.location.href = this.banner.url
    window.location.href = 'https://shop18832718.m.youzan.com/v2/showcase/homepage?alias=10jr9r8du&sf=wx_menu'
  }

  adReport(tp) {
    uni.request({
      url: 'http://yi-diantong.com/product/eventReport',
      method: 'POST',
      data: {
        flow_id: '1086086105951891',
        activity_id: '1103221499692576',
        client_ip: this.banner.ip,
        ad_id: this.banner.ad_id,
        event: tp
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.big-banner {
  min-height: 20rpx;
  width: 100%;
  img {
    width: 100%;
    max-height: 400rpx;
  }
}
</style>
