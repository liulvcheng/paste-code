<template>
  <div class="container">
    <a-table
      class="table-area"
      bordered
      :columns="columns"
      :data-source="data"
      :rowKey="(_, index) => index"
      :scroll="{ x: '100%', y: '80vh' }"
    />
    <a-button @click="handleUncheck">click</a-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [
        { id: 1, name: '1', age: '1', tel: '1', isCheck: false, rowSpan: 3 },
        { id: 2, name: '2', age: '2', tel: '2', isCheck: false, rowSpan: 0 },
        { id: 3, name: '3', age: '3', tel: '3', isCheck: false, rowSpan: 0 },
        { id: 4, name: '4', age: '4', tel: '4', isCheck: false, rowSpan: 1 },
      ],
      isCheckAll: false,
      isIndeterminate: false,
      columns: [
        // render 首行为 checkbox
        // 表头 title、表格内容均为 render 出来的
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
          customRender: (_, record) => {
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
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          customRender: (text, record) => {
            return {
              children: text,
              attrs: {
                rowSpan: record.rowSpan,
              },
            }
          },
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: 'Tel',
          dataIndex: 'tel',
          key: 'tel',
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
      this.data.forEach((item) => {
        item.isCheck = this.isCheckAll
      })
      this.isIndeterminate = false
    },
    updateCheckAllStatus() {
      const checkedCount = this.data.filter((item) => item.isCheck).length
      this.isCheckAll = checkedCount === this.data.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.data.length
    },
    // 根据传入的 val 来取消对应 id 的勾选
    handleUncheck(val) {
      this.data.forEach((item) => {
        if (item.id === val) {
          item.isCheck = false
        }
      })
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
}
.table-area {
  width: 80vw;
  margin: 20vh auto;
}
</style>
