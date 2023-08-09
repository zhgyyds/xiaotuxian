<template>
  <Form
    ref="target"
    class="xtx-form"
    :validation-schema="schema"
    autocomplete="off"
    v-slot="{ errors }"
  >
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field
          :class="{ err: errors.account }"
          name="account"
          v-model="form.account"
          class="input"
          type="text"
          placeholder="请输入用户名"
        />
      </div>
      <div class="error" v-if="errors.account">
        <i class="iconfont icon-warning" /> {{ errors.account }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          :class="{ err: errors.mobile }"
          name="mobile"
          v-model="form.mobile"
          class="input"
          type="text"
          placeholder="请输入手机号"
        />
      </div>
      <div class="error" v-if="errors.mobile">
        <i class="iconfont icon-warning" /> {{ errors.mobile }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          :class="{ err: errors.code }"
          name="code"
          v-model="form.code"
          class="input"
          type="text"
          placeholder="请输入验证码"
        />
        <span class="code" @click="send">{{
          time === 0 ? "发送验证码" : `${time}秒后发送`
        }}</span>
      </div>
      <div class="error" v-if="errors.code">
        <i class="iconfont icon-warning" /> {{ errors.code }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          :class="{ err: errors.password }"
          name="password"
          v-model="form.password"
          class="input"
          type="password"
          placeholder="请输入密码"
        />
      </div>
      <div class="error" v-if="errors.password">
        <i class="iconfont icon-warning" /> {{ errors.password }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          :class="{ err: errors.rePassword }"
          name="rePassword"
          v-model="form.rePassword"
          class="input"
          type="password"
          placeholder="请确认密码"
        />
      </div>
      <div class="error" v-if="errors.rePassword">
        <i class="iconfont icon-warning" /> {{ errors.rePassword }}
      </div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即提交</a>
  </Form>
</template>

<script>
import { onUnmounted, reactive, ref } from 'vue'
import schema from '@/utils/vee-validate-schema'
import { Form, Field } from 'vee-validate'
import { useIntervalFn } from '@vueuse/core'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import Message from '@/components/library/Message'
export default {
  name: 'CallbackPatch',
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  components: {
    Form,
    Field
  },
  setup (props) {
    const route = useRoute()
    // 表单数据对象
    const form = reactive({
      account: null,
      password: null,
      mobile: null,
      code: null,
      rePassword: null
    })

    const mySchema = {
      account: schema.accountApi,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      rePassword: schema.rePassword
    }

    // 发送短信验证码----------------------------------------------------
    const time = ref(0)
    const { pause, resume } = useIntervalFn(
      () => {
        time.value--
        if (time.value <= 0) {
          pause()
        }
      },
      1000,
      { immediate: false }
    )
    onUnmounted(() => {
      pause()
    })
    const target = ref(null)
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        if (time.value === 0) {
          await userQQPatchCode(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        target.value.setFieldError('mobile', valid)
      }
    }

    // 立即提交-------------------------------------------------------------
    const store = useStore()
    const router = useRouter()
    const submit = () => {
      const valid = target.value.validate()
      if (valid) {
        userQQPatchLogin({
          unionId: props.unionId,
          ...form
        })
          .then((data) => {
            // 存储用户信息;
            const { id, account, avatar, mobile, nickname, token } =
              data.result
            store.commit('user/setUser', {
              id,
              account,
              avatar,
              mobile,
              nickname,
              token
            })
            store.dispatch('cart/mergeCart').then(() => {
              //   进行跳转
              router.push(route.query.redirectUrl || '/')
              //   消息提示
              Message({ type: 'success', text: '登录成功' })
            })
          })
          .catch((e) => {
            Message({ type: 'error', text: '完善信息失败' })
          })
      }
    }
    return { form, schema: mySchema, send, target, time, submit }
  }
}
</script>

<style scoped lang="less">
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
