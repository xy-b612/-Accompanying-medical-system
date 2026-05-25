import request from '../utils/request'

//登录接口
export const Login = (data)=>{
    return request.post('/login', data)
}

//首页数据
export const Index = ()=>{
    return request.get('/Index/index')
}

//陪护师列表
export const companionList = () => {
    return request.get('/h5/companion')
}

//提交订单
export const createOrder = (data) => {
    return request.post('/createOrder', data)
}

//订单列表
export const orderList = (params) => {
    return request.get('/order/list', { params })
}

//订单详情
export const orderDetail = (params) => {
    return request.get('/order/detail', { params })
}