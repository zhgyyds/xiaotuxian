<template>
  <div class="order-detail-page" v-if="order">
    <!-- 头部 -->
    <DetailAction :order="order" />
    <!-- 进度 -->
    <!-- 物流 -->
    <Suspense>
      <!-- 组件加载完毕 -->
      <template #default>
        <DetailLogistics
          :order="order"
          v-if="[3, 4, 5].includes(order.orderState)"
        />
      </template>
      <!-- 组件加载中显示 -->

      <template #fallback>
        <div class="loading">loading</div>
      </template>
    </Suspense>
    <!-- 信息 -->
    <OrderInfo :order="order" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { findOrderDetail } from '@/api/order'
import { useRoute } from 'vue-router'
import DetailAction from './components/detail-action'
import DetailLogistics from './component/detail-logistics.vue'
import OrderInfo from './component/detail-info.vue'
export default {
  name: 'OrderDetailPage',
  components: { DetailAction, DetailLogistics, OrderInfo },
  setup () {
    const order = ref(null)
    const route = useRoute()
    findOrderDetail(route.params.id).then((data) => {
      order.value = data.result
    })

    return { order }
  }
}
</script>

<style scoped lang="less">
.order-detail-page {
  background: #fff;
  height: 100%;
}
</style>
