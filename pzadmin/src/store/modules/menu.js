const localDataStr = localStorage.getItem('pz_v3pz')
const localData = localDataStr ? JSON.parse(localDataStr) : null
const state = localData?.menu ?? {
    isCollapse: false,
    selectMenu: [],
    routerList: [],
    menuActive: '1-1'
}
const mutations = {
    collapseMenu(state) {
        state.isCollapse = !state.isCollapse
    },
    adMenu(state, payload) {
        //对数据进行去重
        if (state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
            state.selectMenu.push(payload)
        }
    },
    closeMenu(state, payload) {
        //找到要删除的元素的索引
        const index = state.selectMenu.findIndex(val => val.name === payload.name)
        //根据索引删除元素
        state.selectMenu.splice(index, 1)
    },
    dynamicMenu(state, payload) {
        //console.log(payload);
        //通过glob导入文件
        const modules = import.meta.glob('@/views/**/**/*.vue')
        console.log('数据',modules);
        function routerSet(router) {
            router.forEach(route => {
                //判断没有子菜单，拼接路由数据
                if (!route.children) {
                    const url = `/src/views${route.meta.path}/index.vue`
                    //拿到获取的vue组件
                    route.component = modules[url]
                } else {
                    routerSet(route.children)
                }
            })
        }
        routerSet(payload)
        //拿到完整的路由数据
        state.routerList = payload

    },
    updateMenuActive(state, payload) {
        state.menuActive = payload
    }
}

export default {
    state,
    mutations
}