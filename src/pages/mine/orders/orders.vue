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
import { orderApi } from '../../../utils/api'

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
    async loadList() {
      try {
        const data = await orderApi.list()
        const arr = Array.isArray(data) ? data : []
        this.list = arr.map((it) => ({
          id: it.id,
          no: it.no,
          status: it.status,
          fromCity: it.senderCity,
          fromName: it.senderName,
          toCity: it.receiverCity,
          toName: it.receiverName,
          createTime: it.createTime,
          payType: it.payType,
          serviceType: it.serviceType === 'pickup' ? '上门取件' : '服务点自寄'
        }))
      } catch (e) {
        this.list = []
      }
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
  background: #f6f7f9;
  padding: 16rpx 20rpx;
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
  color: #333;
}
.ord-empty-hint {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #999;
}
.ord-list {
  height: calc(100vh - 40rpx);
}
.ord-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 14rpx;
}
.ord-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.ord-brand {
  font-size: 22rpx;
  color: #e1251b;
  background: #fff2f0;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  margin-right: 10rpx;
}
.ord-no {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}
.ord-status {
  font-size: 26rpx;
  color: #e1251b;
}
.ord-route {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #666;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.ord-arrow {
  margin: 0 12rpx;
  color: #ccc;
}
.ord-meta {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #999;
}
</style>
