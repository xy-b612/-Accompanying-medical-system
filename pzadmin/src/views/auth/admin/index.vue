<template>
    <PanelHead :route="route" />
    <el-table :data="tableData.list" width="100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="permissions_id" label="所属组别">
            <template #default="scope">
                {{ permissionName(scope.row.permissions_id) }}
            </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column label="状态">
            <template #default="scope">
                <el-tag :type="scope.row.active ? 'success' : 'danger'">
                    {{ scope.row.active ? '正常' : '失效' }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="创建时间">
            <template #default="scope">
                <div class="flex-box">
                    <el-icon>
                        <clock />
                    </el-icon>
                    <span style="margin-left: 10px;">{{ scope.row.create_time }}</span>
                </div>
            </template>
        </el-table-column>
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
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" disabled />
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="菜单权限" prop="permissions_id">
                <el-select v-model="form.permissions_id" palceholder="请选择菜单权限" style="width: 240px;">
                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
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
import { authAdmin, menuSelectlist, updateUser } from '@/api/index'
import { reactive, onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';

const route = useRoute()
//console.log(route, 'route');

const pagenationData = reactive({
    pageNum: 1,
    pageSize: 10
})

//列表数据
const tableData = reactive({
    list: [],
    total: 0
})

onMounted(() => {
    getListData()
    menuSelectlist().then(res => {
        options.value = res.data
    })
})

//请求列表
const getListData = () => {
    authAdmin(pagenationData).then(res => {
        console.log('管理员数据', res)
        const { list, total } = res.data
        list.forEach(item => {
            item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
        });
        tableData.list = list
        tableData.total = total
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

//弹窗
const dialogVisible = ref(false)
const beforeClose = () => {
    dialogVisible.value = false
}

//规则
const rules = reactive({
    name: [{ required: true, message: '请填写昵称', trigger: 'blur' }],
    permissions_id: [{ required: true, message: '请选择菜单权限', trigger: 'blur' }]
})


//编辑表单
const formRef = ref()
const form = reactive({
    name: '',
    permissions_id: ''
})
//表单提交
const confirm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            const { name, permissions_id } = form
            updateUser({ name, permissions_id }).then(res => {
                if (res.code === 10000) {
                    dialogVisible.value = false
                    getListData()
                } else {

                }
            })
        } else {
            console.log('error submit', fields);
        }
    })
}

const options = ref([])
//根据权限id匹配权限名称
const permissionName = (id) => {
    const data = options.value.find(el => el.id === id)
    return data ? data.name : '超级管理员'
}

const open = (rowData) => {
    dialogVisible.value = true
    Object.assign(form, { mobile: rowData.mobile, name: rowData.name, permissions_id: rowData.permissions_id })
}

</script>

<style scoped lang="less">
:deep(.flex-box) {
    display: flex;
    align-items: center;
}
</style>