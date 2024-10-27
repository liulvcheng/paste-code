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
    setDataList(dataList, firstKey, secondKeys, _this) {
      const result = []
      let no = (_this.currentPage - 1) * _this.pageSize + 1

      // 生成二级合并的唯一键
      const generateSecondaryKey = (item) =>
        secondKeys.map((k) => item[k]).join('|')

      // 按 firstKey 分组
      const groupedByFirst = {}
      dataList.forEach((item) => {
        const firstKeyValue = item[firstKey]
        if (!groupedByFirst[firstKeyValue]) {
          groupedByFirst[firstKeyValue] = []
        }
        groupedByFirst[firstKeyValue].push(item)
      })

      // 处理每个 firstKey 组å
      Object.values(groupedByFirst).forEach((group) => {
        const secondaryGroups = {}

        // 在 firstKey 组内进行二级分组
        group.forEach((item) => {
          const secondaryKey = generateSecondaryKey(item)
          if (!secondaryGroups[secondaryKey]) {
            secondaryGroups[secondaryKey] = []
          }
          secondaryGroups[secondaryKey].push(item)
        })

        // 处理每个二级分组
        let isFirstInGroup = true
        Object.values(secondaryGroups).forEach((secondaryGroup) => {
          secondaryGroup.forEach((item, index) => {
            const newItem = {
              ...item,
              rowSpan: isFirstInGroup ? group.length : 0,
              secondRowSpan: index === 0 ? secondaryGroup.length : 0,
              no: isFirstInGroup ? no : 0,
            }
            result.push(newItem)

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
