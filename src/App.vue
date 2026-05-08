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
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
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
