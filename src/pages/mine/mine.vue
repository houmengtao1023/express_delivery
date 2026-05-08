<template>
  <view class="mine-page">
    <view class="mine-header">
      <view class="mine-user-block" @click="goRealName">
        <view class="mine-avatar">{{ avatarText }}</view>
        <view class="mine-user-meta">
          <view class="mine-nickname">{{ displayName }}</view>
          <view class="mine-sub">{{ certifiedHint }}</view>
        </view>
        <text class="mine-user-arrow">›</text>
      </view>
    </view>

    <view class="mine-data-card">
      <view class="mine-data-item mine-data-item-tap" @click="goMyOrders">
        <view class="mine-data-num">{{ orderCount }}</view>
        <view class="mine-data-label">我的订单</view>
        <text class="mine-data-hint">查看全部 ›</text>
      </view>
      <view class="mine-data-item">
        <view class="mine-data-num">{{ userInfo.certified ? '是' : '否' }}</view>
        <view class="mine-data-label">已实名</view>
      </view>
    </view>

    <view class="mine-menu-card">
      <view class="mine-menu-row" @click="goRealName">
        <view class="mine-menu-left">
          <text class="mine-menu-icon">🪪</text>
          <view class="mine-menu-texts">
            <text class="mine-menu-title">实名信息</text>
            <text class="mine-menu-desc">寄件需填写真实姓名与证件信息</text>
          </view>
        </view>
        <view class="mine-menu-right">
          <text class="mine-badge" :class="{ ok: userInfo.certified }">{{ certBadge }}</text>
          <text class="mine-arrow">›</text>
        </view>
      </view>

      <view class="mine-menu-row" @click="goMyOrders">
        <text class="mine-menu-icon">📃</text>
        <text class="mine-menu-title plain">我的订单</text>
        <text class="mine-arrow">›</text>
      </view>

      <view class="mine-menu-row" @click="goAddressBook">
        <text class="mine-menu-icon">📍</text>
        <text class="mine-menu-title plain">地址簿</text>
        <text class="mine-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Mine',
  data() {
    return {
      orderCount: 0
    }
  },
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
  onShow() {
    this.refreshOrderCount()
  },
  methods: {
    refreshOrderCount() {
      const list = uni.getStorageSync('mine_orders_list')
      this.orderCount = Array.isArray(list) ? list.length : 0
    },
    goMyOrders() {
      uni.navigateTo({ url: '/pages/mine/orders/orders' })
    },
    goRealName() {
      uni.navigateTo({
        url: '/pages/mine/userInfo/userInfo'
      })
    },
    goAddressBook() {
      uni.navigateTo({
        url: '/pages/mine/addressBook/addressBook'
      })
    },
    toast(msg) {
      uni.showToast({ title: `${msg}（演示）`, icon: 'none' })
    }
  }
}
</script>

<style>
/* 页面级底色在 pages.json 的 backgroundColor 配置，避免用 page{} 带来副作用 */

.mine-page {
  width: 100%;
  box-sizing: border-box;
  min-height: 100vh;
  background-color: var(--bg-page);
  overflow-x: hidden;
}

/* 横向铺满视口，消除左侧 1px 露底；与导航栏同色见 pages.json */
.mine-header {
  box-sizing: border-box;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  background-color: var(--color-primary-dark);
  background-image: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  /* 轻微上移，盖住导航栏与页面内容之间的亚像素接缝 */
  margin-top: -1rpx;
  padding: calc(48rpx + 1rpx) var(--page-pad-x) 72rpx;
  color: var(--text-on-primary);
}

.mine-user-block {
  display: flex;
  align-items: center;
}

.mine-user-arrow {
  font-size: 38rpx;
  color: rgba(255, 255, 255, 0.85);
}

.mine-avatar {
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

.mine-user-meta {
  margin-left: 28rpx;
  flex: 1;
}

.mine-nickname {
  font-size: 36rpx;
  font-weight: 700;
}

.mine-sub {
  margin-top: 12rpx;
  font-size: 24rpx;
  opacity: 0.9;
}

.mine-data-card {
  background: var(--bg-card);
  margin: -40rpx var(--page-pad-x) 20rpx;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  display: flex;
  padding: 24rpx 0;
}

.mine-data-item {
  flex: 1;
  text-align: center;
}

.mine-data-item-tap {
  border-right: 1rpx solid var(--border-hairline);
}

.mine-data-hint {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: var(--color-primary);
}

.mine-data-num {
  font-size: 40rpx;
  color: var(--color-primary);
  font-weight: 700;
}

.mine-data-label {
  font-size: 24rpx;
  color: var(--text-secondary);
  margin-top: 8rpx;
}

.mine-menu-card {
  background: var(--bg-card);
  margin: 0 var(--page-pad-x) var(--page-pad-x);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.mine-menu-row {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid var(--bg-page);
}

.mine-menu-row:last-child {
  border-bottom: none;
}

.mine-menu-row.highlight {
  background: linear-gradient(90deg, var(--color-primary-soft) 0%, var(--bg-card) 100%);
}

.mine-menu-left {
  flex: 1;
  display: flex;
  align-items: center;
}

.mine-menu-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.mine-menu-texts {
  display: flex;
  flex-direction: column;
}

.mine-menu-title {
  font-size: 30rpx;
  color: var(--text-body);
  font-weight: 600;
}

.mine-menu-title.plain {
  font-weight: 500;
  flex: 1;
}

.mine-menu-desc {
  font-size: 24rpx;
  color: var(--text-hint);
  margin-top: 6rpx;
}

.mine-menu-right {
  display: flex;
  align-items: center;
}

.mine-badge {
  font-size: 24rpx;
  color: var(--color-primary);
  background: var(--color-primary-soft);
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
  margin-right: 8rpx;
}

.mine-badge.ok {
  color: var(--color-success);
  background: var(--color-success-soft);
}

.mine-arrow {
  font-size: 36rpx;
  color: var(--border-strong);
}
</style>
