<template>
    <RouterView />
    <van-tabbar v-model="active">
        <van-tabbar-item v-for="item in router.options.routes[0].children" :icon="item.meta.icon" :key="item.path"
            :to="'/' + item.path">
            {{ item.meta.name }}
        </van-tabbar-item>
    </van-tabbar>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const active = ref(0)
const router = useRouter()
const route = useRoute()

const getTabIndex = (path) => {
    if (path.startsWith('/home')) return 0
    if (path.startsWith('/order') || path.startsWith('/detail')) return 1
    if (path.startsWith('/user')) return 2
    return 0
}

watch(() => route.path, (newPath) => {
    active.value = getTabIndex(newPath)
}, { immediate: true })
</script>