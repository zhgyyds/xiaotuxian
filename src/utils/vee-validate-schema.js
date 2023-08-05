import { userCheckAccount } from '@/api/user'

export default {
  account (value) {
    if (!value) return '请输入用户名'
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    return true
  },
  async accountApi (value) {
    if (!value) return '请输入用户名'
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    // 服务器端校验
    const data = await userCheckAccount(value)
    if (data.result.valid) return '用户名已存在'
    return true
  },
  password (value) {
    if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
    return true
  },
  mobile (value) {
    if (!value) return '请输入手机号'
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式错误'
  },
  code (value) {
    if (!value) return '请输入验证码'
    if (!/^\d{6}$/.test(value)) return '验证码是6个数字'
    return true
  },
  isAgree (value) {
    if (!value) return '请勾选同意用户协议'
    return true
  },
  rePassword (value, { form }) {
    if (!value) return '请再次确定密码'
    if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
    if (value !== form.password) return '需要和密码保持一致'
    return true
  }
}
