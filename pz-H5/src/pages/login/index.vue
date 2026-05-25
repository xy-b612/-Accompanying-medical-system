<template>
    <h1>用户登录</h1>
    <!-- 表单 -->
    <van-form @submit="onSubmit">
        <van-cell-group inset>
            <van-field v-model="formData.userName" name="userName" label="用户名" placeholder="用户名"
                :rules="[{ required: true, message: '请填写用户名' }]" />
            <van-field v-model="formData.passWord" name="passWord" label="密码" placeholder="密码"
                :rules="[{ required: true, message: '请输入密码' }]" type="password" />
        </van-cell-group>
        <div class="btn">
            <van-button type="primary" round block native-type="submit">提交</van-button>
        </div>
    </van-form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Login } from '../../api/index'

const router = useRouter()

//表单数据
const formData = reactive({
    userName: '',
    passWord: ''
})
//表单提交
const onSubmit = async () => {
    const res = await Login(formData)
    //console.log(res);
    if (res.code === 10000) {
        localStorage.setItem('h5_token', res.data.token)
        localStorage.setItem('h5_userInfo', JSON.stringify(res.data.userInfo))
        router.push('/home')
    }
}
</script>

<style lang="less" scoped>
h1 {
    text-align: center;
}

.btn {
    margin: 16px;
}
</style>