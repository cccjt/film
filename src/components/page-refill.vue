<template>
  <view class="discounts-tabs">
    <uni-view class="flex justify-between" v-if="rechangeList.length > 0">
      <view class="item" v-for="(v, key) in rechangeList" :key="key" @tap="doRechange(v)"> 充{{ v.recharge }}送{{ v.gift }} </view>
    </uni-view>
  </view>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import PrimaryMixin from '@/common/mixins/PrimaryMixin'
import { WzRecharge } from '@/api/index'

@Component
export default class extends PrimaryMixin {
  private rechangeList: Array<AnyObject> = []

  @Prop({ type: Boolean, required: true, default: false })
  readonly isLogin

  mounted() {
    this.$store.dispatch('INIT_DATA').then(res => {
      this.rechangeList = res.recharge
    })
  }

  public doRechange(item) {
    if (!this.isLogin) {
      uni.showModal({
        title: '必须登录才能充值',
        content: '是否进行登录?',
        success: res => {
          if (res.confirm) {
            uni.navigateTo({ url: '/pages/login/index' })
          }
        }
      })
    } else {
      this.WzPay(item.id)
    }
  }

  public WzPay(rid) {
    const routes:any = getCurrentPages() // 获取当前打开过的页面路由数组
    const params = {
      rid,
      fullPath: routes[routes.length - 1].$route.fullPath
    }
    WzRecharge(params).then(res => {
      window.location.href = res.data as any
    })
  }
}
</script>

<style lang="scss" scoped>
.discounts-tabs {
  width: 100%;
  flex: 1;
  margin-top: 24rpx;
  margin-bottom: 24rpx;
  .item {
    border: 1px solid $default-color;
    color: $default-color;
    border-radius: 6rpx;
    text-align: center;
    line-height: 60rpx;
    width: 30%;
  }
}
</style>
