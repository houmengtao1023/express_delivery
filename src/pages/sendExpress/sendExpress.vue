<template>
  <view class="page">
    <view class="hero">
      <view class="hero-title">寄快递</view>
      <view class="hero-sub">上门取件 · 运费透明 · 全程可追踪</view>
    </view>

    <view class="card address-card">
      <view class="card-row" @click="toastSoon('填写寄件地址')">
        <view class="row-label">
          <text class="dot send" />
          寄件地址
        </view>
        <view class="row-value">
          {{ sendAddr }}
          <text class="arrow">›</text>
        </view>
      </view>
      <view class="divider" />
      <view class="card-row" @click="toastSoon('填写收件地址')">
        <view class="row-label">
          <text class="dot recv" />
          收件地址
        </view>
        <view class="row-value">
          {{ recvAddr }}
          <text class="arrow">›</text>
        </view>
      </view>
    </view>

    <view class="card">
      <view class="section-title">常用服务</view>
      <view class="grid">
        <view v-for="item in services" :key="item.t" class="grid-item" @click="toastSoon(item.t)">
          <view class="grid-icon">{{ item.icon }}</view>
          <view class="grid-text">{{ item.t }}</view>
        </view>
      </view>
    </view>

    <view class="card promo" @click="toastSoon('优惠活动')">
      <view class="promo-left">
        <view class="promo-tag">新人礼</view>
        <view class="promo-main">首单立减 · 优惠券领取</view>
        <view class="promo-hint">参考京东快递小程序活动位样式</view>
      </view>
      <text class="arrow light">›</text>
    </view>

    <view class="footer-tip">演示页面：下单与支付需对接真实业务接口</view>
  </view>
</template>

<script>
export default {
  name: 'SendExpress',
  data() {
    return {
      sendAddr: '点击填写寄件信息',
      recvAddr: '点击填写收件信息',
      services: [
        { icon: '🏠', t: '上门取件' },
        { icon: '📦', t: '服务点自寄' },
        { icon: '📋', t: '批量寄件' },
        { icon: '⏱', t: '运费时效' }
      ]
    }
  },
  methods: {
    toastSoon(name) {
      uni.showToast({ title: `${name}（演示）`, icon: 'none' })
    }
  }
}
</script>

<style>
.page {
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.hero {
  background: linear-gradient(180deg, #e1251b 0%, #c41e17 100%);
  padding: 36rpx 32rpx 48rpx;
  color: #fff;
}

.hero-title {
  font-size: 44rpx;
  font-weight: 700;
}

.hero-sub {
  margin-top: 12rpx;
  font-size: 26rpx;
  opacity: 0.9;
}

.card {
  background: #fff;
  margin: -28rpx 24rpx 24rpx;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
  padding: 8rpx 0;
}

.address-card {
  margin-top: -28rpx;
}

.card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 24rpx;
}

.row-label {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  margin-right: 16rpx;
}

.dot.send {
  background: #e1251b;
}

.dot.recv {
  background: #52c41a;
}

.row-value {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #999;
  max-width: 420rpx;
  text-align: right;
}

.arrow {
  margin-left: 8rpx;
  font-size: 36rpx;
  color: #ccc;
}

.divider {
  height: 1rpx;
  background: #f0f0f0;
  margin: 0 24rpx;
}

.section-title {
  padding: 24rpx 24rpx 8rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  padding: 8rpx 12rpx 24rpx;
}

.grid-item {
  width: 25%;
  padding: 20rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grid-icon {
  font-size: 48rpx;
  margin-bottom: 8rpx;
}

.grid-text {
  font-size: 24rpx;
  color: #666;
}

.promo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 24rpx;
  margin: 0 24rpx 24rpx;
  background: linear-gradient(90deg, #fff5f5 0%, #ffffff 100%);
  border: 1rpx solid #ffe0e0;
}

.promo-left {
  flex: 1;
}

.promo-tag {
  display: inline-block;
  background: #e1251b;
  color: #fff;
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  margin-bottom: 8rpx;
}

.promo-main {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.promo-hint {
  font-size: 24rpx;
  color: #999;
  margin-top: 6rpx;
}

.arrow.light {
  color: #e1251b;
  font-size: 40rpx;
}

.footer-tip {
  text-align: center;
  font-size: 24rpx;
  color: #bbb;
  padding: 0 48rpx;
}
</style>
