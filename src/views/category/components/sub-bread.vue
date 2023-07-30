<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>

    <XtxBreadItem
      v-if="category.top"
      :to="`/category/${category.top.id}`"
      :key="category.top.id"
      >{{ category.top.name }}</XtxBreadItem
    >
    <transition name="fade-right" mode="out-in">
      <XtxBreadItem v-if="category.sub" :key="category.sub.id">{{
        category.sub.name
      }}</XtxBreadItem></transition
    >
  </XtxBread>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'subBread',
  setup () {
    const route = useRoute()
    const store = useStore()
    const category = computed(() => {
      const cate = {}
      store.state.category.list.forEach((top) => {
        if (top.children) {
          const sub = top.children.find((sub) => sub.id === route.params.id)
          if (sub) {
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })

      return cate
    })
    return { category }
  }
}
</script>

<style></style>
