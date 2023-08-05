<template>
  <Form
    class="xtx-form"
    :validation-schema="mySchema"
    v-slot="{ errors }"
    ref="target"
  >
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>
        {{ `Hi，${nickName} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~` }}
      </p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          :class="{ err: errors.mobile }"
          v-model="form.mobile"
          name="mobile"
          class="input"
          type="text"
          placeholder="绑定的手机号"
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
          v-model="form.code"
          name="code"
          class="input"
          type="text"
          placeholder="短信验证码"
        />
        <span class="code" @click="send">{{
          time === 0 ? "发送验证码" : `${time}秒后发送`
        }}</span>
      </div>
      <div class="error" v-if="errors.code">
        <i class="iconfont icon-warning" /> {{ errors.code }}
      </div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import schema from '@/utils/vee-validate-schema'
import { Form, Field } from 'vee-validate'
import { ref, reactive, onUnmounted } from 'vue'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
export default {
  name: 'CallbackBind',
  components: {
    Form,
    Field
  },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const route = useRoute()
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
    }
    const form = reactive({
      mobile: null,
      code: null
    })
    const nickName = ref('null')
    const avatar = ref('null')
    if (QC.Login.check()) {
      QC.api('get_user_info').success((res) => {
        nickName.value = res.data.nickname
        avatar.value = res.data.figureurl_qq_1
      })
    }
    // 发送验证码
    const target = ref(null)
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
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        if (time.value === 0) {
          await userQQBindCode(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60

          resume()
        }
      } else {
        target.value.setFieldError('mobile', valid)
      }
    }
    const store = useStore()
    const router = useRouter()
    const submit = () => {
      const valid = target.value.validate()
      if (valid) {
        userQQBindLogin({
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
            //   进行跳转
            router.push(route.query.redirectUrl || '/')
            //   消息提示
            Message({ type: 'success', text: '登录成功' })
          })
          .catch((e) => {
            Message({ type: 'error', text: '绑定失败' })
          })
      }
    }
    return { nickName, avatar, mySchema, form, send, target, time, submit }
  }
}
</script>

<style scoped lang="less">
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
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
