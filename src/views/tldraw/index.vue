<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="创建用户ID" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入创建用户ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入标题" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="房间ID" prop="roomId">
        <el-input v-model="queryParams.roomId" placeholder="请输入房间ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="用户群组" prop="members">
        <el-input v-model="queryParams.members" placeholder="请输入用户群组" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <el-input v-model="queryParams.cover" placeholder="请输入封面" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="queryParams.remarks" placeholder="请输入备注" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['tldraw:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['tldraw:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['tldraw:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['tldraw:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tldrawList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="创建用户ID" align="center" prop="userId" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="房间ID" align="center" prop="roomId" />
      <el-table-column label="用户群组" align="center" prop="members" />
      <el-table-column label="类型 (0文件夹 1白板)" align="center" prop="type" />
      <el-table-column label="封面" align="center" prop="cover" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['tldraw:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['tldraw:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改tldraw对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="创建用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入创建用户ID" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="房间ID" prop="roomId">
          <el-input v-model="form.roomId" placeholder="请输入房间ID" />
        </el-form-item>
        <el-form-item label="用户群组" prop="members">
          <el-input v-model="form.members" placeholder="请输入用户群组" />
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-input v-model="form.cover" placeholder="请输入封面" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTldraw, getTldraw, delTldraw, addTldraw, updateTldraw } from '@/api/tldraw/tldraw'

export default {
  name: 'Tldraw',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // tldraw表格数据
      tldrawList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        title: null,
        roomId: null,
        members: null,
        type: null,
        cover: null,
        status: null,
        remarks: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [{ required: true, message: '创建用户ID不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        roomId: [{ required: true, message: '房间ID不能为空', trigger: 'blur' }],
        members: [{ required: true, message: '用户群组不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询tldraw列表 */
    getList() {
      this.loading = true
      listTldraw(this.queryParams).then(response => {
        this.tldrawList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        title: null,
        roomId: null,
        members: null,
        type: null,
        cover: null,
        status: '0',
        remarks: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加tldraw'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getTldraw(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改tldraw'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTldraw(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addTldraw(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal
        .confirm('是否确认删除tldraw编号为"' + ids + '"的数据项？')
        .then(function () {
          return delTldraw(ids)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'tldraw/export',
        {
          ...this.queryParams
        },
        `tldraw_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
