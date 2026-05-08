<template>
  <view class="page">
    <view class="header">
      <view class="user-block">
        <view class="avatar">{{ avatarText }}</view>
        <view class="user-meta">
          <view class="nickname">{{ displayName }}</view>
          <view class="sub">{{ certifiedHint }}</view>
        </view>
      </view>
    </view>

    <view class="menu-card">
      <view class="menu-row highlight" @click="goRealName">
        <view class="menu-left">
          <text class="menu-icon">🪪</text>
          <view class="menu-texts">
            <text class="menu-title">实名信息</text>
            <text class="menu-desc">寄件需填写真实姓名与证件信息</text>
          </view>
        </view>
        <view class="menu-right">
          <text class="badge" :class="{ ok: userInfo.certified }">{{ certBadge }}</text>
          <text class="arrow">›</text>
        </view>
      </view>

      <view class="menu-row" @click="toast('我的订单')">
        <text class="menu-icon">📃</text>
        <text class="menu-title plain">我的订单</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-row" @click="toast('地址簿')">
        <text class="menu-icon">📍</text>
        <text class="menu-title plain">地址簿</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-row" @click="toast('联系客服')">
        <text class="menu-icon">💬</text>
        <text class="menu-title plain">联系客服</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-row" @click="toast('设置')">
        <text class="menu-icon">⚙️</text>
        <text class="menu-title plain">设置</text>
        <text class="arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Mine',
  computed: {
    ...mapState(['userInfo']),
    displayName() {
      if (this.userInfo.certified && this.userInfo.realName) {
        const n = this.userInfo.realName
        return n.length > 1 ? `${n[0]}*${n.slice(-1)}` : n
      }
      return '点击完善实名信息'
    },
    avatarText() {
      if (this.userInfo.realName) return this.userInfo.realName.slice(0, 1)
      return '寄'
    },
    certifiedHint() {
      return this.userInfo.certified ? '已完成实名认证' : '未完成实名，可能影响寄件'
    },
    certBadge() {
      return this.userInfo.certified ? '已认证' : '去填写'
    }
  },
  methods: {
    goRealName() {
      uni.navigateTo({
        url: '/pages/mine/userInfo/userInfo'
      })
    },
    toast(msg) {
      uni.showToast({ title: `${msg}（演示）`, icon: 'none' })
    }
  }
}
</script>

<style>
.page {
  min-height: 100vh;
}

.header {
  background: linear-gradient(180deg, #e1251b 0%, #c41e17 100%);
  padding: 48rpx 32rpx 72rpx;
  color: #fff;
}

.user-block {
  display: flex;
  align-items: center;
}

.avatar {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  font-weight: 700;
}

.user-meta {
  margin-left: 28rpx;
  flex: 1;
}

.nickname {
  font-size: 36rpx;
  font-weight: 700;
}

.sub {
  margin-top: 12rpx;
  font-size: 24rpx;
  opacity: 0.9;
}

.menu-card {
  background: #fff;
  margin: -40rpx 24rpx 24rpx;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.menu-row {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.menu-row:last-child {
  border-bottom: none;
}

.menu-row.highlight {
  background: linear-gradient(90deg, #fff9f9 0%, #ffffff 100%);
}

.menu-left {
  flex: 1;
  display: flex;
  align-items: center;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.menu-texts {
  display: flex;
  flex-direction: column;
}

.menu-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 600;
}

.menu-title.plain {
  font-weight: 500;
  flex: 1;
}

.menu-desc {
  font-size: 24rpx;
  color: #999;
  margin-top: 6rpx;
}

.menu-right {
  display: flex;
  align-items: center;
}

.badge {
  font-size: 24rpx;
  color: #e1251b;
  background: #fff2f0;
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
  margin-right: 8rpx;
}

.badge.ok {
  color: #52c41a;
  background: #f6ffed;
}

.arrow {
  font-size: 36rpx;
  color: #ccc;
}
</style>
