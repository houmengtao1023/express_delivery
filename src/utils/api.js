import http from './request'

export const addressApi = {
  list(keyword) {
    return http.get('/address/list', keyword ? { keyword } : undefined)
  },
  detail(id) {
    return http.get(`/address/${id}`)
  },
  save(payload) {
    return http.post('/address', payload)
  },
  setDefault(id) {
    return http.put(`/address/${id}/default`)
  },
  remove(id) {
    return http.del(`/address/${id}`)
  }
}

export const stationApi = {
  list(type) {
    return http.get('/station/list', type ? { type } : undefined)
  },
  nearest(type) {
    return http.get('/station/nearest', { type })
  }
}

export const orderApi = {
  pickupSlots() {
    return http.get('/order/pickup-slots')
  },
  estimate(payload) {
    return http.post('/order/estimate', payload, { silent: true })
  },
  create(payload) {
    return http.post('/order', payload, { showLoading: true })
  },
  list() {
    return http.get('/order/list')
  },
  detail(id) {
    return http.get(`/order/${id}`)
  }
}

export default {
  addressApi,
  stationApi,
  orderApi
}
