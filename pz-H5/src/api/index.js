import request from '../utils/request'

export default {
    login(data) {
        return request.post('/login', data)
    },
    //首页
    home() {
        return request.get('/Index/index')
    }
}