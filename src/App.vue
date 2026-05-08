<script>
export default {
  onLaunch() {
    try {
      const saved = uni.getStorageSync('userInfo')
      if (saved && typeof saved === 'object') {
        this.$store.commit('SET_USER_INFO', saved)
      }
    } catch (e) {
      // ignore
    }
  }
}
</script>

<style>
/**
 * 全局设计令牌：与 pages.json 导航栏 / tabBar 主色 #E1251B 对齐，各页样式请使用 var(--*) 引用。
 */
page {
  /* 品牌色 */
  --color-primary: #e1251b;
  --color-primary-dark: #c41e17;
  --color-primary-soft: #fff2f0;
  --color-primary-muted: rgba(225, 37, 27, 0.12);

  /* 页面与表面 */
  --bg-page: #f6f7f9;
  --bg-card: #ffffff;
  --bg-muted: #f1f3f7;
  --bg-elevated: #f7f8fa;
  --bg-input: #fafafa;
  --bg-wash: #f4f6f9;

  /* 文字 */
  --text-title: #1f2430;
  --text-body: #333333;
  --text-secondary: #666666;
  --text-tertiary: #8c94a2;
  --text-hint: #9aa1af;
  --text-disabled: #b0b6c2;
  --text-on-primary: #ffffff;

  /* 描边 */
  --border-hairline: #f0f2f5;
  --border-light: #eff2f6;
  --border-default: #e4e8ee;
  --border-strong: #dfe3ea;
  --border-input: #dedede;

  /* 语义 */
  --color-success: #52c41a;
  --color-success-soft: #f6ffed;
  --color-success-border: #d9f7be;
  --color-warning: #faad14;
  --color-warning-soft: #fff7e6;
  --color-warning-text: #b47b2d;
  --color-warning-bg: #fff6e9;
  --color-info-soft: #eef7ff;
  --color-info-border: #d3e8ff;
  --color-info-text: #5b7ea6;
  --color-link: #2b6cb0;
  --color-link-muted: #4d7dbd;

  /* 遮罩与阴影 */
  --mask-scrim: rgba(0, 0, 0, 0.45);
  --shadow-card: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
  --shadow-footer: 0 -6rpx 18rpx rgba(0, 0, 0, 0.06);
  --shadow-float: 0 6rpx 16rpx rgba(0, 0, 0, 0.15);

  /* 布局（rpx，供组件内一致引用） */
  --page-pad-x: 24rpx;
  --page-pad-y: 18rpx;
  --radius-card: 16rpx;
  --radius-card-sm: 14rpx;
  --radius-pill: 999rpx;

  background-color: var(--bg-page);
  color: var(--text-title);
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

button::after {
  border: none;
}

/* uni-app 预加载阴影的 page::after 在部分基础库下会引发整页异常，直接关闭 */
page::after {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
  content: none !important;
  animation: none !important;
  -webkit-animation: none !important;
}
</style>
