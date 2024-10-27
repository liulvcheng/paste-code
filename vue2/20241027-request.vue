<template>
  <div class="container">
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <a-row type="flex" :gutter="16">
        <a-col :span="12">
          <a-form-model-item label="API 路径" prop="apiPath">
            <a-input v-model="form.apiPath" placeholder="请输入 API 路径" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="请求方式" prop="httpMethod">
            <a-select v-model="form.httpMethod" placeholder="请求方式">
              <a-select-option value="get">GET</a-select-option>
              <a-select-option value="post">POST</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <div class="form-item-group">
        <a-row
          type="flex"
          justify="space-between"
          :gutter="16"
          v-for="(item, index) in form.items"
          :key="index"
        >
          <a-col :span="3">
            <a-form-model-item
              :label="item.hiddenLabel ? '' : '模型参数名'"
              :prop="`items[${index}].modelParamsKey`"
              :rules="[
                {
                  required: !item.isFixed,
                  // required:
                  //   !item.isFixed || (!item.isFixed && this.isHandleTest),
                  message: '请输入模型参数名！',
                  trigger: 'blur',
                },
                {
                  validator: validateUnique('modelParamsKey'),
                  trigger: 'blur',
                },
              ]"
            >
              <a-input v-model="item.modelParamsKey" placeholder="模型参数名" />
            </a-form-model-item>
          </a-col>
          <a-col :span="3">
            <a-form-model-item
              :label="item.hiddenLabel ? '' : '模型参数值'"
              :prop="`items[${index}].modelParamsValue`"
              :rules="{
                required: !item.isFixed,
                // required: !item.isFixed || (!item.isFixed && this.isHandleTest),
                message: '请输入模型参数值！',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="item.modelParamsValue"
                placeholder="模型参数值"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="3">
            <a-form-model-item
              :label="item.hiddenLabel ? '' : '模型参数类型'"
              :prop="`items[${index}].paramType`"
              :rules="{
                required: !item.isFixed,
                message: '请输入模型参数类型！',
                trigger: 'blur',
              }"
            >
              <a-select v-model="item.paramType" placeholder="模型参数类型">
                <a-select-option value="string">字符串</a-select-option>
                <a-select-option value="number">数字</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="3">
            <a-form-model-item
              :label="item.hiddenLabel ? '' : '入参名'"
              :prop="`items[${index}].inputParamsKey`"
              :rules="[
                { required: true, message: '请输入入参名！', trigger: 'blur' },
                {
                  validator: validateUnique('inputParamsKey'),
                  trigger: 'blur',
                },
              ]"
            >
              <a-input v-model="item.inputParamsKey" placeholder="入参名" />
            </a-form-model-item>
          </a-col>
          <a-col :span="3">
            <a-form-model-item
              :label="item.hiddenLabel ? '' : '入参值'"
              :prop="`items[${index}].inputParamsValue`"
              :rules="{
                required: item.isFixed,
                // required: item.isFixed || (item.isFixed && this.isHandleTest),
                message: '请输入入参值！',
                trigger: 'blur',
              }"
            >
              <a-input v-model="item.inputParamsValue" placeholder="入参值" />
            </a-form-model-item>
          </a-col>
          <a-col :span="3">
            <a-form-model-item
              :label="item.hiddenLabel ? '' : '出参类型'"
              :prop="`items[${index}].paramType`"
              :rules="{
                required: true,
                message: '请输入出参类型！',
                trigger: 'blur',
              }"
            >
              <a-select v-model="item.paramType" placeholder="出参类型">
                <a-select-option value="string">字符串</a-select-option>
                <a-select-option value="number">数字</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="3">
            <a-form-model-item :label="item.hiddenLabel ? '' : '操作'">
              <div class="action-buttons">
                <a-button
                  @click="addItem"
                  type="primary"
                  icon="plus"
                  class="action-button"
                  >新增</a-button
                >
                <a-button
                  @click="removeItem(index)"
                  type="danger"
                  icon="minus"
                  :disabled="form.items.length === 1"
                  class="action-button"
                  >删除</a-button
                >
                <a-icon
                  :type="item.isFixed ? 'lock' : 'unlock'"
                  @click="toggleFixed(index)"
                  class="toggle-icon"
                />
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
    </a-form-model>
    <div class="submit-btn">
      <a-button @click="handleSubmit" type="primary" icon="plus">提交</a-button>
      <a-button @click="handleTest" type="primary">测试</a-button>
      <a-button @click="handleClear" type="info">清空</a-button>
    </div>
  </div>
</template>

<script>
// import { request } from '@/utils'

export default {
  data() {
    return {
      isHandleTest: false,
      form: {
        apiPath: 'apiPath',
        httpMethod: undefined,
        items: [
          {
            modelParamsKey: '',
            modelParamsValue: '',
            paramType: undefined,
            inputParamsKey: '',
            inputParamsValue: '',
            isFixed: false,
            hiddenLabel: false,
          },
        ],
      },
      rules: {
        apiPath: [
          { required: true, message: '请输入 API 路径！', trigger: 'blur' },
        ],
        httpMethod: [
          { required: true, message: '请选择请求方式！', trigger: 'change' },
        ],
      },
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.isHandleTest = false
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log('Received values of form: ', this.form)
          // 这里可以添加提交逻辑
        } else {
          console.log('Validation failed')
          this.$message.error('表单验证失败，请检查必填字段')
        }
      })
    },
    constructRequestData(form) {
      const { apiPath, httpMethod, items } = form
      let params = {}
      let url = apiPath

      // 构造 params 对象
      items.forEach((item) => {
        params[item.modelParamsKey] = item.modelParamsValue || ''
        params[item.inputParamsKey] = item.inputParamsValue || ''
      })

      // 处理 GET 请求
      if (httpMethod.toLowerCase() === 'get') {
        const queryParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          queryParams.append(key, value)
        })
        url = `${apiPath}?${queryParams.toString()}`
        params = undefined // GET 请求不需要 params
      }

      return { url, params }
    },
    // 通过 validate 方法验证
    // handleTest() {
    //   this.$refs.ruleForm.validate((valid) => {
    //     if (valid) {
    //       console.log('here')
    //     }
    //   })
    // },
    // 通过手动验证必填字段和唯一性验证
    handleTest() {
      this.isHandleTest = true
      // 手动验证必填字段
      const { apiPath, httpMethod, items } = this.form

      if (!apiPath || !httpMethod) {
        this.$message.error('请填写 API 路径和请求方式')
        return
      }

      const invalidItems = items.filter((item) => {
        if (item.isFixed) {
          return (
            !item.inputParamsKey || !item.inputParamsValue || !item.paramType
          )
        } else {
          return (
            !item.modelParamsKey ||
            !item.modelParamsValue ||
            !item.inputParamsKey ||
            !item.paramType
          )
        }
      })
      if (invalidItems.length > 0) {
        this.$message.error('请填写所有必填字段')
        return
      }

      // 验证唯一性
      const modelParamsKeys = items
        .map((item) => item.modelParamsKey)
        .filter(Boolean)
      const inputParamsKeys = items.map((item) => item.inputParamsKey)
      if (new Set(modelParamsKeys).size !== modelParamsKeys.length) {
        this.$message.error('模型参数名必须唯一')
        return
      }
      if (new Set(inputParamsKeys).size !== inputParamsKeys.length) {
        this.$message.error('入参名必须唯一')
        return
      }

      const { url, params } = this.constructRequestData(this.form)
      const isGet = httpMethod.toLowerCase() === 'get'
      request({
        url: isGet ? url : apiPath,
        method: httpMethod,
        data: isGet ? undefined : params,
      })
        .then((response) => {
          console.log('Test response:', response)
          this.$message.success('测试请求成功')
        })
        .catch((error) => {
          console.error('Test error:', error)
          this.$message.error('测试请求失败')
        })
    },
    handleClear() {
      this.$refs.ruleForm.resetFields()
    },
    addItem() {
      this.form.items.push({
        modelParamsKey: '',
        modelParamsValue: '',
        paramType: '',
        inputParamsKey: '',
        inputParamsValue: '',
        isFixed: false,
        hiddenLabel: true,
      })
    },
    removeItem(index) {
      this.form.items.splice(index, 1)
    },
    toggleFixed(index) {
      this.form.items[index].isFixed = !this.form.items[index].isFixed
      this.$refs.ruleForm.validateField(`items[${index}]`)
    },
    validateUnique(field) {
      return (rule, value, callback) => {
        if (!value) {
          callback()
          return
        }
        const count = this.form.items.filter(
          (item) => item[field] === value
        ).length
        if (count > 1) {
          callback(
            new Error(
              `${
                field === 'modelParamsKey' ? '模型参数名' : '入参名'
              }必须是唯一的`
            )
          )
        } else {
          callback()
        }
      }
    },
  },
}
</script>

<style scoped>
.container {
  padding: 24px;
  background: #fff;
  border-radius: 4px;
}

.form-item-group {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 4px;
}

.action-buttons {
  display: flex;
  align-items: center;
  padding-top: 4px;
}

.action-button {
  margin-right: 8px;
}

.toggle-icon {
  font-size: 20px;
  cursor: pointer;
  color: #1890ff;
  transition: color 0.3s;
}

.toggle-icon:hover {
  color: #40a9ff;
}

.submit-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

/* 覆盖 Ant Design 的一些默认样式 */
:deep(.ant-form-item) {
  margin-bottom: 0;
}

:deep(.ant-form-item-label) {
  line-height: 32px;
}

:deep(.ant-input) {
  border-radius: 4px;
}

:deep(.ant-btn) {
  border-radius: 4px;
}
</style>
