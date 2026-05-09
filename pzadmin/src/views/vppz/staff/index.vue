<template>
    <PanelHead :route="route" />
    <div class="btns">
        <el-button icon="Plus" type="primary" @click="open(null)" size="small">新增</el-button>
        <el-popconfirm confirm-button-text="是" cancel-button-text="否" :icon="InfoFilled" icon-color="#626AEF"
            title="是否确认删除？" @confirm="confirmEvent">
            <template #reference>
                <el-button type="danger" :icon="Delete" size="small">删除</el-button>
            </template>
        </el-popconfirm>
    </div>
    <!-- 列表 -->
    <el-table :data="tableData.list" style="width:100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column label="头像">
            <template #default="scope">
                <el-image style="width:50px;height:50px" :src="scope.row.avatar" />
            </template>
        </el-table-column>
        <el-table-column label="性别">
            <template #default="scope">
                {{ scope.row.sex === 1 ? '男' : '女' }}
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
        <el-table-column label="编辑">
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-info">
        <el-pagination v-model:current-page="pagenationData.pageNum" :page-size="pagenationData.pageSize" size="small"
            :background="false" layout="total, prev, pager, next" :total="tableData.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 弹窗 -->
    <el-dialog v-model="dialogformVisiable" :before-close="beforeClose" destroy-on-close title="培护师" width="500">
        <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
            <el-form-item v-show="false" prop="id">
                <el-input v-model="form.id" />
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <el-button v-if="!form.avatar" type="primary" @click="dialogImgVisiable = true">点击上传</el-button>
                <el-image v-else :src="form.avatar" style="height:100px;width:100px;"
                    @click="dialogImgVisiable = true" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex" :options="options" placeholder="请选择性别" />
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input-number v-model="form.age" :step="1" :min="1" />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="是否生效" prop="active">
                <el-radio-group v-model="form.active">
                    <el-radio :value="0">失效</el-radio>
                    <el-radio :value="1">生效</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="confirm(formRef)">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 添加图片弹窗 -->
    <el-dialog v-model="dialogImgVisiable" :before-close="beforeCloseImg" @open="onImageDialogOpen" title="选择图片"
        width="680">
        <div class="image-list">
            <div v-for="(item, index) in fileList" :key="item.name" class="img-box" @click="selectIndex = index">
                <div v-if="selectIndex === index" class="select">
                    <el-icon color="#fff">
                        <Check />
                    </el-icon>
                </div>
                <el-image style="width:148px;height:148px" :src="item.url" />
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogImgVisiable = false">
                    取消
                </el-button>
                <el-button type="primary" @click="confirmImage">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>

</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { Plus, InfoFilled, Delete } from '@element-plus/icons-vue';
import { photoList, Companion, companionList, deleteCompanion } from '@/api/index'
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';

const route = useRoute()

onMounted(() => {
    photoList().then(res => {
        fileList.value = res.data
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

const getListData = () => {
    companionList(pagenationData).then(res => {
        const { list, total } = res.data
        tableData.list = list
        tableData.total = total
    })
}

//弹窗
const dialogformVisiable = ref(false)
const beforeClose = () => {
    dialogformVisiable.value = false
}

const resetFormData = () => {
    form.id = 0
    form.mobile = ""
    form.active = 1
    form.age = 20
    form.avatar = ""
    form.name = ""
    form.sex = ""
}

const formRef = ref()
const form = reactive({
    "id": 0,
    "mobile": "",
    "active": 1,
    "age": 20,
    "avatar": "",
    "name": "",
    "sex": ""
})

const rules = reactive({
    name: [{ required: true, trigger: 'blur', message: '请填写昵称' }],
    avatar: [{ required: true, message: '请选择头像' }],
    sex: [{ required: true, trigger: 'change', message: '请选择性别' }],
    mobile: [{ required: true, trigger: 'blur', message: '请填写手机号' }]
})

const options = [
    {
        value: '1',
        label: '男'
    },
    {
        value: '2',
        label: '女'
    }
]

const confirm = async (formEl) => {
    if (!formEl) return
    try {
        await formEl.validate()
        await Companion(form).then(res => {
            if (res.code === 10000) {
                ElMessage.success('成功')
                beforeClose()
                getListData()
            } else {
                ElMessage.error(res.message)
            }
        })
    } catch (error) {
        console.log('error submit', error);
    }
}

const open = (rowData = {}) => {
    dialogformVisiable.value = true
    nextTick(() => {
        resetFormData()
        //编辑情况
        if (rowData && Object.keys(rowData).length) {
            Object.assign(form, rowData)
        }
    })
}

//头像上传弹窗
const dialogImgVisiable = ref(false)
const fileList = ref([])
const selectIndex = ref(0)

const confirmImage = () => {
    form.avatar = fileList.value[selectIndex.value].url
    dialogImgVisiable.value = false
}

const beforeCloseImg = () => {
    dialogImgVisiable.value = false
}

const onImageDialogOpen = () => {
    selectIndex.value = 0
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

const selectTableData = ref([])
const handleSelectionChange = (val) => {
    selectTableData.value = val.map(item => ({ id: item.id }))
}
const confirmEvent = () => {
    if (!selectTableData.value.length) {
        return ElMessage.warning('请至少选择一项数据')
    } else {
        deleteCompanion({ id: selectTableData.value }).then(res => {
            if (res.code === 10000) {
                ElMessage.success('删除成功')
                //清空选中
                selectTableData.value = []
                if (tableData.list.length === 1 && pagenationData.pageNum > 1) {
                    pagenationData.pageNum--
                }
                getListData()
            } else {
                ElMessage.error(res.message || '删除失败')
            }
        }).catch(() => {
            ElMessage.error('删除请求失败')
        })
    }
}
</script>

<style scoped lang="less">
.btns {
    padding: 10px 0 10px 10px;
    background-color: #fff;
}

:deep(.flex-box) {
    display: flex;
    align-items: center;
}

.image-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .img-box {
        position: relative;

        .select {
            position: absolute;
            left: 0px;
            top: 0px;
            width: 24px;
            height: 24px;
            background-color: #67c23a;
            z-index: 999;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .el-image {
        margin-right: 10px;
        margin-bottom: 10px;
    }
}
</style>