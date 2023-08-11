<template>
  <div class="member-order">
    <!-- 体验jsx语法 -->
    <!-- tab组件 -->-----------------------------
    <XtxTabs v-model="activeName" @tab-click="tabClick">
      <xtx-tabs-panel label="选项卡0" name="first"> 内容0</xtx-tabs-panel>
      <xtx-tabs-panel
        v-for="item in orderStatus"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </xtx-tabs-panel>
    </XtxTabs>
    <!-- 订单列表 -->-------------------------------------
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem
        v-for="item in orderList"
        :key="item.id"
        :order="item"
        @on-cancel="handerCancel"
        @on-delete="handerDelete"
        @on-confirm="handerConfirm"
        @on-logistics="handerLogistics"
      />
    </div>
    <!-- 分页组件 -->-----------------------------
    <xtx-pagination
      v-if="total > 0"
      :current-page="requestParams.page"
      :page-size="requestParams.pageSize"
      :total="total"
      @current-change="requestParams.page = $event"
    />
    <!-- 取消订单组件 -->
    <OrderCancel ref="orderCancelCom" />
    <!-- 查看物流组件 -->
    <OrderLogistics ref="orderLogisticsCom" />
  </div>
</template>

<script>
import xtxTabsPanel from '@/components/library/xtx-tabs-panel.vue'
import { orderStatus } from '@/api/constants'
import { reactive, ref, watch } from 'vue'
import XtxPagination from '@/components/library/xtx-pagination.vue'
import OrderItem from './components/order-item'
import { confirmOrder, delteOrder, findOrderList } from '@/api/order'
import Confirm from '@/components/library/Confirm'
import OrderCancel from './component/order-cancel.vue'
import Message from '@/components/library/Message'
import OrderLogistics from './components/order-logistics'

export default {
  components: {
    xtxTabsPanel,
    XtxPagination,
    OrderItem,
    OrderCancel,
    OrderLogistics
  },
  name: 'MemberOrder',
  setup () {
    const activeName = ref('all')

    // 查询订单参数
    const requestParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    // 订单列表
    const orderList = ref([])
    // 查询订单,筛选条件发生变化，从新加载。
    const getOrderList = () => {
      loading.value = true
      findOrderList(requestParams).then((data) => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      })
    }
    watch(
      requestParams,
      () => {
        getOrderList()
      },
      { immediate: true }
    )

    const tabClick = ({ index }) => {
      requestParams.page = 1
      requestParams.orderState = index
    }
    const loading = ref(false)
    const total = ref(0)
    // 删除订单
    const handerDelete = (order) => {
      Confirm({ text: '亲，您确认删除该订单嘛?' })
        .then(() => {
          delteOrder(order.id).then(() => {
            Message({ text: '删除订单成功', type: 'success' })
            getOrderList()
          })
        })
        .catch((e) => {})
    }

    return {
      activeName,
      orderStatus,
      orderList,
      tabClick,
      loading,
      total,
      requestParams,
      ...useCancel(),
      handerDelete,
      ...useConfirm(),
      ...useLogistics()
    }
  }
}

// 取消订单逻辑
export const useCancel = () => {
  const orderCancelCom = ref(null)
  const handerCancel = (order) => {
    orderCancelCom.value.open(order)
  }
  return { handerCancel, orderCancelCom }
}
// 确认收货逻辑
export const useConfirm = () => {
  const handerConfirm = (order) => {
    Confirm({ text: '您确认收到货吗？确认后货款将会打给卖家。' })
      .then(() => {
        confirmOrder(order.id).then(() => {
          Message({ text: '确认收货成功', type: 'success' })
          order.orderState = 4
        })
      })
      .catch((e) => {})
  }
  return { handerConfirm }
}
// 查看物流逻辑
export const useLogistics = () => {
  const orderLogisticsCom = ref(null)
  const handerLogistics = (order) => {
    orderLogisticsCom.value.open(order)
  }
  return { handerLogistics, orderLogisticsCom }
}
</script>

<style scoped lang="less">
.member-order {
  height: 100%;
  background: #fff;
}
.order-list {
  background: #fff;
  padding: 20px;
  position: relative;
  min-height: 400px;
}

.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif)
    no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
