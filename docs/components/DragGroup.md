---
title: 拖拽组
toc: content # 在页面右侧展示锚点链接
group:
  title: 高级组件
  order: 1
---

# 拖拽组(DragGroup)

## 使用场景

实际开发中常见需要拖拽的组件，比如导出时需要给导出的字段选择顺序，这个时候希望交互为拖拽顺序，这个时候可以使用
**拖拽组（DragGroup）** 组件。

## 代码样例

<code src="../demos/DragGroup.tsx">拖拽组演示样例</code>

## 属性和方法

### IDragGroupProps

| 属性名        | 描述     | 类型                                       | 默认值 |
| ------------- | -------- | ------------------------------------------ | ------ |
| initValueEnum | 初始的值 | `IDragGroupValueEnumProps[]`               | []     |
| className     | 类名     | `string`                                   |
| style         | 样式     | `React.CSSProperties`                      |
| onChange      | 回调函数 | `(v: IDragGroupValueEnumProps[]) => void;` |

### IDragGroupValueEnumProps

| 属性名      | 描述         | 类型                                                      | 默认值 |
| ----------- | ------------ | --------------------------------------------------------- | ------ |
| label       | 按钮文本     | `string` \| `number` \| `ReactNode`                       |        |
| value       | 按钮唯一标识 | `string` \| `number` \| `Record<any, any>` \| `undefined` |
| isDraggable | 是否可以拖拽 | `boolean`                                                 | true   |
| allowDelete | 是否可以删除 | `boolean`                                                 | true   |
