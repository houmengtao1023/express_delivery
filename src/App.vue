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
</style>
