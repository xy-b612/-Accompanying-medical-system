<template>
    <el-aside :width="!isCollapse ? '230px' : '64px'" style=" height: 100%;">
        <el-menu :collapse="isCollapse" :collapse-transition="false" active-text-color="#ffd04b"
            background-color="#545c64" class="aside-container" text-color="#fff" :default-active="active"
            @open="handleOpen" @close="handleClose">

            <p class=" logo-lg">
                <span v-show="!isCollapse">DIDI陪诊</span>
                <span v-show="isCollapse">DIDI</span>
            </p>
            <TreeMenu :index="1" :menuData="menuData" />
        </el-menu>
    </el-aside>
</template>

<script setup>
import TreeMenu from './treeMenu.vue';
import { useRouter } from 'vue-router';
import { reactive, computed } from 'vue';
import { useStore } from 'vuex'

const router = useRouter();
// console.log(router);
//const menuData = reactive(router.options.routes[0].children);
const store = useStore();
const menuData = computed(() => store.state.menu.routerList)

const isCollapse = computed(() => store.state.menu.isCollapse);

const active = computed(() => store.state.menu.menuActive)

const handleOpen = () => {

}

const handleClose = () => {

}

</script>

<style scoped lang="less">
.aside-container {
    height: 100%;

    .logo-lg {
        font-size: 20px;
        text-align: center;
        height: 50px;
        line-height: 50px;
        color: #fff;
    }
}
</style>