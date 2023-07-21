import { createStore } from 'vuex'

// export default createStore({
//     state: {
//         username: 'zs'
//     },
//     getters: {
//         newName(state) {
//             return state.username + '!!!'

//         }
//     },
//     mutations: {
//         updateName(state) {
//             state.username = 'Is'
//         }
//     },
//     actions: {
//         updateName(ctx) {
//             setTimeout(() => {
//                 ctx.commit('updateName')
//             }, 1000)
//         }
//     },
//     modules: {}
// })

// const moduleA = {
//   state: {
//     username: 'moduleA'
//   },
//   getters: {
//     newName (state) {
//       return state.username + '!!!'
//     }
//   },
//   mutations: {
//     updateName (state) {
//       state.updateName = 'moduleAAA'
//     }
//   },
//   actions: {
//     updateName (ctx) {
//       setTimeout(() => {
//         ctx.commit('updateName')
//       }, 1000)
//     }
//   }

// }

// const moduleB = {
//   namespaced: true,
//   state: {
//     username: 'moduleB'
//   },
//   getters: {
//     newName (state) {
//       return state.username + '!!!'
//     }
//   },
//   mutations: {
//     updateName (state) {
//       state.username = 'Is'
//     }
//   },
//   actions: {
//     updateName (ctx) {
//       setTimeout(() => {
//         ctx.commit('updateName')
//       }, 1000)
//     }
//   }
// }

import cart from './modules/cart'
import user from './modules/user'
import category from './modules/category'
import createPersistedstate from 'vuex-persistedstate'
export default createStore({
  modules: {
    user,
    cart,
    category
  },
  plugins: [
    createPersistedstate({
      key: 'erabbit-client-pc-store',
      paths: ['user', 'cart']
    })
  ]
})
