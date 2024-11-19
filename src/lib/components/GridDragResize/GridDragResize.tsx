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

import { GridDragResizeContext, type GridDragResizeContextState } from './context'

import GridDragResizeItem from './GridDragResizeItem'

type GridDragResizeComponent = GridDragResizeProps & {
  className?: string
  style?: CSSProperties
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
  // console.log('GridDragResizeWithTagName')
  // 穿透上下文
  const context = useContext(GridDragResizeContext)!

  // 判断嵌套
  const sub = useMemo(() => props.parentProps !== void 0, [props.parentProps])

  // Props 转 useRef
  const columnsParsed = useRef(1)
  const rowsParsed = useRef(1)
  const gapParsed = useRef(0)
  const overflowParsed = useRef<string | undefined>()
  const dragHandlerParsed = useRef<string | undefined>()
  const dropOutHandlerParsed = useRef<string | undefined>()
  const removeHandlerParsed = useRef<string | undefined>()
  const readonlyParsed = useRef<boolean | undefined>()
  const draggableParsed = useRef<boolean | undefined>()
  const resizableParsed = useRef<boolean | undefined>()
  const removableParsed = useRef<boolean | undefined>()
  const droppableOutParsed = useRef<boolean | undefined>()
  const maskParsed = useRef<boolean | undefined>()
  const debugParsed = useRef<boolean | undefined>()
  const droppableInParsed = useRef<boolean | undefined>()
  const beforeDropParsed = useRef<
    | ((
        before: GridDragResizeItemProps<any>
      ) => GridDragResizeItemProps<any> | Promise<GridDragResizeItemProps<any>>)
    | undefined
  >()
  const suffixClassParsed = useRef<string | undefined>()
  const TagNameParsed = useRef('div')
  const droppingChildParsed = useRef<GridDragResizeItemProps | undefined>()

  // Props 的 useRef 默认值处理
  const droppableInDefault = useRef<boolean | undefined>()

  useEffect(() => {
    columnsParsed.current = props.columns || 1
    rowsParsed.current = props.rows || 1
    gapParsed.current = props.gap || 0
    overflowParsed.current = props.overflow || props.parentProps?.overflow
    dragHandlerParsed.current = props.dragHandler || props.parentProps?.dragHandler
    dropOutHandlerParsed.current = props.dropOutHandler || props.parentProps?.dropOutHandler
    removeHandlerParsed.current = props.removeHandler || props.parentProps?.removeHandler

    readonlyParsed.current = props.readonly ?? props.parentProps?.readonly

    draggableParsed.current = readonlyParsed.current
      ? false
      : (props.draggable ?? props.parentProps?.draggable)
    resizableParsed.current = readonlyParsed.current
      ? false
      : (props.resizable ?? props.parentProps?.resizable)
    removableParsed.current = readonlyParsed.current
      ? false
      : (props.removable ?? props.parentProps?.removable)
    droppableOutParsed.current = readonlyParsed.current
      ? false
      : (props.droppableOut ?? props.parentProps?.droppableOut)
    maskParsed.current = props.mask ?? props.parentProps?.mask
    debugParsed.current = props.debug ?? props.parentProps?.debug
    droppableInParsed.current = readonlyParsed.current
      ? false
      : (props.droppableIn ?? props.parentProps?.droppableIn)
    droppableInDefault.current = droppableInParsed.current ?? true
    beforeDropParsed.current = props.beforeDrop ?? props.parentProps?.beforeDrop
    suffixClassParsed.current = props.suffixClass || props.parentProps?.suffixClass
    TagNameParsed.current = props.tagName || props.parentProps?.tagName || 'div'
  }, [props])

  useEffect(() => {
    droppingChildParsed.current = context.state.droppingChild ?? props.droppingChild
  }, [context.state.droppingChild, props.droppingChild])

  // Props 转 useState
  const [TagNameState, setTagNameState] = useState(TagNameParsed.current)
  const [droppingChildState, setDroppingChildState] = useState(droppingChildParsed.current)
  const [suffixClassState, setSuffixClassState] = useState(suffixClassParsed.current)
  const [gapState, setGapState] = useState(gapParsed.current)

  // Props 的 useState 默认值处理
  useEffect(() => {
    setTagNameState(TagNameParsed.current)
  }, [props.tagName, props.parentProps?.tagName])
  useEffect(() => {
    setDroppingChildState(droppingChildParsed.current)
  }, [props.droppingChild, context.state.droppingChild])
  useEffect(() => {
    setSuffixClassState(suffixClassParsed.current)
  }, [props.suffixClass])
  useEffect(() => {
    setGapState(gapParsed.current)
  }, [props.gap])

  // Dom
  const rootEle = useRef<HTMLDivElement | null>(null)
  const [rootEleState, setRootEleState] = useState(rootEle.current)

  useEffect(() => {
    setRootEleState(rootEle.current)
  }, [])

  // 下发父配置
  const [parentPropsState, setParentPropsState] = useState<GridDragResizeProps['parentProps']>()
  const parentProps = useRef<GridDragResizeProps['parentProps']>()

  useEffect(() => {
    parentProps.current = {
      ...props,
      //
      dragHandler: dragHandlerParsed.current,
      dropOutHandler: dropOutHandlerParsed.current,
      removeHandler: removeHandlerParsed.current,
      overflow: overflowParsed.current,
      //
      readonly: readonlyParsed.current,
      //
      draggable: draggableParsed.current,
      resizable: resizableParsed.current,
      removable: removableParsed.current,
      droppableOut: droppableOutParsed.current,
      mask: maskParsed.current,
      //
      debug: debugParsed.current,
      //
      droppableIn: droppableInParsed.current,
      //
      beforeDrop: beforeDropParsed.current,
      //
      suffixClass: suffixClassParsed.current,
      tagName: TagNameParsed.current,
    }
    setParentPropsState(parentProps.current)
  }, [
    props.dragHandler,
    props.parentProps?.dragHandler,
    props.dropOutHandler,
    props.parentProps?.dropOutHandler,
    props.removeHandler,
    props.parentProps?.removeHandler,
    props.overflow,
    props.parentProps?.overflow,
    props.readonly,
    props.parentProps?.readonly,
    props.draggable,
    props.parentProps?.draggable,
    props.resizable,
    props.parentProps?.resizable,
    props.removable,
    props.parentProps?.removable,
    props.droppableOut,
    props.parentProps?.droppableOut,
    props.mask,
    props.parentProps?.mask,
    props.debug,
    props.parentProps?.debug,
    props.droppableIn,
    props.parentProps?.droppableIn,
    props.beforeDrop,
    props.parentProps?.beforeDrop,
    props.suffixClass,
    props.parentProps?.suffixClass,
    props.tagName,
    props.parentProps?.tagName,
  ])

  // 调试
  if (debugParsed.current) {
    console.log(parentProps)
  }

  // ............................................................

  // 拖入 shadow 大小位置
  const [droppingRowColumnState, setDroppingRowColumnState] = useState({
    columnStart: 1,
    columnEnd: 2,
    rowStart: 1,
    rowEnd: 2,
  })

  useEffect(() => {
    setDroppingRowColumnState({
      columnStart: droppingChildState?.columnStart ?? 1,
      columnEnd: droppingChildState?.columnEnd ?? 2,
      rowStart: droppingChildState?.rowStart ?? 1,
      rowEnd: droppingChildState?.rowEnd ?? 2,
    })
  }, [droppingChildState])

  // 在自己内部、自己的 parent drop 不算数
  const [droppingSelfOrParentState, setDroppingSelfOrParentState] = useState<boolean | undefined>()

  useEffect(() => {
    if (context.state.droppingChildRaw && rootEleState) {
      setDroppingSelfOrParentState(
        props.cells?.includes(context.state.droppingChildRaw) ||
          context.state.droppingChildEle?.contains(rootEleState)
      )
    } else {
      setDroppingSelfOrParentState(false)
    }
  }, [context.state.droppingChildRaw, context.state.droppingChildEle, rootEleState, props.cells])

  // 拖入操作中
  const [droppingState, setDroppingState] = useState(false)

  useEffect(() => {
    setDroppingState(context.state.droppingEle === rootEleState && !droppingSelfOrParentState)
  }, [context.state.droppingEle, rootEleState, droppingSelfOrParentState])

  // 当前调整大小子的数据项
  const resizingChildRef = useRef<GridDragResizeItemProps | undefined>()
  const [resizingChildState, setResizingChildState] = useState<
    GridDragResizeItemProps | undefined
  >()

  // 最新大小
  const rowsChangedRef = useRef(1)
  const columnsChangedRef = useRef(1)
  const [rowsChangedState, setRowsChangedState] = useState(rowsParsed.current)
  const [columnsChangedState, setColumnsChangedState] = useState(columnsParsed.current)

  useEffect(() => {
    rowsChangedRef.current = props.rows || 1
    columnsChangedRef.current = props.columns || 1
  }, [props.rows, props.columns])

  useEffect(() => {
    setRowsChangedState(rowsChangedRef.current)
    setColumnsChangedState(columnsChangedRef.current)
  }, [props.rows, props.columns])

  // 限制 扩展
  const rowExpandableParsed = useMemo(
    () => props.rowExpandable && !droppingSelfOrParentState,
    [props.rowExpandable, droppingSelfOrParentState]
  )
  const columnExpandableParsed = useMemo(
    () => props.columnExpandable && !droppingSelfOrParentState,
    [props.columnExpandable, droppingSelfOrParentState]
  )

  // 样式
  const style = useMemo<CSSProperties>(() => {
    return {
      gridTemplateColumns: gridTemplateParse(
        columnsChangedState,
        props.columnExpandable ?? false,
        props.columnSize,
        props.columnTemplate
      ),
      gridTemplateRows: gridTemplateParse(
        rowsChangedState,
        props.rowExpandable ?? false,
        props.rowSize,
        props.rowTemplate
      ),
      gridGap: gapState > 0 ? `${gapState}px ${gapState}px` : '',
    }
  }, [
    columnsChangedState,
    props.columnSize,
    props.rowSize,
    rowsChangedState,
    gapState,
    props.columnTemplate,
    props.rowTemplate,
    columnExpandableParsed,
    rowExpandableParsed,
  ])

  // 正在拖入的目标（仅外部用）
  useEffect(() => {
    if (context.state.droppingChild !== props.droppingChild) {
      context.state.droppingChild = { ...props.droppingChild }
      context.setState({ ...context.state })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.droppingChild])

  // 清空 drop 相关状态
  const droppingChildClear = useCallback(() => {
    props.updateDroppingChild?.(undefined)

    // debugger
    context.state.droppingChild = undefined
    context.state.droppingChildEle = undefined
    context.state.droppingChildRaw = undefined
    context.state.droppingEle = undefined
    context.state.droppingChildRemove = undefined
    context.setState({ ...context.state })
  }, [context, props])

  // 更新状态
  const stateInjectActionDown = useCallback(
    (v: boolean) => {
      // debugger
      if (v) {
        // 记录 当前正在 drag、resize 的 GridDragResize 组件
        context.state.actionEle = rootEle.current ?? undefined
      } else {
        context.state.actionEle = undefined
      }
    },
    [context.state]
  )

  // grid 模版 扩展
  function gridTemplateExpand(template: string, count: number, size?: number) {
    const list = calcTemplate(template)
    const patch = count - list.length
    const item = Number.isInteger(size) ? `${size}px` : '1fr'
    return template + (patch > 0 ? ` repeat(${patch},${item})` : '')
  }

  // 转换为 grid 模版
  function gridTemplateParse(count: number, expand: boolean, size?: number, template?: string) {
    return template
      ? expand
        ? gridTemplateExpand(template, count, size)
        : template
      : `repeat(${count},${Number.isInteger(size) ? `${size}px` : '1fr'})`
  }

  // 如果没定义 行数/列数，根据 cells 计算合适的 行数/列数
  const calcMaxCount = useCallback(
    (target: string, min?: number, more: GridDragResizeItemProps[] = []) => {
      const calc = [...(props.cells ?? []), ...more].reduce((max, cell) => {
        const end = { rows: cell.rowEnd, columns: cell.columnEnd }[target]
        if (end && end > 1) {
          if (end - 1 > max) {
            max = end - 1
          }
        }

        const count = { rows: cell.rows, columns: cell.columns }[target] ?? 1
        return Math.max(max, count)
      }, 1)

      return min === void 0 ? calc : min < calc ? calc : min
    },
    [props.cells]
  )

  useEffect(() => {
    const nRows = calcMaxCount(
      'rows',
      Math.max(rowsParsed.current, calcTemplate(props.rowTemplate ?? '').length)
    )
    if (rowsChangedRef.current !== nRows) {
      rowsChangedRef.current = nRows
      setRowsChangedState(rowsChangedRef.current)
      props.updateRows?.(rowsChangedRef.current)
    }

    const nColumns = calcMaxCount(
      'columns',
      Math.max(columnsParsed.current, calcTemplate(props.columnTemplate ?? '').length)
    )
    if (columnsChangedRef.current !== nColumns) {
      columnsChangedRef.current = nColumns
      setColumnsChangedState(columnsChangedRef.current)
      props.updateColumns?.(columnsChangedRef.current)
    }
  }, [props, calcMaxCount])

  // ! 自动计算（书写习惯：从左向右、从上向下）
  useEffect(() => {
    // 一个个计算
    const target = props.cells?.find(
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
    if (target && props.cells) {
      const readyItems = props.cells.filter(
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
        for (
          ;
          columnStart + target.columns! <= columnsChangedRef.current + 1 && on;
          columnStart++
        ) {
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

        props.updateCells?.(props.cells ? [...props.cells] : [])
      }
    }
  }, [props, columnsChangedState])

  // 计算 行、列 大小
  function calcSize(size: number, count: number, gap: number, list: string[]) {
    const fixedSize = list.filter((o) => /\d+px/.test(o))

    const fixedTotal = fixedSize.map((o) => parseInt(o) + gap).reduce((sum, num) => sum + num, 0)

    return (size - fixedTotal - gap * (count - 1 - fixedSize.length)) / (count - fixedSize.length)
  }

  // 列宽
  const getColumnSize = useCallback(() => {
    const rootRect = rootEleState?.getBoundingClientRect() ?? {
      height: 0,
      width: 0,
      x: 0,
      y: 0,
      bottom: 0,
      right: 0,
    }

    let contentWidth = rootRect.width

    if (rootEleState) {
      contentWidth =
        contentWidth -
        [
          parseInt(window.getComputedStyle(rootEleState).paddingLeft),
          parseInt(window.getComputedStyle(rootEleState).paddingRight),
        ]
          .filter((o) => !isNaN(o))
          .reduce((sum, item) => sum + item, 0)
    }

    return (
      props.columnSize ||
      calcSize(
        contentWidth,
        columnsChangedRef.current,
        gapState,
        props.columnTemplate ? calcTemplate(props.columnTemplate) : []
      )
    )
  }, [columnsChangedState, gapState, props.columnSize, rootEleState, props.columnTemplate])

  // 行高
  const getRowSize = useCallback(() => {
    const rootRect = rootEleState?.getBoundingClientRect() ?? {
      height: 0,
      width: 0,
      x: 0,
      y: 0,
      bottom: 0,
      right: 0,
    }

    let contentHeight = rootRect.height

    if (rootEleState) {
      contentHeight =
        contentHeight -
        [
          parseInt(window.getComputedStyle(rootEleState).paddingTop),
          parseInt(window.getComputedStyle(rootEleState).paddingBottom),
        ]
          .filter((o) => !isNaN(o))
          .reduce((sum, item) => sum + item, 0)
    }

    return (
      props.rowSize ||
      calcSize(
        contentHeight,
        rowsChangedRef.current,
        gapState,
        props.rowTemplate ? calcTemplate(props.rowTemplate) : []
      )
    )
  }, [rowsChangedState, gapState, props.rowSize, rootEleState, props.rowTemplate])

  // ............................................................

  // 点击开始位置
  const clickStartX = useRef(0),
    clickStartY = useRef(0)
  // 点击偏移量
  const clickOffsetX = useRef(0),
    clickOffsetY = useRef(0)

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
  const resizeStartClientX = useRef(0),
    resizeStartClientY = useRef(0)
  // 调整大小拖动偏移量
  const resizeOffsetClientRow = useRef(0),
    resizeOffsetClientColumn = useRef(0)

  // 当前拖动子组件的数据项
  const draggingChildRef = useRef<GridDragResizeItemProps | undefined>()
  const [draggingChildState, setDraggingChildState] = useState(draggingChildRef.current)
  // 当前拖动子组件的数据项（初始状态）
  const draggingChildBefore = useRef<GridDragResizeItemProps | undefined>()
  // 当前拖动子组件的位置、大小信息
  const draggingChildRect = useRef<DOMRect | undefined>()
  // 当前拖动子组件的 Dom
  const draggingChildEle = useRef<HTMLElement | undefined>()

  // 拖动开始位置
  const dragStartClientX = useRef(0),
    dragStartClientY = useRef(0)
  // 拖动偏移量
  const dragOffsetClientRow = useRef(0),
    dragOffsetClientColumn = useRef(0)

  // 计算移动方向
  const rowDirection = useRef(0),
    columnDirection = useRef(0)

  // 计算 grid template 每一项
  function calcTemplateItem(item: string) {
    const repeat = item.match(/repeat\((\d+),(\d+(fr|px))\)/)
    if (repeat) {
      return new Array(parseInt(repeat[1])).fill(repeat[2])
    }
    return [item]
  }

  // 计算 grid template
  function calcTemplate(template: string) {
    const items = template.trim().replace(/ {2,}/, ' ').replace(/, /, ',').split(' ')
    const list = items
      .map((o) => calcTemplateItem(o))
      .reduce((res, arr) => {
        return res.concat(arr)
      }, [])
    return list as string[]
  }

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
    template?: string
  }) {
    const { size, gap, span, max, offset, startBefore, expandable, template } = opts

    if (template) {
      // 解析
      const list = calcTemplate(template)

      const listParsed = list.map((o) => (/\d+px/.test(o) ? parseInt(o) : size))
      let sum = 0
      let i = 0
      for (; i < listParsed.length && i < startBefore; i++) {
        if (i > startBefore) {
          break
        }
        sum += listParsed[i] + gap
      }

      if (offset > 0) {
        let sum2 = sum

        for (; i < listParsed.length; i++) {
          sum2 += listParsed[i] + gap
          if (sum + offset < sum2) {
            break
          }
        }

        if (expandable && sum + offset > sum2) {
          const more = Math.round((sum + offset - sum2) / (size + gap))
          i += more
        }

        let start = i

        if (!expandable && start + span > max + 1) {
          start = max + 1 - span
        }

        return {
          start: start,
          end: start + span,
        }
      } else {
        let sum2 = 0
        let j = startBefore - 2
        let x = 0
        for (; j >= 0; j--, x++) {
          sum2 += listParsed[j] + gap
          if (sum2 > Math.abs(offset)) {
            break
          }
        }

        let start = startBefore - x

        if (start < 1) {
          start = 1
        }

        return {
          start: start,
          end: start + span,
        }
      }
    } else {
      const offsetStart = size + gap ? Math.round(offset / (size + gap)) : 0

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
  }

  // 根据鼠标拖动位置（相对于组件），计算列/行方向上的位置，移动后最新的位置和大小
  function calcDragStartEndByPos(opts: {
    size: number
    gap: number
    span: number
    max: number
    pos: number
    expandable: boolean
    template?: string
  }) {
    const { size, gap, span, max, pos, expandable, template } = opts

    if (template) {
      // 解析
      const list = calcTemplate(template)

      const listParsed = list.map((o) => (/\d+px/.test(o) ? parseInt(o) : size))
      let sum = 0
      let i = 0
      for (; i < listParsed.length; i++) {
        sum += listParsed[i] + gap
        if (pos < sum) {
          break
        }
      }

      if (expandable && pos - sum > 0) {
        const more = Math.floor((pos - sum) / (size + gap))
        i += more
      }

      let start = i + 1

      if (!expandable && start + span > max + 1) {
        start = max + 1 - span
      }

      return {
        start,
        end: start + span,
      }
    } else {
      // 虚拟地在 grid 四边补充二分之一的 gap 距离
      // 如此，通过计算 拖动位置（相对于组件）与 大小+间隙 的倍数即可
      let start = size + gap ? Math.ceil((pos + gap / 2) / (size + gap)) : 0

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
    template?: string
  }) {
    const { size, gap, max, offset, startBefore, endBefore, target, expandable, template } = opts

    if (template) {
      // 解析
      const list = calcTemplate(template)

      const listParsed = list.map((o) => (/\d+px/.test(o) ? parseInt(o) : size))

      if (target === 'start') {
        if (offset > 0) {
          let sum = 0
          let i = 0
          for (; i < listParsed.length && i < startBefore - 1; i++) {
            if (i > startBefore - 1) {
              break
            }
            sum += listParsed[i] + gap
          }

          let sum2 = sum

          for (; i < listParsed.length; i++) {
            sum2 += listParsed[i] + gap
            if (sum + offset < sum2) {
              break
            }
          }

          let start = i + 1

          if (start + 1 > endBefore) {
            start = endBefore - 1
          }

          return {
            start: start,
            end: endBefore,
          }
        } else {
          let sum2 = 0
          let j = startBefore - 2
          let x = 0
          for (; j >= 0; j--, x++) {
            sum2 += listParsed[j] + gap
            if (sum2 > Math.abs(offset)) {
              break
            }
          }

          let start = startBefore - x

          if (start + 1 > endBefore) {
            start = endBefore - 1
          }

          return {
            start,
            end: endBefore,
          }
        }
      } else {
        if (offset > 0) {
          let sum = 0
          let i = 0
          for (; i < listParsed.length && i < endBefore - 1; i++) {
            if (i > endBefore - 1) {
              break
            }
            sum += listParsed[i] + gap
          }

          let sum2 = sum

          for (; i < listParsed.length; i++) {
            sum2 += listParsed[i] + gap
            if (sum + offset < sum2) {
              break
            }
          }

          if (expandable && sum + offset > sum2) {
            const more = Math.round((sum + offset - sum2) / (size + gap))
            i += more
          }

          const end = i + 1

          return {
            start: startBefore,
            end,
          }
        } else {
          let sum2 = 0
          let j = endBefore - 2
          let x = 0
          for (; j >= 0; j--, x++) {
            sum2 += listParsed[j] + gap
            if (sum2 > Math.abs(offset)) {
              break
            }
          }

          let end = endBefore - x

          if (end < startBefore) {
            end = startBefore
          }

          return {
            start: startBefore,
            end,
          }
        }
      }
    } else {
      const offsetStart = size + gap ? Math.round(offset / (size + gap)) : 0

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
  }

  // !

  const resizingReset = useCallback(() => {
    // debugger
    context.state.resizing = false
    context.setState({ ...context.state })
    stateInjectActionDown(false)

    resizingChildBefore.current = undefined
    resizingChildRect.current = undefined
    resizingChildCursor.current = ''
    setResizingChildCursorState(resizingChildCursor.current)
    resizingChildDirection.current = ''

    document.body.style.cursor = ''
  }, [context, stateInjectActionDown])

  const dragReset = useCallback(() => {
    context.state.dragging = false
    context.setState({ ...context.state })
    stateInjectActionDown(false)

    draggingChildRef.current = undefined
    setDraggingChildState(draggingChildRef.current)
    draggingChildBefore.current = undefined
    draggingChildRect.current = undefined
    draggingChildEle.current = undefined
  }, [context, stateInjectActionDown])

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
  const scrollIntoViewIfNeeded = useCallback((target?: HTMLElement) => {
    if (target) {
      if (!isElementInViewport(target)) {
        target.scrollIntoView()
      }
    }
  }, [])

  // 拖动开始
  const startDrag = (res: StartDragEvent, cell: GridDragResizeItemProps) => {
    const { event: e, rect } = res
    if (e && e.currentTarget instanceof HTMLElement) {
      updateDrag(cell, rect, e.currentTarget)
    }
  }

  // 调整大小开始
  const resizingStart = useCallback(
    (...args: any[] | unknown[]) => {
      // 这里的写法是为了通过 github pages 的 type-check
      const res = args[0] as StartResizeEvent
      const { event: e, rect, cursor, direction } = res

      if (e && e.currentTarget instanceof HTMLElement) {
        if (e.currentTarget.parentElement instanceof HTMLElement) {
          resizingChildEle.current = e.currentTarget.parentElement
        }
      }

      // 更新 点击开始位置
      clickStartX.current = e.clientX
      clickStartY.current = e.clientY

      // 更新 调整大小开始位置
      resizeStartClientX.current = e.clientX
      resizeStartClientY.current = e.clientY

      // 状态互斥
      dragReset()

      context.state.resizing = true
      context.setState({ ...context.state })

      stateInjectActionDown(true)

      // 更新计算所需信息
      resizingChildRect.current = rect
      resizingChildCursor.current = cursor
      setResizingChildCursorState(resizingChildCursor.current)
      resizingChildDirection.current = direction

      // 拖出区域保持鼠标类型
      document.body.style.cursor = cursor

      // 缓存状态
      resizingChildBefore.current = { ...resizingChildRef.current }
    },
    [context, dragReset, stateInjectActionDown]
  )

  // 更新拖动信息
  function updateDrag(cell: GridDragResizeItemProps, rect: DOMRect, target: HTMLElement) {
    draggingChildRef.current = cell
    setDraggingChildState(draggingChildRef.current)
    draggingChildBefore.current = { ...cell }
    draggingChildRect.current = rect
    draggingChildEle.current = target
  }

  // grid 模版 缓存记录
  const dragRowTemplateRef = useRef(props.rowTemplate)
  const dragColumnTemplateRef = useRef(props.columnTemplate)

  // 拖动开始
  const dragStart = useCallback(
    (e: MouseEvent) => {
      // 更新 点击开始位置
      clickStartX.current = e.clientX
      clickStartY.current = e.clientY

      if (!readonlyParsed.current) {
        if (draggingChildRef.current && draggingChildRect.current) {
          // 状态互斥
          resizingReset()

          context.state.dragging = true
          context.setState({ ...context.state })

          stateInjectActionDown(true)

          // 记录 拖动开始位置
          dragStartClientX.current = e.clientX
          dragStartClientY.current = e.clientY

          // 缓存 grid 模版
          dragRowTemplateRef.current = props.rowTemplate
            ? gridTemplateExpand(props.rowTemplate, rowsChangedRef.current, getRowSize())
            : ''
          dragColumnTemplateRef.current = props.columnTemplate
            ? gridTemplateExpand(props.columnTemplate, columnsChangedRef.current, getColumnSize())
            : ''
        }
      }
    },
    [context, resizingReset, stateInjectActionDown]
  )

  // 拖动中
  const dragMove = useCallback(
    (e: MouseEvent) => {
      if (context.state.dragging && draggingChildRef.current) {
        // 计算 拖动偏移量
        dragOffsetClientColumn.current = e.clientX - dragStartClientX.current
        dragOffsetClientRow.current = e.clientY - dragStartClientY.current

        // 当前拖动子组件的 grid 大小
        let rowSpan =
          (draggingChildRef.current.rowEnd ?? draggingChildRef.current.rowStart ?? 1) -
          (draggingChildRef.current.rowStart ?? 1)
        let columnSpan =
          (draggingChildRef.current.columnEnd ?? draggingChildRef.current.columnStart ?? 1) -
          (draggingChildRef.current.columnStart ?? 1)

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
          size: getRowSize(),
          gap: gapParsed.current,
          span: rowSpan,
          max: rowsChangedRef.current ?? 1,
          offset: dragOffsetClientRow.current,
          startBefore: draggingChildBefore.current?.rowStart ?? 1,
          direction: rowDirection.current,
          expandable: rowExpandableParsed ?? false,
          template: dragRowTemplateRef.current,
        })

        if (rowExpandableParsed) {
          // 向下扩展
          rowsChangedRef.current = calcMaxCount('rows', rowsParsed.current)
          setRowsChangedState(rowsChangedRef.current)
        }

        // 计算列方向上，移动后最新的位置和大小
        const { start: columnStart, end: columnEnd } = calcDragStartEndByOffset({
          size: getColumnSize(),
          gap: gapParsed.current,
          span: columnSpan,
          max: columnsChangedRef.current ?? 1,
          offset: dragOffsetClientColumn.current,
          startBefore: draggingChildBefore.current?.columnStart ?? 1,
          direction: columnDirection.current,
          expandable: columnExpandableParsed ?? false,
          template: dragColumnTemplateRef.current,
        })

        if (columnExpandableParsed) {
          // 向右扩展
          columnsChangedRef.current = calcMaxCount('columns', columnsParsed.current)
          setColumnsChangedState(columnsChangedRef.current)
        }

        // 更新 当前拖动子组件的数据项
        draggingChildRef.current.columnStart = columnStart
        draggingChildRef.current.columnEnd = columnEnd
        draggingChildRef.current.rowStart = rowStart
        draggingChildRef.current.rowEnd = rowEnd

        props.updateCells?.(props.cells ? [...props.cells] : [])

        // 滚动跟随
        scrollIntoViewIfNeeded(draggingChildEle.current)
      }
      if (context.state.resizing && resizingChildRef.current) {
        // 计算 调整大小拖动偏移量
        resizeOffsetClientColumn.current = e.clientX - resizeStartClientX.current
        resizeOffsetClientRow.current = e.clientY - resizeStartClientY.current

        if (resizingChildRef.current) {
          // 行 向
          if (resizingChildDirection.current.startsWith('top')) {
            const { start: rowStart, end: rowEnd } = calcResizeStartEnd({
              size: getRowSize(),
              gap: gapParsed.current,
              max: rowsChangedRef.current ?? 1,
              offset: resizeOffsetClientRow.current,
              startBefore: resizingChildBefore.current?.rowStart ?? 1,
              endBefore: resizingChildBefore.current?.rowEnd ?? 1,
              target: 'start',
              expandable: rowExpandableParsed ?? false,
              template: dragRowTemplateRef.current,
            })
            resizingChildRef.current.rows = rowEnd - rowStart
            resizingChildRef.current.rowStart = rowStart
            resizingChildRef.current.rowEnd = rowEnd
            setResizingChildState(resizingChildRef.current)
            props.updateCells?.(props.cells ? [...props.cells] : [])
          } else if (resizingChildDirection.current.startsWith('bottom')) {
            const { start: rowStart, end: rowEnd } = calcResizeStartEnd({
              size: getRowSize(),
              gap: gapParsed.current,
              max: rowsChangedRef.current ?? 1,
              offset: resizeOffsetClientRow.current,
              startBefore: resizingChildBefore.current?.rowStart ?? 1,
              endBefore: resizingChildBefore.current?.rowEnd ?? 1,
              target: 'end',
              expandable: rowExpandableParsed ?? false,
              template: dragRowTemplateRef.current,
            })
            resizingChildRef.current.rows = rowEnd - rowStart
            resizingChildRef.current.rowStart = rowStart
            resizingChildRef.current.rowEnd = rowEnd
            setResizingChildState(resizingChildRef.current)
            props.updateCells?.(props.cells ? [...props.cells] : [])

            if (rowExpandableParsed) {
              // 向下扩展
              rowsChangedRef.current = calcMaxCount('rows', rowsParsed.current)
              setRowsChangedState(rowsChangedRef.current)
            }
          }

          // 列 向
          if (resizingChildDirection.current.endsWith('left')) {
            const { start: columnStart, end: columnEnd } = calcResizeStartEnd({
              size: getColumnSize(),
              gap: gapParsed.current,
              max: columnsChangedRef.current ?? 1,
              offset: resizeOffsetClientColumn.current,
              startBefore: resizingChildBefore.current?.columnStart ?? 1,
              endBefore: resizingChildBefore.current?.columnEnd ?? 1,
              target: 'start',
              expandable: columnExpandableParsed ?? false,
              template: dragColumnTemplateRef.current,
            })
            resizingChildRef.current.columns = columnEnd - columnStart
            resizingChildRef.current.columnStart = columnStart
            resizingChildRef.current.columnEnd = columnEnd
            setResizingChildState(resizingChildRef.current)
            props.updateCells?.(props.cells ? [...props.cells] : [])
          } else if (resizingChildDirection.current.endsWith('right')) {
            const { start: columnStart, end: columnEnd } = calcResizeStartEnd({
              size: getColumnSize(),
              gap: gapParsed.current,
              max: columnsChangedRef.current ?? 1,
              offset: resizeOffsetClientColumn.current,
              startBefore: resizingChildBefore.current?.columnStart ?? 1,
              endBefore: resizingChildBefore.current?.columnEnd ?? 1,
              target: 'end',
              expandable: columnExpandableParsed ?? false,
              template: dragColumnTemplateRef.current,
            })
            resizingChildRef.current.columns = columnEnd - columnStart
            resizingChildRef.current.columnStart = columnStart
            resizingChildRef.current.columnEnd = columnEnd
            setResizingChildState(resizingChildRef.current)
            props.updateCells?.(props.cells ? [...props.cells] : [])

            if (columnExpandableParsed) {
              // 向右扩展
              columnsChangedRef.current = calcMaxCount('columns', columnsParsed.current)
              setColumnsChangedState(columnsChangedRef.current)
            }
          }
        }

        // 滚动跟随
        scrollIntoViewIfNeeded(resizingChildEle.current)
      }
    },
    [
      calcMaxCount,
      columnExpandableParsed,
      context.state.dragging,
      context.state.resizing,
      props,
      rowExpandableParsed,
      scrollIntoViewIfNeeded,
      getColumnSize,
      getRowSize,
    ]
  )

  // 拖动结束
  const dragEnd = useCallback(
    (e: MouseEvent) => {
      // 计算 点击拖动偏移量
      clickOffsetX.current = e.clientX - clickStartX.current
      clickOffsetY.current = e.clientY - clickStartY.current

      // 状态重置
      {
        resizingReset()
        dragReset()
      }
    },
    [dragReset, resizingReset]
  )

  // 清除选择
  const clearSelection = useCallback(() => {
    // 判断真实 click
    if (Math.abs(clickOffsetX.current) < 5 && Math.abs(clickOffsetY.current) < 5) {
      // debugger
      context.state.selectedChild = undefined
      context.setState({ ...context.state })

      props.updateSelectedChild?.(undefined)
      props.select?.(undefined)
      resizingChildRef.current = undefined
      setResizingChildState(resizingChildRef.current)
    }

    // 状态重置
    {
      resizingReset()
      dragReset()
    }
  }, [context, dragReset, props, resizingReset])

  // 选择
  const select = useCallback(
    (cell: GridDragResizeItemProps) => {
      if (Math.abs(clickOffsetX.current) < 5 && Math.abs(clickOffsetY.current) < 5) {
        // debugger
        context.state.selectedChild = cell
        context.setState({ ...context.state })
        props.updateSelectedChild?.(cell)
        props.select?.(cell)
      }
    },
    [context, props]
  )

  // 选择 调整大小
  const selectResizing = (cell: GridDragResizeItemProps) => {
    if (Math.abs(clickOffsetX.current) < 5 && Math.abs(clickOffsetY.current) < 5) {
      resizingChildRef.current = cell
      setResizingChildState(resizingChildRef.current)

      draggingChildRef.current = undefined
      setDraggingChildState(draggingChildRef.current)
      draggingChildBefore.current = undefined
      draggingChildRect.current = undefined
      draggingChildEle.current = undefined
    }
  }

  useEffect(() => {
    window.addEventListener('mousedown', dragStart)

    return () => {
      window.removeEventListener('mousedown', dragStart)
    }
  }, [dragStart])

  useEffect(() => {
    window.addEventListener('mousemove', dragMove)

    return () => {
      window.removeEventListener('mousemove', dragMove)
    }
  }, [dragMove])

  useEffect(() => {
    window.addEventListener('mouseup', dragEnd)

    return () => {
      window.removeEventListener('mouseup', dragEnd)
    }
  }, [dragEnd])

  // 点击空白区域，清空选择
  useEffect(() => {
    window.addEventListener('click', clearSelection)

    return () => {
      window.removeEventListener('click', clearSelection)
    }
  }, [clearSelection])

  // 拖入中
  const dropOver = useCallback(
    (e: DragEvent) => {
      if (droppableInDefault.current) {
        e.stopPropagation()
        e.preventDefault()

        if (context.state.droppingEle !== rootEle.current) {
          context.state.droppingEle = rootEle.current ?? undefined
          context.setState({ ...context.state })
        }

        if (droppingChildParsed.current) {
          // 当前拖动子组件的 grid 大小
          const rowSpan = droppingChildParsed.current?.rows ?? 1
          const columnSpan = droppingChildParsed.current?.columns ?? 1

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

          // // 计算行方向上，移动后最新的位置和大小
          const { start: rowStart, end: rowEnd } = calcDragStartEndByPos({
            size: getRowSize(),
            gap: gapParsed.current,
            span: rowSpan,
            max: rowsChangedRef.current ?? 1,
            pos: posY,
            expandable: rowExpandableParsed ?? false,
            template: dropRowTemplateRef.current,
          })

          // 更新 当前拖入子组件的数据项
          if (droppingChildParsed.current) {
            droppingChildParsed.current.rowStart = rowStart
            droppingChildParsed.current.rowEnd = rowEnd
            setDroppingChildState({ ...droppingChildParsed.current })
          }

          if (rowExpandableParsed) {
            // 向下扩展
            rowsChangedRef.current = calcMaxCount(
              'rows',
              rowsParsed.current,
              droppingChildParsed.current ? [droppingChildParsed.current] : []
            )
            setRowsChangedState(rowsChangedRef.current)
          }

          // 计算列方向上，移动后最新的位置和大小
          const { start: columnStart, end: columnEnd } = calcDragStartEndByPos({
            size: getColumnSize(),
            gap: gapParsed.current,
            span: columnSpan,
            max: columnsChangedRef.current ?? 1,
            pos: posX,
            expandable: columnExpandableParsed ?? false,
            template: dropColumnTemplateRef.current,
          })

          // 更新 当前拖入子组件的数据项
          if (droppingChildParsed.current) {
            droppingChildParsed.current.columnStart = columnStart
            droppingChildParsed.current.columnEnd = columnEnd
            setDroppingChildState({ ...droppingChildParsed.current })
          }

          if (columnExpandableParsed) {
            // 向右扩展
            columnsChangedRef.current = calcMaxCount(
              'columns',
              columnsParsed.current,
              droppingChildParsed.current ? [droppingChildParsed.current] : []
            )
            setColumnsChangedState(columnsChangedRef.current)
          }
        }
      }
    },
    [context, calcMaxCount, columnExpandableParsed, rowExpandableParsed, getColumnSize, getRowSize]
  )

  // 拖入结束
  const drop = useCallback(
    (e: DragEvent) => {
      if (droppableInDefault.current) {
        e.stopPropagation()
        e.preventDefault()

        // 在自己的 parent drop 不算数
        if (droppingChildParsed.current && !droppingSelfOrParentState) {
          // 拖出删除
          context.state.droppingChildRemove?.()

          let cell = { ...droppingChildParsed.current }
          if (beforeDropParsed.current instanceof Function) {
            const res = beforeDropParsed.current(cell)
            if (res instanceof Promise) {
              res
                .then((c) => {
                  cell = c ?? cell

                  props.cells?.push(cell)
                  props.updateCells?.(props.cells ? [...props.cells] : [])
                })
                .catch((e) => {
                  console.error(e)
                })
            } else {
              cell = res ?? cell

              props.cells?.push(cell)
              props.updateCells?.(props.cells ? [...props.cells] : [])
            }
          } else {
            props.cells?.push(cell)
            props.updateCells?.(props.cells ? [...props.cells] : [])
          }
        }

        droppingChildClear()
      }
    },
    [context.state, droppingChildClear, droppingSelfOrParentState, props]
  )

  // TODO: 多次改变 Listener
  useEffect(() => {
    if (!sub) {
      // console.log('addEventListener')
      window.addEventListener('dragover', dropOver)
    }

    return () => {
      if (!sub) {
        // console.log('removeEventListener')
        window.removeEventListener('dragover', dropOver)
      }
    }
  }, [sub, dropOver])

  // 是否阻止事件传递
  const shouldStop = useMemo(() => {
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

  const draggingBlank = useRef(false)

  // 嵌套时，控制事件传递
  const subDragStart = useCallback(
    (e: MouseEvent) => {
      draggingBlank.current = e.target === rootEle.current

      if (sub && shouldStop && !draggingBlank.current) {
        e.stopPropagation()

        dragStart(e)
      }
    },
    [sub, dragStart, shouldStop]
  )

  const subDragMove = useCallback(
    (e: MouseEvent) => {
      if (sub && shouldStop && !draggingBlank.current) {
        e.stopPropagation()

        dragMove(e)
      }
    },
    [dragMove, shouldStop, sub]
  )

  const subDragEnd = useCallback(
    (e: MouseEvent) => {
      if (sub && shouldStop && !draggingBlank.current) {
        e.stopPropagation()

        dragEnd(e)
      }

      draggingBlank.current = false
    },
    [dragEnd, shouldStop, sub]
  )

  const subClick = useCallback(
    (e: MouseEvent) => {
      if (sub && e.target !== rootEle.current) {
        e.stopPropagation()

        clearSelection()
      }
    },
    [sub, clearSelection]
  )

  // 移除
  const remove = useCallback(
    (cell: GridDragResizeItemProps) => {
      if (props.cells) {
        const idx = props.cells.findIndex((o) => o === cell)
        if (idx > -1) {
          props.cells.splice(idx, 1)
          props.updateCells?.(props.cells ? [...props.cells] : [])
        }
      }
    },
    [props]
  )

  // 克隆
  const deepClone = useCallback((cell: Record<string, any>): GridDragResizeItemProps => {
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
  }, [])

  // 内部互 drop 开始
  const cellDropStart = useCallback(
    (cell: GridDragResizeItemProps, val: { ele: HTMLElement | null; remove: () => void }) => {
      context.state.droppingChild = deepClone(cell)
      context.state.droppingChildEle = val.ele ?? undefined
      context.state.droppingChildRaw = cell
      context.state.droppingChildRemove = val.remove
      context.setState({ ...context.state })

      props.updateDroppingChild?.(context.state.droppingChild)
    },
    [context, deepClone, props]
  )

  // grid 模版 缓存记录
  const dropRowTemplateRef = useRef(props.rowTemplate)
  const dropColumnTemplateRef = useRef(props.columnTemplate)

  const dropStart = useCallback(
    (
      val: {
        ele: HTMLElement | null
        remove: () => void | undefined
      },
      cell: GridDragResizeItemProps
    ) => {
      cellDropStart(cell, val)

      // 缓存 grid 模版
      dropRowTemplateRef.current = props.rowTemplate
        ? gridTemplateExpand(props.rowTemplate, rowsChangedRef.current, getRowSize())
        : ''
      dropColumnTemplateRef.current = props.columnTemplate
        ? gridTemplateExpand(props.columnTemplate, columnsChangedRef.current, getColumnSize())
        : ''
    },
    [cellDropStart, props.rowTemplate, props.columnTemplate, getRowSize, getColumnSize]
  )

  const subDropOver = useCallback(
    (e: DragEvent) => {
      if (sub && droppableInDefault.current) {
        e.stopPropagation()

        dropOver(e)
      }
    },
    [dropOver, sub]
  )

  // 内部互 drop 结束
  const cellDropEnd = useCallback(() => {
    clearSelection()

    droppingChildClear()
  }, [clearSelection, droppingChildClear])

  return props.children
    ? createElement(
        TagNameState,
        {
          className: `grid-drag-resize ${[
            ...(suffixClassState ? [suffixClassState] : []),
            ...(sub ? ['grid-drag-resize--sub'] : []),
            ...(props.className ? [props.className] : []),
          ].join(' ')}`,
          ref: rootEle,
          style: {
            ...props.style,
          },
        },
        props.children
      )
    : createElement(
        TagNameState,
        {
          className: `grid-drag-resize ${[
            ...(suffixClassState ? [suffixClassState] : []),
            ...(sub ? ['grid-drag-resize--sub'] : []),
            ...(droppingChildState && droppingState ? ['grid-drag-resize--dropping'] : []),
            ...(props.className ? [props.className] : []),
          ].join(' ')}`,
          ref: rootEle,
          style: {
            ...props.style,
            ...style,
          },
          //
          onDragOver: subDropOver,
          onDrop: drop,
          onMouseDown: subDragStart,
          onMouseMove: subDragMove,
          onMouseUp: subDragEnd,
          onClick: subClick,
        },
        <>
          {props.cells?.map((cell, idx) => {
            const key = idGen(cell)
            return (
              <GridDragResizeItem
                key={key}
                {...{
                  ...cell,
                  columnStart: cell.columnStart,
                  columnEnd: cell.columnEnd,
                  rowStart: cell.rowStart,
                  rowEnd: cell.rowEnd,
                  rows: cell.rows,
                  columns: cell.columns,
                  //
                  updateColumnStart: (val) => {
                    cell.columnStart = val
                  },
                  updateColumnEnd: (val) => {
                    cell.columnEnd = val
                  },
                  updateRowStart: (val) => {
                    cell.rowStart = val
                  },
                  updateRowEnd: (val) => {
                    cell.rowEnd = val
                  },
                  updateRows: (val) => {
                    cell.rows = val
                  },
                  updateColumns: (val) => {
                    cell.columns = val
                  },
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
                  startResize: (e) => {
                    resizingStart(e)
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
                  ...(context.state.selectedChild === cell
                    ? ['grid-drag-resize__item--selected']
                    : []),
                  ...(context.state.selectedChild === cell && resizingChildState === cell
                    ? ['grid-drag-resize__item--resizing']
                    : []),
                ].join(' ')}
                style={{
                  zIndex:
                    draggingChildState === cell
                      ? (props.cells?.length ?? 0) + 2
                      : context.state.selectedChild === cell
                        ? (props.cells?.length ?? 0) + 1
                        : idx + 1,
                  cursor: resizingChildCursorState,
                }}
                parentProps={parentPropsState}
              ></GridDragResizeItem>
            )
          })}
          {droppingChildState && droppingState && (
            <GridDragResizeItem
              key={0}
              {...{
                draggable: false,
                resizable: false,
                ...droppingRowColumnState,
              }}
              className="grid-drag-resize__item--shadow"
              style={{
                zIndex: (props.cells?.length ?? 0) + 3,
              }}
            ></GridDragResizeItem>
          )}
        </>
      )
}

export default function GridDragResize(props: GridDragResizeComponent) {
  // console.log('GridDragResize')
  const [state, setState] = useState<GridDragResizeContextState>({
    dragging: false,
    resizing: false,
    //
    droppingChild: props.droppingChild,
    droppingChildRaw: props.droppingChild,
    selectedChild: props.selectedChild,
  })

  const context = useContext(GridDragResizeContext) ?? {
    state,
    setState,
  }
  return (
    <GridDragResizeContext.Provider value={context}>
      <GridDragResizeWithTagName
        {...props}
        parentProps={{ ...props.parentProps, ...props }}
      ></GridDragResizeWithTagName>
    </GridDragResizeContext.Provider>
  )
}
