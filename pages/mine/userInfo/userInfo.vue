<template>
  <view class="user-info-container">
    <!-- 页面头部提示 -->
    <view class="header-tip">
      <view class="tip-icon">ℹ️</view>
      <view class="tip-text">实名认证信息仅用于快递寄送，我们保护您的隐私</view>
    </view>

    <!-- 表单区域 -->
    <view class="form-section">
      <!-- 真实姓名 -->
      <view class="form-group">
        <view class="form-label">
          真实姓名
          <text class="required">*</text>
        </view>
        <input 
          v-model="formData.realName" 
          class="form-input" 
          placeholder="请输入真实姓名"
          maxlength="20"
          @blur="validateField('realName')"
        />
        <view v-if="errors.realName" class="error-message">{{ errors.realName }}</view>
      </view>

      <!-- 身份证号码 -->
      <view class="form-group">
        <view class="form-label">
          身份证号码
          <text class="required">*</text>
        </view>
        <input 
          v-model="formData.idNumber" 
          class="form-input" 
          placeholder="请输入18位身份证号码"
          maxlength="18"
          @blur="validateField('idNumber')"
        />
        <view v-if="errors.idNumber" class="error-message">{{ errors.idNumber }}</view>
      </view>

      <!-- 手机号码 -->
      <view class="form-group">
        <view class="form-label">
          手机号码
          <text class="required">*</text>
        </view>
        <view class="phone-input-group">
          <view class="country-code">+86</view>
          <input 
            v-model="formData.phoneNumber" 
            class="form-input phone-input" 
            placeholder="请输入11位手机号码"
            maxlength="11"
            type="number"
            @blur="validateField('phoneNumber')"
          />
        </view>
        <view v-if="errors.phoneNumber" class="error-message">{{ errors.phoneNumber }}</view>
      </view>

      <!-- 身份证照片 -->
      <view class="form-group">
        <view class="form-label">
          身份证照片（正面）
          <text class="required">*</text>
        </view>
        <view class="photo-upload">
          <view v-if="formData.idPhotoFront" class="photo-preview">
            <image :src="formData.idPhotoFront" class="preview-image" />
            <view class="remove-btn" @click="removePhoto('front')">✕</view>
          </view>
          <view v-else class="photo-placeholder" @click="uploadPhoto('front')">
            <view class="upload-icon">📸</view>
            <view class="upload-text">点击上传正面照</view>
          </view>
        </view>
        <view v-if="errors.idPhotoFront" class="error-message">{{ errors.idPhotoFront }}</view>
      </view>

      <!-- 身份证照片反面 -->
      <view class="form-group">
        <view class="form-label">
          身份证照片（反面）
          <text class="required">*</text>
        </view>
        <view class="photo-upload">
          <view v-if="formData.idPhotoBack" class="photo-preview">
            <image :src="formData.idPhotoBack" class="preview-image" />
            <view class="remove-btn" @click="removePhoto('back')">✕</view>
          </view>
          <view v-else class="photo-placeholder" @click="uploadPhoto('back')">
            <view class="upload-icon">📸</view>
            <view class="upload-text">点击上传反面照</view>
          </view>
        </view>
        <view v-if="errors.idPhotoBack" class="error-message">{{ errors.idPhotoBack }}</view>
      </view>

      <!-- 协议勾选 -->
      <view class="agreement-section">
        <view class="checkbox-item">
          <checkbox 
            v-model="formData.agreeProtocol" 
            class="checkbox"
          />
          <view class="agreement-text">
            我已阅读并同意
            <text class="link-text" @click="showAgreement">《实名认证协议》</text>
          </view>
        </view>
        <view v-if="errors.agreeProtocol" class="error-message">{{ errors.agreeProtocol }}</view>
      </view>

      <!-- 提交按钮 -->
      <view class="button-group">
        <button 
          class="btn-submit" 
          @click="submitCertification"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '提交中...' : '提交认证' }}
        </button>
        <button class="btn-cancel" @click="goBack">取消</button>
      </view>
    </view>

    <!-- 协议弹窗 -->
    <view v-if="showAgreementModal" class="modal-overlay" @click="showAgreementModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <view class="modal-title">实名认证协议</view>
          <view class="modal-close" @click="showAgreementModal = false">✕</view>
        </view>
        
        <view class="modal-body">
          <view class="agreement-content">
            <view class="section-title">第一条 总则</view>
            <view class="section-text">
              用户通过实名认证后，获得更完整的快递服务功能。实名认证信息仅用于快递寄送和身份验证。
            </view>

            <view class="section-title">第二条 信息安全</view>
            <view class="section-text">
              我们采用行业领先的安全技术保护您的个人信息，不会向第三方披露您的实名信息，除非获得您的明确授权或法律要求。
            </view>

            <view class="section-title">第三条 用户责任</view>
            <view class="section-text">
              用户保证提交的信息真实、有效。用户对使用本服务过程中的行为承担法律责任。
            </view>

            <view class="section-title">第四条 服务条款</view>
            <view class="section-text">
              本服务的最终解释权归我们所有。我们保留随时修改服务条款的权利。
            </view>
          </view>
        </view>

        <view class="modal-footer">
          <button class="btn-agree" @click="agreeAndClose">我同意</button>
        </view>
      </view>
    </view>

    <!-- 加载提示 -->
    <view v-if="isSubmitting" class="loading-overlay">
      <view class="loading-spinner"></view>
      <view class="loading-text">正在提交...</view>
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
  onLoad() {
    // 如果已经认证，加载现有数据
    const userInfo = this.$store.state.userInfo
    if (userInfo.realName) {
      this.formData = {
        realName: userInfo.realName,
        phoneNumber: userInfo.phoneNumber,
        idNumber: userInfo.idNumber,
        idPhotoFront: '',
        idPhotoBack: '',
        agreeProtocol: true
      }
    }
  },
  methods: {
    validateField(field) {
      const { realName, idNumber, phoneNumber, idPhotoFront, idPhotoBack, agreeProtocol } = this.formData

      switch (field) {
        case 'realName':
          if (!realName) {
            this.errors.realName = '请输入真实姓名'
          } else if (realName.length < 2) {
            this.errors.realName = '姓名至少需要2个字符'
          } else {
            this.errors.realName = ''
          }
          break

        case 'idNumber':
          if (!idNumber) {
            this.errors.idNumber = '请输入身份证号码'
          } else if (idNumber.length !== 18) {
            this.errors.idNumber = '请输入18位身份证号码'
          } else if (!this.validateIDNumber(idNumber)) {
            this.errors.idNumber = '身份证号码格式不正确'
          } else {
            this.errors.idNumber = ''
          }
          break

        case 'phoneNumber':
          if (!phoneNumber) {
            this.errors.phoneNumber = '请输入手机号码'
          } else if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
            this.errors.phoneNumber = '请输入正确的手机号码'
          } else {
            this.errors.phoneNumber = ''
          }
          break

        case 'idPhotoFront':
          if (!idPhotoFront) {
            this.errors.idPhotoFront = '请上传身份证正面照片'
          } else {
            this.errors.idPhotoFront = ''
          }
          break

        case 'idPhotoBack':
          if (!idPhotoBack) {
            this.errors.idPhotoBack = '请上传身份证反面照片'
          } else {
            this.errors.idPhotoBack = ''
          }
          break

        case 'agreeProtocol':
          if (!agreeProtocol) {
            this.errors.agreeProtocol = '请同意协议'
          } else {
            this.errors.agreeProtocol = ''
          }
          break
      }
    },
    validateIDNumber(idNumber) {
      // 简单的身份证号码验证（实际应该使用更复杂的算法）
      if (!/^\d{17}[\dX]$/.test(idNumber)) {
        return false
      }
      return true
    },
    uploadPhoto(side) {
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempPath = res.tempFilePaths[0]
          if (side === 'front') {
            this.formData.idPhotoFront = tempPath
            this.errors.idPhotoFront = ''
          } else {
            this.formData.idPhotoBack = tempPath
            this.errors.idPhotoBack = ''
          }
        },
        fail: (err) => {
          uni.showToast({ title: '上传失败', icon: 'none' })
        }
      })
    },
    removePhoto(side) {
      if (side === 'front') {
        this.formData.idPhotoFront = ''
      } else {
        this.formData.idPhotoBack = ''
      }
    },
    submitCertification() {
      // 验证所有字段
      this.validateField('realName')
      this.validateField('idNumber')
      this.validateField('phoneNumber')
      this.validateField('idPhotoFront')
      this.validateField('idPhotoBack')
      this.validateField('agreeProtocol')

      // 检查是否有错误
      const hasErrors = Object.values(this.errors).some(error => error !== '')
      if (hasErrors) {
        uni.showToast({ title: '请修正表单错误', icon: 'none' })
        return
      }

      // 开始提交
      this.isSubmitting = true
      uni.showLoading({ title: '提交中...' })

      // 模拟上传照片到服务器
      setTimeout(() => {
        // 保存到Vuex store
        this.$store.dispatch('updateUserInfo', {
          realName: this.formData.realName,
          phoneNumber: this.formData.phoneNumber,
          idNumber: this.formData.idNumber,
          certified: true
        })

        uni.hideLoading()
        this.isSubmitting = false

        uni.showToast({
          title: '认证成功！',
          icon: 'success',
          duration: 2000
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }, 2000)
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

<style scoped>
.user-info-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 20rpx;
}

/* 头部提示 */
.header-tip {
  background-color: #e3f2fd;
  margin: 20rpx;
  padding: 16rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  border-left: 4rpx solid #1976d2;
}

.tip-icon {
  font-size: 32rpx;
  flex-shrink: 0;
}

.tip-text {
  font-size: 26rpx;
  color: #1976d2;
  line-height: 1.4;
}

/* 表单区域 */
.form-section {
  background-color: white;
  margin: 0 20rpx;
  border-radius: 8rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.form-group {
  padding: 24rpx 20rpx;
  border-bottom: 1rpx solid #eee;
  position: relative;
}

.form-group:last-of-type {
  border-bottom: none;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.required {
  color: #DD001B;
  margin-left: 4rpx;
}

.form-input {
  width: 100%;
  padding: 14rpx 16rpx;
  border: 1rpx solid #ddd;
  border-radius: 4rpx;
  font-size: 28rpx;
  background-color: #fff;
  color: #333;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #999;
}

.form-input:focus {
  border-color: #DD001B;
  box-shadow: 0 0 0 2rpx rgba(221, 0, 27, 0.1);
}

.phone-input-group {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.country-code {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  min-width: 50rpx;
}

.phone-input {
  flex: 1;
}

.error-message {
  color: #DD001B;
  font-size: 24rpx;
  margin-top: 8rpx;
}

/* 照片上传 */
.photo-upload {
  margin-top: 12rpx;
}

.photo-placeholder {
  border: 2rpx dashed #ddd;
  border-radius: 8rpx;
  padding: 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  transition: all 0.3s;
}

.photo-placeholder:active {
  background-color: #f0f0f0;
  border-color: #DD001B;
}

.upload-icon {
  font-size: 64rpx;
  margin-bottom: 12rpx;
}

.upload-text {
  font-size: 26rpx;
  color: #999;
}

.photo-preview {
  position: relative;
  border-radius: 8rpx;
  overflow: hidden;
  background-color: #f0f0f0;
}

.preview-image {
  width: 100%;
  height: 200rpx;
  object-fit: cover;
  display: block;
}

.remove-btn {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

/* 协议区域 */
.agreement-section {
  padding: 24rpx 20rpx;
  border-bottom: 1rpx solid #eee;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

.agreement-text {
  font-size: 26rpx;
  color: #333;
  line-height: 1.4;
}

.link-text {
  color: #1976d2;
  text-decoration: underline;
}

/* 按钮组 */
.button-group {
  padding: 24rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.btn-submit {
  background-color: #DD001B;
  color: white;
  border: none;
  padding: 18rpx;
  border-radius: 4rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.btn-submit:active {
  background-color: #b30015;
}

.btn-submit[disabled] {
  opacity: 0.6;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #333;
  border: 1rpx solid #ddd;
  padding: 18rpx;
  border-radius: 4rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.btn-cancel:active {
  background-color: #eee;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 100;
}

.modal-content {
  background-color: white;
  width: 100%;
  border-radius: 16rpx 16rpx 0 0;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.modal-close {
  font-size: 32rpx;
  color: #999;
}

.modal-body {
  flex: 1;
  padding: 20rpx;
  overflow-y: auto;
}

.agreement-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.8;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-top: 16rpx;
  margin-bottom: 12rpx;
}

.section-text {
  color: #666;
  margin-bottom: 16rpx;
}

.modal-footer {
  padding: 20rpx;
  border-top: 1rpx solid #eee;
  background-color: #f5f5f5;
}

.btn-agree {
  background-color: #DD001B;
  color: white;
  border: none;
  padding: 16rpx;
  border-radius: 4rpx;
  font-size: 28rpx;
  font-weight: bold;
}

.btn-agree:active {
  background-color: #b30015;
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f0f0f0;
  border-top-color: #DD001B;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 20rpx;
  color: white;
  font-size: 28rpx;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
