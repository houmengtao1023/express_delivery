<template>
  <view class="cert-page">
    <view class="cert-status">
      <view class="cert-status-tag" :class="{ ok: $store.state.userInfo.certified }">
        {{ $store.state.userInfo.certified ? '已实名' : '待实名' }}
      </view>
      <view class="cert-status-tip">实名信息仅用于寄件身份校验与安全风控</view>
    </view>

    <view class="cert-card">
      <view class="cert-group">
        <view class="cert-label">真实姓名<text class="must">*</text></view>
        <input
          v-model.trim="formData.realName"
          class="cert-input"
          maxlength="20"
          placeholder="请输入与证件一致的姓名"
          @blur="validateField('realName')"
        />
        <view v-if="errors.realName" class="cert-error">{{ errors.realName }}</view>
      </view>

      <view class="cert-group">
        <view class="cert-label">身份证号码<text class="must">*</text></view>
        <input
          v-model.trim="formData.idNumber"
          class="cert-input"
          maxlength="18"
          placeholder="请输入18位身份证号码"
          @input="onIdInput"
          @blur="validateField('idNumber')"
        />
        <view class="cert-extra" v-if="maskedIdNo">证件号：{{ maskedIdNo }}</view>
        <view v-if="errors.idNumber" class="cert-error">{{ errors.idNumber }}</view>
      </view>

      <view class="cert-group">
        <view class="cert-label">手机号码<text class="must">*</text></view>
        <view class="cert-phone">
          <view class="cert-country">+86</view>
          <input
            v-model.trim="formData.phoneNumber"
            class="cert-input cert-phone-input"
            maxlength="11"
            type="number"
            placeholder="请输入11位手机号"
            @blur="validateField('phoneNumber')"
          />
        </view>
        <view v-if="errors.phoneNumber" class="cert-error">{{ errors.phoneNumber }}</view>
      </view>

      <view class="cert-group">
        <view class="cert-label">身份证照片（正面）<text class="must">*</text></view>
        <view class="cert-photo" @click="handlePhotoClick('front')">
          <image v-if="formData.idPhotoFront" :src="formData.idPhotoFront" class="cert-photo-img" mode="aspectFill" />
          <view v-else class="cert-photo-empty">
            <view class="cert-photo-icon">📷</view>
            <view>点击上传人像面</view>
          </view>
          <view v-if="formData.idPhotoFront" class="cert-photo-actions">
            <text class="cert-photo-btn" @click.stop="previewPhoto(formData.idPhotoFront)">预览</text>
            <text class="cert-photo-btn danger" @click.stop="removePhoto('front')">删除</text>
          </view>
        </view>
        <view v-if="errors.idPhotoFront" class="cert-error">{{ errors.idPhotoFront }}</view>
      </view>

      <view class="cert-group no-border">
        <view class="cert-label">身份证照片（反面）<text class="must">*</text></view>
        <view class="cert-photo" @click="handlePhotoClick('back')">
          <image v-if="formData.idPhotoBack" :src="formData.idPhotoBack" class="cert-photo-img" mode="aspectFill" />
          <view v-else class="cert-photo-empty">
            <view class="cert-photo-icon">📷</view>
            <view>点击上传国徽面</view>
          </view>
          <view v-if="formData.idPhotoBack" class="cert-photo-actions">
            <text class="cert-photo-btn" @click.stop="previewPhoto(formData.idPhotoBack)">预览</text>
            <text class="cert-photo-btn danger" @click.stop="removePhoto('back')">删除</text>
          </view>
        </view>
        <view v-if="errors.idPhotoBack" class="cert-error">{{ errors.idPhotoBack }}</view>
      </view>
    </view>

    <view class="cert-agreement">
      <view class="cert-check" :class="{ checked: formData.agreeProtocol }" @click="toggleAgreement">
        <text v-if="formData.agreeProtocol">✓</text>
      </view>
      <view class="cert-agreement-text">
        已阅读并同意
        <text class="cert-link" @click="showAgreement">《实名认证协议》</text>
      </view>
    </view>
    <view v-if="errors.agreeProtocol" class="cert-error agreement-error">{{ errors.agreeProtocol }}</view>

    <view class="cert-actions">
      <button class="cert-submit" :disabled="isSubmitting" @click="submitCertification">
        {{ isSubmitting ? '提交中...' : '提交认证' }}
      </button>
      <button class="cert-cancel" @click="goBack">取消</button>
    </view>

    <view v-if="showAgreementModal" class="cert-modal-mask" @click="showAgreementModal = false">
      <view class="cert-modal" @click.stop>
        <view class="cert-modal-head">
          <view class="cert-modal-title">实名认证协议</view>
          <view class="cert-modal-close" @click="showAgreementModal = false">✕</view>
        </view>
        <view class="cert-modal-body">
          <view class="cert-modal-sub">第一条 总则</view>
          <view>实名认证信息仅用于快递寄件、身份核验与风险控制，不做其他用途。</view>
          <view class="cert-modal-sub">第二条 安全保护</view>
          <view>我们采用加密存储与访问控制机制，严格保护用户隐私数据安全。</view>
          <view class="cert-modal-sub">第三条 责任说明</view>
          <view>用户需保证提交信息真实有效，否则可能影响寄件服务正常使用。</view>
        </view>
        <view class="cert-modal-foot">
          <button class="cert-modal-ok" @click="agreeAndClose">我同意</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'UserInfo',
  data() {
    return {
      formData: {
        realName: '',
        idNumber: '',
        phoneNumber: '',
        idPhotoFront: '',
        idPhotoBack: '',
        agreeProtocol: false
      },
      errors: {
        realName: '',
        idNumber: '',
        phoneNumber: '',
        idPhotoFront: '',
        idPhotoBack: '',
        agreeProtocol: ''
      },
      isSubmitting: false,
      showAgreementModal: false
    }
  },
  computed: {
    maskedIdNo() {
      const id = this.formData.idNumber || ''
      if (id.length < 8) return ''
      return `${id.slice(0, 4)}********${id.slice(-4)}`
    }
  },
  onLoad() {
    const userInfo = this.$store.state.userInfo
    if (userInfo && userInfo.realName) {
      this.formData.realName = userInfo.realName
      this.formData.phoneNumber = userInfo.phoneNumber || ''
      this.formData.idNumber = userInfo.idNumber || ''
      this.formData.agreeProtocol = true
    }
  },
  methods: {
    onIdInput(e) {
      this.formData.idNumber = (e.detail.value || '').toUpperCase().replace(/\s/g, '')
    },
    toggleAgreement() {
      this.formData.agreeProtocol = !this.formData.agreeProtocol
      this.validateField('agreeProtocol')
    },
    validateField(field) {
      const data = this.formData
      if (field === 'realName') {
        if (!data.realName) {
          this.errors.realName = '请输入真实姓名'
        } else if (!/^[\u4e00-\u9fa5A-Za-z·\s]{2,20}$/.test(data.realName)) {
          this.errors.realName = '姓名格式不正确'
        } else {
          this.errors.realName = ''
        }
      }
      if (field === 'idNumber') {
        if (!data.idNumber) {
          this.errors.idNumber = '请输入身份证号码'
        } else if (!this.validateIDNumber(data.idNumber)) {
          this.errors.idNumber = '身份证号码格式不正确'
        } else {
          this.errors.idNumber = ''
        }
      }
      if (field === 'phoneNumber') {
        if (!data.phoneNumber) {
          this.errors.phoneNumber = '请输入手机号码'
        } else if (!/^1[3-9]\d{9}$/.test(data.phoneNumber)) {
          this.errors.phoneNumber = '请输入正确的手机号码'
        } else {
          this.errors.phoneNumber = ''
        }
      }
      if (field === 'idPhotoFront') {
        this.errors.idPhotoFront = data.idPhotoFront ? '' : '请上传身份证正面照片'
      }
      if (field === 'idPhotoBack') {
        this.errors.idPhotoBack = data.idPhotoBack ? '' : '请上传身份证反面照片'
      }
      if (field === 'agreeProtocol') {
        this.errors.agreeProtocol = data.agreeProtocol ? '' : '请先勾选协议'
      }
    },
    validateIDNumber(id) {
      if (!/^\d{17}[\dX]$/.test(id)) return false
      const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      const parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
      let sum = 0
      for (let i = 0; i < 17; i += 1) {
        sum += Number(id[i]) * factors[i]
      }
      return parity[sum % 11] === id[17]
    },
    handlePhotoClick(side) {
      if ((side === 'front' && this.formData.idPhotoFront) || (side === 'back' && this.formData.idPhotoBack)) return
      uni.showActionSheet({
        itemList: ['拍照上传', '从相册选择'],
        success: (res) => {
          const sourceType = res.tapIndex === 0 ? ['camera'] : ['album']
          this.uploadPhoto(side, sourceType)
        }
      })
    },
    uploadPhoto(side, sourceType) {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType,
        success: (res) => {
          const path = res.tempFilePaths[0]
          if (side === 'front') {
            this.formData.idPhotoFront = path
            this.errors.idPhotoFront = ''
          } else {
            this.formData.idPhotoBack = path
            this.errors.idPhotoBack = ''
          }
        }
      })
    },
    previewPhoto(path) {
      uni.previewImage({
        urls: [path],
        current: path
      })
    },
    removePhoto(side) {
      if (side === 'front') {
        this.formData.idPhotoFront = ''
        this.validateField('idPhotoFront')
      } else {
        this.formData.idPhotoBack = ''
        this.validateField('idPhotoBack')
      }
    },
    submitCertification() {
      this.validateField('realName')
      this.validateField('idNumber')
      this.validateField('phoneNumber')
      this.validateField('idPhotoFront')
      this.validateField('idPhotoBack')
      this.validateField('agreeProtocol')

      const hasError = Object.values(this.errors).some((v) => !!v)
      if (hasError) {
        uni.showToast({ title: '请完善必填信息', icon: 'none' })
        return
      }
      this.isSubmitting = true
      uni.showLoading({ title: '提交中...' })

      setTimeout(() => {
        this.$store.dispatch('updateUserInfo', {
          realName: this.formData.realName,
          phoneNumber: this.formData.phoneNumber,
          idNumber: this.formData.idNumber,
          certified: true
        })
        uni.hideLoading()
        this.isSubmitting = false
        uni.showToast({ title: '认证成功', icon: 'success' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1200)
      }, 1200)
    },
    showAgreement() {
      this.showAgreementModal = true
    },
    agreeAndClose() {
      this.formData.agreeProtocol = true
      this.errors.agreeProtocol = ''
      this.showAgreementModal = false
    },
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style>
.cert-page {
  min-height: 100vh;
  background: #f6f7f9;
  padding: 20rpx;
  box-sizing: border-box;
}

.cert-status {
  background: #eef7ff;
  border: 1rpx solid #d3e8ff;
  border-radius: 12rpx;
  padding: 18rpx 20rpx;
  margin-bottom: 16rpx;
}

.cert-status-tag {
  display: inline-block;
  font-size: 22rpx;
  color: #e1251b;
  background: #fff2f1;
  border: 1rpx solid #ffd2cf;
  border-radius: 999rpx;
  padding: 4rpx 14rpx;
}

.cert-status-tag.ok {
  color: #389e0d;
  background: #f6ffed;
  border-color: #d9f7be;
}

.cert-status-tip {
  font-size: 24rpx;
  color: #5b7ea6;
  margin-top: 10rpx;
}

.cert-card {
  background: #fff;
  border-radius: 14rpx;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.cert-group {
  border-bottom: 1rpx solid #f1f1f1;
  padding: 22rpx 20rpx;
}

.cert-group.no-border {
  border-bottom: none;
}

.cert-label {
  font-size: 28rpx;
  color: #222;
  font-weight: 600;
  margin-bottom: 10rpx;
}

.must {
  color: #e1251b;
  margin-left: 4rpx;
}

.cert-input {
  width: 100%;
  height: 76rpx;
  box-sizing: border-box;
  border: 1rpx solid #dedede;
  border-radius: 10rpx;
  background: #fafafa;
  padding: 0 16rpx;
  font-size: 28rpx;
  color: #333;
}

.cert-extra {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #9b9b9b;
}

.cert-phone {
  display: flex;
  align-items: center;
}

.cert-country {
  width: 92rpx;
  height: 76rpx;
  line-height: 76rpx;
  text-align: center;
  border: 1rpx solid #dedede;
  border-right: none;
  border-radius: 10rpx 0 0 10rpx;
  background: #fafafa;
  font-size: 28rpx;
}

.cert-phone-input {
  border-radius: 0 10rpx 10rpx 0;
}

.cert-photo {
  border: 2rpx dashed #e2e2e2;
  border-radius: 12rpx;
  background: #fbfbfb;
  overflow: hidden;
}

.cert-photo-empty {
  min-height: 220rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 26rpx;
}

.cert-photo-icon {
  font-size: 58rpx;
  margin-bottom: 8rpx;
}

.cert-photo-img {
  width: 100%;
  height: 220rpx;
}

.cert-photo-actions {
  display: flex;
  justify-content: flex-end;
  padding: 12rpx 14rpx;
  background: #fff;
}

.cert-photo-btn {
  font-size: 24rpx;
  color: #4d7dbd;
  margin-left: 24rpx;
}

.cert-photo-btn.danger {
  color: #e1251b;
}

.cert-agreement {
  display: flex;
  align-items: center;
  margin: 22rpx 6rpx 0;
}

.cert-check {
  width: 34rpx;
  height: 34rpx;
  border: 1rpx solid #d6d6d6;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 22rpx;
  margin-right: 12rpx;
}

.cert-check.checked {
  background: #e1251b;
  border-color: #e1251b;
}

.cert-agreement-text {
  font-size: 24rpx;
  color: #666;
}

.cert-link {
  color: #2b6cb0;
  text-decoration: underline;
}

.agreement-error {
  margin-left: 8rpx;
}

.cert-error {
  margin-top: 8rpx;
  color: #e1251b;
  font-size: 23rpx;
}

.cert-actions {
  margin-top: 20rpx;
}

.cert-submit,
.cert-cancel {
  border-radius: 10rpx;
  font-size: 30rpx;
}

.cert-submit {
  background: #e1251b;
  color: #fff;
}

.cert-submit[disabled] {
  opacity: 0.7;
}

.cert-cancel {
  margin-top: 12rpx;
  color: #666;
  background: #fff;
  border: 1rpx solid #e5e5e5;
}

.cert-modal-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: flex-end;
  z-index: 100;
}

.cert-modal {
  width: 100%;
  background: #fff;
  border-radius: 18rpx 18rpx 0 0;
  max-height: 78vh;
  overflow: hidden;
}

.cert-modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.cert-modal-title {
  font-size: 32rpx;
  font-weight: 700;
}

.cert-modal-close {
  font-size: 30rpx;
  color: #999;
}

.cert-modal-body {
  padding: 20rpx;
  font-size: 26rpx;
  color: #666;
  line-height: 1.8;
  max-height: 50vh;
  overflow-y: auto;
}

.cert-modal-sub {
  margin-top: 12rpx;
  margin-bottom: 8rpx;
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

.cert-modal-foot {
  padding: 16rpx 20rpx 24rpx;
}

.cert-modal-ok {
  background: #e1251b;
  color: #fff;
  border-radius: 10rpx;
  font-size: 28rpx;
}
</style>
