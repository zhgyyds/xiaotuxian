<template>
  <div class="checkout-address">
    <div class="text">
      <div class="none" v-if="!showAddress">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-if="showAddress">
        <li>
          <span>收<i />货<i />人：</span>{{ showAddress.receiver }}
        </li>
        <li>
          <span>联系方式：</span
          >{{ showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})/, "$1****$2") }}
        </li>
        <li>
          <span>收货地址：</span>{{ showAddress.fullLocation.replace(/ /g, "")
          }}{{ showAddress.address }}
        </li>
      </ul>
      <a
        href="javascript:;"
        v-if="showAddress"
        @click="openAddressEdit(showAddress)"
        >修改地址</a
      >
    </div>
    <div class="action">
      <XtxButton class="btn" @click="open">切换地址</XtxButton>
      <XtxButton class="btn" @click="openAddressEdit({})">添加地址</XtxButton>
    </div>
  </div>
  <!-- 对话框组件 -->
  <XtxDialog title="切换收货地址" v-model:visible="visibleDialog">
    <div
      class="text item"
      v-for="item in list"
      :key="item.id"
      @click="selectedAddress = item"
      :class="{ active: selectedAddress && selectedAddress.id === item.id }"
    >
      <ul>
        <li>
          <span>收<i />货<i />人：</span>{{ item.receiver }}
        </li>
        <li>
          <span>联系方式：</span
          >{{ item.contact.replace(/^(\d{3})\d{4}(\d{4})/, "$1****$2") }}
        </li>
        <li>
          <span>收货地址：</span
          >{{ item.fullLocation.replace(/ /g, "") + item.address }}
        </li>
      </ul>
    </div>
    <template #footer>
      <XtxButton
        type="gray"
        style="margin-right: 20px"
        @click="visibleDialog = false"
        >取消</XtxButton
      >
      <XtxButton type="primary" @click="confirmAddressFn">确认</XtxButton>
    </template>
  </XtxDialog>
  <!-- 添加编辑组件 -->
  <AddressEdit ref="addressEditCom" @on-success="successHandler" />
</template>
<script>
import { ref } from 'vue'
import AddressEdit from './address-edit.vue'
export default {
  name: 'CheckoutAddress',
  components: {
    AddressEdit
  },
  props: {
    // 收货地址列表
    list: {
      type: Array,
      default: () => []
    }
  },
  setup (props, { emit }) {
    // 显示的地址
    const showAddress = ref(null)
    if (props.list.length) {
      const defaultAddress = props.list.find((item) => item.isDefault === 1)
      if (defaultAddress) {
        showAddress.value = defaultAddress
      } else {
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddress.value = props.list[0]
      }
    }
    // 默认通知父组件一个收货地址ID
    emit('change', showAddress.value && showAddress.value.id)

    const visibleDialog = ref(false)
    // 记录当前选中的地址ID
    const selectedAddress = ref(null)
    const confirmAddressFn = () => {
      showAddress.value = selectedAddress.value
      emit('change', selectedAddress.value.id)
      visibleDialog.value = false
    }
    const open = () => {
      selectedAddress.value = null
      visibleDialog.value = true
    }
    // 打开添加剪辑收货地址组件
    const addressEditCom = ref(null)
    const openAddressEdit = (address) => {
      addressEditCom.value.open(address)
    }
    const successHandler = (formData) => {
      const editAddress = props.list.find((item) => item.id === formData.id)
      if (editAddress) {
        // 修改
        for (const key in editAddress) {
          editAddress[key] = formData[key]
        }
      } else {
        // 如果是添加，往list中追加一条
        const jsonStr = JSON.stringify(formData)
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(JSON.parse(jsonStr))
      }
    }
    return {
      showAddress,
      visibleDialog,
      selectedAddress,
      confirmAddressFn,
      open,
      openAddressEdit,
      addressEditCom,
      successHandler
    }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
