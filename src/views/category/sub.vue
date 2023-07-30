<template>
  <div>
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 筛选区 -->
      <SubFilter @filter-change="changeFilter" />
      <!--商品面板 -->
      <div class="goods-list">
        <SubSort @sort-change="sortChange" />
        <!-- 列表 -->
        <ul>
          <li v-for="goods in goodList" :key="goods.id">
            <GoodsItem :goods="goods" />
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <XtxInfiniteLoading
          @infinite="getData"
          :loading="loading"
          :finished="finished"
        />
      </div>
    </div>
  </div>
</template>
<script>
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item'
import { ref, watch } from 'vue'
import { findSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'

export default {
  name: 'SubCategory',
  components: {
    SubBread,
    SubFilter,
    GoodsItem,
    SubSort
  },
  setup () {
    const route = useRoute()
    const loading = ref(false)
    const finished = ref(false)
    const goodList = ref([])
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    const getData = () => {
      loading.value = true
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) {
          goodList.value.push(...result.items)
          reqParams.page++
        } else {
          finished.value = true
        }
        loading.value = false
      })
    }
    watch(
      () => route.params.id,
      (newVal) => {
        if (newVal && `/category/sub/${newVal}` === route.path) {
          finished.value = false
          goodList.value = []
          reqParams = {
            page: 1,
            pageSize: 20
          }
        }
      }
    )
    // 1.更改排序组件的筛选数据，重新请求
    const sortChange = (sortParams) => {
      finished.value = false
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodList.value = []
    }

    // 2.更改筛选组件的筛选条件，重新请求
    const changeFilter = (filterParams) => {
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodList.value = []
      finished.value = false
    }
    return { getData, loading, finished, goodList, sortChange, changeFilter }
  }
}
</script>
<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
