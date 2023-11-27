<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="180px">
      <el-form-item label="author" prop="author">
        <el-input v-model="queryParams.author" placeholder="请输入author" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="comment account" prop="commentNums">
        <el-input v-model="queryParams.commentNums" placeholder="请输入comment account" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="like account" prop="likesNum">
        <el-input v-model="queryParams.likesNum" placeholder="请输入like account" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="page views" prop="seeNum">
        <el-input v-model="queryParams.seeNum" placeholder="请输入page views" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="article state" prop="state">
        <el-input v-model="queryParams.state" placeholder="请输入article state" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="article title" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入article title" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="article type" prop="type">
        <el-input v-model="queryParams.type" placeholder="请输入article type" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:articles:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:articles:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:articles:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:articles:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="articlesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="article id" align="center" prop="id" />
      <el-table-column label="author" align="center" prop="author" />
      <el-table-column label="comment account" align="center" prop="commentNums" />
      <el-table-column label="content" align="center" prop="content" />
      <el-table-column label="cover" align="center" prop="cover" />
      <el-table-column label="image list" align="center" prop="imgList" />
      <el-table-column label="like account" align="center" prop="likesNum" />
      <el-table-column label="page views" align="center" prop="seeNum" />
      <el-table-column label="article state" align="center" prop="state" />
      <el-table-column label="article title" align="center" prop="title" />
      <el-table-column label="article type" align="center" prop="type" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:articles:edit']"
            >修改</el-button
          >
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:articles:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改article sheet对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="author" prop="author">
          <el-input v-model="form.author" placeholder="请输入author" />
        </el-form-item>
        <el-form-item label="comment account" prop="commentNums">
          <el-input v-model="form.commentNums" placeholder="请输入comment account" />
        </el-form-item>
        <el-form-item label="content">
          <editor v-model="form.content" :min-height="192" />
        </el-form-item>
        <!-- <el-form-item label="cover" prop="cover">
          <el-input v-model="form.cover" type="textarea" placeholder="请输入内容" />
        </el-form-item> -->
        <el-form-item label="cover">
          <image-upload v-model="form.cover" />
        </el-form-item>
        <el-form-item label="image list" prop="imgList">
          <el-input v-model="form.imgList" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="like account" prop="likesNum">
          <el-input v-model="form.likesNum" placeholder="请输入like account" />
        </el-form-item>
        <el-form-item label="page views" prop="seeNum">
          <el-input v-model="form.seeNum" placeholder="请输入page views" />
        </el-form-item>
        <el-form-item label="article state" prop="state">
          <el-input v-model="form.state" placeholder="请输入article state" />
        </el-form-item>
        <el-form-item label="article title" prop="title">
          <el-input v-model="form.title" placeholder="请输入article title" />
        </el-form-item>
        <el-form-item label="article type" prop="type">
          <el-input v-model="form.type" placeholder="article type" />
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
import { listArticles, getArticles, delArticles, addArticles, updateArticles } from '@/api/qdpz/articles.js'

export default {
  name: 'Articles',
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
      // article sheet表格数据
      articlesList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        author: null,
        commentNums: null,
        content: null,
        cover: null,
        imgList: null,
        likesNum: null,
        seeNum: null,
        state: null,
        title: null,
        type: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        author: [{ required: true, message: 'author不能为空', trigger: 'blur' }],
        commentNums: [{ required: true, message: 'comment account不能为空', trigger: 'blur' }],
        content: [{ required: true, message: 'content不能为空', trigger: 'blur' }],
        cover: [{ required: true, message: 'cover不能为空', trigger: 'blur' }],
        imgList: [{ required: true, message: 'image list不能为空', trigger: 'blur' }],
        likesNum: [{ required: true, message: 'like account不能为空', trigger: 'blur' }],
        seeNum: [{ required: true, message: 'page views不能为空', trigger: 'blur' }],
        state: [{ required: true, message: 'article state不能为空', trigger: 'blur' }],
        title: [{ required: true, message: 'article title不能为空', trigger: 'blur' }],
        type: [{ required: true, message: 'article type不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询article sheet列表 */
    getList() {
      this.loading = true
      listArticles(this.queryParams).then(response => {
        this.articlesList = response.rows
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
        author: null,
        commentNums: null,
        content: null,
        createTime: null,
        cover: null,
        imgList: null,
        likesNum: null,
        seeNum: null,
        state: null,
        title: null,
        type: null
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
      this.title = '添加article sheet'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getArticles(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改article sheet'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateArticles(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addArticles(this.form).then(response => {
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
        .confirm('是否确认删除article sheet编号为"' + ids + '"的数据项？')
        .then(function () {
          return delArticles(ids)
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
        'system/articles/export',
        {
          ...this.queryParams
        },
        `articles_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
