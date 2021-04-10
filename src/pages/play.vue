<template>
  <view class="wrap">
    <match-media :min-height="500" orientation="landscape">
      <view class="title">
        <view class="btn">
          <u-button size="mini" @tap="$u.route('/pages/index')">返回</u-button>
        </view>
        <view class="label" id="xxxa">视频宽度</view>
        <view class="slider">
          <slider value="1200" block-size="24" @change="sliderWidthChange" @changing="sliderWidthChange" min="1200" :max="widthMax" show-value />
        </view>
      </view>
    </match-media>

    <view class="play-container" :style="{ position: playStyle.position }">
      <view class="player" :style="playStyle">
        <view id="xgplayer" ref="xgplayer" :style="{ width: playStyle.width }" class="xgplayer"> </view>
        <!-- <view class="move" @click="moveClick">
          <i class="el-icon-arrow-right"></i>
        </view> -->
      </view>
    </view>

    <view class="content" :style="{ 'margin-top': playStyle.position === 'fixed' ? playStyle.height : 0, width: playStyle.width }">
      <view class="video-name">
        <text class="u-margin-right-30">{{ videoInfo.film_name }} {{ videoInfo.note }}</text>
        <u-button v-if="isrecommend" type="success" size="mini" @tap="doRecommend">推荐</u-button>
      </view>

      <view class="source">
        <view v-if="sourceList.length > 0">
          <u-tabs bg-color="#1d1d1f" active-color="#19be6b" inactive-color="#f1f1f1" :list="sourceList" :current="sourceCurrent" @change="sourceChange" :is-scroll="true"></u-tabs>
        </view>
        <view v-if="sourceList.length > 0" class="swiper-item">
          <view
            hover-stop-propagation
            :hover-start-time="2000"
            :hover-stay-time="2000"
            class="item"
            :class="{ active: itemCurrent === index && playingSource === item.source }"
            v-for="(item, index) in resolveAddress"
            @tap="play(item, index)"
            :key="index"
          >
            {{ item.name }}
          </view>
        </view>
      </view>

      <view style="clear: both"> </view>

      <view class="info">
        <view class="introduction">
          <view class="item"
            ><view class="label">类型:</view>
            <view class="">
              {{ videoInfo.douban_genre && videoInfo.douban_state !== 1 ? videoInfo.douban_genre.join(' / ') : videoInfo.type }}
            </view>
          </view>
          <view class="item"
            ><view class="label">国家/地区:</view>
            <view class="content">
              {{ videoInfo.douban_state !== 1 ? videoInfo.douban_country : videoInfo.area }}
            </view>
          </view>
          <view class="item"
            ><view class="label">上映日期:</view>
            <view class="content">
              {{ videoInfo.douban_state !== 1 ? videoInfo.douban_initial_date : videoInfo.year }}
            </view>
          </view>
          <view class="item" v-if="videoInfo.douban_state !== 1"
            ><view class="label">导演:</view>
            <view class="content">
              {{ videoInfo.director }}
            </view>
          </view>
          <view class="item" v-if="videoInfo.douban_state !== 1">
            <view class="label">主演:</view>
            <view class="content">
              {{ videoInfo.actor ? videoInfo.actor.join(' / ') : '' }}
            </view>
          </view>
          <view class="item" v-if="videoInfo.douban_state !== 1"
            ><view class="label">豆瓣评分: </view>
            <view class="content">
              <view>{{ videoInfo.douban_rating }}</view>
              <u-rate class="u-margin-left-10" :current="3.7" :disabled="true" active-color="#FFAC2D"></u-rate>
              <view class="doubanicon" @tap="openURL(videoInfo.douban_url)"></view>
              <button v-if="videoInfo.isAdmin" type="warn" size="mini" class="report" @tap="reportErr(videoInfo)">报错</button>
            </view>
          </view>
        </view>
        <view class="story"> {{ videoInfo.film_name }} 的故事简介 </view>
        <view class="desc">
          {{ filterAttr(videoInfo) }}
        </view>
      </view>

      <view class="recommend-films">
        <view class="item" @tap="$u.route('/pages/play', { id: item._id })" ref="filmItem" v-for="(item, index) in videoInfo.recommend" :key="index">
          <view class="item-rank">{{ item.douban_rating ? item.douban_rating : '0' }}</view>
          <view class="film">
            <view class="pic">
              <u-lazy-load :height="428" :image="getImage(item)" border-radius="20" img-mode="scaleToFill"></u-lazy-load>
            </view>

            <view class="film-info">
              <view class="name">
                <text>{{ item.film_name }}</text>
                <text>{{ item.note }}</text>
              </view>
              <view class="recommend-info">
                <view>{{ item.douban_initial_date ? item.douban_initial_date : item.initial_year }}</view>
                <view>{{ item.douban_country ? item.douban_country : item.area }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view style="clear: both"> </view>
    </view>
  </view>
</template>

<script lang="ts">
import 'xgplayer'
import HlsJsPlayer from 'xgplayer-hls.js'
import { Component } from 'vue-property-decorator'
import PrimaryMixin from '@/common/mixins/PrimaryMixin'
import fetch from '@/common/utils/fetch'
import store from '@/store'

@Component({
  components: {}
})
export default class extends PrimaryMixin {
  videoInfo: any = {
    recommend: []
  }

  playId = null
  // 播放源
  sourceList: any = []
  sourceCurrent = 0 // 源
  itemCurrent = 0 // 集
  playingSource = 0 // 当前播放
  playStyle = { width: this.$u.sys().screenWidth + 'px', height: '300px' }
  xgPlayer = null
  xgConfig = {
    id: 'xgplayer',
    url: null,
    lang: 'zh-cn',
    width: '100%',
    height: '100%',
    autoplay: true,
    screenShot: false,
    keyShortcut: 'on',
    crossOrigin: true,
    defaultPlaybackRate: 1,
    playbackRate: [0.5, 1, 1.25, 1.5, 2, 3, 4, 5],
    airplay: false,
    lastPlayTime: 0,
    cssFullscreen: true,
    playNext: {
      urlList: []
    }
  }

  recommend = uni.getStorageSync('recommend') || []

  history = {}
  playTime = null

  widthMax = this.$u.sys().screenWidth
  sliderValue = 0

  get secret() {
    return store.getters.getSecretkey
  }

  get isrecommend() {
    return !this.recommend.includes(this.videoInfo._id)
  }

  set isrecommend(id) {
    this.recommend.push(id)
    uni.setStorageSync('recommend', this.recommend)
  }

  // 获取缓存
  get historyPlay() {
    this.history = uni.getStorageSync('history') || {}
    let res = { last: 0, time: 0 }
    if (this.history && this.history[this.playId] && this.history[this.playId].play) {
      res = this.history[this.playId].play
    }
    return res
  }

  onLoad(option) {
    this.playId = option.id
    this.query(option.id)
    this.fixPlayStyle()
  }

  mounted() {
    this.testMediaQueryObserver()
  }

  onHide() {
    if (this.$u.sys().screenWidth < 500) {
      this.xgPlayer.pause()
    }
  }

  destroyed() {
    this.doDestroyed()
  }

  // 推荐
  private doRecommend() {
    this.isrecommend = this.videoInfo._id
    fetch('upRecommend', { id: this.videoInfo._id })
  }

  // 宽度超过560开始计算行数
  private testMediaQueryObserver() {
    this.mediaQueryOb = uni.createMediaQueryObserver(this)
    this.mediaQueryOb.observe({ minWidth: 560 }, matches => {
      this.fixPlayStyle()
    })
  }

  private fixPlayStyle() {
    let width = this.$u.sys().screenWidth
    let position = 'fixed'
    if (width > 1200) {
      width = 1200
      position = 'relative'
    }
    const height = (width * 9) / 16
    this.playStyle = { width: width + 'px', height: height + 'px', position }
  }

  private doDestroyed() {
    if (this.playTime) {
      if (this.history && this.history[this.playId]) {
        this.history[this.playId].play = { last: this.itemCurrent, time: this.playTime }
      } else {
        this.history[this.playId] = { play: { last: this.itemCurrent, time: this.playTime }, name: this.videoInfo.film_name }
      }
      uni.setStorageSync('history', this.history)
    }
    this.xgPlayer.src = ''
    this.xgPlayer.destroy()
    uni.setStorageSync('history', this.history)
    uni.setStorageSync('style', this.playStyle)
  }

  // tabs通知swiper切换
  private sourceChange(index) {
    this.sourceCurrent = index
  }

  private query(id) {
    uni.showLoading({
      mask: true,
      title: '加载中...'
    })
    fetch('getFilmInfo', { id }).then(res => {
      this.videoInfo = res.data
      this.sourceList = this.videoInfo.video.map(v => {
        return { name: v.key }
      })
      // 初始化播放器
      this.initXgPlayer()
      uni.hideLoading()
    })
  }

  private initXgPlayer() {
    if (this.historyPlay.time > 0) {
      this.itemCurrent = this.historyPlay.last
      this.xgConfig.lastPlayTime = this.historyPlay.time
    } else {
      this.itemCurrent = 0
    }
    this.getPlaylist()
    this.xgConfig.url = this.resolveAddress[this.itemCurrent].url
    this.xgPlayer = new HlsJsPlayer(this.xgConfig)
    this.xgPlayer.on('playerNext', () => {
      this.itemCurrent += 1
    })
    this.xgPlayer.on('urlListEnd', () => {
      this.itemCurrent = 0
    })
    this.xgPlayer.on('timeupdate', e => {
      this.playTime = e.currentTime
    })
  }

  private play(item, index) {
    if (this.itemCurrent === index && this.playingSource === item.source) {
      return false
    }
    if (!item.url.includes('http')) {
      this.$u.toast('播放地址错误')
      return false
    }
    const url = this.resolveAddress[this.itemCurrent].url
    const dom = document.getElementById('xgplayer')
    document.getElementById('play-iframe') && document.getElementById('play-iframe').remove()
    this.itemCurrent = index
    this.playingSource = item.source
    // m3u8地址
    if (url.indexOf('.m3u8') > -1) {
      if (this.xgPlayer !== null) {
        this.xgPlayer.src = url
      } else {
        this.xgConfig.url = url
        this.initXgPlayer()
      }
    } else {
      if (this.xgPlayer) {
        this.xgPlayer.destroy()
        this.xgPlayer = null
        setTimeout(function () {
          const iframe = document.createElement('iframe')
          iframe.src = url
          iframe.id = 'play-iframe'
          iframe.width = '100%'
          iframe.height = '100%'
          dom.appendChild(iframe)
        }, 1000)
      } else {
        this.xgPlayer = null
        const iframe = document.createElement('iframe')
        iframe.src = url
        iframe.id = 'play-iframe'
        iframe.width = '100%'
        iframe.height = '100%'
        dom.appendChild(iframe)
      }
    }
  }

  // 返回播放列表(集)
  private getPlaylist() {
    this.xgConfig.playNext.urlList = this.resolveAddress.slice(this.itemCurrent).map(v => v.url)
  }

  // 初始化播放地址
  get resolveAddress() {
    console.log(this.videoInfo.video[this.sourceCurrent])
    const list = this.videoInfo.video[this.sourceCurrent].plist
    return list.map((v, i) => {
      if (v.includes('$$$')) {
        v = v.split('$$$')[0]
      }
      const film = v.split('$')
      const name = film.length === 2 ? v.split('$')[0].replace(/第|集/g, '') : i
      return {
        source: this.sourceCurrent,
        name,
        url: film.length === 2 ? film[1] : film[0]
      }
    })
  }

  // 获取图片
  private getImage(item) {
    if (item.douban_pic && item.douban_pic.indexOf('movie_default_medium') === -1) {
      return item.douban_pic
    }
    return item.pic
  }

  // 调整宽度
  private sliderWidthChange(e) {
    console.log(111)
    const width = e.detail.value
    this.playStyle.width = width + 'px'
    this.playStyle.height = (width * 9) / 16 + 'px'
  }

  // 过滤hmtl标签
  private filterAttr(info) {
    const des = info.douban_state !== 1 && info.douban_des ? info.douban_des : info.des
    return des ? des.replace(/<\/?.+?>/g, '') : ''
  }

  private openURL(url) {
    // #ifdef APP-PLUS
    plus.runtime.openURL(url) // 这里默认使用外部浏览器打开而不是内部web-view组件打开
    // #endif
    // #ifdef H5
    window.open(url)
    // #endif
  }

  // 报错
  private reportErr(info) {
    fetch('reportErr', { id: info._id })
    this.videoInfo.douban_state = 1
  }
}
</script>

<style lang="scss" scoped>
.title {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  .u-btn {
    padding: 30rpx;
    color: rgb(59, 59, 59);
  }
  .label {
    margin: 0 60rpx;
  }
  .slider {
    flex: 1;
  }
}
.play-container {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 999;
  .player {
    margin: 0 auto;
  }
}

.content {
  margin: 0 auto;
}

.video-name {
  font-size: 36rpx;
  line-height: 100rpx;
  padding-top: 20rpx;
}

.info {
  line-height: 1.8;
  font-size: 26rpx;
  padding: 0 20rpx;
  margin-top: 40rpx;
  margin-bottom: 40rpx;
  .introduction {
    .item {
      display: flex;
      .label {
        width: 140rpx;
        color: #adadad;
      }
      .content {
        display: flex;
        align-content: center;
        flex: 1;
        .doubanicon {
          height: 40rpx;
          width: 40rpx;
          cursor: pointer;
          margin: 2px 10rpx 0 10rpx;
          background: url('@/assets/image/dou.gif');
          background-size: 100%;
        }
        .report {
          margin: unset;
          margin-left: 8px;
          padding: 10rpx 20rpx;
          line-height: 1;
          border-radius: 0;
        }
      }
    }
  }
  .story {
    font-size: 32rpx;
    margin: 10rpx 0;
    color: #07ca4d;
  }
  .desc {
    text-indent: 2em;
  }
}

.source {
  margin: 0 auto;
  .swiper-item {
    grid-template-columns: repeat(auto-fill, 140rpx);
    .item {
      float: left;
      margin-top: 20rpx;
      width: 160rpx;
      padding: 10rpx;
      white-space: nowrap;
      overflow: hidden;
      background: #eaeaea;
      margin-left: 22rpx;
      text-align: center;
      color: #525252;
      border-radius: 6rpx;
      &:hover {
        cursor: pointer;
        box-shadow: 0 2px 20px 1px #37a862 !important;
        transform: scale(1.01) translateY(-1px);
      }
      &.active {
        background: #19be6b;
        box-shadow: 0 2px 20px 1px #37a862 !important;
        transform: scale(1.01) translateY(-1px);
      }
    }
  }
}

.recommend-films {
  color: #fff;
  font-size: 26rpx;
  padding-left: 20rpx;
  .item {
    float: left;
    position: relative;
    margin: 20rpx 20rpx 20rpx 0;
    width: 360rpx;
    margin-right: 36rpx;
    border-radius: 20rpx;
    margin-bottom: 20px;
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
      display: flex;
      justify-content: space-between;
    }
    .recommend-info {
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      color: #ababab;
    }
  }
}
</style>
