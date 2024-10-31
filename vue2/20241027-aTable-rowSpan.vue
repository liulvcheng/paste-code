<template>
  <div class="container">
    <a-table
      class="table-area"
      bordered
      :columns="columns"
      :data-source="dataList"
      :rowKey="(_, index) => index"
      :scroll="{ x: '100%', y: '80vh' }"
    />
    <a-button @click="handleUncheck">click</a-button>
  </div>
</template>

<script>
export default {
  mounted() {
    this.dataList = this.setDataList(
      this.data,
      this.firstKey,
      this.secondKeys,
      this
    )
  },
  data() {
    return {
      isCheckAll: false,
      isIndeterminate: false,
      count: 0,
      currentPage: 1,
      pageSize: 10,
      firstKey: 'id',
      secondKeys: ['name', 'age'],
      dataList: [],
      data: [
        {
          id: 1,
          name: 'zhangsan',
          age: 10,
          tel: 'tel 1',
          isCheck: false,
          inputParamsKey: 'number',
        },
        {
          id: 1,
          name: 'zhangsan',
          age: 10,
          tel: 'tel 2',
          isCheck: false,
          inputParamsKey: 'string',
        },
        {
          id: 1,
          name: 'lisi',
          age: 20,
          tel: 'tel 1',
          isCheck: false,
          inputParamsKey: 'number',
        },
        {
          id: 1,
          name: 'lisi',
          age: 20,
          tel: 'tel 2',
          isCheck: false,
          inputParamsKey: 'string',
        },
        {
          id: 2,
          name: 'wangwu',
          age: 30,
          tel: 'wangwu - tel',
          isCheck: false,
          inputParamsKey: 'string',
        },
      ],
      columns: [
        {
          title: () => (
            <a-checkbox
              indeterminate={this.isIndeterminate}
              checked={this.isCheckAll}
              onChange={this.onCheckAllClick}
            />
          ),
          dataIndex: 'check',
          key: 'check',
          customRender: (text, record) => {
            return {
              children: (
                <a-checkbox
                  checked={record.isCheck}
                  onChange={() => this.onCheckClick(record)}
                />
              ),
              attrs: {
                rowSpan: record.rowSpan,
              },
            }
          },
        },
        {
          title: 'No',
          dataIndex: 'no',
          key: 'no',
          customRender: this.renderWithRowSpan(),
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          customRender: this.renderWithRowSpan(),
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
          customRender: this.renderWithRowSpan(),
        },
        {
          title: 'Tel',
          dataIndex: 'tel',
          key: 'tel',
          customRender: this.renderWithRowSpan(),
        },
        {
          title: 'InputParamsKey',
          dataIndex: 'inputParamsKey',
          key: 'inputParamsKey',
          customRender: this.renderWithRowSpan(),
        },
      ],
    }
  },
  methods: {
    onCheckClick(record) {
      record.isCheck = !record.isCheck
      this.updateCheckAllStatus()
    },
    onCheckAllClick(e) {
      this.isCheckAll = e.target.checked
      this.dataList.forEach((item) => {
        item.isCheck = this.isCheckAll
      })
      this.isIndeterminate = false
    },
    updateCheckAllStatus() {
      const checkedCount = this.dataList.filter((item) => item.isCheck).length
      this.isCheckAll = checkedCount === this.dataList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.dataList.length
    },
    handleUncheck() {
      if (this.count >= this.dataList.length) {
        this.count = 0
      }
      this.dataList[this.count].isCheck = false
      this.count++
    },
    renderWithRowSpan() {
      return (text, record, _, column) => {
        let rowSpan = 1
        if ([this.firstKey, 'no'].includes(column.dataIndex)) {
          rowSpan = record.rowSpan
        } else if (this.secondKeys.includes(column.dataIndex)) {
          rowSpan = record.secondRowSpan
        }

        return {
          children: text,
          attrs: {
            rowSpan: rowSpan,
          },
        }
      }
    },
    generateGroupKey(item, keys) {
      return keys?.map((k) => item[k]).join('|')
    },

    // 按键分组：根据生成的键将数据分组
    // 示例输入: items = [{id: 1, type: 'A'}, {id: 2, type: 'A'}, {id: 3, type: 'B'}]
    // 示例输出: { 'A': [{id: 1, type: 'A'}, {id: 2, type: 'A'}], 'B': [{id: 3, type: 'B'}] }
    groupByKey(items, keyGenerator) {
      const groups = {}
      items.forEach((item) => {
        const key = keyGenerator(item)
        if (!groups[key]) {
          groups[key] = []
        }
        groups[key].push(item)
      })
      return groups
    },

    /**
     * 设置数据列表的行合并信息
     * @param {Array} dataList - 原始数据列表
     * @param {Object} options - 配置选项
     * @param {string} options.firstKey - 第一级分组键
     * @param {Array} options.secondKeys - 第二级分组键数组
     * @param {Array} options.thirdKeys - 第三级分组键数组
     * @param {Object} _this - Vue 组件实例，用于获取分页信息
     *
     * 示例输入:
     * dataList = [
     *   { department: 'IT', position: 'dev', level: 'senior', name: 'John' },
     *   { department: 'IT', position: 'dev', level: 'senior', name: 'Mike' },
     *   { department: 'IT', position: 'qa', level: 'junior', name: 'Tom' }
     * ]
     * options = {
     *   firstKey: 'department',
     *   secondKeys: ['position', 'level'],
     *   thirdKeys: ['name']
     * }
     *
     * 示例输出:
     * [
     *   { department: 'IT', position: 'dev', level: 'senior', name: 'John', rowSpan: 3, secondRowSpan: 2, thirdRowSpan: 1, no: 1 },
     *   { department: 'IT', position: 'dev', level: 'senior', name: 'Mike', rowSpan: 0, secondRowSpan: 0, thirdRowSpan: 1, no: 0 },
     *   { department: 'IT', position: 'qa', level: 'junior', name: 'Tom', rowSpan: 0, secondRowSpan: 1, thirdRowSpan: 1, no: 0 }
     * ]
     */
    setDataList(dataList, { firstKey, secondKeys, thirdKeys }, _this) {
      const result = []
      let no = (_this.currentPage - 1) * _this.pageSize + 1

      // 一级分组：按 firstKey 分组
      const firstGroups = groupByKey(dataList, (item) => item[firstKey])

      Object.values(firstGroups).forEach((group) => {
        // 二级分组：按 secondKeys 组合分组
        const secondGroups = groupByKey(group, (item) =>
          generateGroupKey(item, secondKeys)
        )
        let isFirstInGroup = true

        Object.values(secondGroups).forEach((secondGroup) => {
          // 三级分组：如果有 thirdKeys，则按 thirdKeys 组合分组
          let thirdGroups = null
          if (thirdKeys?.length) {
            thirdGroups = groupByKey(secondGroup, (item) =>
              generateGroupKey(item, thirdKeys)
            )
          }

          secondGroup.forEach((item, index) => {
            // 计算三级分组的行数
            let thirdRowSpan = 0
            if (thirdGroups && index === 0) {
              const thirdKey = generateGroupKey(item, thirdKeys)
              thirdRowSpan = thirdGroups[thirdKey].length
            }

            // 构建结果项
            result.push({
              ...item,
              rowSpan: isFirstInGroup ? group.length : 0,
              secondRowSpan: index === 0 ? secondGroup.length : 0,
              thirdRowSpan,
              no: isFirstInGroup ? no : 0,
            })

            // 更新首项标记和序号
            if (isFirstInGroup) {
              no++
              isFirstInGroup = false
            }
          })
        })
      })

      return result
    },
  },
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  max-width: 1800px;
  margin: 100px auto;
}

.table-area {
  width: 100%;
  max-width: 80vw;
  margin: 2rem auto;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .table-area {
    max-width: 95vw;
  }
}

.a-button {
  margin-top: 1rem;
}
</style>
