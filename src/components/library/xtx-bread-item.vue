<template>
  <RouterLink v-if="to" :to="to"><slot /></RouterLink>
  <span v-else><slot /></span>
</template>
<script>
export default {
  name: 'XtxBreadItem',
  props: {
    to: {
      type: [String, Object],
      default: ''
    }
  }
}
</script>
