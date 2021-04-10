<script lang="ts">
import { Vue } from 'vue-property-decorator'

// nui-app 必须这样写
export default Vue.extend({
  mpType: 'app',
  onLaunch() {
    /**
     * 传递参数给自定义顶部导航条
     */
    uni.getSystemInfo({
      success: e => {
        /**
         * @param statusBarHeight 状态栏的高度，单位：px
         * @param titleBarHeight 标题栏高度，单位：px
         */
        const { statusBarHeight = 20, titleBarHeight = 0 } = e

        // 小程序
        // #ifndef MP
        this.$statusBarHeight = statusBarHeight
        if (e.platform === 'android') {
          this.$customBarHeight = statusBarHeight + 50
        } else {
          this.$customBarHeight = statusBarHeight + 45
        }
        // #endif

        // 微信小程序
        // #ifdef MP-WEIXIN
        this.$statusBarHeight = statusBarHeight
        /**
         * @param bottom 小程序右上角胶囊按钮下边界坐标，单位：px
         * @param top 小程序右上角胶囊按钮上边界坐标，单位：px
         */
        const { bottom = 58, top = 26 } = uni.getMenuButtonBoundingClientRect()
        this.$customBarHeight = bottom + top - statusBarHeight
        // #endif

        // 阿里小程序
        // #ifdef MP-ALIPAY
        this.$statusBarHeight = statusBarHeight
        this.$customBarHeight = statusBarHeight + titleBarHeight
        // #endif
      }
    })
  }
})
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import 'uview-ui/index.scss';
</style>
