import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'
import { onUnmounted, ref } from 'vue'

export const useLazyData = (apiFn) => {
  const result = ref([])
  const target = ref(null)

  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        stop()
        apiFn().then(data => {
          result.value = data.result
        })
      }
    }, {
      threshold: 0
    })
  return { target, result }
}

export const usePayTime = () => {
  // 倒计时逻辑
  const timeText = ref('')
  const time = ref(0)
  const { pause, resume } = useIntervalFn(
    () => {
      time.value--
      timeText.value = dayjs.unix(time.value).format('mm分ss秒')
      if (time.value <= 0) {
        pause()
      }
    },
    1000, { immediate: false }
  )
  onUnmounted(() => {
    pause()
  })
  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }
  return { start, timeText }
}
