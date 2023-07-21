<template>
  <div>
    app
    <p>{{ $store.state.username }}</p>
    <p>{{ $store.getters.newName }}</p>
    <p>{{ $store.getters["newName"] }}</p>
    <button @click="change">修改</button>
  </div>
</template>

<script>
import { useStore } from 'vuex'
export default {
  name: 'App',
  setup () {
    const store = useStore()
    console.log(store.state.username)
    console.log(store.getters.newName)

    const change = () => {
      // store.commit("updateName");
      store.dispatch('updateName')
    }
    return { change }
  }
}
</script>

<style></style>
