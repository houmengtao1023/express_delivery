import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function readStoredUser() {
  try {
    const raw = uni.getStorageSync('userInfo')
    return raw && typeof raw === 'object' ? raw : {}
  } catch (e) {
    return {}
  }
}

const store = new Vuex.Store({
  state: {
    userInfo: {
      certified: false,
      realName: '',
      idNumber: '',
      phoneNumber: '',
      ...readStoredUser()
    }
  },
  mutations: {
    SET_USER_INFO(state, payload) {
      state.userInfo = { ...state.userInfo, ...payload }
      try {
        uni.setStorageSync('userInfo', { ...state.userInfo })
      } catch (e) {
        // ignore
      }
    }
  },
  actions: {
    updateUserInfo({ commit }, payload) {
      commit('SET_USER_INFO', payload)
    }
  }
})

export default store
