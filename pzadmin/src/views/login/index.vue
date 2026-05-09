<template>
    <el-row class="login-container" justify="center" align="middle">
        <el-card style="max-width: 480px;">
            <!-- 图片 -->
            <template #header>
                <div class="card-header">
                    <img :src="imgUrl" alt="">
                </div>
            </template>
            <!-- 切换登录和注册 -->
            <div class="jump-link">
                <el-link type="primary" @click="handleChange">{{ formType ? '注册账号' : '返回登录' }}</el-link>
            </div>
            <!-- 表单 -->
            <el-form ref="loginFormRef" :model="loginForm" style="max-width: 600px;
            " class="demo-ruleForm" :rules="rules">
                <el-form-item prop="userName">
                    <el-input v-model="loginForm.userName" placeholder="手机号" prefix-icon="UserFilled"></el-input>
                </el-form-item>
                <el-form-item prop="passWord">
                    <el-input v-model="loginForm.passWord" placeholder="密码" prefix-icon="Lock"
                        type="password"></el-input>
                </el-form-item>
                <el-form-item v-if="!formType" prop="validCode">
                    <el-input v-model="loginForm.validCode" placeholder="验证码" prefix-icon="Lock">
                        <template #append>
                            <span @click="sendSmChange" style="cursor:pointer">{{ sendSms.validText }}</span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 100%;" @click="submitForm(loginFormRef)">
                        {{ formType ? '登录' : '注册账号' }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-row>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { onUnmounted, reactive, ref, computed, toRaw } from 'vue'
import { getCode, userAuthentication, login, menuPermissions } from '@/api/index'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex/dist/vuex.cjs.js';
const imgUrl = new URL('../../assets/images/login-head.png', import.meta.url).href

//表单数据
const loginForm = reactive({
    "userName": "",
    "passWord": "",
    "validCode": ""
})

//账号验证规则
const validateUser = (rule, value, callback) => {
    //不能为空
    if (value === '') {
        callback(new Error('请输入账号'))
    } else {
        const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
        phoneReg.test(value) ? callback() : callback(new Error('手机号格式不正确，请输入正确的手机号'))
    }
}
//密码验证规则
const validatePass = (rule, value, callback) => {
    //不能为空
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        const passReg = /^[a-zA-Z0-9_-]{4,16}$/
        passReg.test(value) ? callback() : callback(new Error('密码格式不正确，密码必须为4-16位字母、数字、下划线或减号'))
    }
}

//表单验证规则
const rules = reactive({
    userName: [{ validator: validateUser, trigger: 'blur' }],
    passWord: [{ validator: validatePass, trigger: 'blur' }],
})

//创建一个响应式变量来存储当前的登录状态，默认为true表示登录页面
const formType = ref(true);

//点击切换登录和注册
const handleChange = () => {
    formType.value = !formType.value;
}

//发送短信
const sendSms = reactive({
    validText: '获取验证码',
    time: 60
})

//定义一个标志变量，防止重复点击发送短信按钮
let flag = false
//定义一个定时器变量，用于清除定时器
let timer = null
//点击发送短信
const sendSmChange = () => {
    //如果已经点击过发送短信按钮，直接返回
    if (flag) return
    //判断手机号是否存在且正确
    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
        return ElMessage({
            message: '请检查手机号是否正确',
            type: 'warning'
        })
    }
    //倒计时
    timer = setInterval(() => {
        if (sendSms.time <= 0) {
            clearInterval(timer)
            sendSms.time = 60
            sendSms.validText = '获取验证码'
            flag = false
            return
        } else {
            sendSms.time -= 1
            sendSms.validText = `剩余${sendSms.time}s`
        }
    }, 1000)
    flag = true
    getCode({ tel: loginForm.userName })
}

const router = useRouter()
const loginFormRef = ref()
const store = useStore()

const routerList = computed(() => store.state.menu.routerList)

//提交表单
const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, field) => {
        if (valid) {
            // 表单验证通过
            console.log(loginForm, 'submit');
            //注册页面
            if (!formType.value) {
                userAuthentication(loginForm).then(res => {
                    console.log('注册响应', res)
                    if (res.code === 10000) {
                        ElMessage.success('注册成功，请登录')
                        //清空个人信息
                        loginForm.userName = ''
                        loginForm.passWord = ''
                        loginForm.validCode = ''
                        formType.value = true
                    } else {
                        ElMessage.error(res.message || '注册失败')
                    }
                })
            } else {
                //登录页面
                login(loginForm).then(res => {
                    if (res.code === 10000) {
                        ElMessage.success('登录成功')
                        console.log(res.data)
                        //将用户信息存储在localStorage中
                        localStorage.setItem('pz_token', res.data.token)
                        localStorage.setItem('pz_userInfo', JSON.stringify(res.data.userInfo))
                        menuPermissions().then(res => {
                            store.commit('dynamicMenu', res.data)
                            console.log(routerList.value, 'routerList');
                            toRaw(routerList.value).forEach(item => {
                                router.addRoute('main',item)
                            });
                            router.push('/')
                        })
                    }
                })
            }

        } else {
            // 表单验证失败
            console.log('error submit!', field);
        }
    })
}

//组件卸载时清除定时器
onUnmounted(() => {
    clearInterval(timer)
})
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
    padding: 0
}

.login-container {
    height: 100%;

    .card-header {
        background-color: #899fe1;

        img {
            width: 430px;
        }
    }

    .jump-link {
        text-align: right;
        margin-bottom: 10px;
    }
}
</style>