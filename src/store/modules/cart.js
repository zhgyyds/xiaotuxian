import { mergeLocalCart, deleteCart, findCart, getNewCartGoods, insertCart, checkAllCart, updateCart } from '@/api/cart'

export default {
  namespaced: true,
  state () {
    return {
      list: []
    }
  },
  getters: {
    validList (state) {
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    validAmount (state, getters) {
      return getters.validList.reduce((p, c) => p + parseInt(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(goods => goods.stock <= 0 || !goods.isEffective)
    },
    // 已选择商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 已选商品总件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count / 100, 0)
    },
    // 是否全选
    isSelectAll (state, getters) {
      return getters.validTotal > 0 && getters.validTotal === getters.selectedTotal
    }
  },
  mutations: {
    // 加入购物车
    insertCart (state, payload) {
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (sameIndex > -1) {
        const count = state.list[sameIndex].count
        payload.count += count
        // 删除原来
        state.list.splice(sameIndex, 1)
      }
      // 追加新的
      state.list.unshift(payload)
    },
    // 修改购物车商品-----------------
    updateCart (state, goods) {
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== null && goods[key] !== undefined && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 设置购物车
    setCart (state, payload) {
      state.list = payload
    }

  },
  actions: {
    // 加入购物车
    insertCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        // 已登录
        if (ctx.rootState.user.profile.token) {
          insertCart({ skuId: payload.skuId, count: payload.count }).then(() => {
            // 更新列表
            return this.findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 获取商品列表
    findCartList (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          findCart().then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 同时发送请求，等所有请求成功，一并去修改本地数据
          const promiseArr = ctx.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          Promise.all(promiseArr).then(dataList => {
            dataList.forEach((data, i) => {
              ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...data.result })
            })
            resolve()
          })
        }
      })
    },
    deleteCart (ctx, skuId) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          deleteCart([skuId]).then(() => {
            return this.findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          ctx.commit('deleteCart', skuId)
          resolve()
        }
      })
    },
    // 修改购物车商品-----------------
    updateCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          updateCart(payload).then(() => {
            return this.findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          ctx.commit('updateCart', payload)
          resolve()
        }
      })
    },
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          const ids = ctx.getters.validList.map(item => item.skuId)
          checkAllCart({ selected, ids }).then(() => {
            return this.findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          ctx.getters.validList.forEach(item => {
            ctx.commit('updateCart', { skuId: item.skuId, selected })
          })
          resolve()
        }
      })
    },
    batchDeleteCart (ctx, isClear) {
      return new Promise((resolve) => {
        if (ctx.rootState.user.profile.token) {
          const ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(() => {
            return this.findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          ctx.getters[isClear ? 'invalidList' : 'selectedList'].forEach(item => {
            ctx.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },
    updateCartSku (ctx, { oldSkuId, newSku }) {
      return new Promise((resolve) => {
        if (ctx.rootState.user.profile.token) {
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldSkuId]).then(() => {
            return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
          }).then(() => {
            return findCart()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          ctx.commit('deleteCart', oldSkuId)
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // 合并购物车
    async mergeCart (ctx) {
      const cartList = ctx.state.list.map(goods => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count: goods.count
        }
      })
      await mergeLocalCart(cartList)
      // 清空本地购物车
      ctx.commit('setCart', [])
    }
  }
}
