<template>
  <XtxDialog
    :title="`${formData.id ? '修改' : '添加'}收货地址`"
    v-model:visible="dialogVisible"
  >
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input
              class="input"
              placeholder="请输入收货人"
              v-model="formData.receiver"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input
              class="input"
              placeholder="请输入手机号"
              v-model="formData.contact"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <XtxCity
              placeholder="请选择所在地区"
              :fullLocation="formData.fullLocation"
              @change="changeCity"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input
              class="input"
              placeholder="请输入详细地址"
              v-model="formData.address"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input
              class="input"
              placeholder="请输入邮政编码"
              v-model="formData.postalCode"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input
              class="input"
              placeholder="请输入地址标签，逗号分隔"
              v-model="formData.addressTags"
            />
          </div>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <XtxButton
        type="gray"
        style="margin-right: 20px"
        @click="visibleDialog = false"
        >取消</XtxButton
      >
      <XtxButton type="primary" @click="submit">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { reactive, ref } from 'vue'
import { addAddress, editAddress } from '@/api/order'
import Message from '@/components/library/Message'
import { formatDate } from '@vueuse/core'

export default {
  name: 'AddressEdit',
  setup (props, { emit }) {
    const dialogVisible = ref(false)
    // 打开函数
    const open = (address) => {
      dialogVisible.value = true
      if (address.id) {
        // 如果修改,填充表单
        for (const key in address) {
          formData[key] = address[key]
        }
      } else {
        for (const key in formData) {
          if (key === 'isDefault') {
            formData[key] = 1
          } else {
            formData[key] = null
          }
        }
      }
    }

    // 定义表单数据对象
    const formData = reactive({
      receiver: '',
      contact: '',
      provinceCode: '',
      cityCode: '',
      countyCode: '',
      address: '',
      postalCode: '',
      addressTags: '',
      isDefault: 0,
      fullLocation: ''
    })

    // 城市选中
    const changeCity = (result) => {
      formData.provinceCode = result.provinceCode
      formData.cityCode = result.cityCode
      formData.countyCode = result.countyCode
      formData.fullLocation = result.fullLocation
    }

    // 添加时候的提交操作
    const submit = () => {
      if (formData.id) {
        editAddress(formData).then((data) => {
          Message({ type: 'success', text: '修改收货地址成功' })
          dialogVisible.value = false
          // 触发自定义事件
          emit('on-success', formData)
        })
      } else {
        addAddress(formData).then((data) => {
          formatDate.id = data.result.id
          Message({ type: 'success', text: '添加收货地址成功' })
          dialogVisible.value = false
          // 触发自定义事件
          emit('on-success', formData)
        })
      }
    }
    return { dialogVisible, open, formData, changeCity, submit }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper) {
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>
