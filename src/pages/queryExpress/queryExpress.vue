<template>
  <view class="page">
    <view class="search-wrap">
      <view class="search-bar">
        <text class="search-icon">🔍</text>
        <input
          v-model="trackingNo"
          class="search-input"
          type="text"
          placeholder="请输入运单号"
          placeholder-class="ph"
          confirm-type="search"
          @confirm="onQuery"
        />
        <view class="search-btn" @click="onQuery">查件</view>
      </view>
    </view>

    <view v-if="lastList.length" class="card">
      <view class="section-head">
        <text class="section-title">最近查询</text>
        <text class="link" @click="clearRecent">清空</text>
      </view>
      <view
        v-for="(item, idx) in lastList"
        :key="idx"
        class="recent-row"
        @click="applyNo(item)"
      >
        <text class="no">{{ item }}</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <view class="card track-card">
      <view class="section-title">物流轨迹（演示数据）</view>
      <view v-if="!tracks.length" class="empty">输入单号后点击查件查看示例轨迹</view>
      <view v-else class="timeline">
        <view v-for="(t, i) in tracks" :key="i" class="tl-item">
          <view class="tl-dot-wrap">
            <view class="tl-dot" :class="{ active: i === 0 }" />
            <view v-if="i < tracks.length - 1" class="tl-line" />
          </view>
          <view class="tl-body">
            <view class="tl-status">{{ t.status }}</view>
            <view class="tl-time">{{ t.time }}</view>
            <view class="tl-addr">{{ t.addr }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const STORAGE_KEY = 'query_express_recent'

export default {
  name: 'QueryExpress',
  data() {
    return {
      trackingNo: '',
      lastList: [],
      tracks: []
    }
  },
  onShow() {
    this.loadRecent()
  },
  methods: {
    loadRecent() {
      try {
        const list = uni.getStorageSync(STORAGE_KEY)
        this.lastList = Array.isArray(list) ? list : []
      } catch (e) {
        this.lastList = []
      }
    },
    saveRecent(no) {
      const n = (no || '').trim()
      if (!n) return
      let list = [...this.lastList].filter((x) => x !== n)
      list.unshift(n)
      list = list.slice(0, 8)
      this.lastList = list
      try {
        uni.setStorageSync(STORAGE_KEY, list)
      } catch (e) {
        // ignore
      }
    },
    clearRecent() {
      this.lastList = []
      try {
        uni.removeStorageSync(STORAGE_KEY)
      } catch (e) {
        // ignore
      }
    },
    applyNo(no) {
      this.trackingNo = no
      this.mockTracks(no)
    },
    onQuery() {
      const no = (this.trackingNo || '').trim()
      if (!no) {
        uni.showToast({ title: '请输入运单号', icon: 'none' })
        return
      }
      this.saveRecent(no)
      this.mockTracks(no)
      uni.showToast({ title: '已更新演示轨迹', icon: 'success' })
    },
    mockTracks(no) {
      const tail = no.length > 4 ? no.slice(-4) : no
      this.tracks = [
        {
          status: '已签收，感谢使用京东快递',
          time: '2026-05-08 09:20',
          addr: '北京市大兴区***'
        },
        {
          status: '派送中',
          time: '2026-05-08 07:05',
          addr: '北京分拨中心'
        },
        {
          status: '运输中',
          time: '2026-05-07 22:18',
          addr: '武汉转运中心'
        },
        {
          status: '已揽收',
          time: '2026-05-07 14:02',
          addr: `运单尾号${tail} · 演示数据`
        }
      ]
    }
  }
}
</script>

<style>
.page {
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.search-wrap {
  background: linear-gradient(180deg, #e1251b 0%, #c41e17 100%);
  padding: 24rpx 24rpx 40rpx;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 999rpx;
  padding: 8rpx 8rpx 8rpx 24rpx;
}

.search-icon {
  font-size: 28rpx;
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  height: 72rpx;
  font-size: 28rpx;
}

.ph {
  color: #bfbfbf;
}

.search-btn {
  background: #e1251b;
  color: #fff;
  font-size: 28rpx;
  padding: 16rpx 32rpx;
  border-radius: 999rpx;
  font-weight: 600;
}

.card {
  background: #fff;
  margin: -20rpx 24rpx 24rpx;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.track-card {
  margin-top: 0;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 24rpx 0;
}

.section-title {
  padding: 24rpx 24rpx 12rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.track-card .section-title {
  padding-bottom: 8rpx;
}

.link {
  font-size: 26rpx;
  color: #e1251b;
}

.recent-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 24rpx;
  border-top: 1rpx solid #f5f5f5;
}

.no {
  font-size: 28rpx;
  color: #333;
}

.empty {
  padding: 48rpx 24rpx 40rpx;
  text-align: center;
  font-size: 26rpx;
  color: #999;
}

.timeline {
  padding: 8rpx 24rpx 32rpx;
}

.tl-item {
  display: flex;
}

.tl-dot-wrap {
  width: 36rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tl-dot {
  width: 18rpx;
  height: 18rpx;
  border-radius: 50%;
  background: #d9d9d9;
  margin-top: 8rpx;
}

.tl-dot.active {
  background: #e1251b;
  box-shadow: 0 0 0 6rpx rgba(225, 37, 27, 0.2);
}

.tl-line {
  flex: 1;
  width: 2rpx;
  background: #f0f0f0;
  min-height: 48rpx;
  margin: 8rpx 0;
}

.tl-body {
  flex: 1;
  padding: 0 0 32rpx 16rpx;
}

.tl-status {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.tl-time {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.tl-addr {
  font-size: 24rpx;
  color: #666;
  margin-top: 4rpx;
}
</style>
