<template>
  <view class="ec-page">
    <view class="ec-tip">根据国家法规要求，寄件人姓名需与实名认证信息一致</view>
    <view class="ec-recognize">
      <input
        v-model.trim="pasteText"
        class="ec-recognize-input"
        placeholder="请粘贴输入文本，点击“粘贴识别”自动识别姓名、电话和地址"
      />
      <view class="ec-recognize-actions">
        <view class="ec-rec-btn" @click="pasteAndRecognize">粘贴识别</view>
      </view>
    </view>

    <view class="ec-card">
      <view class="ec-tabs">
        <view class="ec-tab active">地图选址</view>
        <view class="ec-tab">地区选址</view>
      </view>

      <view class="ec-group">
        <input v-model.trim="form.name" class="ec-input" placeholder="真实姓名" maxlength="20" />
        <input v-model.trim="form.phone" class="ec-input" placeholder="手机/座机" maxlength="11" type="number" />
      </view>
      <input v-model.trim="form.province" class="ec-input single" placeholder="省/市" maxlength="20" />
      <input v-model.trim="form.city" class="ec-input single" placeholder="区/县" maxlength="20" />
      <textarea v-model.trim="form.detail" class="ec-textarea" placeholder="请完善门牌号，例如3单元201室" maxlength="80" />
      <input v-model.trim="form.company" class="ec-input single" placeholder="公司名称（选填）" maxlength="30" />

      <view class="ec-tags">
        <view
          v-for="item in tagOptions"
          :key="item"
          class="ec-tag"
          :class="{ active: form.tag === item }"
          @click="form.tag = item"
        >
          {{ item }}
        </view>
      </view>

      <view class="ec-default-row" @click="form.isDefault = !form.isDefault">
        <view class="ec-left">
          <view class="ec-check" :class="{ checked: form.isDefault }">{{ form.isDefault ? '✓' : '' }}</view>
          <text class="ec-default-text">默认寄件地址</text>
        </view>
        <text class="ec-clear" @click.stop="clearForm">清空</text>
      </view>
    </view>

    <view class="ec-footer">
      <button class="ec-confirm" @click="save">确定</button>
    </view>
  </view>
</template>

<script>
const STORAGE_KEY = 'mine_address_book'

export default {
  name: 'EditContact',
  data() {
    return {
      id: null,
      tagOptions: ['家', '公司', '学校', '其他'],
      form: {
        name: '',
        phone: '',
        province: '',
        city: '',
        detail: '',
        company: '',
        tag: '家',
        isDefault: false
      },
      pasteText: ''
    }
  },
  onLoad(options) {
    if (options && options.id) {
      this.id = Number(options.id)
      const list = uni.getStorageSync(STORAGE_KEY) || []
      const found = list.find((x) => x.id === this.id)
      if (found) this.form = { ...found }
    }
  },
  methods: {
    clearForm() {
      this.form = {
        name: '',
        phone: '',
        province: '',
        city: '',
        detail: '',
        company: '',
        tag: '家',
        isDefault: false
      }
    },
    pasteAndRecognize() {
      uni.getClipboardData({
        success: (res) => {
          const raw = (res.data || '').trim()
          if (!raw) {
            uni.showToast({ title: '剪贴板为空', icon: 'none' })
            return
          }
          this.pasteText = raw
          this.recognizeText(raw)
        }
      })
    },
    recognizeText(text) {
      const normalized = (text || '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
      const phoneMatch = normalized.match(/1[3-9]\d{9}/)
      if (phoneMatch) this.form.phone = phoneMatch[0]

      let name = ''
      if (phoneMatch) {
        const beforePhone = normalized.slice(0, phoneMatch.index).trim()
        const nameMatch = beforePhone.match(/[\u4e00-\u9fa5·]{2,10}$/)
        if (nameMatch) name = nameMatch[0]
      }
      if (!name) {
        const firstNameMatch = normalized.match(/[\u4e00-\u9fa5·]{2,10}/)
        if (firstNameMatch) name = firstNameMatch[0]
      }
      if (name) this.form.name = name

      let addr = normalized
      if (name) addr = addr.replace(name, '').trim()
      if (this.form.phone) addr = addr.replace(this.form.phone, '').trim()
      addr = addr.replace(/[，,。；;]/g, ' ').replace(/\s+/g, ' ').trim()

      const provinceMatch = addr.match(/(.*?(省|市|自治区|特别行政区))/)
      if (provinceMatch) {
        this.form.province = provinceMatch[1]
        addr = addr.slice(provinceMatch[1].length)
      }
      const cityMatch = addr.match(/(.*?(市|区|县|旗))/)
      if (cityMatch) {
        this.form.city = cityMatch[1]
        addr = addr.slice(cityMatch[1].length)
      }
      if (addr) this.form.detail = addr

      uni.showToast({ title: '识别完成，请核对', icon: 'none' })
    },
    save() {
      if (!this.form.name) return uni.showToast({ title: '请输入姓名', icon: 'none' })
      if (!/^1[3-9]\d{9}$/.test(this.form.phone)) return uni.showToast({ title: '手机号格式不正确', icon: 'none' })
      if (!this.form.province || !this.form.city || !this.form.detail) {
        return uni.showToast({ title: '请填写完整地址信息', icon: 'none' })
      }
      const list = uni.getStorageSync(STORAGE_KEY) || []
      if (this.id) {
        const idx = list.findIndex((x) => x.id === this.id)
        if (idx > -1) list[idx] = { ...list[idx], ...this.form, id: this.id }
      } else {
        list.unshift({ ...this.form, id: Date.now() })
      }
      if (this.form.isDefault) {
        list.forEach((item) => {
          item.isDefault = item.id === (this.id || list[0].id)
        })
      } else if (!list.some((x) => x.isDefault)) {
        list[0].isDefault = true
      }
      uni.setStorageSync(STORAGE_KEY, list)
      uni.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 500)
    }
  }
}
</script>

<style>
.ec-page {
  min-height: 100vh;
  background: #f6f7f9;
}

.ec-tip {
  font-size: 26rpx;
  color: #b47b2d;
  background: #fff6e9;
  padding: 14rpx 20rpx;
}

.ec-recognize {
  background: #fff;
  margin: 12rpx 20rpx 0;
  border-radius: 14rpx;
  padding: 16rpx 18rpx;
}

.ec-recognize-input {
  width: 100%;
  min-height: 66rpx;
  font-size: 28rpx;
  color: #666;
}

.ec-recognize-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8rpx;
}

.ec-rec-btn {
  background: #ff3b30;
  color: #fff;
  font-size: 28rpx;
  border-radius: 999rpx;
  padding: 8rpx 20rpx;
}

.ec-card {
  background: #fff;
  margin: 16rpx 20rpx;
  border-radius: 18rpx;
  padding: 20rpx;
}

.ec-tabs {
  display: flex;
  margin-bottom: 20rpx;
}

.ec-tab {
  flex: 1;
  text-align: center;
  background: #f4f6f9;
  border-radius: 999rpx;
  height: 64rpx;
  line-height: 64rpx;
  color: #9da4b2;
}

.ec-tab.active {
  color: #202632;
  font-weight: 700;
  background: #fff;
  border: 1rpx solid #eceff3;
}

.ec-group {
  display: flex;
}

.ec-input {
  flex: 1;
  height: 78rpx;
  border-bottom: 1rpx solid #edf0f5;
  font-size: 30rpx;
  margin-right: 20rpx;
}

.ec-input:last-child {
  margin-right: 0;
}

.ec-input.single {
  width: 100%;
  margin-right: 0;
}

.ec-textarea {
  width: 100%;
  min-height: 120rpx;
  border-bottom: 1rpx solid #edf0f5;
  padding: 14rpx 0;
  box-sizing: border-box;
  font-size: 30rpx;
}

.ec-tags {
  display: flex;
  margin-top: 18rpx;
}

.ec-tag {
  border: 1rpx solid #e4e8ee;
  border-radius: 999rpx;
  padding: 6rpx 24rpx;
  font-size: 28rpx;
  color: #666;
  margin-right: 14rpx;
}

.ec-tag.active {
  color: #ff3b30;
  border-color: #ff3b30;
  background: #fff1f0;
}

.ec-default-row {
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ec-left {
  display: flex;
  align-items: center;
}

.ec-check {
  width: 34rpx;
  height: 34rpx;
  border: 1rpx solid #d7dce5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #fff;
  font-size: 22rpx;
  margin-right: 12rpx;
}

.ec-check.checked {
  background: #ff3b30;
  border-color: #ff3b30;
}

.ec-default-text,
.ec-clear {
  font-size: 32rpx;
  color: #555d6b;
}

.ec-footer {
  position: fixed;
  left: 20rpx;
  right: 20rpx;
  bottom: 24rpx;
}

.ec-confirm {
  background: #ff3b30;
  color: #fff;
  border-radius: 999rpx;
  font-size: 36rpx;
  height: 88rpx;
  line-height: 88rpx;
}
</style>
