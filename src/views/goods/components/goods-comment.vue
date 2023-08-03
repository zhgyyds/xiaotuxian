<template>
  <div class="goods-comment">
    <!-- 评价头部 -->
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p>
          <span>{{ commentInfo.salesCount }}</span
          ><span>人购买</span>
        </p>
        <p>
          <span>{{ commentInfo.praisePercent }}</span
          ><span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            @click="changeTag(i)"
            :class="{ active: currTag === i }"
            href="javascript:;"
            v-for="(item, i) in commentInfo.tags"
            :key="item.title"
            >{{ item.title }}（{{ item.tagCount }}）</a
          >
        </div>
      </div>
    </div>
    <div class="sort" v-if="commentInfo">
      <span>排序：</span>
      <a
        @click="changeSort('null')"
        href="javascript:;"
        :class="{ active: reqParams.sortField === null }"
        >默认</a
      >
      <a
        @click="changeSort('praiseCount')"
        href="javascript:;"
        :class="{ active: reqParams.sortField === 'praiseCount' }"
        >最热</a
      >
      <a
        @click="changeSort('createTime')"
        href="javascript:;"
        :class="{ active: reqParams.sortField === 'createTime' }"
        >最新</a
      >
    </div>
    <!-- 评价列表 -->
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="" />
          <span>{{ formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <i class="iconfont icon-wjx01" v-for="i in item.score" :key="i"></i>

            <i
              class="iconfont icon-wjx02"
              v-for="i in 5 - item.score"
              :key="i"
            ></i>
            <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
          </div>
          <div class="text">
            {{ item.content }}
            <!-- 评论图片组件 -->
            <GoodsCommentImage
              v-if="item.pictures.length"
              :pictures="item.pictures"
            />
          </div>
          <div class="time">
            <span>{{ item.createTime }}</span>
            <span class="zan"
              ><i class="iconfont icon-dianzan"></i>{{ item.praiseCount }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 分页组件 -->
    <xtx-pagination
      v-if="total"
      @current-change="changePagerFn"
      :total="total"
      :pageSize="reqParams.pageSize"
      :currentPage="reqParams.page"
    />
  </div>
</template>
<script>
import { inject, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findCommentInfoByGoods, findGoodsCommentList } from '@/api/product'
import GoodsCommentImage from './goods-comment-image.vue'
import XtxPagination from '@/components/library/xtx-pagination.vue'
export default {
  name: 'GoodsComment',
  components: {
    GoodsCommentImage,
    XtxPagination
  },
  setup () {
    const currTag = ref(0)
    const commentInfo = ref(null)
    const route = useRoute()
    const goods = inject('goods')
    findCommentInfoByGoods(route.params.id).then((data) => {
      // 设置数据之前，tags数组前加有图，全部评价
      data.result.tags.unshift({
        type: 'img',
        title: '有图',
        tagCount: data.result.hasPictureCount
      })
      data.result.tags.unshift({
        type: 'all',
        title: '全部评价',
        tagCount: data.result.evaluateCount
      })

      commentInfo.value = data.result
    })
    const changeTag = (i) => {
      currTag.value = i
      // 点击tag的时候修改筛选条件
      const tag = commentInfo.value.tags[i]
      if (tag.type === 'all') {
        reqParams.hasPicture = null
        reqParams.tag = null
      } else if (tag.type === 'img') {
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        reqParams.hasPicture = null
        reqParams.tag = tag.title
      }
    }
    const changeSort = (sort) => {
      reqParams.sortField = sort
      reqParams.page = 1
    }
    // 准备筛选条件数据
    // 筛选条件准备
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      sortField: null
    })
    const commentList = ref([])
    const total = ref(0)
    watch(
      reqParams,
      () => {
        findGoodsCommentList(goods.value.id, reqParams).then((data) => {
          commentList.value = data.result.items
          total.value = data.result.counts
        })
      },
      { immediate: true }
    )
    // 定义转换数据的函数
    const formatSpecs = (specs) => {
      return specs
        .reduce((p, c) => `${p} ${c.name}: ${c.nameValue}`, '')
        .trim()
    }
    // 格式化名字
    const formatNickname = (nickname) => {
      return nickname.substr(0, 1) + '****' + nickname.substr(-1)
    }
    // 实现分页切换
    const changePagerFn = (newPage) => {
      reqParams.page = newPage
    }
    return {
      commentInfo,
      currTag,
      changeTag,
      reqParams,
      commentList,
      changeSort,
      formatSpecs,
      formatNickname,
      total,
      changePagerFn
    }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
}
.list {
  padding: 0 20px;
  .item {
    display: flex;
    padding: 25px 10px;
    border-bottom: 1px solid #f5f5f5;
    .user {
      width: 160px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }
      span {
        padding-left: 10px;
        color: #666;
      }
    }
    .body {
      flex: 1;
      .score {
        line-height: 40px;
        .iconfont {
          color: #ff9240;
          padding-right: 3px;
        }
        .attr {
          padding-left: 10px;
          color: #666;
        }
      }
    }
    .text {
      color: #666;
      line-height: 24px;
    }
    .time {
      color: #999;
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }
  }
}
</style>
