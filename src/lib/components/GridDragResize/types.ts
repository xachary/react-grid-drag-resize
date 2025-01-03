// ! 这些配置在嵌套过程中，会从外到内传递继承
export interface GridDragResizeCommonProps<T = any> {
  overflow?: string // CSS overflow
  dragHandler?: string // 拖动锚点（querySelector）
  dropOutHandler?: string // 拖出锚点（querySelector）
  removeHandler?: string // 删除锚点（querySelector）
  //
  readonly?: boolean // * 只读，true 将禁用所有的 xxxable
  //
  draggable?: boolean // 是否可拖动
  resizable?: boolean // 是否可调整大小
  removable?: boolean // 是否移除
  droppableIn?: boolean // 是否可拖入
  droppableOut?: boolean // 是否可拖出
  mask?: boolean // 蒙版，阻止 render 内部鼠标交互
  //
  debug?: boolean
  //
  parentProps?: GridDragResizeProps<T>
}

// 子组件的 Props
export interface GridDragResizeItemProps<T = any> extends GridDragResizeCommonProps {
  columns?: number // 列数
  rows?: number // 行数
  //
  columnStart?: number // CSS columnStart
  columnEnd?: number // CSS columnEnd
  rowStart?: number // CSS rowStart
  rowEnd?: number // CSS rowEnd
  //
  render?: (props: GridDragResizeItemProps) => JSX.Element // 显示内容
  //
  data?: T // 数据项
  //
  grid?: GridDragResizeProps<T> // 子 GridDragResize
  //
  updateColumnStart?: (val: number) => void
  updateColumnEnd?: (val: number) => void
  updateRowStart?: (val: number) => void
  updateRowEnd?: (val: number) => void
  updateRows?: (val: number) => void
  updateColumns?: (val: number) => void
  startDrag?: (val: StartDragEvent) => void
  select?: () => void
  selectResizing?: () => void
  startResize?: (val: StartResizeEvent) => void
  remove?: () => void
  dropStart?: (val: { ele: HTMLElement | null; remove: () => void | undefined }) => void
  dropEnd?: () => void
}

// 组件的 Props
export interface GridDragResizeProps<T = any> extends GridDragResizeCommonProps {
  columns?: number // 列数
  rows?: number // 行数
  gap?: number // 间隙
  columnSize?: number // 列宽，undefined 相当于 1fr
  rowSize?: number // 行高，undefined 相当于 1fr
  columnTemplate?: string // grid 模板 列
  rowTemplate?: string // grid 模板 行
  //
  columnExpandable?: boolean // 允许向右扩展列数
  rowExpandable?: boolean // 允许向下扩展行数
  //
  cells?: GridDragResizeItemProps<T>[] // 子组件配置项
  //
  droppingChild?: GridDragResizeItemProps // 拖入子组件的数据项
  selectedChild?: GridDragResizeItemProps // 选择项
  //
  beforeDrop?: (
    before: GridDragResizeItemProps
  ) => GridDragResizeItemProps | Promise<GridDragResizeItemProps> // 拖入之前进行处理
  //
  suffixClass?: string // 附加 CSS Class
  tagName?: string // 根 HTML 标签
  //
  updateRows?: (val: number) => void
  updateColumns?: (val: number) => void
  updateCells?: (val: GridDragResizeProps['cells']) => void
  updateDroppingChild?: (val?: GridDragResizeItemProps) => void
  updateSelectedChild?: (val?: GridDragResizeItemProps) => void
  select?: (val?: GridDragResizeItemProps) => void
}

// 子组件 startDrag 事件返回数据
export interface StartDragEvent {
  event: MouseEvent
  rect: DOMRect
}

// 子组件 startResize 事件返回数据
export interface StartResizeEvent {
  event: MouseEvent
  rect: DOMRect
  cursor: string
  direction: string
}
