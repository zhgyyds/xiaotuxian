<template>
  <!-- 装载是内容 -->
  <div class="xtx-tabs-panel" v-show="name === activeName">
    <slot />
  </div>
</template>
<script>
import { inject } from 'vue'
export default {
  name: 'XtxTabsPanel',
  props: {
    // 标签页标题文章
    label: {
      type: String,
      default: ''
    },
    // 唯一标识
    name: {
      type: String,
      default: ''
    }
  },
  setup () {
    const activeName = inject('activeName')
    return { activeName }
  }
}
</script>

<style></style>
