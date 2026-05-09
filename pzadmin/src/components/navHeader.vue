<template>
    <div class="header-container">
        <div class="header-left flex-box">
            <el-icon class="icon" size="20" @click="store.commit('collapseMenu')">
                <Fold />
            </el-icon>
            <ul class="flex-box">
                <li v-for="(item, index) in selectMenu" :key="item.path" class="tab flex-box"
                    :class="{ selected: route.path === item.path }">
                    <el-icon size="12"">
                        <component :is="item.icon" />
                    </el-icon>
                    <router-link :to="{ path: item.path }" class="text flex-box">
                        {{ item.name }}
                    </router-link>
                    <el-icon size="12"" class=" close" @click="closeTab(item, index)">
                        <Close />
                    </el-icon>

                </li>
            </ul>
        </div>
        <div class=" header-right">
            <el-dropdown @command="handleClick">
                <div class="el-dropdown-link flex-box">
                    <el-avatar :src="userInfo.avatar" />
                    <p class="user-name">{{ userInfo.name }}</p>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="cancel">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
//创建store实例
const store = useStore();
//当前的路由对象
const route = useRoute();
//路由跳转对象
const router = useRouter();

const selectMenu = computed(() => store.state.menu.selectMenu);

const userInfo = JSON.parse(localStorage.getItem('pz_userInfo'))


//关闭标签页
const closeTab = (item, index) => {
    if (!item || !item.path) {
        console.warn('closeTab 收到无效 item', item, index);
        return;
    }
    const isCurrentTab = route.path === item.path;
    // const oldMenu = selectMenu.value;//删除前的数组
    //执行删除
    store.commit('closeMenu', item);

    //1.删除的非当前标签页，不需要跳转
    if (!isCurrentTab) return;
    //2.删除的是当前页
    const newMenu = selectMenu.value;//删除后的数组
    //2.1如果删除后没有标签页了，跳转到首页
    if (newMenu.length === 0) {
        router.push('/');
        return;
    }
    //2.2删除后还有标签页，尝试跳转到原来位置的标签页
    //因为删除后右边的元素会往左边移动，所以默认是往右边跳转，如果要往左边跳转，需要index-1
    let target = newMenu[index]
    if (!target) {
        //如果删除的是最后一项，跳转到新数组的最后一项
        target = newMenu[newMenu.length - 1]
    }
    router.push({
        path: target.path
    });

}

const handleClick = (command) => {
    if (command === "cancel") {
        localStorage.removeItem('pz_token')
        localStorage.removeItem('pz_userInfo')
        localStorage.removeItem('pz_v3pz')

        window.location.href = window.location.origin
    }
}
</script>

<style lang="less" scoped>
.flex-box {
    display: flex;
    align-items: center;
    height: 100%;
}

.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: #fff;
    padding-right: 25px;

    a {
        height: 100%;
        color: #333;
        font-size: 15px;
    }

    .header-left {
        height: 100%;

        .icon {
            width: 45px;
            height: 100%;
        }

        .icon:hover {
            background-color: #f5f5f5;
            cursor: pointer;
        }

        .tab {
            padding: 0 10px;
            height: 100%;

            .close {
                visibility: hidden;
            }

            &.selected {
                a {
                    color: #409eff;
                }

                i {
                    color: #409eff;
                }

                background-color: #f5f5f5;
            }
        }

        .tab:hover {
            background-color: #f5f5f5;

            .close {
                visibility: inherit;
                cursor: pointer;
                color: #000;
            }
        }

        .text {
            margin: 0 5px;
        }
    }

    .header-right {
        .user-name {
            margin-left: 10px;
        }
    }
}
</style>