<template>
    <div class="container">
        <div class="header">
            <van-icon @click="goBack" name="arrow-left" class="header-left" size="30" />
            订单详情
        </div>
        <statusBar :item="stateMap[detailData.trade_state]" />
        <div class="tips">
            <div class="dzf" v-if="detailData.trade_state === '待支付'">
                <div class="text1">订单待支付</div>
                <div class="text2">请在
                    <counter :second="second" />
                    内完成支付，超时订单将被取消。
                </div>
                <div class="text3">
                    <van-button type="success" @click="showCode = true">立即支付(0.5)元</van-button>
                </div>
            </div>
            <div class="dzf" v-if="detailData.trade_state === '待服务'">
                <div class="text1">正在为您安排服务专员...</div>
                <div class="text2">请保持手机畅通，稍后将有服务专员与您联系</div>
            </div>
            <div class="dzf" v-if="detailData.trade_state === '已完成'">
                <div class="text1">服务已完成</div>
                <div class="text2">感谢您的使用，如有售后问题请联系客服</div>
            </div>
            <div class="dzf" v-if="detailData.trade_state === '已取消'">
                <div class="text1">订单已取消</div>
                <div class="text2">期待下次为您服务，如有疑问请联系客服</div>
            </div>
        </div>

        <van-cell-group class="card">
            <div class="header-text">预约信息</div>
            <van-cell v-for="(item, key) in makeInfo" :key="key" :title="item" :value="formatData(key)" />
        </van-cell-group>
        <van-cell-group class="card">
            <div class="header-text">订单信息</div>
            <van-cell v-for="(item, key) in orderInfo" :key="key" :title="item" :value="formatData(key)" />
        </van-cell-group>

        <!-- 提交订单成功后显示的弹窗 -->
        <van-dialog v-model:show="showCode" :show-confirm-button="false">
            <van-icon name="cross" class="close" @click="closeCode" />
            <div>微信支付</div>
            <van-image width="150" height="150" :src="codeImg" />
            <div>请使用本人微信扫描二维码</div>
        </van-dialog>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import statusBar from '../../components/statusBar.vue'
import counter from '../../components/counter.vue'
import { orderDetail } from '../../api/index'
import { onMounted, ref, reactive, computed } from 'vue'
import Qrcode from 'qrcode'

const router = useRouter()
const route = useRoute()
//点击返回
const goBack = () => {
    router.go(-1)
}

//详情页数据
const detailData = reactive({})

//计算倒计时
const second = computed(() => {
    return detailData.order_start_time ? detailData.order_start_time + 7200000 - Date.now() : 0
})

//二维码图片
const showCode = ref(false)
const codeImg = ref('')
const closeCode = () => {
    showCode.value = false
    router.push('/order')
}

const stateMap = {
    '待支付': 10,
    '待服务': 20,
    '已完成': 30,
    '已取消': 40
}

//获取订单详情
const makeInfo = {
    service_name: '预约服务',
    hospital_name: '预约医院',
    starttime: '期望就诊时间',
    'client.name': '就诊人',
    'client.mobile': '就诊人电话',
    receiveAddress: '接送地址',
    demand: '其他需求'
}
const orderInfo = {
    tel: '联系电话',
    order_start_time: '下单时间',
    price: '应付金额',
    out_trade_no: '订单编号',
}
const formatData = (key) => {
    if (key.indexOf(".") === -1) {
        if (key === "order_start_time") {
            return formatTimestamp(detailData[key]);
        }
        return detailData[key];
    }
    let arr = key.split(".").reduce((o, p) => {
        return (o || {})[p];
    }, detailData);
    return arr;
}
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份是从0开始的，所以需要+1
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

onMounted(async () => {
    const res = await orderDetail({ oid: route.query.oid })
    Object.assign(detailData, res.data)
    Qrcode.toDataURL(res.data.code_url).then(url => {
        codeImg.value = url
    })
    console.log(detailData);
})


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

    .header-left {
        float: left;
    }
}

.card {
    margin: 15px 0;
    padding: 10px;

    .header-text {
        padding-left: 5px;
        line-height: 30px;
        font-size: 16px;
        font-weight: bold;
        border-left: 4px solid red;
    }
}

.dzf {
    padding: 20px;

    .text1 {
        font-size: 20px;
        font-weight: bold;
        line-height: 30px;
        color: #666;
    }

    .text2 {
        font-size: 14px;
        color: #666;
    }

    .text3 {
        text-align: center;

        .van-button {
            margin-top: 10px;
            margin-left: 10px;
            width: 80%;
            font-weight: bold;
        }
    }
}

::v-deep(.van-dialog__content) {
    text-align: center;
    padding: 20px;

    .close {
        position: absolute;
        left: 20px;
    }
}
</style>