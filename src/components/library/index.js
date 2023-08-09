// import XtxSkeleton from '@/components/library/xtx-skeleton.vue'
// import XtxCarousel from '@/components/library/xtx-carousel.vue'
// import XtxMore from '@/components/library/xtx-more.vue'
// import XtxBread from '@/components/library/xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item.vue'
import defaultImg from '@/assets/images/200.png'
import Confirm from './Confirm'
import Message from './Message'
const importFn = require.context('./', false, /\.vue$/)

export default {
  install (app) {
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)

    importFn.keys().forEach(path => {
      const component = importFn(path).default
      app.component(component.name, component)
    })
    // 定义指令
    defineDirective(app)

    // 如果你想挂载全局的属性，能够通过组件实例调用的属性   this.$message
    app.config.globalProperties.$message = Message
    app.config.globalProperties.$confirm = Confirm
  }
}

// 定义指令
const defineDirective = (app) => {
  // 图片懒加载指令
  app.directive('lazy', {
    mounted (el, binding) {
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          observer.unobserve(el)
          el.onerror = () => {
            el.src = defaultImg
          }
          el.src = binding.value
        }
      }, {
        threshold: 0.01
      })
      observer.observe(el)
    }
  })
}
