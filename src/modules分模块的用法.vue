<template>
  <div>
    <p>{{ $store.state.moduleA.username }}</p>
    <p>{{ $store.getters.newName }}</p>

    <p>{{ $store.state.moduleB.username }}</p>
    <p>{{ $store.getters["moduleB/newName"] }}</p>
    <button @click="mutationFn">mutattionsFn</button>
    <button @click="actionFn">actionFn</button>
  </div>
</template>

<script>
import { useStore } from 'vuex'
export default {
  name: 'App',
  setup () {
    const store = useStore()
    const mutationFn = () => {
      store.commit('moduleB/updateName')
    }
    const actionFn = () => {
      store.dispatch('moduleB/updateName')
    }
    return { mutationFn, actionFn }
  }
}
</script>

<style></style>
