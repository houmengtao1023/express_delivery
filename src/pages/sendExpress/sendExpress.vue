<template>
  <view class="sd-page">
    <view class="sd-card">
      <view class="sd-contact-row" @click="openAddressBook('send')">
        <view class="sd-badge send">寄</view>
        <view class="sd-contact-main">
          <view class="sd-contact-top">
            <text class="sd-name">{{ sender.name || '新建寄件人' }}</text>
            <text class="sd-phone">{{ sender.phone ? maskPhone(sender.phone) : '' }}</text>
          </view>
          <view class="sd-contact-addr">{{ senderText }}</view>
        </view>
        <view class="sd-right-action">地址簿</view>
      </view>
      <view class="sd-line" />
      <view class="sd-contact-row" @click="openAddressBook('recv')">
        <view class="sd-badge recv">收</view>
        <view class="sd-contact-main">
          <view class="sd-contact-top">
            <text class="sd-name">{{ receiver.name || '新建收件人' }}</text>
            <text class="sd-phone">{{ receiver.phone ? maskPhone(receiver.phone) : '' }}</text>
          </view>
          <view class="sd-contact-addr">{{ receiverText }}</view>
        </view>
        <view class="sd-right-action">地址簿</view>
      </view>
    </view>

    <view class="sd-card">
      <view class="sd-switch-wrap">
        <view class="sd-switch-item" :class="{ active: serviceType === 'pickup' }" @click="switchService('pickup')">上门取件</view>
        <view class="sd-switch-item" :class="{ active: serviceType === 'station' }" @click="switchService('station')">服务点自寄</view>
      </view>

      <view v-if="serviceType === 'pickup'" class="sd-row" @click="showTimePicker = true">
        <text class="sd-label">期望上门时间</text>
        <view class="sd-value">{{ pickupTimeText }} ›</view>
      </view>

      <view v-if="serviceType === 'station'">
        <view class="sd-row">
          <text class="sd-label">网点类型</text>
          <view class="sd-inline-tabs">
            <text
              class="sd-inline-tab"
              :class="{ active: stationType === '便民站' }"
              @click.stop="stationType = '便民站'"
            >便民站</text>
            <text
              class="sd-inline-tab"
              :class="{ active: stationType === '营业部' }"
              @click.stop="stationType = '营业部'"
            >营业部</text>
          </view>
        </view>
        <view class="sd-line" />
        <view class="sd-station-card">
          <view class="sd-station-main">
            <view class="sd-station-name">{{ stationInfo.name }}</view>
            <view class="sd-station-sub">{{ stationInfo.distance }}</view>
            <view class="sd-station-tag">最近</view>
          </view>
          <view class="sd-station-addr">{{ stationInfo.address }}</view>
        </view>
      </view>

      <view class="sd-line" />
      <view class="sd-row">
        <text class="sd-label">付款方式</text>
        <picker :range="payTypes" @change="onPayChange">
          <view class="sd-value">{{ payType }} ›</view>
        </picker>
      </view>
    </view>

    <view class="sd-bottom-space" />

    <view class="sd-footer">
      <view class="sd-fee-box">
        <text class="sd-fee">¥{{ estimatedPrice }}</text>
        <text class="sd-detail">明细</text>
      </view>
      <button class="sd-order-btn" @click="submitOrder">下单</button>
    </view>

    <view v-if="showTimePicker" class="sd-mask" @click="showTimePicker = false">
      <view class="sd-picker-panel" @click.stop>
        <view class="sd-picker-head">
          <text class="sd-picker-title">期望上门时间</text>
          <text class="sd-picker-close" @click="showTimePicker = false">✕</text>
        </view>
        <view class="sd-picker-body">
          <view class="sd-day-col">
            <view
              v-for="(day, idx) in pickupDays"
              :key="day"
              class="sd-day-item"
              :class="{ active: selectedDayIndex === idx }"
              @click="selectPickupDay(idx)"
            >
              {{ day }}
            </view>
          </view>
          <scroll-view class="sd-slot-col" scroll-y>
            <view
              v-for="(slot, idx) in currentSlots"
              :key="slot"
              class="sd-slot-item"
              :class="{ active: selectedSlotIndex === idx }"
              @click="selectedSlotIndex = idx"
            >
              {{ slot }}
            </view>
          </scroll-view>
        </view>
        <view class="sd-picker-foot">
          <button class="sd-picker-btn" @click="confirmPickupTime">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const SEND_DRAFT_KEY = 'send_express_draft'
const MINE_ORDERS_KEY = 'mine_orders_list'

export default {
  name: 'SendExpress',
  data() {
    return {
      serviceType: 'pickup',
      pickupDays: ['今天', '明天', '后天'],
      selectedDayIndex: 0,
      selectedSlotIndex: 0,
      showTimePicker: false,
      stationType: '营业部',
      stationInfo: {
        name: '北京市站',
        distance: '777m',
        address: '朝阳区望京街道东湖国际广场1层'
      },
      payType: '寄付现结',
      payTypes: ['寄付现结', '寄方月结', '到付'],
      sender: {},
      receiver: {}
    }
  },
  computed: {
    senderText() {
      if (!this.sender.detail) return '请先选择寄件地址'
      return `${this.sender.province || ''}${this.sender.city || ''}${this.sender.detail || ''}`
    },
    receiverText() {
      if (!this.receiver.detail) return '支持一键粘贴、图片识别等快速填写'
      return `${this.receiver.province || ''}${this.receiver.city || ''}${this.receiver.detail || ''}`
    },
    currentSlots() {
      const day = this.pickupDays[this.selectedDayIndex] || '今天'
      if (day === '今天') {
        return ['一小时内', ...this.generateHourSlots(12, 21)]
      }
      return this.generateHourSlots(9, 21)
    },
    pickupTimeText() {
      const day = this.pickupDays[this.selectedDayIndex] || '今天'
      const slot = this.currentSlots[this.selectedSlotIndex] || '一小时内'
      return `${day} ${slot}`
    },
    estimatedPrice() {
      const hasSender = !!this.sender.id
      const hasReceiver = !!this.receiver.id
      if (!hasSender || !hasReceiver) return '--'
      const base = this.serviceType === 'pickup' ? 12 : 9
      return base.toFixed(2)
    }
  },
  onShow() {
    this.loadDraftData()
  },
  methods: {
    generateHourSlots(start, end) {
      const slots = []
      for (let hour = start; hour < end; hour += 1) {
        const from = `${hour}`.padStart(2, '0')
        const to = `${hour + 1}`.padStart(2, '0')
        slots.push(`${from}:00-${to}:00`)
      }
      return slots
    },
    maskPhone(phone) {
      if (!phone || phone.length < 7) return ''
      return `${phone.slice(0, 3)}****${phone.slice(-4)}`
    },
    switchService(type) {
      this.serviceType = type
      this.saveDraftData()
    },
    onPayChange(e) {
      this.payType = this.payTypes[e.detail.value]
      this.saveDraftData()
    },
    confirmPickupTime() {
      this.showTimePicker = false
      this.saveDraftData()
    },
    selectPickupDay(index) {
      this.selectedDayIndex = index
      this.selectedSlotIndex = 0
    },
    openAddressBook(type) {
      uni.navigateTo({
        url: `/pages/mine/addressBook/addressBook?pick=1&type=${type}`,
        success: (res) => {
          res.eventChannel.on('addressPicked', (payload) => {
            if (!payload || !payload.data) return
            if (payload.type === 'send') this.sender = payload.data
            if (payload.type === 'recv') this.receiver = payload.data
            this.saveDraftData()
          })
        }
      })
    },
    saveDraftData() {
      uni.setStorageSync(SEND_DRAFT_KEY, {
        sender: this.sender,
        receiver: this.receiver,
        serviceType: this.serviceType,
        selectedDayIndex: this.selectedDayIndex,
        selectedSlotIndex: this.selectedSlotIndex,
        stationType: this.stationType,
        payType: this.payType
      })
    },
    loadDraftData() {
      try {
        const data = uni.getStorageSync(SEND_DRAFT_KEY)
        if (!data || typeof data !== 'object') return
        const s = data.sender
        const r = data.receiver
        this.sender = s && typeof s === 'object' ? s : {}
        this.receiver = r && typeof r === 'object' ? r : {}
        this.serviceType = data.serviceType === 'station' ? 'station' : 'pickup'
        this.selectedDayIndex = Number.isInteger(data.selectedDayIndex) ? data.selectedDayIndex : 0
        this.selectedSlotIndex = Number.isInteger(data.selectedSlotIndex) ? data.selectedSlotIndex : 0
        if (this.selectedSlotIndex >= this.currentSlots.length) {
          this.selectedSlotIndex = 0
        }
        this.stationType = data.stationType || '营业部'
        this.payType = data.payType || '寄付现结'
      } catch (e) {
        this.sender = {}
        this.receiver = {}
      }
    },
    submitOrder() {
      if (!this.sender.id || !this.receiver.id) {
        uni.showToast({ title: '请先补全寄件人和收件人', icon: 'none' })
        return
      }
      if (this.serviceType === 'pickup' && !this.pickupTimeText) {
        uni.showToast({ title: '请选择上门时间', icon: 'none' })
        return
      }
      this.saveDraftData()
      this.appendMineOrder()
      uni.showToast({ title: '下单成功', icon: 'success' })
    },
    appendMineOrder() {
      const raw = uni.getStorageSync(MINE_ORDERS_KEY)
      const arr = Array.isArray(raw) ? raw : []
      const ts = Date.now()
      const no = `JDK${String(ts).slice(-12)}`
      const d = new Date()
      const pad = (n) => (n < 10 ? `0${n}` : `${n}`)
      const createTime = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
      arr.unshift({
        id: ts,
        no,
        status: '待揽收',
        fromCity: this.sender.city || '',
        fromName: this.sender.name || '寄件人',
        toCity: this.receiver.city || '',
        toName: this.receiver.name || '收件人',
        createTime,
        payType: this.payType,
        serviceType: this.serviceType === 'pickup' ? '上门取件' : '服务点自寄'
      })
      uni.setStorageSync(MINE_ORDERS_KEY, arr)
    }
  }
}
</script>

<style>
page {
  background-color: #f6f7f9;
  color: #1f2430;
}

.sd-page {
  min-height: 100vh;
  background: #f6f7f9;
  padding: 18rpx 20rpx 0;
  box-sizing: border-box;
  color: #1f2430;
}

.sd-card {
  background: #fff;
  border-radius: 18rpx;
  margin-bottom: 16rpx;
}

.sd-contact-row {
  display: flex;
  align-items: center;
  padding: 22rpx;
}

.sd-badge {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  color: #fff;
  font-size: 28rpx;
  line-height: 52rpx;
  text-align: center;
  margin-right: 14rpx;
}

.sd-badge.send {
  background: #2f3745;
}

.sd-badge.recv {
  background: #ff4b42;
}

.sd-contact-main {
  flex: 1;
}

.sd-contact-top {
  display: flex;
  align-items: center;
}

.sd-name {
  font-size: 42rpx;
  color: #1f2430;
  font-weight: 700;
}

.sd-phone {
  margin-left: 14rpx;
  font-size: 42rpx;
  color: #1f2430;
}

.sd-contact-addr {
  margin-top: 8rpx;
  font-size: 30rpx;
  color: #8c94a2;
  line-height: 1.4;
}

.sd-right-action {
  color: #596173;
  font-size: 32rpx;
  margin-left: 12rpx;
}

.sd-line {
  height: 1rpx;
  background: #eff2f6;
  margin: 0 22rpx;
}

.sd-switch-wrap {
  margin: 18rpx 20rpx 8rpx;
  height: 68rpx;
  background: #f1f3f7;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  padding: 4rpx;
}

.sd-switch-item {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  color: #656e80;
  line-height: 60rpx;
  border-radius: 999rpx;
}

.sd-switch-item.active {
  background: #fff;
  color: #ff3b30;
  font-weight: 700;
}

.sd-row {
  height: 94rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
}

.sd-label {
  font-size: 38rpx;
  color: #1f2430;
}

.sd-value {
  font-size: 38rpx;
  color: #1f2430;
}

.sd-inline-tabs {
  display: flex;
}

.sd-inline-tab {
  font-size: 32rpx;
  color: #8b93a1;
  margin-left: 24rpx;
  position: relative;
}

.sd-inline-tab.active {
  color: #ff3b30;
  font-weight: 700;
}

.sd-station-card {
  margin: 14rpx 22rpx 18rpx;
  background: #f7f8fa;
  border-radius: 14rpx;
  padding: 16rpx;
}

.sd-station-main {
  display: flex;
  align-items: baseline;
}

.sd-station-name {
  font-size: 36rpx;
  color: #1f2430;
  font-weight: 700;
}

.sd-station-sub {
  margin-left: 10rpx;
  font-size: 30rpx;
  color: #ff4b42;
}

.sd-station-tag {
  margin-left: 12rpx;
  font-size: 28rpx;
  color: #ff4b42;
}

.sd-station-addr {
  margin-top: 8rpx;
  font-size: 28rpx;
  color: #8c94a2;
}

.sd-bottom-space {
  height: 130rpx;
}

.sd-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 12rpx 20rpx 24rpx;
  box-sizing: border-box;
  box-shadow: 0 -6rpx 18rpx rgba(0, 0, 0, 0.06);
}

.sd-fee-box {
  flex: 1;
  display: flex;
  align-items: baseline;
}

.sd-fee {
  color: #ff3b30;
  font-size: 46rpx;
  font-weight: 700;
}

.sd-detail {
  margin-left: 14rpx;
  color: #1f2430;
  font-size: 38rpx;
}

.sd-order-btn {
  width: 300rpx;
  height: 86rpx;
  line-height: 86rpx;
  border-radius: 999rpx;
  color: #fff;
  background: #ff3b30;
  font-size: 40rpx;
  border: none;
}

.sd-order-btn::after {
  border: none;
}

.sd-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: flex-end;
  z-index: 20;
}

.sd-picker-panel {
  width: 100%;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
}

.sd-picker-head {
  height: 84rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  border-bottom: 1rpx solid #f0f2f5;
}

.sd-picker-title {
  font-size: 42rpx;
  font-weight: 700;
  color: #1f2430;
}

.sd-picker-close {
  font-size: 40rpx;
  color: #9aa1af;
}

.sd-picker-body {
  display: flex;
  height: 540rpx;
}

.sd-day-col {
  width: 32%;
  background: #f7f7f8;
}

.sd-day-item {
  height: 96rpx;
  line-height: 96rpx;
  text-align: center;
  font-size: 36rpx;
  color: #1f2430;
}

.sd-day-item.active {
  color: #ff3b30;
  font-weight: 700;
  background: #fff;
}

.sd-slot-col {
  flex: 1;
}

.sd-slot-item {
  height: 96rpx;
  line-height: 96rpx;
  text-align: center;
  font-size: 38rpx;
  color: #1f2430;
}

.sd-slot-item.active {
  color: #ff3b30;
  font-weight: 700;
}

.sd-picker-foot {
  padding: 12rpx 20rpx 20rpx;
}

.sd-picker-btn {
  background: #ff3b30;
  color: #fff;
  border-radius: 999rpx;
  font-size: 34rpx;
  height: 80rpx;
  line-height: 80rpx;
}
</style>
