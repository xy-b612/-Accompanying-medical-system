<template>
    <div class="container">
        <div class="header">我的订单</div>
        <van-tabs @click-tab="onClickTab" v-model:active="active">
            <van-tab title="全部" name="" />
            <van-tab title="待支付" name="1" />
            <van-tab title="待服务" name="2" />
            <van-tab title="已完成" name="3" />
            <van-tab title="已取消" name="4" />
        </van-tabs>
        <van-row @click="goDetail(item)" v-for="item in order" :key="item.out_trade_no">
            <van-col span="5">
                <van-image width="50" height="50" radius="5" :src="item.serviceImg" />
            </van-col>
            <van-col span="14">
                <div class="text1">{{ item.service_name }}</div>
                <div class="text2">
                    <div>{{ item.hospital_name }}</div>
                    <div>预约时间:{{ item.starttime }}</div>
                </div>
            </van-col>
            <van-col class="text2" span="5" :style="{ color: colorMap[item.trade_state] }">
                {{ item.trade_state }}
                <counter :second="item.timer" v-if="item.trade_state === '待支付'" />
            </van-col>
        </van-row>
        <div class="bottom-text">没有更多了</div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderList } from '../../api/index'
import counter from '../../components/counter.vue'

const route = useRoute()
const router = useRouter()

const active = ref('')      // 当前激活的 tab name
const order = ref([])

const colorMap = {
    '待支付': '#ffa200',
    '待服务': '#1da6fd',
    '已完成': '#21c521'
}

// 获取订单列表（state: '' 表示全部，'1'~'4' 对应状态）
const getOrderList = async (state) => {
    const params = {}
    if (state !== '') {
        params.state = state
    }
    const data = await orderList(params)
    data.data.forEach(item => {
        item.timer = item.order_start_time + 7200000 - Date.now()
    })
    order.value = data.data
}

// 切换 tab 时调用
const onClickTab = (tab) => {
    // 注意：tab.name 是字符串 '' 或 '1','2','3','4'
    const state = tab.name
    getOrderList(state)
    // 更新 URL 参数（使用 replace 避免产生过多历史记录）
    if (state === '') {
        router.replace({ query: {} })          // 全部时清除 active 参数
    } else {
        router.replace({ query: { active: state } })
    }
}

// 监听 active 变化，用于外部（如从“我的”页面跳转）同步 URL 参数
// 但为了避免重复请求，不在这里调用 getOrderList，因为 onClickTab 已经做了
// 这里只做 URL 的补充同步（例如用户直接修改地址栏时）
watch(active, (newVal) => {
    // 如果当前 URL 的 query.active 和实际 active 不一致，则同步
    const currentQueryActive = route.query.active
    if (newVal === '') {
        if (currentQueryActive !== undefined) {
            router.replace({ query: {} })
        }
    } else {
        if (currentQueryActive !== newVal) {
            router.replace({ query: { active: newVal } })
        }
    }
})

// 初始化：读取 URL 参数，设置 active 并加载数据
onMounted(() => {
    const activeParam = route.query.active
    if (activeParam === '1' || activeParam === '2' || activeParam === '3' || activeParam === '4') {
        active.value = activeParam
        getOrderList(activeParam)
    } else {
        active.value = ''
        getOrderList('')
    }
})

const goDetail = (item) => {
    router.push(`/detail?oid=${item.out_trade_no}`)
}
</script>

<style lang="less" scoped>
.container {
    background-color: #f0f0f0;
    height: 100vh;
}
.header {
    background-color: #fff;
    line-height: 40px;
    text-align: center;
}
.van-row {
    background-color: #fff;
    padding: 10px;
    margin: 5px;
    border-radius: 5px;
    .text1 {
        font-size: 16px;
        line-height: 25px;
        font-weight: bold;
    }
    .text2 {
        font-size: 14px;
        line-height: 20px;
        color: #999999;
    }
}
.bottom-text {
    line-height: 50px;
    text-align: center;
    color: #999999;
}
</style>