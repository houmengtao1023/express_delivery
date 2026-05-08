# 开发指南

详细的开发文档和常见问题解答。

## 📋 目录

- [项目结构](#项目结构)
- [开发环境](#开发环境)
- [核心文件说明](#核心文件说明)
- [组件开发](#组件开发)
- [状态管理](#状态管理)
- [API 集成](#api-集成)
- [调试技巧](#调试技巧)
- [性能优化](#性能优化)
- [常见问题](#常见问题)

## 项目结构详解

```
express-delivery/
├── pages/                          # 页面目录
│   ├── sendExpress/
│   │   └── sendExpress.vue         # 寄快递 - 三步流程表单
│   ├── queryExpress/
│   │   └── queryExpress.vue        # 查快递 - 搜索和详情
│   └── mine/
│       ├── mine.vue                # 我的 - 用户中心
│       └── userInfo/
│           └── userInfo.vue        # 实名认证 - 表单和照片
├── components/                     # 共享组件
├── static/                         # 静态资源
│   └── images/                     # 图片文件
├── App.vue                         # 根组件 - 底部导航
├── main.js                         # 入口 - Vuex store
├── pages.json                      # 页面配置
├── manifest.json                   # 应用配置
└── package.json                    # 依赖配置
```

## 开发环境

### 必要工具

1. **HBuilderX** (推荐)
   - 下载: https://www.dcloud.io/hbuilderx.html
   - UniApp 官方 IDE，开箱即用

2. **Node.js + npm**
   ```bash
   # 检查版本
   node --version  # >= 12.0
   npm --version   # >= 6.0
   ```

3. **微信开发者工具**
   - 下载: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   - 用于模拟器和真机调试

### 初始化项目

```bash
# 1. 克隆仓库
git clone https://github.com/houmengtao1023/express_delivery.git
cd express_delivery

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 在 HBuilderX 中打开项目
# 菜单: 运行 > 运行到小程序模拟器 > 微信开发者工具
```

## 核心文件说明

### App.vue - 主应用组件

```vue
<template>
  <view class="app-container">
    <!-- 根据 activeTab 显示不同页面 -->
    <sendExpress v-if="activeTab === 'send'" />
    <queryExpress v-if="activeTab === 'query'" />
    <mine v-if="activeTab === 'mine'" />
    
    <!-- 底部菜单导航 -->
    <view class="tab-bar">
      <!-- 三个菜单项 -->
    </view>
  </view>
</template>
```

**功能**:
- 管理底部导航菜单
- 动态切换三个主页面
- 提供全局事件总线

### main.js - 入口文件

```javascript
// Vuex store 配置
const store = {
  state: {
    userInfo: {
      certified: false,
      realName: '',
      idNumber: '',
      phoneNumber: ''
    }
  },
  mutations: {
    setUserInfo(state, info) {
      state.userInfo = Object.assign(state.userInfo, info)
      uni.setStorageSync('userInfo', state.userInfo)
    }
  }
}

// 挂载到 Vue
Vue.prototype.$store = store
```

**功能**:
- 创建 Vuex store（简化版）
- 管理全局用户信息
- 自动本地存储

### pages.json - 页面配置

```json
{
  "pages": [
    {
      "path": "pages/sendExpress/sendExpress",
      "style": {
        "navigationBarTitleText": "寄快递",
        "navigationBarBackgroundColor": "#DD001B"
      }
    }
  ],
  "tabBar": {
    "color": "#999",
    "selectedColor": "#DD001B",
    "list": [
      {
        "pagePath": "pages/sendExpress/sendExpress",
        "text": "寄快递"
      }
    ]
  }
}
```

**功能**:
- 注册所有页面
- 配置导航栏样式
- 定义底部菜单

## 组件开发

### 创建新页面

1. **创建文件结构**
   ```
   pages/
   └── newPage/
       └── newPage.vue
   ```

2. **编写组件**
   ```vue
   <template>
     <view class="container">
       <!-- 页面内容 -->
     </view>
   </template>

   <script>
   export default {
     name: 'NewPage',
     data() {
       return {}
     }
   }
   </script>

   <style scoped>
   .container {
     padding: 20rpx;
   }
   </style>
   ```

3. **在 pages.json 中注册**
   ```json
   {
     "pages": [
       {
         "path": "pages/newPage/newPage",
         "style": {
           "navigationBarTitleText": "新页面"
         }
       }
     ]
   }
   ```

### 页面导航

```javascript
// 跳转到新页面
uni.navigateTo({
  url: '/pages/mine/userInfo/userInfo'
})

// 替换当前页面
uni.redirectTo({
  url: '/pages/home/home'
})

// 返回上一页
uni.navigateBack({
  delta: 1
})
```

### 页面生命周期

```javascript
export default {
  onLoad(options) {
    // 页面加载 - 获取 URL 参数
    console.log(options)
  },
  
  onShow() {
    // 页面显示 - 加载数据
    this.loadData()
  },
  
  onHide() {
    // 页面隐藏
  },
  
  onUnload() {
    // 页面卸载 - 清理资源
  }
}
```

## 状态管理

### 使用 Vuex 存储用户信息

```javascript
// 保存用户认证信息
this.$store.state.userInfo.certified = true
this.$store.state.userInfo.realName = '张三'

// 或使用 mutations
this.$store.commit('setUserInfo', {
  certified: true,
  realName: '张三'
})

// 或使用 actions
this.$store.dispatch('updateUserInfo', {
  certified: true,
  realName: '张三'
})
```

### 本地存储

```javascript
// 保存数据
uni.setStorageSync('key', value)

// 读取数据
const value = uni.getStorageSync('key')

// 删除数据
uni.removeStorageSync('key')

// 清空全部
uni.clearStorageSync()
```

### 在组件中监听状态变化

```javascript
watch: {
  '$store.state.userInfo': {
    handler(newVal) {
      console.log('用户信息已更改:', newVal)
    },
    deep: true
  }
}
```

## API 集成

### 使用 uni.request 进行 API 调用

```javascript
// 基础 GET 请求
uni.request({
  url: 'https://api.example.com/express/query',
  method: 'GET',
  data: {
    trackingNumber: 'JD202605081234'
  },
  success: (res) => {
    console.log('成功:', res.data)
  },
  fail: (err) => {
    uni.showToast({ title: '请求失败', icon: 'none' })
  }
})

// POST 请求 - 提交认证信息
uni.request({
  url: 'https://api.example.com/user/certification',
  method: 'POST',
  header: {
    'Content-Type': 'application/json'
  },
  data: {
    realName: '张三',
    idNumber: '11010520200101001X',
    phoneNumber: '13800138000'
  },
  success: (res) => {
    if (res.data.code === 0) {
      this.$store.commit('setUserInfo', { certified: true })
    }
  }
})
```

### 创建 API 请求封装

```javascript
// utils/api.js
const BASE_URL = 'https://api.example.com'

export function queryExpress(trackingNumber) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/express/query`,
      method: 'GET',
      data: { trackingNumber },
      success: (res) => resolve(res.data),
      fail: (err) => reject(err)
    })
  })
}

// 在组件中使用
import { queryExpress } from '@/utils/api'

queryExpress('JD202605081234')
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

## 调试技巧

### 使用控制台输出

```javascript
// 普通日志
console.log('普通日志:', data)

// 警告
console.warn('警告:', message)

// 错误
console.error('错误:', error)

// 组织日志
console.group('用户信息')
console.log('姓名:', this.userInfo.realName)
console.log('状态:', this.userInfo.certified)
console.groupEnd()
```

### HBuilderX 调试

1. 打开调试窗口: `Ctrl+Shift+D`
2. 查看控制台输出
3. 设置断点（点击行号左侧）
4. 单步执行

### 微信开发者工具调试

1. 打开微信开发者工具
2. 点击 "调试器" 选项卡
3. 查看 Console、Network、Storage 等信息

## 性能优化

### 图片优化

```vue
<template>
  <!-- 使用 image 组件替代 img -->
  <image 
    src="path/to/image.jpg"
    class="image"
    mode="aspectFill"
  />
</template>

<style scoped>
.image {
  width: 200rpx;
  height: 200rpx;
}
</style>
```

### 列表优化

```vue
<!-- 使用 key 提高渲染效率 -->
<view v-for="item in list" :key="item.id" class="item">
  {{ item.name }}
</view>
```

### 防止过度渲染

```javascript
// 使用计算属性而不是在模板中调用方法
computed: {
  filteredList() {
    return this.list.filter(item => item.visible)
  }
}
```

## 常见问题

### Q: 如何处理表单验证？

```javascript
validateForm() {
  const { name, phone, address } = this.formData
  
  if (!name) {
    this.errors.name = '请输入姓名'
    return false
  }
  
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    this.errors.phone = '手机号格式不正确'
    return false
  }
  
  if (!address) {
    this.errors.address = '请输入地址'
    return false
  }
  
  return true
}

// 在提交前调用
submit() {
  if (!this.validateForm()) {
    uni.showToast({ title: '请修正表单错误', icon: 'none' })
    return
  }
  // 继续提交
}
```

### Q: 如何处理异步操作（加载中状态）？

```javascript
async fetchData() {
  this.loading = true
  try {
    const res = await uni.request({
      url: '/api/data',
      method: 'GET'
    })
    this.data = res.data
  } catch (err) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    this.loading = false
  }
}
```

### Q: 如何处理多图上传？

```javascript
uploadPhotos() {
  uni.chooseImage({
    count: 2,  // 最多选择 2 张
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      this.photos = res.tempFilePaths
      // 上传到服务器
      this.uploadToServer()
    }
  })
}

uploadToServer() {
  this.photos.forEach(photo => {
    uni.uploadFile({
      url: 'https://api.example.com/upload',
      filePath: photo,
      name: 'file',
      success: (res) => {
        console.log('上传成功')
      }
    })
  })
}
```

### Q: 如何处理权限请求？

```javascript
requestPermission() {
  uni.authorize({
    scope: 'scope.userLocation',
    success() {
      // 用户允许
      uni.getLocation({
        type: 'wgs84',
        success: (res) => {
          console.log(res)
        }
      })
    },
    fail() {
      // 用户拒绝
      uni.showToast({ title: '需要授予位置权限', icon: 'none' })
    }
  })
}
```

### Q: 如何调试 iOS 和 Android？

```javascript
// 获取平台信息
const info = uni.getSystemInfoSync()
console.log(info.platform)  // 'ios' 或 'android'

// 条件编译
// #ifdef APP-PLUS
  // 仅在 App 平台执行
// #endif

// #ifdef MP-WEIXIN
  // 仅在微信小程序执行
// #endif
```

---

**需要帮助？** 查看 [API.md](./API.md) 或 [官方文档](https://uniapp.dcloud.io/)
