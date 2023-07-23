import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'

export default {
  namespaced: true,
  state () {
    return {
      list: topCategory.map(item => ({ name: item }))
    }
  },
  mutations: {
    setList (state, headCategory) {
      state.list = headCategory
    },
    // 修改当前一级分类下的open数据为true
    show (state, item) {
      const currCategory = state.list.find(category => category.id === item.id)
      currCategory.open = true
    },
    // 修改当前一级分类下的open数据为false
    hide (state, item) {
      const currCategory = state.list.find(category => category.id === item.id)
      currCategory.open = false
    }
  },
  actions: {
    async getList ({ commit }) {
      const data = await findAllCategory()
      data.result.forEach(top => {
        top.open = false
      })
      commit('setList', data.result)
    }
  }
}
