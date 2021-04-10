<template>
  <view class="wrap">
    <view class="header">
      <view class="search-keyword">
        <u-icon class="search-icon" name="search" color="#888" size="28"></u-icon>
        <input class="input" v-model="keyword" placeholder="搜索影片" trim placeholder-class="placeholder-class" confirm-type="search" @confirm="params.keyword = keyword" />
        <u-button type="primary" class="search-btn" @tap="params.keyword = keyword">搜索</u-button>
        <view class="filter cursor" @tap="filterShow = !filterShow">
          <u-icon name="more-circle" size="30"></u-icon>
          筛选
        </view>
      </view>

      <view class="classify">
        <u-tabs
          class="cursor"
          bg-color="#1d1d1f"
          active-color="#19be6b"
          inactive-color="#f1f1f1"
          bar-height="4"
          :is-scroll="false"
          :list="filterObj[0].list"
          :current="params[filterObj[0].key]"
          @change="
            index => {
              filterTabChange(index, filterObj[0].key)
            }
          "
        ></u-tabs>
      </view>

      <view class="filter-tabs" v-show="filterShow">
        <view class="item" v-for="(item, index) in filterObj" :key="index">
          <u-tabs
            v-if="index > 0"
            height="58"
            bg-color="#1d1d1f"
            inactive-color="#f1f1f1"
            active-color="#19be6b"
            :is-scroll="true"
            :show-bar="false"
            :list="item.list"
            :current="params[item.key]"
            @change="
              index => {
                filterTabChange(index, item.key)
              }
            "
          ></u-tabs>
        </view>
        <view class="filter-btns">
          <button class="btn" type="primary" size="mini" @tap="resetFilter">复位</button>
          <button class="btn close" size="mini" @tap="filterShow = false">关闭</button>
        </view>
      </view>
    </view>
    <u-mask :show="filterShow" duration="50" z-index="9" @click="filterShow = false"></u-mask>

    <view class="list" v-if="filmList.length > 0">
      <view class="item" @tap="$u.route('/pages/play', { id: item._id })" ref="filmItem" v-for="(item, index) in filmList" :key="index">
        <view class="item-rank">{{ item.douban_rating ? item.douban_rating : '0' }}</view>
        <view class="film">
          <view class="pic">
            <u-lazy-load :height="428" :image="item.pic" border-radius="20" img-mode="scaleToFill" :error-img="getImage(item)"></u-lazy-load>
          </view>

          <view class="film-info">
            <view class="name">{{ item.film_name }}</view>
            <view class="info">
              <view>{{ item.douban_initial_date ? item.douban_initial_date : item.initial_year }}</view>
              <view>{{ item.douban_country ? item.douban_country : item.area }}</view>
            </view>
            <!-- <view class="des">
              {{ item.des }}
            </view> -->
          </view>
        </view>
      </view>
    </view>
    <u-loadmore class="loadmore" margin-top="20" margin-bottom="40" :status="status" :loadText="{ loadmore: '上拉加载更多', loading: '加载中', nomore: '后面木有了' }" />
    <u-back-top :scroll-top="scrollTop" top="600" bottom="100"></u-back-top>

    <u-modal v-model="secretShow" z-index="9999" :show-title="false" @confirm="getFilters">
      <view class="slot-content u-padding-20">
        <u-input v-model="secret" clearable input-align="center" :focus="true" :border="true" trim placeholder="" />
      </view>
    </u-modal>
  </view>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import PrimaryMixin from '@/common/mixins/PrimaryMixin'
import fetch from '@/common/utils/fetch'
import store from '@/store'

@Component({
  components: {}
})
export default class extends PrimaryMixin {
  private keyword: string = '' // 搜索关键字
  private status = 'loadmore'
  private scrollTop = 0
  private total = 0

  private filmList = []
  private itemStyle = { width: 0, height: 0 }
  private params = {
    keyword: '',
    year: 0,
    area: 0,
    order: 0,
    genre: 0,
    classify: 0,
    rank: 0,
    pagesize: 0,
    page: 1
  }

  private filterTabstyle = {
    background: '#edf1ed',
    'border-radius': '2px'
  }

  private filterShow = false
  private filterObj = [{ key: 'classify', list: [] }]

  private mediaQueryOb = null

  get secret() {
    return store.getters.getSecretkey
  }

  set secret(v) {
    store.commit('setSecretkey', v)
  }

  get newParams() {
    return this.$u.deepClone(this.params)
  }

  @Watch('newParams', { immediate: false, deep: true })
  onParamsChange(newVal, oldVal) {
    // 除了page变化,其他发生变化都需要把page重置为1
    if (newVal.page === oldVal.page) {
      this.params.page = 1
      this.filmList = []
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
    }
    this.query()
  }

  // 和 UI 相关的 api 在组件 mountd 后执行
  mounted() {
    this.getFilters()
    this.testMediaQueryObserver()
  }

  destroyed() {
    this.mediaQueryOb.disconnect() // 组件销毁时停止监听
  }

  // 设置当前是否显示回到顶部
  onPageScroll(e) {
    this.scrollTop = e.scrollTop
  }

  // 滚动到底部
  onReachBottom(e) {
    console.log(e)
    if (this.status !== 'loading' && this.status !== 'nomore') {
      this.params.page += 1
    }
  }

  // 下拉刷新
  onPullDownRefresh() {
    const pageSize = this.params.pagesize
    this.params = {
      keyword: '',
      year: 0,
      area: 0,
      order: 0,
      genre: 0,
      classify: 0,
      rank: 0,
      pagesize: pageSize,
      page: 1
    }
    alert(11)
  }

  // 设置连点
  private clickTime = null
  private clickNum = 0
  private secretShow = false
  private resetFilter() {
    this.filterObj.forEach(v => {
      this.params[v.key] = 0
    })
    if (!this.clickTime) {
      this.clickTime = setTimeout(() => {
        this.clickNum = 0
        clearTimeout(this.clickTime)
        this.clickTime = null
      }, 2000)
    }
    this.clickNum += 1
    if (this.clickNum >= 5) {
      this.clickNum = 0
      this.secretShow = true
    }
  }

  // 进行筛选
  private filterTabChange(index, key) {
    this.$set(this.params, key, index)
  }

  private testMediaQueryObserver() {
    this.mediaQueryOb = uni.createMediaQueryObserver(this)
    this.mediaQueryOb.observe({ minWidth: 560 }, matches => {
      const row = parseInt((this.$u.sys().screenWidth - 10) / 182)
      this.params.pagesize = matches ? row * 6 : row * 12
    })
  }

  // 搜索列表
  private query() {
    uni.showLoading({
      mask: true,
      title: '加载中...'
    })
    this.status = 'loading'
    fetch('getFilmList', this.params).then(res => {
      this.filmList = this.filmList.concat(res.data.rows)
      this.status = res.data.rows.length > 0 ? 'loadmore' : 'nomore'
      uni.hideLoading()
    })
  }

  // 获取筛选条件
  private getFilters() {
    fetch('getClassify').then(res => {
      this.filterObj = res.data
    })
  }

  // 获取图片
  private getImage(item) {
    if (item.douban_pic && item.douban_pic.indexOf('movie_default_medium') === -1) {
      return item.douban_pic
    }
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAMAAAC3Ycb+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODdDMjhENDYyQUQ2MTFFQTlDQ0VBODgxQjFFOEEyMEMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODdDMjhENDcyQUQ2MTFFQTlDQ0VBODgxQjFFOEEyMEMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4N0MyOEQ0NDJBRDYxMUVBOUNDRUE4ODFCMUU4QTIwQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4N0MyOEQ0NTJBRDYxMUVBOUNDRUE4ODFCMUU4QTIwQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhLwhikAAAAzUExURZWVldfX162t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'
  }
}
</script>

<style lang="scss" scoped>
.filter-tabs {
  .item {
    margin-top: 8rpx;
  }
  .filter-btns {
    margin: 20rpx 0 40rpx 0;
    text-align: center;
    .btn {
      display: inline-block;
      padding: 0 40rpx;
      &:first-child {
        margin-right: 60rpx;
      }
      &.close {
        color: #101d18;
      }
    }
  }
}
.header {
  background: linear-gradient(left, #101d18, #1c2023);
  box-shadow: 0 4px 20px 2px #1c2023;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 999;
  .search-keyword {
    padding: 20rpx;
    padding-bottom: 0;
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    .input {
      color: rgb(184, 183, 183);
      border-radius: 64rpx;
      height: 64rpx;
      background: linear-gradient(left, #404f52, #333b40);
      font-size: 28rpx;
      padding-left: 60rpx;
      box-sizing: border-box;
      flex: 1;
    }
    .search-icon {
      position: absolute;
      margin-left: 16rpx;
      top: 40rpx;
    }
    .placeholder-class {
      color: #888888;
    }
  }
  .search-btn {
    height: 60rpx;
    padding: 0 28rpx;
    font-size: 26rpx;
    margin: 0;
    margin-left: 8rpx;
  }
  .filter {
    color: rgb(184, 183, 183);
    font-size: 26rpx;
    margin-left: 20rpx;
    background: #333b40;
    line-height: 64rpx;
    padding: 0 20rpx;
    border-radius: 32rpx;
    display: flex;
    .u-icon {
      margin-right: 8rpx;
    }
  }
  .classify {
    width: 100%;
  }
}
.list {
  margin-top: 170rpx;
  color: #fff;
  display: flex;
  flex-wrap: wrap;
  font-size: 26rpx;
  justify-content: space-between;
  padding-left: 20rpx;
  .item {
    position: relative;
    margin: 20rpx 20rpx 20rpx 0;
    width: 344rpx;
    border-radius: 20rpx;
    &:hover {
      cursor: pointer;
      box-shadow: 0 5px 20px 4px #37a862 !important;
      transform: scale(1.02) translateY(-2px); // scale 控制缩放大小
    }
    .item-rank {
      position: absolute;
      top: 20rpx;
      z-index: 9;
      background-color: #ff5f00 !important;
      font-size: 14px;
      left: -12rpx;
      padding: 0 20rpx;
      text-align: right;
      &::before {
        content: '';
        position: absolute;
        bottom: -12rpx;
        border-top: 12rpx solid #ff5f00;
        border-left: 12rpx solid transparent;
        left: 0;
      }
    }
    .film-info {
      padding: 8rpx;
      white-space: nowrap;
      overflow: hidden;
    }
    .name {
      margin: 10rpx 0;
    }
    .info {
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      color: #ababab;
    }
  }
}
.loadmore {
  margin-bottom: 20rpx;
}
</style>
