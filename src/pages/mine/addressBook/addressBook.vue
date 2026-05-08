<template>
  <view class="ab-page">
    <view class="ab-search-wrap">
      <text class="ab-search-icon">🔍</text>
      <input
        v-model.trim="keyword"
        class="ab-search"
        placeholder="请输入姓名/电话/地址关键词/地址别名"
        placeholder-class="ab-search-ph"
      />
    </view>

    <view v-if="filterList.length === 0" class="ab-empty">
      <view class="ab-empty-icon">📭</view>
      <view class="ab-empty-text">暂无匹配地址</view>
    </view>

    <scroll-view v-else class="ab-list" scroll-y>
      <view v-for="item in filterList" :key="item.id" class="ab-item" @click="pickAddress(item)">
        <view class="ab-top">
          <view
            v-if="isManage"
            class="ab-select"
            :class="{ active: selectedIds.includes(item.id) }"
            @click.stop="toggleSelect(item.id)"
          >
            <text v-if="selectedIds.includes(item.id)">✓</text>
          </view>
          <text class="ab-name">{{ item.name }}</text>
          <text class="ab-phone">{{ maskPhone(item.phone) }}</text>
        </view>
        <view class="ab-address">{{ item.province }}{{ item.city }}{{ item.detail }}</view>
        <view class="ab-line" />
        <view class="ab-ops">
          <view class="ab-default-wrap" @click.stop="toggleDefault(item.id)">
            <text class="ab-default-label">默认寄件地址</text>
            <view class="ab-switch" :class="{ on: item.isDefault }">
              <view class="ab-dot" />
            </view>
          </view>
          <view class="ab-btns">
            <text class="ab-op" @click.stop="editItem(item.id)">编辑</text>
            <text class="ab-op" @click.stop="shareItem(item)">分享</text>
            <text class="ab-op delete" @click.stop="removeItem(item.id)">删除</text>
          </view>
        </view>
      </view>
      <view class="ab-bottom-space" />
    </scroll-view>

    <view v-if="!pickMode" class="ab-footer">
      <button v-if="isManage" class="ab-manage" @click="toggleManage">完成</button>
      <button v-if="isManage" class="ab-add" @click="batchDelete">删除</button>
      <button v-if="!isManage" class="ab-manage" @click="toggleManage">管理</button>
      <button v-if="!isManage" class="ab-add" @click="goAdd">新增</button>
    </view>
  </view>
</template>

<script>
const STORAGE_KEY = 'mine_address_book'

export default {
  name: 'AddressBook',
  data() {
    return {
      list: [],
      keyword: '',
      isManage: false,
      selectedIds: [],
      pickMode: false,
      pickType: 'send'
    }
  },
  computed: {
    filterList() {
      const key = (this.keyword || '').toLowerCase()
      if (!key) return this.list
      return this.list.filter((item) => {
        const full = `${item.name}${item.phone}${item.province}${item.city}${item.detail}${item.tag || ''}`.toLowerCase()
        return full.indexOf(key) > -1
      })
    }
  },
  onLoad(options) {
    if (options && options.pick === '1') {
      this.pickMode = true
      this.pickType = options.type || 'send'
    }
  },
  onShow() {
    this.loadList()
  },
  methods: {
    loadList() {
      const cache = uni.getStorageSync(STORAGE_KEY)
      if (Array.isArray(cache) && cache.length) {
        this.list = cache
      } else {
        this.list = [
          {
            id: 1,
            name: '侯梦涛',
            phone: '15122226268',
            province: '北京',
            city: '朝阳区',
            detail: '东湖街道叶青大厦D座4层',
            tag: '公司',
            isDefault: true
          }
        ]
        this.saveList()
      }
    },
    saveList() {
      uni.setStorageSync(STORAGE_KEY, this.list)
    },
    maskPhone(phone) {
      if (!phone || phone.length < 7) return phone || ''
      return `${phone.slice(0, 3)}****${phone.slice(-4)}`
    },
    toggleDefault(id) {
      if (this.pickMode) return
      this.list = this.list.map((item) => ({ ...item, isDefault: item.id === id }))
      this.saveList()
    },
    editItem(id) {
      if (this.pickMode) return
      uni.navigateTo({ url: `/pages/mine/addressBook/editContact?id=${id}` })
    },
    shareItem(item) {
      if (this.pickMode) return
      const text = `${item.name} ${item.phone} ${item.province}${item.city}${item.detail}`
      uni.setClipboardData({ data: text })
    },
    removeItem(id) {
      if (this.pickMode) return
      uni.showModal({
        title: '提示',
        content: '确定删除该地址吗？',
        success: (res) => {
          if (!res.confirm) return
          this.list = this.list.filter((item) => item.id !== id)
          if (this.list.length > 0 && !this.list.some((item) => item.isDefault)) {
            this.list[0].isDefault = true
          }
          this.saveList()
        }
      })
    },
    toggleManage() {
      if (this.pickMode) return
      this.isManage = !this.isManage
      if (!this.isManage) {
        this.selectedIds = []
      }
      uni.showToast({ title: this.isManage ? '管理模式' : '已完成', icon: 'none' })
    },
    toggleSelect(id) {
      const idx = this.selectedIds.indexOf(id)
      if (idx > -1) {
        this.selectedIds.splice(idx, 1)
      } else {
        this.selectedIds.push(id)
      }
    },
    batchDelete() {
      if (!this.selectedIds.length) {
        uni.showToast({ title: '请先选择要删除的地址', icon: 'none' })
        return
      }
      uni.showModal({
        title: '提示',
        content: `确定删除选中的 ${this.selectedIds.length} 条地址吗？`,
        success: (res) => {
          if (!res.confirm) return
          this.list = this.list.filter((item) => !this.selectedIds.includes(item.id))
          if (this.list.length > 0 && !this.list.some((item) => item.isDefault)) {
            this.list[0].isDefault = true
          }
          this.saveList()
          this.selectedIds = []
          this.isManage = false
          uni.showToast({ title: '删除成功', icon: 'success' })
        }
      })
    },
    goAdd() {
      if (this.pickMode) return
      uni.navigateTo({ url: '/pages/mine/addressBook/editContact' })
    },
    pickAddress(item) {
      if (!this.pickMode || this.isManage) return
      const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel()
      if (eventChannel) {
        eventChannel.emit('addressPicked', { type: this.pickType, data: item })
      }
      uni.navigateBack()
    }
  }
}
</script>

<style>
.ab-page {
  height: 100vh;
  background: #f6f7f9;
  padding: 18rpx 20rpx 0;
  box-sizing: border-box;
}

.ab-search-wrap {
  display: flex;
  align-items: center;
  height: 72rpx;
  background: #fff;
  border-radius: 999rpx;
  padding: 0 18rpx;
}

.ab-search-icon {
  font-size: 28rpx;
  margin-right: 10rpx;
}

.ab-search {
  flex: 1;
  font-size: 26rpx;
}

.ab-search-ph {
  color: #b8bec9;
}

.ab-list {
  height: calc(100vh - 210rpx);
  margin-top: 16rpx;
}

.ab-item {
  background: #fff;
  border-radius: 20rpx;
  padding: 22rpx;
  margin-bottom: 16rpx;
}

.ab-top {
  display: flex;
  align-items: center;
}

.ab-select {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 1rpx solid #d2d7e1;
  margin-right: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24rpx;
}

.ab-select.active {
  border-color: #ff3b30;
  background: #ff3b30;
}

.ab-name {
  font-size: 38rpx;
  font-weight: 700;
  color: #1f2430;
}

.ab-phone {
  font-size: 38rpx;
  color: #1f2430;
  margin-left: 14rpx;
}

.ab-address {
  margin-top: 10rpx;
  font-size: 34rpx;
  color: #8d94a3;
  line-height: 1.45;
}

.ab-line {
  height: 1rpx;
  background: #f0f2f5;
  margin: 18rpx 0 14rpx;
}

.ab-ops {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ab-default-wrap {
  display: flex;
  align-items: center;
}

.ab-default-label {
  color: #8d94a3;
  font-size: 30rpx;
  margin-right: 10rpx;
}

.ab-switch {
  width: 66rpx;
  height: 38rpx;
  border-radius: 30rpx;
  background: #e9ecf2;
  padding: 4rpx;
  box-sizing: border-box;
}

.ab-switch.on {
  background: #ff3b30;
}

.ab-dot {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  background: #fff;
}

.ab-switch.on .ab-dot {
  margin-left: 28rpx;
}

.ab-btns {
  display: flex;
  align-items: center;
}

.ab-op {
  font-size: 32rpx;
  color: #6e7584;
  margin-left: 22rpx;
}

.ab-op.delete {
  color: #8d94a3;
}

.ab-empty {
  margin-top: 240rpx;
  text-align: center;
}

.ab-empty-icon {
  font-size: 76rpx;
}

.ab-empty-text {
  margin-top: 14rpx;
  font-size: 28rpx;
  color: #8d94a3;
}

.ab-footer {
  position: fixed;
  left: 20rpx;
  right: 20rpx;
  bottom: 26rpx;
  display: flex;
}

.ab-manage,
.ab-add {
  border-radius: 999rpx;
  font-size: 38rpx;
  height: 86rpx;
  line-height: 86rpx;
}

.ab-manage {
  flex: 1;
  margin-right: 18rpx;
  color: #ff3b30;
  background: #fff;
  border: 1rpx solid #ff3b30;
}

.ab-add {
  flex: 1;
  color: #fff;
  background: #ff3b30;
  border: none;
}

.ab-bottom-space {
  height: 120rpx;
}
</style>
