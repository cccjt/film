<template name="page-foot">
  <view class="page-share-title">
    <view class="item" :class="{ active: active === index }" v-for="(item, index) in tabbarList" :key="index" @tap="tabbarNav(index)">
      <view class="iconfont" :class="item.iconClass"></view>
      <text>{{ item.text }}</text>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import PrimaryMixin from '@/common/mixins/PrimaryMixin'
import { WxJspInit } from '@/api'
const jweixin = require('jweixin-module')

@Component
export default class extends PrimaryMixin {
  tabbarList = [
    { iconClass: 'icon-faxian-copy', text: '首页', url: '/pages/index/index' },
    { iconClass: 'icon-vip', text: '会员卡', url: '/pages/vip/index' },
    { iconClass: 'icon-saoyisao1', text: '扫一扫', url: '' },
    { iconClass: 'icon-wode', text: '个人中心', url: '/pages/mine/index' }
  ]

  @Prop({ type: Number, default: -1 })
  readonly active

  private tabbarNav(index) {
    const item = this.tabbarList[index]
    if (item.url === '') {
      this.wxScanQr()
    }
    const routes = getCurrentPages()
    const curRoute = routes[routes.length - 1].route
    if (item.url && item.url !== curRoute) {
      uni.navigateTo({ url: item.url })
    }
  }

  // 微信扫码
  private async wxScanQr() {
    const url = window.location.href
    const wxRes: any = await WxJspInit({ url })
    wxRes.jsApiList = ['scanQRCode']
    wxRes.debug = false
    jweixin.config(wxRes)

    jweixin.ready(() => {
      jweixin.scanQRCode({
        needResult: 1,
        scanType: ['qrCode'],
        success: res => {
          const code = res.resultStr.split('?number=')[1]
          const token = this.$store.getters.GET_TOKEN
          uni.redirectTo({
            url: `/pages/index/index?token=${token}&code=${code}`
          })
        }
      })
    })
  }
}
</script>
<style scoped lang="scss">
.page-share-title {
  background: #fff;
  z-index: 99;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 99;
  display: flex;
  justify-content: space-around;
  line-height: 1;
  font-size: 24rpx;
  height: 100rpx;
  border-top: 1px solid #ececec;
  align-items: center;
  .item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    &.active {
      color: $default-color;
    }
    .iconfont {
      font-size: 50rpx !important;
    }
    text {
      margin-top: 8rpx;
    }
  }
}

.active {
  color: #ffc554;
}

.sao {
  border-radius: 50%;
  /*   padding: 18upx; */
  background: #fff;
  z-index: 999;
  // width: 100upx;
  // height: 80upx;
  /*    margin-top: -20upx; */
}

.sao .icon-footer {
  font-size: 80upx;
  color: #f3924a;
}
</style>
