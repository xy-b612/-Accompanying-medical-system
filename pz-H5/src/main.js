import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

router.beforeEach((to, from) => {
    if (to.path !== '/login') {
        if (!localStorage.getItem('h5_token')) {
            return '/login'
        }
    }
})

//路由挂载
app.use(router)
app.mount('#app')
