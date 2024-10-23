import {
  useContext,
  useMemo,
  createElement,
  useRef,
  useCallback,
  type CSSProperties,
  useEffect,
  type DOMAttributes,
  useState,
} from 'react'

import type {
  GridDragResizeProps,
  GridDragResizeItemProps,
  StartDragEvent,
  StartResizeEvent,
} from './types'

import { GridDragResizeContext, type GridDragResizeContextType } from './context'

import GridDragResizeItem from './GridDragResizeItem'

type GridDragResizeComponent = GridDragResizeProps & {
  className?: string
} & DOMAttributes<HTMLDivElement>

let id = 0
const map = new Map()
function idGen(cell: GridDragResizeProps) {
  if (map.has(cell)) {
    return map.get(cell)
  } else {
    const next = ++id
    map.set(cell, next)
    return next
  }
}

function GridDragResizeWithTagName(props: GridDragResizeComponent) {
  const columnsParsed = useMemo(() => props?.columns || 1, [props?.columns])
  const rowsParsed = useMemo(() => props?.rows || 1, [props?.rows])
  const gapParsed = useMemo(() => props?.gap || 0, [props?.gap])

  const cellsParsed = useRef<GridDragResizeItemProps[]>([...(props?.cells ?? [])])
  const [cellsParsedState, setCellsParsedState] = useState(cellsParsed.current)

  const rootEle = useRef<HTMLDivElement | null>(null)
  const [rootEleState] = useState(rootEle.current)

  // 穿透上下文
  const context =
    useContext(GridDragResizeContext) ??
    ({
      gird: { props },
    } as GridDragResizeContextType)

  // 判断嵌套
  const sub = context.gird !== props

  // 穿透 Props 处理
  const overflowParsed = useMemo(
    () => props?.overflow || context.cell?.props.overflow || context.gird?.props.overflow,
    [props?.overflow, context.cell?.props.overflow, context.gird?.props.overflow]
  )
  const dragHandlerParsed = useMemo(
    () => props?.dragHandler || context.cell?.props.dragHandler || context.gird?.props.dragHandler,
    [props?.dragHandler, context.cell?.props.dragHandler, context.gird?.props.dragHandler]
  )
  const dropOutHandlerParsed = useMemo(
    () =>
      props?.dropOutHandler ||
      context.cell?.props.dropOutHandler ||
      context.gird?.props.dropOutHandler,
    [props?.dropOutHandler, context.cell?.props.dropOutHandler, context.gird?.props.dropOutHandler]
  )
  const removeHandlerParsed = useMemo(
    () =>
      props?.removeHandler ||
      context.cell?.props.removeHandler ||
      context.gird?.props.removeHandler,
    [props?.removeHandler, context.cell?.props.removeHandler, context.gird?.props.removeHandler]
  )
  //
  const readonlyParsed = useMemo(
    () => props?.readonly ?? context.cell?.props.readonly ?? context.gird?.props.readonly,
    [props?.readonly, context.cell?.props.readonly, context.gird?.props.readonly]
  )
  //
  const draggableParsed = useMemo(
    () =>
      readonlyParsed
        ? false
        : (props?.draggable ?? context.cell?.props.draggable ?? context.gird?.props.draggable),
    [readonlyParsed, props?.draggable, context.cell?.props.draggable, context.gird?.props.draggable]
  )
  const resizableParsed = useMemo(
    () =>
      readonlyParsed
        ? false
        : (props?.resizable ?? context.cell?.props.resizable ?? context.gird?.props.resizable),
    [readonlyParsed, props?.resizable, context.cell?.props.resizable, context.gird?.props.resizable]
  )
  const removableParsed = useMemo(
    () =>
      readonlyParsed
        ? false
        : (props?.removable ?? context.cell?.props.removable ?? context.gird?.props.removable),
    [readonlyParsed, props?.removable, context.cell?.props.removable, context.gird?.props.removable]
  )
  const droppableOutParsed = useMemo(
    () =>
      readonlyParsed
        ? false
        : (props?.droppableOut ??
          context.cell?.props.droppableOut ??
          context.gird?.props.droppableOut),
    [
      readonlyParsed,
      props?.droppableOut,
      context.cell?.props.droppableOut,
      context.gird?.props.droppableOut,
    ]
  )
  //
  const debugParsed = useMemo(
    () => props?.debug ?? context.cell?.props.debug ?? context.gird?.props.debug,
    [props?.debug, context.cell?.props.debug, context.gird?.props.debug]
  )
  //
  const droppableInParsed = useMemo(
    () => (readonlyParsed ? false : (props?.droppableIn ?? context.gird?.props.droppableIn)),
    [readonlyParsed, props?.droppableIn, context.gird?.props.droppableIn]
  )
  //
  const beforeDropParsed = useMemo(
    () => props?.beforeDrop ?? context.gird?.props.beforeDrop,
    [props?.beforeDrop, context.gird?.props.beforeDrop]
  )
  //
  const suffixClassParsed = useMemo(() => {
    return props?.suffixClass || context.gird?.props.suffixClass
  }, [props?.suffixClass, context.gird?.props.suffixClass])

  const TagNameParsed = useMemo(() => {
    return props?.tagName || context.gird?.props.tagName || 'div'
  }, [props?.tagName, context.gird?.props.tagName])

  const providePropsRef = useMemo(
    () => ({
      ...props,
      //
      dragHandler: dragHandlerParsed,
      dropOutHandler: dropOutHandlerParsed,
      removeHandler: removeHandlerParsed,
      overflow: overflowParsed,
      //
      readonly: readonlyParsed,
      //
      draggable: draggableParsed,
      resizable: resizableParsed,
      removable: removableParsed,
      droppableOut: droppableOutParsed,
      //
      debug: debugParsed,
      //
      droppableIn: droppableInParsed,
      //
      before: beforeDropParsed,
      //
      suffixClass: suffixClassParsed,
      tagName: TagNameParsed,
    }),
    [
      props,
      dragHandlerParsed,
      dropOutHandlerParsed,
      removeHandlerParsed,
      overflowParsed,
      readonlyParsed,
      draggableParsed,
      resizableParsed,
      removableParsed,
      droppableOutParsed,
      debugParsed,
      droppableInParsed,
      beforeDropParsed,
      suffixClassParsed,
      TagNameParsed,
    ]
  )

  const contextNext: GridDragResizeContextType = {
    gird: {
      props: providePropsRef,
    },
    state: context.state,
  }

  // 默认值处理
  const droppableInDefault = useMemo(() => droppableInParsed ?? true, [droppableInParsed])

  if (debugParsed) {
    console.log(providePropsRef)
  }

  // 正在拖入的目标（仅外部用）
  useEffect(() => {
    if (context.state) {
      context.state.droppingChild = { ...props?.droppingChild }
    }
  }, [context.state, props?.droppingChild])

  const droppingChildParsed = useMemo(() => {
    return context.state?.droppingChild ?? props?.droppingChild
  }, [context.state, props?.droppingChild])

  // 清空 drop 相关状态
  function droppingChildClear() {
    props.updateDroppingChild?.(undefined)

    if (context.state) {
      context.state.droppingChild = undefined
      context.state.droppingChildEle = undefined
      context.state.droppingChildRaw = undefined
      context.state.droppingEle = undefined
      context.state.droppingChildRemove = undefined
    }
  }

  // 在自己内部、自己的 parent drop 不算数
  const droppingSelfOrParent = useMemo(() => {
    if (context.state) {
      if (context.state.droppingChildRaw && rootEleState) {
        return (
          cellsParsedState.includes(context.state.droppingChildRaw) ||
          context.state?.droppingChildEle?.contains(rootEleState)
        )
      }
    }

    return false
  }, [context.state, rootEleState, cellsParsedState])

  // 拖入操作中
  const dropping = useMemo(() => {
    return context.state?.droppingEle === rootEleState && !droppingSelfOrParent
  }, [context.state, rootEleState, droppingSelfOrParent])

  // 限制 扩展
  const rowExpandableParsed = useMemo(
    () => props?.rowExpandable && !droppingSelfOrParent,
    [props?.rowExpandable, droppingSelfOrParent]
  )
  const columnExpandableParsed = useMemo(
    () => props?.columnExpandable && !droppingSelfOrParent,
    [props?.columnExpandable, droppingSelfOrParent]
  )

  // 更新状态
  function stateInjectActionDown(v: boolean) {
    if (context.state) {
      if (v) {
        context.state.actionEle = rootEle.current ?? undefined // 记录 当前正在 drag、resize 的 GridDragResize 组件
      } else {
        context.state.actionEle = undefined
      }
    }
  }

  // 同步外部 cells 变化
  useEffect(() => {
    cellsParsed.current = [...(props?.cells ?? [])]
    setCellsParsedState(cellsParsed.current)
  }, [props?.cells])

  // 转换为 grid 模版
  function gridTemplateParse(count: number, size?: number) {
    return `repeat(${count},${Number.isInteger(size) ? `${size}px` : '1fr'})`
  }

  // 如果没定义 行数/列数，根据 cells 计算合适的 行数/列数
  const calcMaxCount = useCallback(
    (target: string, min?: number, more: GridDragResizeItemProps[] = []) => {
      const calc = [...cellsParsed.current, ...more].reduce((max, cell) => {
        const end = { rows: cell.rowEnd, columns: cell.columnEnd }[target]
        if (end && end > 1) {
          if (end - 1 > max) {
            max = end - 1
          }
        }
        return max
      }, 1)

      return min === void 0 ? calc : min < calc ? calc : min
    },
    [cellsParsed]
  )

  const rows = useRef(props?.rows || 1)
  const [rowsState, setRowsState] = useState(rows.current)

  const columns = useRef(props?.columns || 1)
  const [columnsState, setColumnsState] = useState(columns.current)

  useEffect(() => {
    rows.current = calcMaxCount('rows', rowsParsed)
    setRowsState(rows.current)
    columns.current = calcMaxCount('columns', columnsParsed)
    setColumnsState(columns.current)
    if (rows.current !== rowsParsed) {
      props.updateRows?.(rows.current)
    }

    if (columns.current !== columnsParsed) {
      props.updateColumns?.(columns.current)
    }
  }, [props, calcMaxCount, rowsParsed, columnsParsed])

  // ! 自动计算（书写习惯：从左向右、从上向下）
  useEffect(() => {
    // 一个个计算
    const target = cellsParsed.current.find(
      (o) =>
        [o.columns, o.columnStart, o.columnEnd, o.rows, o.rowStart, o.rowEnd].every(
          (o) => o !== void 0
        ) &&
        o.columns! > 0 &&
        o.columnStart! < 1 &&
        o.columnEnd! < 1 &&
        o.rows! > 0 &&
        o.rowStart! < 1 &&
        o.rowEnd! < 1
    )

    // 开始计算
    if (target) {
      const readyItems = cellsParsed.current.filter(
        (o) =>
          [o.columnStart, o.columnEnd, o.rowStart, o.rowEnd].every((o) => o !== void 0) &&
          o.columnEnd! > o.columnStart! &&
          o.rowEnd! > o.rowStart!
      )

      let on = true
      let columnStart = 1,
        columnEnd = columnStart + target.columns!,
        rowStart = 1,
        rowEnd = rowStart + target.rows!

      for (; on; rowStart++) {
        rowEnd = rowStart + target.rows!

        columnStart = 1
        for (; columnStart + target.columns! <= columnsParsed + 1 && on; columnStart++) {
          columnEnd = columnStart + target.columns!

          //
          let cross = false
          for (const item of readyItems) {
            if (
              !(
                !(
                  (columnStart >= item.columnStart! && columnStart < item.columnEnd!) ||
                  (columnEnd > item.columnStart! && columnEnd <= item.columnEnd!)
                ) ||
                !(
                  (rowStart >= item.rowStart! && rowStart < item.rowEnd!) ||
                  (rowEnd > item.rowStart! && rowEnd <= item.rowEnd!)
                )
              )
            ) {
              cross = true
              break
            }
          }
          if (!cross) {
            on = false
          }
        }
      }

      if (!on) {
        columnStart = columnStart - 1
        rowStart = rowStart - 1

        target.columnStart = columnStart
        target.columnEnd = columnEnd

        target.rowStart = rowStart
        target.rowEnd = rowEnd

        props.updateCells?.(cellsParsed.current)
      }
    }
  }, [props, cellsParsed, columnsParsed])

  // grid 样式
  const style = useMemo<CSSProperties>(() => {
    return {
      gridTemplateColumns: gridTemplateParse(columnsState, props?.columnSize),
      gridTemplateRows: gridTemplateParse(rowsState, props?.rowSize),
      gridGap: gapParsed > 0 ? `${gapParsed}px ${gapParsed}px` : '',
    }
  }, [columnsState, props?.columnSize, props?.rowSize, rowsState, gapParsed])

  // 列宽
  const columnSize = useMemo(() => {
    const rootRect = rootEleState?.getBoundingClientRect() ?? {
      height: 0,
      width: 0,
      x: 0,
      y: 0,
      bottom: 0,
      right: 0,
    }
    return props?.columnSize ?? (rootRect.width - gapParsed * (columnsState - 1)) / columnsState
  }, [columnsState, gapParsed, props?.columnSize, rootEleState])

  // 行高
  const rowSize = useMemo(() => {
    const rootRect = rootEleState?.getBoundingClientRect() ?? {
      height: 0,
      width: 0,
      x: 0,
      y: 0,
      bottom: 0,
      right: 0,
    }
    return props?.rowSize ?? (rootRect.height - gapParsed * (rows.current - 1)) / rows.current
  }, [rows, gapParsed, props?.rowSize, rootEleState])

  // 点击开始位置
  let clickStartX = 0,
    clickStartY = 0
  // 点击偏移量
  let clickOffsetX = 0,
    clickOffsetY = 0

  // 当前调整大小子的数据项
  const resizingChild = useRef<GridDragResizeItemProps | undefined>()

  // 当前调整大小子组件的数据项（初始状态）
  const resizingChildBefore = useRef<GridDragResizeItemProps | undefined>()
  // 当前调整大小子组件的位置、大小信息
  const resizingChildRect = useRef<DOMRect | undefined>()
  // 当前调整大小类型
  const resizingChildCursor = useRef<string>('')
  const [resizingChildCursorState, setResizingChildCursorState] = useState(
    resizingChildCursor.current
  )
  // 当前调整大小方向
  const resizingChildDirection = useRef<string>('')
  // 当前调整大小子组件的 Dom
  const resizingChildEle = useRef<HTMLElement | undefined>()

  // 调整大小开始位置
  let resizeStartClientX = 0,
    resizeStartClientY = 0
  // 调整大小拖动偏移量
  let resizeOffsetClientRow = 0,
    resizeOffsetClientColumn = 0

  // 当前拖动子组件的数据项
  const draggingChild = useRef<GridDragResizeItemProps | undefined>()
  const [draggingChildState, setDraggingChildState] = useState(draggingChild.current)
  // 当前拖动子组件的数据项（初始状态）
  const draggingChildBefore = useRef<GridDragResizeItemProps | undefined>()
  // 当前拖动子组件的位置、大小信息
  const draggingChildRect = useRef<DOMRect | undefined>()
  // 当前拖动子组件的 Dom
  const draggingChildEle = useRef<HTMLElement | undefined>()

  // 拖动开始位置
  let dragStartClientX = 0,
    dragStartClientY = 0
  // 拖动偏移量
  let dragOffsetClientRow = 0,
    dragOffsetClientColumn = 0

  // 计算移动方向
  const rowDirection = 0,
    columnDirection = 0

  // 根据鼠标拖动偏移量，计算列/行方向上，移动后最新的位置和大小
  function calcDragStartEndByOffset(opts: {
    size: number
    gap: number
    span: number
    max: number
    offset: number
    startBefore: number
    direction: number
    expandable: boolean
  }) {
    const { size, gap, span, max, offset, startBefore, expandable } = opts

    const offsetStart = Math.round(offset / (size + gap))

    let start = startBefore + offsetStart

    if (start < 1) {
      start = 1
    }

    if (!expandable) {
      if (start + span > max) {
        start = max - span + 1
      }
    }

    return {
      start,
      end: start + span,
    }
  }

  // 根据鼠标拖动位置（相对于组件），计算列/行方向上的位置，移动后最新的位置和大小
  function calcDragStartEndByPos(opts: {
    size: number
    gap: number
    span: number
    max: number
    pos: number
    expandable: boolean
  }) {
    const { size, gap, span, max, pos, expandable } = opts

    // 虚拟地在 grid 四边补充二分之一的 gap 距离
    // 如此，通过计算 拖动位置（相对于组件）与 大小+间隙 的倍数即可
    let start = Math.ceil((pos + gap / 2) / (size + gap))

    if (start < 1) {
      start = 1
    }

    if (!expandable) {
      if (start + span > max) {
        start = max - span + 1
      }
    }

    return {
      start,
      end: start + span,
    }
  }

  // 根据鼠标拖动偏移量，计算调整大小后的位置
  function calcResizeStartEnd(opts: {
    size: number
    gap: number
    max: number
    offset: number
    startBefore: number
    endBefore: number
    target: 'start' | 'end'
    expandable: boolean
  }) {
    const { size, gap, max, offset, startBefore, endBefore, target, expandable } = opts

    const offsetStart = Math.round(offset / (size + gap))

    if (target === 'start') {
      let start = startBefore + offsetStart

      if (start < 1) {
        start = 1
      }

      if (start >= endBefore) {
        start = endBefore - 1
      }

      return {
        start,
        end: endBefore,
      }
    } else {
      let end = endBefore + offsetStart

      if (!expandable) {
        if (end > max) {
          end = max + 1
        }
      }

      if (end <= startBefore) {
        end = startBefore + 1
      }

      return {
        start: startBefore,
        end,
      }
    }
  }

  // !

  function resizingReset() {
    if (context.state) {
      context.state.resizing = false
    }
    stateInjectActionDown(false)

    resizingChildBefore.current = undefined
    resizingChildRect.current = undefined
    resizingChildCursor.current = ''
    setResizingChildCursorState(resizingChildCursor.current)
    resizingChildDirection.current = ''

    document.body.style.cursor = ''
  }

  function dragReset() {
    if (context.state) {
      context.state.dragging = false
    }
    stateInjectActionDown(false)

    draggingChild.current = undefined
    setDraggingChildState(draggingChild.current)
    draggingChildBefore.current = undefined
    draggingChildRect.current = undefined
    draggingChildEle.current = undefined
  }

  // 元素是否整个在都可视区域内
  function isElementInViewport(el: HTMLElement) {
    const rect = el.getBoundingClientRect()

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  // 滚动使小组件在可视区域内
  function scrollIntoViewIfNeeded(target?: HTMLElement) {
    if (target) {
      if (!isElementInViewport(target)) {
        target.scrollIntoView()
      }
    }
  }

  // 拖动开始
  function startDrag(res: StartDragEvent, cell: GridDragResizeItemProps) {
    console.log('startDrag')
    const { event: e, rect } = res
    if (e && e.currentTarget instanceof HTMLElement) {
      updateDrag(cell, rect, e.currentTarget)
    }
  }

  // 调整大小开始
  function resizingStart(...args: any[] | unknown[]) {
    // 这里的写法是为了通过 github pages 的 type-check
    const res = args[0] as StartResizeEvent
    const { event: e, rect, cursor, direction } = res

    if (e && e.currentTarget instanceof HTMLElement) {
      if (e.currentTarget.parentElement instanceof HTMLElement) {
        resizingChildEle.current = e.currentTarget.parentElement
      }
    }

    // 更新 点击开始位置
    clickStartX = e.clientX
    clickStartY = e.clientY

    // 更新 调整大小开始位置
    resizeStartClientX = e.clientX
    resizeStartClientY = e.clientY

    // 状态互斥
    dragReset()
    if (context.state) {
      context.state.resizing = true
    }
    stateInjectActionDown(true)

    // 更新计算所需信息
    resizingChildRect.current = rect
    resizingChildCursor.current = cursor
    setResizingChildCursorState(resizingChildCursor.current)
    resizingChildDirection.current = direction

    // 拖出区域保持鼠标类型
    document.body.style.cursor = cursor

    // 缓存状态
    resizingChildBefore.current = { ...resizingChild.current }
  }

  // 更新拖动信息
  function updateDrag(cell: GridDragResizeItemProps, rect: DOMRect, target: HTMLElement) {
    console.log('updateDrag', cell)
    draggingChild.current = cell
    setDraggingChildState(draggingChild.current)
    draggingChildBefore.current = { ...cell }
    draggingChildRect.current = rect
    draggingChildEle.current = target
  }

  // 拖动开始
  function dragStart(e: MouseEvent) {
    // 更新 点击开始位置
    clickStartX = e.clientX
    clickStartY = e.clientY

    if (!readonlyParsed) {
      if (draggingChild.current && draggingChildRect.current) {
        // 状态互斥
        resizingReset()
        if (context.state) {
          context.state.dragging = true
        }
        stateInjectActionDown(true)

        // 记录 拖动开始位置
        dragStartClientX = e.clientX
        dragStartClientY = e.clientY
      }
    }
  }

  // 拖动中
  function dragMove(e: MouseEvent) {
    if (context.state?.dragging && draggingChild.current) {
      // 计算 拖动偏移量
      dragOffsetClientColumn = e.clientX - dragStartClientX
      dragOffsetClientRow = e.clientY - dragStartClientY

      // 当前拖动子组件的 grid 大小
      let rowSpan =
        (draggingChild.current.rowEnd ?? draggingChild.current.rowStart ?? 1) -
        (draggingChild.current.rowStart ?? 1)
      let columnSpan =
        (draggingChild.current.columnEnd ?? draggingChild.current.columnStart ?? 1) -
        (draggingChild.current.columnStart ?? 1)

      // 边界处理
      {
        if (rowSpan <= 0) {
          rowSpan = 1
        }

        if (columnSpan <= 0) {
          columnSpan = 1
        }
      }

      // 计算行方向上，移动后最新的位置和大小
      const { start: rowStart, end: rowEnd } = calcDragStartEndByOffset({
        size: rowSize,
        gap: gapParsed,
        span: rowSpan,
        max: rows.current ?? 1,
        offset: dragOffsetClientRow,
        startBefore: draggingChildBefore.current?.rowStart ?? 1,
        direction: rowDirection,
        expandable: rowExpandableParsed ?? false,
      })

      if (rowExpandableParsed) {
        // 向下扩展
        rows.current = calcMaxCount('rows', rowsParsed)
        setRowsState(rows.current)
      }

      // 计算列方向上，移动后最新的位置和大小
      const { start: columnStart, end: columnEnd } = calcDragStartEndByOffset({
        size: columnSize,
        gap: gapParsed,
        span: columnSpan,
        max: columns.current ?? 1,
        offset: dragOffsetClientColumn,
        startBefore: draggingChildBefore.current?.columnStart ?? 1,
        direction: columnDirection,
        expandable: columnExpandableParsed ?? false,
      })

      if (columnExpandableParsed) {
        // 向右扩展
        columns.current = calcMaxCount('columns', columnsParsed)
        setColumnsState(columns.current)
      }

      // 更新 当前拖动子组件的数据项
      draggingChild.current = {
        ...draggingChild.current,
        columnStart,
        columnEnd,
        rowStart,
        rowEnd,
      }

      setDraggingChildState(draggingChild.current)

      // 滚动跟随
      scrollIntoViewIfNeeded(draggingChildEle.current)
    }
    if (context.state?.resizing) {
      // 计算 调整大小拖动偏移量
      resizeOffsetClientColumn = e.clientX - resizeStartClientX
      resizeOffsetClientRow = e.clientY - resizeStartClientY

      if (resizingChild.current) {
        // 行 向
        if (resizingChildDirection.current.startsWith('top')) {
          const { start: rowStart, end: rowEnd } = calcResizeStartEnd({
            size: rowSize,
            gap: gapParsed,
            max: rows.current ?? 1,
            offset: resizeOffsetClientRow,
            startBefore: resizingChildBefore.current?.rowStart ?? 1,
            endBefore: resizingChildBefore.current?.rowEnd ?? 1,
            target: 'start',
            expandable: rowExpandableParsed ?? false,
          })
          resizingChild.current = {
            ...resizingChild.current,
            rowStart,
            rowEnd,
            rows: rowEnd - rowStart,
          }
        } else if (resizingChildDirection.current.startsWith('bottom')) {
          const { start: rowStart, end: rowEnd } = calcResizeStartEnd({
            size: rowSize,
            gap: gapParsed,
            max: rows.current ?? 1,
            offset: resizeOffsetClientRow,
            startBefore: resizingChildBefore.current?.rowStart ?? 1,
            endBefore: resizingChildBefore.current?.rowEnd ?? 1,
            target: 'end',
            expandable: rowExpandableParsed ?? false,
          })
          resizingChild.current = {
            ...resizingChild.current,
            rowStart,
            rowEnd,
            rows: rowEnd - rowStart,
          }

          if (rowExpandableParsed) {
            // 向下扩展
            rows.current = calcMaxCount('rows', rowsParsed)
            setRowsState(rows.current)
          }
        }

        // 列 向
        if (resizingChildDirection.current.endsWith('left')) {
          const { start: columnStart, end: columnEnd } = calcResizeStartEnd({
            size: columnSize,
            gap: gapParsed,
            max: columns.current ?? 1,
            offset: resizeOffsetClientColumn,
            startBefore: resizingChildBefore.current?.columnStart ?? 1,
            endBefore: resizingChildBefore.current?.columnEnd ?? 1,
            target: 'start',
            expandable: columnExpandableParsed ?? false,
          })
          resizingChild.current = {
            ...resizingChild.current,
            columnStart,
            columnEnd,
            columns: columnEnd - columnStart,
          }
        } else if (resizingChildDirection.current.endsWith('right')) {
          const { start: columnStart, end: columnEnd } = calcResizeStartEnd({
            size: columnSize,
            gap: gapParsed,
            max: columns.current ?? 1,
            offset: resizeOffsetClientColumn,
            startBefore: resizingChildBefore.current?.columnStart ?? 1,
            endBefore: resizingChildBefore.current?.columnEnd ?? 1,
            target: 'end',
            expandable: columnExpandableParsed ?? false,
          })
          resizingChild.current = {
            ...resizingChild.current,
            columnStart,
            columnEnd,
            columns: columnEnd - columnStart,
          }

          if (columnExpandableParsed) {
            // 向右扩展
            columns.current = calcMaxCount('columns', columnsParsed)
            setColumnsState(columns.current)
          }
        }
      }

      // 滚动跟随
      scrollIntoViewIfNeeded(resizingChildEle.current)
    }
  }

  // 拖动结束
  function dragEnd(e: MouseEvent) {
    // 计算 点击拖动偏移量
    clickOffsetX = e.clientX - clickStartX
    clickOffsetY = e.clientY - clickStartY

    // 状态重置
    {
      resizingReset()
      dragReset()
    }
  }

  // 清除选择
  function clearSelection() {
    // 判断真实 click
    if (Math.abs(clickOffsetX) < 5 && Math.abs(clickOffsetY) < 5) {
      if (context.state) {
        context.state.selectedChild = undefined
        props.updateSelectedChild?.(undefined)
        props.select?.(undefined)
      }
      resizingChild.current = undefined
    }

    // 状态重置
    {
      resizingReset()
      dragReset()
    }
  }

  // 选择
  function select(cell: GridDragResizeItemProps) {
    if (Math.abs(clickOffsetX) < 5 && Math.abs(clickOffsetY) < 5) {
      if (context.state) {
        context.state.selectedChild = cell
        props.updateSelectedChild?.(cell)
        props.select?.(cell)
      }
    }
  }

  // 选择 调整大小
  function selectResizing(cell: GridDragResizeItemProps) {
    if (Math.abs(clickOffsetX) < 5 && Math.abs(clickOffsetY) < 5) {
      resizingChild.current = cell

      draggingChild.current = undefined
      setDraggingChildState(draggingChild.current)
      draggingChildBefore.current = undefined
      draggingChildRect.current = undefined
      draggingChildEle.current = undefined
    }
  }

  // if (sub) {
  //   // 补充 鼠标超出区域时 计算是否为点击
  //   window.addEventListener('mousedown', (e: MouseEvent) => {
  //     // 更新 点击开始位置
  //     clickStartX = e.clientX
  //     clickStartY = e.clientY
  //   })
  //   window.addEventListener('mouseup', (e: MouseEvent) => {
  //     // 计算 点击拖动偏移量
  //     clickOffsetX = e.clientX - clickStartX
  //     clickOffsetY = e.clientY - clickStartY

  //     // 状态重置
  //     {
  //       resizingReset()
  //       dragReset()
  //     }
  //   })
  // } else {
  window.addEventListener('mousedown', dragStart)
  window.addEventListener('mousemove', dragMove)
  window.addEventListener('mouseup', dragEnd)
  // }

  // 点击空白区域，清空选择
  window.addEventListener('click', clearSelection)

  // 拖入中
  function dropover(e: DragEvent) {
    if (droppableInDefault) {
      e.stopPropagation()
      e.preventDefault()

      if (context.state) {
        context.state.droppingEle = rootEle.current ?? undefined
      }

      if (droppingChildParsed) {
        // 当前拖动子组件的 grid 大小
        const rowSpan = droppingChildParsed.rows ?? 1
        const columnSpan = droppingChildParsed.columns ?? 1

        const rootRect = rootEle?.current?.getBoundingClientRect() ?? {
          height: 0,
          width: 0,
          x: 0,
          y: 0,
          bottom: 0,
          right: 0,
        }

        // 相对于 组件 的鼠标位置（并考虑 相对于 当前拖动子组件 的鼠标位置）
        let posY = e.clientY - rootRect.y
        if (posY < 0) {
          posY = 0
        } else if (!rowExpandableParsed && posY > rootRect.height) {
          posY = rootRect.height
        }

        let posX = e.clientX - rootRect.x
        if (posX < 0) {
          posX = 0
        } else if (!columnExpandableParsed && posX > rootRect.width) {
          posX = rootRect.width
        }

        // 计算行方向上，移动后最新的位置和大小
        const { start: rowStart, end: rowEnd } = calcDragStartEndByPos({
          size: rowSize,
          gap: gapParsed,
          span: rowSpan,
          max: rows.current ?? 1,
          pos: posY,
          expandable: rowExpandableParsed ?? false,
        })

        // 更新 当前拖入子组件的数据项
        droppingChildParsed.rowStart = rowStart
        droppingChildParsed.rowEnd = rowEnd

        if (rowExpandableParsed) {
          // 向下扩展
          rows.current = calcMaxCount('rows', rowsParsed, [droppingChildParsed])
          setRowsState(rows.current)
        }

        // 计算列方向上，移动后最新的位置和大小
        const { start: columnStart, end: columnEnd } = calcDragStartEndByPos({
          size: columnSize,
          gap: gapParsed,
          span: columnSpan,
          max: columns.current ?? 1,
          pos: posX,
          expandable: columnExpandableParsed ?? false,
        })

        // 更新 当前拖入子组件的数据项
        droppingChildParsed.columnStart = columnStart
        droppingChildParsed.columnEnd = columnEnd

        if (columnExpandableParsed) {
          // 向右扩展
          columns.current = calcMaxCount('columns', columnsParsed, [droppingChildParsed])
          setColumnsState(columns.current)
        }
      }
    }
  }

  // 拖入结束
  function drop(e: DragEvent) {
    if (droppableInDefault) {
      e.stopPropagation()
      e.preventDefault()

      // 在自己的 parent drop 不算数
      if (droppingChildParsed && !droppingSelfOrParent) {
        // 拖出删除
        context.state?.droppingChildRemove?.()

        let cell = { ...droppingChildParsed }
        if (beforeDropParsed instanceof Function) {
          const res = beforeDropParsed(cell)
          if (res instanceof Promise) {
            res
              .then((c) => {
                cell = c ?? cell

                cellsParsed.current.push(cell)
                props.updateCells?.(cellsParsed.current)
              })
              .catch((e) => {
                console.error(e)
              })
          } else {
            cell = res ?? cell

            cellsParsed.current.push(cell)
            props.updateCells?.(cellsParsed.current)
          }
        } else {
          cellsParsed.current.push(cell)
          props.updateCells?.(cellsParsed.current)
        }
      }

      droppingChildClear()
    }
  }

  if (!sub) {
    // 鼠标处理事件（处理拖入中的扩展）
    window.addEventListener('dragover', dropover)
  }

  // 是否阻止事件传递
  const sholdStop = useMemo(() => {
    if (rootEleState && context.state) {
      if (context.state.actionEle) {
        // 通过“contains”、“判断是否为自身”两种方式判断：
        // 高层的 GridDragResize 或是 自身 正在 drag、resize 操作
        return (
          !context.state.actionEle.contains(rootEleState) ||
          context.state.actionEle === rootEleState
        )
      }
    }

    // 假如没有上面的逻辑，均返回 true （阻止）
    // 将会导致高层的 GridDragResize 往内部 resize 的时候失效
    return true
  }, [context.state, rootEleState])

  let draggingBlank = false

  // 嵌套时，控制事件传递
  function subDragStart(e: MouseEvent) {
    draggingBlank = e.target === rootEle.current

    if (sub && sholdStop && !draggingBlank) {
      e.stopPropagation()

      console.log('subDragStart')
      dragStart(e)
    }
  }

  function subDragMove(e: MouseEvent) {
    if (sub && sholdStop && !draggingBlank) {
      e.stopPropagation()

      dragMove(e)
    }
  }

  function subDragEnd(e: MouseEvent) {
    if (sub && sholdStop && !draggingBlank) {
      e.stopPropagation()

      dragEnd(e)
    }

    draggingBlank = false
  }

  function subClick(e: MouseEvent) {
    if (sub && e.target !== rootEle.current) {
      e.stopPropagation()

      clearSelection()
    }
  }

  // 移除
  function remove(cell: GridDragResizeItemProps) {
    const idx = cellsParsed.current.findIndex((o) => o === cell)
    if (idx > -1) {
      cellsParsed.current.splice(idx, 1)
      props.updateCells?.(cellsParsed.current)
    }
  }

  function dropStart(
    val: {
      ele: HTMLElement | null
      remove: () => void | undefined
    },
    cell: GridDragResizeItemProps
  ) {
    cellDropStart(cell, val)
  }

  const droppingRowColumn = useMemo(() => {
    const rowColumn = {
      columnStart: droppingChildParsed?.columnStart ?? 1,
      columnEnd: droppingChildParsed?.columnEnd ?? 2,
      rowStart: droppingChildParsed?.rowStart ?? 1,
      rowEnd: droppingChildParsed?.rowEnd ?? 2,
    }
    return rowColumn
  }, [
    droppingChildParsed?.columnStart,
    droppingChildParsed?.columnEnd,
    droppingChildParsed?.rowStart,
    droppingChildParsed?.rowEnd,
  ])

  function subDropover(e: DragEvent) {
    if (sub && droppableInDefault) {
      e.stopPropagation()

      dropover(e)
    }
  }

  // 克隆
  function deepClone(cell: Record<string, any>): GridDragResizeItemProps {
    const copy: Record<string, any> = {}
    for (const p in cell) {
      if (Array.isArray(cell[p])) {
        copy[p] = cell[p].map((o: any) => deepClone(o))
      } else if (cell[p] instanceof Function) {
        copy[p] = cell[p]
      } else if (cell[p] instanceof Object) {
        copy[p] = deepClone(cell[p])
      } else {
        copy[p] = cell[p]
      }
    }
    return copy as GridDragResizeItemProps
  }

  // 内部互 drop 开始
  function cellDropStart(
    cell: GridDragResizeItemProps,
    val: { ele: HTMLElement | null; remove: () => void }
  ) {
    if (context.state) {
      context.state.droppingChild = deepClone(cell)
      context.state.droppingChildEle = val.ele ?? undefined
      context.state.droppingChildRaw = cell
      context.state.droppingChildRemove = val.remove
      props.updateDroppingChild?.(context.state.droppingChild)
    }
  }

  // 内部互 drop 结束
  function cellDropEnd() {
    clearSelection()

    droppingChildClear()
  }

  return (
    <GridDragResizeContext.Provider value={contextNext}>
      {(Array.isArray(props.children) ? props.children.length : 0) > 0
        ? createElement(
            TagNameParsed,
            {
              className: `grid-drag-resize ${[
                ...(suffixClassParsed ? [suffixClassParsed] : []),
                ...(sub ? ['grid-drag-resize--sub'] : []),
                ...(props.className ? [props.className] : []),
              ].join(' ')}`,
              ref: rootEle,
            },
            props.children
          )
        : createElement(
            TagNameParsed,
            {
              className: `grid-drag-resize ${[
                ...(suffixClassParsed ? [suffixClassParsed] : []),
                ...(sub ? ['grid-drag-resize--sub'] : []),
                ...(droppingChildParsed && dropping ? ['grid-drag-resize--dropping'] : []),
                ...(props.className ? [props.className] : []),
              ].join(' ')}`,
              ref: rootEle,
              style,
              //
              onDragOver: subDropover,
              onDrop: drop,
              onMouseDown: subDragStart,
              onMouseMove: subDragMove,
              onMouseUp: subDragEnd,
              onClick: subClick,
            },
            <>
              {cellsParsedState.map((cell, idx) => (
                <GridDragResizeItem
                  key={idGen(cell)}
                  {...{
                    ...cell,
                    columnStart: cell.columnStart,
                    columnEnd: cell.columnEnd,
                    rowStart: cell.rowStart,
                    rowEnd: cell.rowEnd,
                    rows: cell.rows,
                    columns: cell.columns,
                    //
                    updateColumnStart: (val) => (cell.columnStart = val),
                    updateColumnEnd: (val) => (cell.columnEnd = val),
                    updateRowStart: (val) => (cell.rowStart = val),
                    updateRowEnd: (val) => (cell.rowEnd = val),
                    updateRows: (val) => (cell.rows = val),
                    updateColumns: (val) => (cell.columns = val),
                    //
                    startDrag: (e) => {
                      startDrag(e, cell)
                    },
                    select: () => {
                      select(cell)
                    },
                    selectResizing: () => {
                      selectResizing(cell)
                    },
                    startResize: () => {
                      resizingStart()
                    },
                    remove: () => {
                      remove(cell)
                    },
                    dropStart: (e) => {
                      dropStart(e, cell)
                    },
                    dropEnd: () => {
                      cellDropEnd()
                    },
                  }}
                  className={[
                    ...(draggingChildState === cell ? ['grid-drag-resize__item--dragging'] : []),
                    ...(context.state?.selectedChild === cell
                      ? ['grid-drag-resize__item--selected']
                      : []),
                    ...(context.state?.selectedChild === cell && resizingChild.current === cell
                      ? ['grid-drag-resize__item--resizing']
                      : []),
                  ].join(' ')}
                  style={{
                    zIndex:
                      draggingChildState === cell
                        ? cellsParsedState.length + 2
                        : context.state?.selectedChild === cell
                          ? cellsParsedState.length + 1
                          : idx + 1,
                    cursor: resizingChildCursorState,
                  }}
                >
                  {cell.grid ? (
                    <GridDragResize {...{ ...cell.grid, cells: cell.grid.cells }}></GridDragResize>
                  ) : (
                    cell.render?.(cell)
                  )}
                </GridDragResizeItem>
              ))}
              {droppingChildParsed && dropping && (
                <GridDragResizeItem
                  key={0}
                  {...{
                    draggable: false,
                    resizable: false,
                    ...droppingRowColumn,
                  }}
                  className="grid-drag-resize__item--shadow"
                  style={{
                    zIndex: cellsParsedState.length + 3,
                  }}
                ></GridDragResizeItem>
              )}
            </>
          )}
    </GridDragResizeContext.Provider>
  )
}

export default function GridDragResize(props: GridDragResizeComponent) {
  // console.log('GridDragResize', config)
  const context =
    useContext(GridDragResizeContext) ??
    (props
      ? {
          gird: {
            props: props,
          },
          state: {
            droppingChild: props.droppingChild,
            droppingChildRaw: props.droppingChild,
            dragging: false,
            resizing: false,
            selectedChild: props.selectedChild,
          },
        }
      : {
          state: {
            dragging: false,
            resizing: false,
          },
        })

  return (
    <GridDragResizeContext.Provider value={context}>
      <GridDragResizeWithTagName {...props}></GridDragResizeWithTagName>
    </GridDragResizeContext.Provider>
  )
}
