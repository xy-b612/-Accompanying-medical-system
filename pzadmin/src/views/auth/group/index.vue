<template>
    <PanelHead :route="route" />
    <div class="btn">
        <el-button icon="Plus" type="primary" @click="open(null)" size="small">新增</el-button>
    </div>
    <el-table :data="tableData.list" width="100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="permissionName" label="菜单权限" width="500px" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-info">
        <el-pagination v-model:current-page="pagenationData.pageNum" :page-size="pagenationData.pageSize" size="small"
            :background="false" layout="total, prev, pager, next" :total="tableData.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog v-model="dialogVisible" :before-close="beforeClose" title="添加权限" wwidth="500px">
        <el-form ref="formRef" lwabel-width="100px" label-position="left" :model="form" :rules="rules">
            <el-form-item v-show="false" prop="id">
                <el-input v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请填写权限名称" />
            </el-form-item>
            <el-form-item label="权限" prop="permissions">
                <el-tree ref="treeRef" :data="permissionsData" style="max-width: 600px;" node-key="id" show-checkbox
                    :default-checked-keys="defaultCheckedKeys" :default-expanded-keys="[2]" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="confirm(formRef)">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { userGetMenu, userSetmenu, menuList } from '@/api/index'
import PaneHead from '../../../components/panelHead.vue'
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';

const route = useRoute()

onMounted(() => {
    userGetMenu().then(res => {
        // console.log('权限数据', res)
        permissionsData.value = res.data
    })
    getListData()
})

//列表数据
const tableData = reactive({
    list: [],
    total: 0
})

const pagenationData = reactive({
    pageNum: 1,
    pageSize: 10
})

//打开弹窗
const open = (rowData = {}) => {
    dialogVisible.value = true
    // 可以在这里设置表单数据
    nextTick(() => {
        if (rowData) {
            Object.assign(form, { id: rowData.id, name: rowData.name })
            treeRef.value.setCheckedKeys(rowData.permissions) // 设置树形组件的选中状态
        }
    })
}

//点击页码
const handleSizeChange = (val) => {
    pagenationData.pageSize = val
    getListData()
}
//点击当前页回调
const handleCurrentChange = (val) => {
    pagenationData.pageNum = val
    getListData()
}

//请求列表数据
const getListData = () => {
    menuList(pagenationData).then(res => {
        // console.log('列表数据', res)
        const { list, total } = res.data
        tableData.list = list
        tableData.total = total
    })
}

const formRef = ref()

//表单数据
const form = reactive({
    name: "",
    permissions: "",
    id: ""
})

//树形菜单权限数据
const permissionsData = ref([])

//对话框显示状态
const dialogVisible = ref(false)

//关闭对话框前的操作
const beforeClose = () => {
    dialogVisible.value = false
    formRef.value.resetFields() // 重置表单
    // 可以在这里清除树形组件的选中状态
    treeRef.value.setCheckedKeys(defaultCheckedKeys) // 清除树形组件的选中状态
}

//选中权限
const defaultCheckedKeys = [4, 5]
const treeRef = ref()

//表单校验规则
const rules = reactive({
    name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
})

//表单提交
const confirm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            //获取选择的checkbox数据
            const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
            userSetmenu({ name: form.name, permissions, id: form.id }).then(res => {
                // console.log('权限修改结果', res)
                beforeClose()
                getListData()
            })
        } else {
            console.log('error submit', fields);
        }
    })
}

</script>

<style scoped lang="less">
.btn {
    padding: 10px 0 10px 10px;
    background-color: #fff;
}
</style>