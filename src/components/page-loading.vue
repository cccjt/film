<!--
 * @Description:
 * @Author: CCC
 * @Date: 2020-06-18 08:10:25
 * @LastEditors: CCC
 * @LastEditTime: 2020-06-21 01:42:52
 * @FilePath: \mosi_nuiapp_dev\src\components\page-loading.vue
-->
<!--
 * @Description: 页面级别的loading
 -->
<template>
  <view class="cu-load load-modal" v-if="loadModal">
    <i class="iconfont loading-icon">&#xe699;</i>
    <view class="gray-text">{{loadingTex}}</view>
  </view>
</template>
<script>
export default {
  name: 'page-loading',
  props: {
    loadModal: { // 是否显示该loading框
      type: Boolean,
      default: false
    },
    loadingTex: { // loading框的文本
      type: String,
      default: '加载中...'
    }
  }
};
</script>
<style lang="scss" scoped>
.cu-load.load-modal {
  .loading-icon {
    color: #fff;
    font-size: 50rpx;
  }
}
</style>
