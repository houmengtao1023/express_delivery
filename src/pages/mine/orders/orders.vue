<template>
  <view class="ord-page">
    <view v-if="!list.length" class="ord-empty">
      <view class="ord-empty-icon">📋</view>
      <view class="ord-empty-text">暂无订单</view>
      <view class="ord-empty-hint">在「寄快递」下单成功后会出现在这里</view>
    </view>
    <scroll-view v-else class="ord-list" scroll-y>
      <view v-for="item in list" :key="item.id" class="ord-card" @click="showDetail(item)">
        <view class="ord-head">
          <text class="ord-brand">京东快递</text>
          <text class="ord-no">{{ item.no }}</text>
          <text class="ord-status">{{ item.status }}</text>
        </view>
        <view class="ord-route">
          <text>{{ item.fromCity }} · {{ item.fromName }}</text>
          <text class="ord-arrow">→</text>
          <text>{{ item.toCity }} · {{ item.toName }}</text>
        </view>
        <view class="ord-meta">{{ item.createTime }} · {{ item.payType }}</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
const ORDERS_KEY = 'mine_orders_list'

export default {
  name: 'MineOrders',
  data() {
    return {
      list: []
    }
  },
  onShow() {
    this.loadList()
  },
  methods: {
    loadList() {
      const raw = uni.getStorageSync(ORDERS_KEY)
      this.list = Array.isArray(raw) ? raw : []
    },
    showDetail(item) {
      uni.showModal({
        title: '运单详情',
        content: `单号：${item.no}\n状态：${item.status}\n寄件：${item.fromCity} ${item.fromName}\n收件：${item.toCity} ${item.toName}`,
        showCancel: false
      })
    }
  }
}
</script>

<style>
.ord-page {
  min-height: 100vh;
  background: var(--bg-page);
  padding: 16rpx var(--page-pad-x);
  box-sizing: border-box;
}
.ord-empty {
  padding-top: 200rpx;
  text-align: center;
}
.ord-empty-icon {
  font-size: 88rpx;
}
.ord-empty-text {
  margin-top: 16rpx;
  font-size: 32rpx;
  color: var(--text-body);
}
.ord-empty-hint {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: var(--text-hint);
}
.ord-list {
  height: calc(100vh - 40rpx);
}
.ord-card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  padding: 20rpx;
  margin-bottom: 14rpx;
  box-shadow: var(--shadow-card);
}
.ord-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.ord-brand {
  font-size: 22rpx;
  color: var(--color-primary);
  background: var(--color-primary-soft);
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  margin-right: 10rpx;
}
.ord-no {
  font-size: 28rpx;
  color: var(--text-body);
  flex: 1;
}
.ord-status {
  font-size: 26rpx;
  color: var(--color-primary);
}
.ord-route {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.ord-arrow {
  margin: 0 12rpx;
  color: var(--border-strong);
}
.ord-meta {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--text-hint);
}
</style>
