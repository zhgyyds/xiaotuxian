<template>
  <div class="xtx-pagination">
    <a
      @click="changePager(myCurrentPage - 1)"
      href="javascript:;"
      v-if="myCurrentPage > 1"
      >上一页</a
    >
    <a href="javascript:;" class="disabled" v-else>上一页</a>
    <span v-if="pager.start > 1">...</span>
    <a
      href="javascript:;"
      :class="{ active: i === myCurrentPage }"
      v-for="i in pager.btnArr"
      :key="i"
      @click="changePager(i)"
      >{{ i }}</a
    >

    <span v-if="pager.end < pager.pageCount">...</span>
    <a
      href="javascript:;"
      v-if="myCurrentPage < pager.end"
      @click="changePager(myCurrentPage + 1)"
      >下一页</a
    >
    <a href="javascript:;" v-else class="disabled">下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    total: {
      type: Number,
      default: 100
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  setup (props, { emit }) {
    const count = 5
    const myCurrentPage = ref(5)
    const myTotal = ref(100)
    const myPageSize = ref(10)
    const pager = computed(() => {
      const pageCount = Math.ceil(myTotal.value / myPageSize.value)
      const offset = Math.floor(count / 2)
      let start = myCurrentPage.value - offset
      let end = start + count - 1
      if (start < 1) {
        start = 1
        end = start + count - 1 > pageCount ? pageCount : start + count - 1
      }
      if (end > pageCount) {
        end = pageCount
        start = end - count + 1 < 1 ? 1 : end - count + 1
      }
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return { pageCount, btnArr, start, end }
    })
    watch(
      props,
      () => {
        myTotal.value = props.total
        myPageSize.value = props.pageSize
        myCurrentPage.value = props.currentPage
      },
      { immediate: true }
    )
    const changePager = (page) => {
      myCurrentPage.value = page
      //   通知父组件
      emit('current-change', page)
    }
    return { myCurrentPage, pager, changePager }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
