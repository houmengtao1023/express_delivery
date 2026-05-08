<template>
  <view class="qe-page">
    <view class="qe-top">
      <view class="qe-search-box">
        <text class="qe-search-icon">🔍</text>
        <input v-model.trim="keyword" class="qe-search-input" placeholder="姓名/电话/运单号" />
      </view>
      <view class="qe-filter-btn" @click="openFilter">{{ hasActiveFilter ? '已筛' : '筛选' }}</view>
    </view>

    <view class="qe-tabs">
      <view class="qe-tab" :class="{ active: activeTab === 'send' }" @click="activeTab = 'send'">
        我寄 <text class="qe-tab-count" :class="{ active: activeTab === 'send' }">{{ sendCount }}</text>
      </view>
      <view class="qe-tab" :class="{ active: activeTab === 'recv' }" @click="activeTab = 'recv'">
        我收 <text class="qe-tab-count" :class="{ active: activeTab === 'recv' }">{{ recvCount }}</text>
      </view>
    </view>

    <view class="qe-banner">
      <text>1分限时秒杀 寄件立省4元！</text>
      <text class="qe-banner-btn">立即查看</text>
    </view>

    <view v-if="filteredList.length === 0" class="qe-empty-wrap">
      <view class="qe-empty-icon">📦</view>
      <view class="qe-empty-title">没找到符合条件的运单哦～</view>
      <button v-if="hasActiveFilter" class="qe-empty-btn" @click="clearFilterAndRefresh">清空筛选</button>
      <view class="qe-empty-tip">
        此处可展示6个月以内运单，6个月至12个月内运单可在搜索框输入运单号或联系
        <text class="qe-tip-link">客服</text> 查询
      </view>
      <view class="qe-service-float">客服中心</view>
    </view>

    <scroll-view v-else class="qe-list" scroll-y>
      <view v-for="item in filteredList" :key="item.no" class="qe-card">
        <view class="qe-card-head">
          <text class="qe-brand">{{ item.brand }}</text>
          <text class="qe-no">运单号：{{ item.no }}</text>
        </view>
        <view class="qe-route">
          <view class="qe-city">
            <view class="qe-city-name">{{ item.fromCity }}</view>
            <view class="qe-user">{{ item.fromName }}</view>
          </view>
          <view class="qe-status">{{ item.status }}</view>
          <view class="qe-city right">
            <view class="qe-city-name">{{ item.toCity }}</view>
            <view class="qe-user">{{ item.toName }}</view>
          </view>
        </view>
        <view class="qe-desc">{{ item.desc }}</view>
        <view class="qe-time">{{ item.timeLabel }}：{{ item.time }}</view>
        <view class="qe-actions">
          <text class="qe-action" @click="copyNo(item.no)">运单条码</text>
          <text class="qe-action" @click="shareItem(item)">分享</text>
        </view>
      </view>
      <view class="qe-bottom-space" />
    </scroll-view>

    <view v-if="showFilter" class="qe-mask" @click="showFilter = false">
      <view class="qe-panel qe-panel-top" @click.stop>
        <view class="qe-panel-head">
          <text class="qe-panel-space"></text>
          <text class="qe-close" @click="showFilter = false">✕</text>
        </view>
        <view class="qe-sec-title">快递状态</view>
        <view class="qe-tags">
          <view v-for="s in statusOptions" :key="s" class="qe-tag" :class="{ active: draftFilters.status === s }" @click="draftFilters.status = s">{{ s }}</view>
        </view>
        <view class="qe-sec-title">时间范围</view>
        <view class="qe-tags">
          <view v-for="d in dateOptions" :key="d" class="qe-tag" :class="{ active: draftFilters.dateRange === d }" @click="draftFilters.dateRange = d">{{ d }}</view>
        </view>
        <view class="qe-sec-title">功能（支持单筛选）</view>
        <view class="qe-tags">
          <view v-for="f in functionOptions" :key="f" class="qe-tag" :class="{ active: draftFilters.functionType === f }" @click="draftFilters.functionType = f">{{ f }}</view>
        </view>
        <view class="qe-foot">
          <button class="qe-reset" @click="resetDraftFilter">重置</button>
          <button class="qe-confirm" @click="confirmFilter">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'QueryExpress',
  data() {
    return {
      activeTab: 'send',
      keyword: '',
      showFilter: false,
      statusOptions: ['待揽件', '运输中', '派送中', '已送达', '已取消'],
      dateOptions: ['今天', '近3天', '近7天', '近30天'],
      payOptions: ['寄付现结', '到付', '月结'],
      functionOptions: ['删除'],
      filters: {
        status: '',
        dateRange: '',
        payType: '',
        functionType: ''
      },
      draftFilters: {
        status: '',
        dateRange: '',
        payType: '',
        functionType: ''
      },
      allOrders: [
        {
          no: 'JDX053545955754',
          type: 'send',
          brand: '京东标快',
          fromCity: '北京市',
          fromName: '侯梦涛',
          toCity: '天津市',
          toName: '宋凡亮',
          status: '待揽件',
          desc: '您已下单成功，请备好货物待小哥上门取件',
          timeLabel: '预约上门时间',
          time: '2026-05-08 15:00',
          payType: '寄付现结',
          dayOffset: 0
        },
        {
          no: 'JDVA42927383066',
          type: 'send',
          brand: '京东标快',
          fromCity: '石家庄市',
          fromName: '李雪然',
          toCity: '宁波市',
          toName: '乐****',
          status: '已送达',
          desc: '您的快件已送达【仓库签收】',
          timeLabel: '送达时间',
          time: '2026-04-01 11:13',
          payType: '月结',
          dayOffset: 40
        },
        {
          no: 'JDVA43851250194',
          type: 'recv',
          brand: '生鲜标快',
          fromCity: '石家庄市',
          fromName: '生鲜产地仓',
          toCity: '北京市',
          toName: '侯梦涛',
          status: '运输中',
          desc: '您的快件到达【石家庄辛集卫庄场小站】，准备中转',
          timeLabel: '预计送达时间',
          time: '2026-05-09 21:00',
          payType: '到付',
          dayOffset: 1
        },
        {
          no: 'JDVA43847040371',
          type: 'recv',
          brand: '京东标快',
          fromCity: '天津市',
          fromName: 'New Bala...',
          toCity: '北京市',
          toName: '侯梦涛',
          status: '待揽件',
          desc: '寄件人已下单成功，待揽收后运输',
          timeLabel: '下单时间',
          time: '2026-05-08 00:27',
          payType: '寄付现结',
          dayOffset: 0
        }
      ]
    }
  },
  computed: {
    sendCount() {
      return this.allOrders.filter((x) => x.type === 'send').length
    },
    recvCount() {
      return this.allOrders.filter((x) => x.type === 'recv').length
    },
    hasActiveFilter() {
      return !!(this.filters.status || this.filters.dateRange || this.filters.payType || this.filters.functionType)
    },
    filteredList() {
      let list = this.allOrders.filter((x) => x.type === this.activeTab)
      if (this.keyword) {
        const key = this.keyword.toLowerCase()
        list = list.filter((x) => `${x.no}${x.fromName}${x.toName}`.toLowerCase().includes(key))
      }
      if (this.filters.status) {
        list = list.filter((x) => x.status === this.filters.status)
      }
      if (this.filters.payType) {
        list = list.filter((x) => x.payType === this.filters.payType)
      }
      if (this.filters.functionType === '删除') {
        list = list.filter((x) => x.status !== '已送达')
      }
      if (this.filters.dateRange) {
        const map = { 今天: 0, 近3天: 3, 近7天: 7, 近30天: 30 }
        const max = map[this.filters.dateRange]
        list = list.filter((x) => x.dayOffset <= max)
      }
      return list
    }
  },
  methods: {
    openFilter() {
      this.draftFilters = { ...this.filters }
      this.showFilter = true
    },
    copyNo(no) {
      uni.setClipboardData({ data: no })
    },
    shareItem(item) {
      uni.setClipboardData({ data: `${item.brand} ${item.no} ${item.status}` })
    },
    resetFilter() {
      this.filters = { status: '', dateRange: '', payType: '', functionType: '' }
    },
    resetDraftFilter() {
      this.draftFilters = { status: '', dateRange: '', payType: '', functionType: '' }
    },
    clearFilterAndRefresh() {
      this.resetFilter()
      uni.showToast({ title: '已清空筛选', icon: 'none' })
    },
    confirmFilter() {
      this.filters = { ...this.draftFilters }
      this.showFilter = false
      uni.showToast({ title: '筛选已应用', icon: 'none' })
    }
  }
}
</script>

<style>
.qe-page { min-height: 100vh; background: #f6f7f9; padding: 18rpx 20rpx 0; box-sizing: border-box; }
.qe-top { display: flex; align-items: center; }
.qe-search-box { flex: 1; display: flex; align-items: center; background: #fff; border-radius: 999rpx; padding: 0 18rpx; height: 72rpx; }
.qe-search-icon { font-size: 26rpx; margin-right: 8rpx; }
.qe-search-input { flex: 1; font-size: 28rpx; }
.qe-filter-btn { margin-left: 14rpx; font-size: 32rpx; color: #ff3b30; }
.qe-tabs { display: flex; margin-top: 14rpx; background: #fff; border-radius: 12rpx; }
.qe-tab { flex: 1; text-align: center; font-size: 38rpx; color: #2d3340; padding: 18rpx 0; position: relative; }
.qe-tab.active { color: #ff3b30; font-weight: 700; }
.qe-tab.active::after { content: ''; width: 72rpx; height: 6rpx; border-radius: 6rpx; background: #ff3b30; position: absolute; left: 50%; bottom: 8rpx; margin-left: -36rpx; }
.qe-tab-count { color: #4d5565; }
.qe-tab-count.active { color: #ff3b30; }
.qe-banner { margin-top: 12rpx; border-radius: 999rpx; background: #fff4ea; color: #ff3b30; padding: 10rpx 18rpx; display: flex; justify-content: space-between; font-size: 28rpx; }
.qe-banner-btn { background: #ff3b30; color: #fff; border-radius: 999rpx; padding: 0 14rpx; }
.qe-list { height: calc(100vh - 280rpx); margin-top: 12rpx; }
.qe-empty-wrap { min-height: calc(100vh - 280rpx); margin-top: 12rpx; text-align: center; position: relative; }
.qe-empty-icon { margin-top: 180rpx; font-size: 120rpx; }
.qe-empty-title { margin-top: 20rpx; font-size: 36rpx; color: #7d8697; }
.qe-empty-btn { margin-top: 24rpx; width: 220rpx; height: 68rpx; line-height: 68rpx; border-radius: 999rpx; background: #ff3b30; color: #fff; font-size: 34rpx; border: none; }
.qe-empty-tip { margin-top: 260rpx; padding: 0 50rpx; font-size: 28rpx; line-height: 1.5; color: #b0b6c2; }
.qe-tip-link { color: #ff3b30; }
.qe-service-float { position: fixed; right: 12rpx; bottom: 220rpx; width: 92rpx; height: 92rpx; border-radius: 50%; background: #fff; box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.15); font-size: 24rpx; color: #2f3745; display: flex; align-items: center; justify-content: center; text-align: center; }
.qe-card { background: #fff; border-radius: 18rpx; padding: 18rpx; margin-bottom: 14rpx; }
.qe-card-head { display: flex; align-items: center; }
.qe-brand { color: #f59f00; font-size: 24rpx; background: #fff7e6; border-radius: 8rpx; padding: 2rpx 8rpx; }
.qe-no { margin-left: 12rpx; font-size: 32rpx; color: #2b3240; }
.qe-route { margin-top: 14rpx; display: flex; align-items: center; justify-content: space-between; }
.qe-city { width: 32%; }
.qe-city.right { text-align: right; }
.qe-city-name { font-size: 52rpx; color: #1f2430; font-weight: 700; }
.qe-user { font-size: 30rpx; color: #707887; margin-top: 4rpx; }
.qe-status { font-size: 42rpx; color: #2f3a4d; font-weight: 700; }
.qe-desc { margin-top: 10rpx; font-size: 30rpx; color: #2f3a4d; }
.qe-time { margin-top: 4rpx; font-size: 30rpx; color: #8891a2; }
.qe-actions { margin-top: 14rpx; border-top: 1rpx solid #eff2f6; padding-top: 12rpx; display: flex; justify-content: flex-end; }
.qe-action { font-size: 30rpx; color: #687083; margin-left: 20rpx; }
.qe-bottom-space { height: 120rpx; }
.qe-mask { position: fixed; left: 0; right: 0; top: 0; bottom: 0; background: rgba(0, 0, 0, 0.45); display: flex; align-items: flex-end; z-index: 20; }
.qe-panel { width: 100%; background: #fff; border-radius: 24rpx 24rpx 0 0; padding: 20rpx; box-sizing: border-box; }
.qe-panel-top { align-self: flex-start; border-radius: 0 0 24rpx 24rpx; padding-top: 10rpx; }
.qe-panel-head { display: flex; justify-content: space-between; font-size: 42rpx; color: #1f2430; font-weight: 700; }
.qe-panel-space { width: 48rpx; }
.qe-close { color: #b7becb; }
.qe-sec-title { margin-top: 16rpx; font-size: 34rpx; color: #1f2430; font-weight: 700; }
.qe-tags { display: flex; flex-wrap: wrap; margin-top: 8rpx; }
.qe-tag { background: #f5f7fa; color: #5f6778; border-radius: 999rpx; font-size: 32rpx; padding: 10rpx 24rpx; margin-right: 12rpx; margin-bottom: 10rpx; }
.qe-tag.active { color: #ff3b30; background: #fff1f0; border: 1rpx solid #ff3b30; }
.qe-foot { display: flex; margin-top: 12rpx; }
.qe-reset,.qe-confirm { flex: 1; border-radius: 999rpx; font-size: 36rpx; height: 84rpx; line-height: 84rpx; }
.qe-reset { margin-right: 14rpx; color: #2f3745; background: #fff; border: 1rpx solid #dfe3ea; }
.qe-confirm { color: #fff; background: #ff3b30; border: none; }
</style>
