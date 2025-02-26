import { reactive } from 'vue'

// 定义类型（HTMLElement 或其子类型，允许 null）
interface ComponentState {
  node: HTMLElement | null
}

// 初始化响应式对象（明确类型 + 初始 null）
const state = reactive<ComponentState>({
  node: null, // 初始为空
})

// 后续赋值（如 DOM 元素挂载时）
const setupNode = () => {
  // 示例：获取 DOM 元素（需要类型断言）
  state.node = document.getElementById('my-element') as HTMLElement

  // 使用 addEventListener（需非空断言或可选链）
  state.node?.addEventListener('click', handleClick)
}

// 重新赋值为其他类型（保持类型一致性）
const resetNode = () => {
  state.node = document.createElement('div') // 新元素
  // 或 state.node = null // 重置为空
}
