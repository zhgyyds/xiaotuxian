<template>
  <!-- 首页入口 -->
  <div class="home-entry">
    <div class="container">
      <!-- 左侧分类 -->
      <HomeCategory />

      <!-- 轮播图 -->
      <HomeBanner />
      <!-- 新鲜好物 -->
      <HomeNew />

      <!-- 人气推荐 -->
      <HomeHot />
      <!-- 品牌组件 -->
      <HomeBrand />
      <!-- 产品区块 -->
      <HomeProduct />
      <!-- 最新专题 -->
      <HomeSpecial />
    </div>
  </div>
</template>

<script>
import HomeCategory from './components/home-category.vue'
import HomeBanner from './components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'
import HomeBrand from './components/home-brand.vue'
import HomeProduct from './components/home-product.vue'
import HomeSpecial from './components/home-special'
import { ref } from 'vue'

export default {
  name: 'HomePage',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial
  },
  setup () {
    const show = ref(true)
    return { show }
  }
}
</script>

<style scoped lang="less">
.box {
  width: 100px;
  height: 100px;
  background-color: red;
}
.container {
  .hoverShadow();
  color: @xtxColor;
}
.h-enter-from {
  opacity: 0;
}
.h-enter-active {
  transition: all 2s;
}
.h-enter-to {
  opacity: 1;
}
.h-leave-from {
  opacity: 1;
}
.h-leave-active {
  transition: all 2s;
}
.h-leave-to {
  opacity: 0;
}
</style>
