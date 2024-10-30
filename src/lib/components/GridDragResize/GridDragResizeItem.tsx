import {
  useContext,
  useMemo,
  useRef,
  useCallback,
  type CSSProperties,
  useEffect,
  type DOMAttributes,
  useState,
} from 'react'

import type { GridDragResizeItemProps, GridDragResizeProps } from './types'

type GridDragResizeItemComponent = GridDragResizeItemProps & {
  className?: string
  style?: CSSProperties
} & DOMAttributes<HTMLDivElement>

import { GridDragResizeContext } from './context'

import GridDragResize from './GridDragResize'

// TODO: 拖入后，hover 样式没立即生效
// TODO: 性能问题

export default function GridDragResizeItem(props: GridDragResizeItemComponent) {
  // 穿透上下文
  const context = useContext(GridDragResizeContext)

  // Props 转 useRef
  const columnsParsed = useRef(1)
  const rowsParsed = useRef(1)
  const columnStartParsed = useRef(1)
  const columnEndParsed = useRef(2)
  const rowStartParsed = useRef(1)
  const rowEndParsed = useRef(2)
  const dragHandlerParsed = useRef<string | undefined>()
  const dropOutHandlerParsed = useRef<string | undefined>()
  const removeHandlerParsed = useRef<string | undefined>()
  const overflowParsed = useRef<string | undefined>()
  const readonlyParsed = useRef<boolean | undefined>()
  const draggableParsed = useRef<boolean | undefined>()
  const resizableParsed = useRef<boolean | undefined>()
  const removableParsed = useRef<boolean | undefined>()
  const droppableOutParsed = useRef<boolean | undefined>()
  const debugParsed = useRef<boolean | undefined>()
  const parentPropsParsed = useRef<GridDragResizeProps | undefined>()

  // Props 的 useRef 默认值处理
  const draggableDefault = useRef<boolean | undefined>()
  const resizableDefault = useRef<boolean | undefined>()
  const removableDefault = useRef<boolean | undefined>()
  const droppableOutDefault = useRef<boolean | undefined>()

  useEffect(() => {
    columnsParsed.current = props.columns || 1
    rowsParsed.current = props.rows || 1
    columnStartParsed.current = ((props.columnStart ?? 0) < 1 ? 1 : props.columnStart)!
    columnEndParsed.current = ((props.columnEnd ?? 0) < 2 ? 2 : props.columnEnd)!
    rowStartParsed.current = ((props.rowStart ?? 0) < 1 ? 1 : props.rowStart)!
    rowEndParsed.current = ((props.rowEnd ?? 0) < 2 ? 2 : props.rowEnd)!
    dragHandlerParsed.current = props.dragHandler || props.parentProps?.dragHandler
    dropOutHandlerParsed.current = props.dropOutHandler || props.parentProps?.dropOutHandler
    removeHandlerParsed.current = props.removeHandler || props.parentProps?.removeHandler
    overflowParsed.current = props.overflow || props.parentProps?.overflow

    readonlyParsed.current = props.readonly ?? props.parentProps?.readonly

    draggableParsed.current = readonlyParsed.current
      ? false
      : (props.draggable ?? props.parentProps?.draggable)
    draggableDefault.current = draggableParsed.current ?? true
    resizableParsed.current = readonlyParsed.current
      ? false
      : (props.resizable ?? props.parentProps?.resizable)
    resizableDefault.current = resizableParsed.current ?? true
    removableParsed.current = readonlyParsed.current
      ? false
      : (props.removable ?? props.parentProps?.removable)
    removableDefault.current = removableParsed.current ?? true
    droppableOutParsed.current = readonlyParsed.current
      ? false
      : (props.droppableOut ?? props.parentProps?.droppableOut)
    droppableOutDefault.current = droppableOutParsed.current ?? true
    debugParsed.current = props.debug ?? props.parentProps?.debug
    parentPropsParsed.current = { ...props.parentProps }
  }, [props])

  // Props 转 useState
  const [droppableOutDefaultState, setDroppableOutDefaultState] = useState(
    droppableOutDefault.current
  )
  const [dropOutHandlerState, setDropOutHandlerState] = useState(dropOutHandlerParsed.current)
  const [removeHandlerState, setRemoveHandlerState] = useState(removeHandlerParsed.current)
  const [removableDefaultState, setRemovableDefaultState] = useState(removableDefault.current)
  const [overflowState, setOverflowState] = useState(overflowParsed.current)
  const [dragHandlerState, setDragHandlerState] = useState(dragHandlerParsed.current)
  const [draggableDefaultState, setDraggableDefaultState] = useState(draggableDefault.current)
  const [columnStartState, setColumnStartState] = useState(columnStartParsed.current)
  const [columnEndState, setColumnEndState] = useState(columnEndParsed.current)
  const [rowStartState, setRowStartState] = useState(rowStartParsed.current)
  const [rowEndState, setRowEndState] = useState(rowEndParsed.current)
  const [rowsState, setRowsState] = useState(rowsParsed.current)
  const [columnsState, setColumnsState] = useState(columnsParsed.current)

  // Props 的 useState 默认值处理
  useEffect(() => {
    setDroppableOutDefaultState(droppableOutParsed.current ?? true)
  }, [props.droppableOut, props.parentProps?.droppableOut])
  useEffect(() => {
    setDropOutHandlerState(dropOutHandlerParsed.current)
  }, [props.dropOutHandler, props.parentProps?.dropOutHandler])
  useEffect(() => {
    setRemoveHandlerState(removeHandlerParsed.current)
  }, [props.removeHandler, props.parentProps?.removeHandler])
  useEffect(() => {
    setRemovableDefaultState(removableParsed.current ?? true)
  }, [props.removable, props.parentProps?.removable])
  useEffect(() => {
    setOverflowState(overflowParsed.current)
  }, [props.overflow, props.parentProps?.overflow])
  useEffect(() => {
    setDragHandlerState(dragHandlerParsed.current)
  }, [props.dragHandler, props.parentProps?.dragHandler])
  useEffect(() => {
    setDraggableDefaultState(draggableParsed.current ?? true)
  }, [props.draggable, props.parentProps?.draggable])
  useEffect(() => {
    setColumnStartState(columnStartParsed.current)
  }, [props.columnStart])
  useEffect(() => {
    setColumnEndState(columnEndParsed.current)
  }, [props.columnEnd])
  useEffect(() => {
    setRowStartState(rowStartParsed.current)
  }, [props.rowStart])
  useEffect(() => {
    setRowEndState(rowEndParsed.current)
  }, [props.rowEnd])
  useEffect(() => {
    setRowsState(rowsParsed.current)
  }, [props.rows])
  useEffect(() => {
    setColumnsState(columnsParsed.current)
  }, [props.columns])

  // Dom
  const itemEle = useRef<HTMLDivElement | null>(null)
  const [itemEleState, setItemEleState] = useState(itemEle.current)

  useEffect(() => {
    setItemEleState(itemEle.current)
  }, [])

  // 下发父配置
  const [parentPropsState, setParentPropsState] = useState(parentPropsParsed.current)
  const parentProps = useRef({ ...parentPropsParsed.current })

  useEffect(() => {
    parentProps.current = {
      ...parentPropsParsed.current,
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
      droppableIn: props.droppableIn,
      droppableOut: droppableOutParsed.current,
      //
      debug: debugParsed.current,
    }
    setParentPropsState(parentProps.current)
  }, [props])

  // 调试
  if (debugParsed.current) {
    console.log(parentProps)
  }

  // ............................................................

  // 自适应间距
  const [adjustDistanceState, setAdjustDistanceState] = useState(props.parentProps?.gap ?? 0)
  useEffect(() => {
    const size = 10 / 2
    const gap = props.parentProps?.gap ?? 0
    setAdjustDistanceState(gap < size ? gap : size)
  }, [props.parentProps?.gap])

  // 自适应间距
  const [removeDistanceState, setRemoveDistanceState] = useState(props.parentProps?.gap ?? 0)
  useEffect(() => {
    const size = 13 / 2
    const gap = props.parentProps?.gap ?? 0
    setRemoveDistanceState(gap < size ? gap : size)
  }, [props.parentProps?.gap])

  // 自适应间距
  const [dropDistanceState, setDropDistanceState] = useState(props.parentProps?.gap ?? 0)
  useEffect(() => {
    const size = 16 / 2
    const gap = props.parentProps?.gap ?? 0
    setDropDistanceState(gap < size ? gap : size)
  }, [props.parentProps?.gap])

  // hover 状态
  const [hoverEleState, setHoverEleState] = useState(context?.state.hoverEle)
  const [hoverState, setHoverState] = useState(hoverEleState === itemEleState)
  useEffect(() => {
    setHoverState(hoverEleState === itemEleState)
  }, [hoverEleState, itemEleState])
  useEffect(() => {
    setHoverEleState(context?.state.hoverEle)
  }, [context?.state.hoverEle])

  // 样式
  const style = useMemo(() => {
    return {
      gridColumnStart: columnStartState ?? '',
      gridColumnEnd: columnEndState ?? '',
      gridRowStart: rowStartState ?? '',
      gridRowEnd: rowEndState ?? '',
    }
  }, [columnStartState, columnEndState, rowStartState, rowEndState])

  // 数据整理
  useEffect(() => {
    if (props.rows !== rowsState) {
      props.updateRows?.(rowsState)
    }
  }, [props, rowsState])

  useEffect(() => {
    if (props.columns !== columnsState) {
      props.updateColumns?.(columnsState)
    }
  }, [props, columnsState])

  // ............................................................

  useEffect(() => {
    let columnStart = props.columnStart ?? 0
    let columnEnd = props.columnEnd ?? 0
    let columns = props.columns ?? 0
    let rowStart = props.rowStart ?? 0
    let rowEnd = props.rowEnd ?? 0
    let rows = props.rows ?? 0

    if (
      (columnStart < 1 && columnEnd < 1) ||
      (columnStart > 0 && columnEnd > 0 && columnEnd <= columnStart)
    ) {
      columnStart = 0
      columnEnd = 0
    }

    if (columns < 1) {
      columns = 1
    }

    if ((rowStart < 1 && rowEnd < 1) || (rowEnd <= rowStart && rowStart > 0 && rowEnd > 1)) {
      rowStart = 0
      rowEnd = 0
    }

    if (rows < 1) {
      rows = 1
    }

    if (columnStart < 1 && columnEnd < 1 && rowStart < 1 && rowEnd < 1) {
      // ! 留给 parent 计算
    } else {
      if (columnStart < 1) {
        columnStart = 1
      }

      if (columnEnd < columnStart) {
        if (columns < 1) {
          columnEnd = columnStart + 1
        } else {
          columnEnd = columnStart + columns
        }
      }

      if (rowStart < 1) {
        rowStart = 1
      }

      if (rowEnd < rowStart) {
        if (rows < 1) {
          rowEnd = rowStart + 1
        } else {
          rowEnd = rowStart + rows
        }
      }

      if (columns < 1 || columns < columnEnd - columnStart) {
        if (columnStart !== void 0 && columnEnd !== void 0) {
          columns = columnEnd - columnStart
        }
      }

      if (rows < 1 || rows < rowEnd - rowStart) {
        if (rowEnd !== void 0 && rowStart !== void 0) {
          rows = rowEnd - rowStart
        }
      }
    }

    props.updateColumnStart?.(columnStart)
    props.updateColumnEnd?.(columnEnd)
    props.updateColumns?.(columns)

    props.updateRowStart?.(rowStart)
    props.updateRowEnd?.(rowEnd)
    props.updateRows?.(rows)
  }, [props])

  // 拖动开始
  const dragstart = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (draggableDefault.current) {
        // 通知父组件 当前拖动子组件
        props.startDrag?.({
          event: e as MouseEvent,
          rect:
            itemEle?.current?.getBoundingClientRect() ??
            ({
              height: 0,
              width: 0,
              x: 0,
              y: 0,
              bottom: 0,
              right: 0,
            } as DOMRect),
        })
      }
    },
    [props]
  )

  const dropEnd = useCallback(() => {
    props.dropEnd?.()
  }, [props])

  const dropStart = useCallback(() => {
    props.dropStart?.({
      ele: itemEle.current,
      remove: () => {
        if (removableDefault.current) {
          props.remove?.()
        }
      },
    })
  }, [props])

  // 移除
  const remove = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.stopPropagation()

      props.remove?.()
    },
    [props]
  )

  // dragHandler 定位、处理、事件绑定
  useEffect(() => {
    if (draggableDefaultState && dragHandlerState && itemEle.current) {
      const handlerEle = itemEle.current.querySelector(dragHandlerState)
      if (handlerEle instanceof HTMLElement) {
        handlerEle.style.cursor = 'move'
        handlerEle.addEventListener('mousedown', dragstart)
      }
    }

    return () => {
      window.removeEventListener('mousedown', dragstart)
    }
  }, [draggableDefaultState, dragHandlerState, dragstart])

  // dropOutHandler 定位、处理、事件绑定
  const mousedownLastDrop = useRef<(e: MouseEvent) => void>()
  const mousemoveLastDrop = useRef<(e: MouseEvent) => void>()
  const mouseupLastDrop = useRef<(e: MouseEvent) => void>()
  const dragstartLastDrop = useRef<(e: MouseEvent) => void>()
  const dragendLastDrop = useRef<(e: MouseEvent) => void>()

  useEffect(() => {
    if (droppableOutDefaultState && dropOutHandlerState && itemEle.current) {
      const handlerEle = itemEle.current.querySelector(dropOutHandlerState)
      if (handlerEle instanceof HTMLElement) {
        handlerEle.style.cursor = 'grab'

        handlerEle.setAttribute('draggable', 'true')

        if (mousedownLastDrop.current) {
          handlerEle.removeEventListener('mousedown', mousedownLastDrop.current)
        }
        if (mousemoveLastDrop.current) {
          handlerEle.removeEventListener('mousemove', mousemoveLastDrop.current)
        }
        if (mouseupLastDrop.current) {
          handlerEle.removeEventListener('mouseup', mouseupLastDrop.current)
        }
        if (dragstartLastDrop.current) {
          handlerEle.removeEventListener('dragstart', dragstartLastDrop.current)
        }
        if (dragendLastDrop.current) {
          handlerEle.removeEventListener('dragend', dragendLastDrop.current)
        }

        mousedownLastDrop.current = (e: MouseEvent) => {
          e.stopPropagation()
          dropStart()
        }
        handlerEle.addEventListener('mousedown', mousedownLastDrop.current)
        mousemoveLastDrop.current = (e: MouseEvent) => {
          e.stopPropagation()
        }
        handlerEle.addEventListener('mousemove', mousemoveLastDrop.current)
        mouseupLastDrop.current = (e: MouseEvent) => {
          e.stopPropagation()
        }
        handlerEle.addEventListener('mouseup', mouseupLastDrop.current)
        dragstartLastDrop.current = (e: MouseEvent) => {
          e.stopPropagation()
        }
        handlerEle.addEventListener('dragstart', dragstartLastDrop.current)
        dragendLastDrop.current = (e: MouseEvent) => {
          e.stopPropagation()
          dropEnd()
        }
        handlerEle.addEventListener('dragend', dragendLastDrop.current)
      }
    }
  }, [dropOutHandlerState, droppableOutDefaultState, dropEnd, dropStart])

  // removeHandler 定位、处理、事件绑定
  const clickLastRemove = useRef<(e: MouseEvent) => void>()
  const mousedownLastRemove = useRef<(e: MouseEvent) => void>()
  const mousemoveLastRemove = useRef<(e: MouseEvent) => void>()
  const mouseupLastRemove = useRef<(e: MouseEvent) => void>()

  useEffect(() => {
    if (removableDefaultState && removeHandlerState && itemEle.current) {
      const handlerEle = itemEle.current.querySelector(removeHandlerState)
      if (handlerEle instanceof HTMLElement) {
        handlerEle.style.cursor = 'pointer'

        if (clickLastRemove.current) {
          handlerEle.removeEventListener('click', clickLastRemove.current)
        }
        if (mousedownLastRemove.current) {
          handlerEle.removeEventListener('mousedown', mousedownLastRemove.current)
        }
        if (mousemoveLastRemove.current) {
          handlerEle.removeEventListener('mousemove', mousemoveLastRemove.current)
        }
        if (mouseupLastRemove.current) {
          handlerEle.removeEventListener('mouseup', mouseupLastRemove.current)
        }

        clickLastRemove.current = (e: MouseEvent) => {
          remove(e)
        }
        handlerEle.addEventListener('click', clickLastRemove.current)

        mousedownLastRemove.current = (e: MouseEvent) => {
          e.stopPropagation()
        }
        handlerEle.addEventListener('mousedown', mousedownLastRemove.current)
        mousemoveLastRemove.current = (e: MouseEvent) => {
          e.stopPropagation()
        }
        handlerEle.addEventListener('mousemove', mousemoveLastRemove.current)
        mouseupLastRemove.current = (e: MouseEvent) => {
          e.stopPropagation()
        }
        handlerEle.addEventListener('mouseup', mouseupLastRemove.current)
      }
    }
  }, [removableDefaultState, removeHandlerState, remove])

  // 选中
  const selectAndResizing = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (!readonlyParsed.current) {
        e.stopPropagation()

        // 通知父组件 选中子组件
        props.select?.()
      }

      if (resizableDefault.current) {
        e.stopPropagation()

        // 通知父组件 选中子组件
        props.selectResizing?.()
      }
    },
    [props]
  )

  // 开始改变大小
  const resizeStart = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLElement, MouseEvent>, direction: string) => {
      if (resizableDefault.current) {
        e.stopPropagation()

        props.startResize?.({
          event: e as MouseEvent,
          rect:
            itemEle?.current?.getBoundingClientRect() ??
            ({
              height: 0,
              width: 0,
              x: 0,
              y: 0,
              bottom: 0,
              right: 0,
            } as DOMRect),
          cursor: e.target instanceof HTMLElement ? getComputedStyle(e.target).cursor : '',
          direction,
        })
      }
    },
    [props]
  )

  const mouseover = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (e.currentTarget instanceof HTMLElement) {
        if (context) {
          context.state.hoverEle = e.currentTarget
          context.setState({ ...context.state })
        }
      }
    },
    [context]
  )

  const mouseleave = useCallback(() => {
    if (context) {
      context.state.hoverEle = undefined
      context.setState({ ...context.state })
    }
  }, [context])

  return (
    <div
      className={`grid-drag-resize__item ${[
        ...(draggableDefaultState ? ['grid-drag-resize__item--draggable'] : []),
        ...(draggableDefaultState && !dragHandlerState
          ? ['grid-drag-resize__item--draggable-full']
          : []),
        ...(hoverState && !context?.state.dragging && !context?.state.resizing
          ? ['grid-drag-resize__item--hover']
          : []),
        ...(props.className ? [props.className] : []),
      ].join(' ')}`}
      style={{ ...props.style, ...style }}
      onMouseDown={(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
        dragHandlerState ? undefined : dragstart(e)
      }
      onClick={selectAndResizing}
      onMouseOverCapture={mouseover}
      onMouseLeave={mouseleave}
      ref={itemEle}
    >
      <div className="grid-drag-resize__item__group" style={{ overflow: overflowState }}>
        {props.grid ? (
          <GridDragResize
            {...props.grid}
            droppingChild={context?.state.droppingChild}
            parentProps={parentPropsState}
            updateCells={() =>
              parentPropsState?.updateCells?.([...(parentPropsState?.cells ?? [])])
            }
          ></GridDragResize>
        ) : (
          props.render?.(props)
        )}
      </div>
      <b className="grid-drag-resize__item__border grid-drag-resize__item__border--top"></b>
      <b className="grid-drag-resize__item__border grid-drag-resize__item__border--bottom"></b>
      <b className="grid-drag-resize__item__border grid-drag-resize__item__border--left"></b>
      <b className="grid-drag-resize__item__border grid-drag-resize__item__border--right"></b>
      <i
        className="grid-drag-resize__item__adjust grid-drag-resize__item__adjust--top"
        style={{ top: `${-adjustDistanceState}px` }}
        onMouseDown={(e) => resizeStart(e, 'top')}
      ></i>
      <i
        className="grid-drag-resize__item__adjust grid-drag-resize__item__adjust--right"
        style={{ right: `${-adjustDistanceState}px` }}
        onMouseDown={(e) => resizeStart(e, 'right')}
      ></i>
      <i
        className="grid-drag-resize__item__adjust grid-drag-resize__item__adjust--bottom"
        style={{ bottom: `${-adjustDistanceState}px` }}
        onMouseDown={(e) => resizeStart(e, 'bottom')}
      ></i>
      <i
        className="grid-drag-resize__item__adjust grid-drag-resize__item__adjust--left"
        style={{ left: `${-adjustDistanceState}px` }}
        onMouseDown={(e) => resizeStart(e, 'left')}
      ></i>
      <i
        className="grid-drag-resize__item__adjust grid-drag-resize__item__adjust--top-left"
        style={{ top: `${-adjustDistanceState}px`, left: `${-adjustDistanceState}px` }}
        onMouseDown={(e) => resizeStart(e, 'top-left')}
      ></i>
      <i
        className="grid-drag-resize__item__adjust grid-drag-resize__item__adjust--top-right"
        style={{ top: `${-adjustDistanceState}px`, right: `${-adjustDistanceState}px` }}
        onMouseDown={(e) => resizeStart(e, 'top-right')}
      ></i>
      <i
        className="grid-drag-resize__item__adjust grid-drag-resize__item__adjust--bottom-left"
        style={{ bottom: `${-adjustDistanceState}px`, left: `${-adjustDistanceState}px` }}
        onMouseDown={(e) => resizeStart(e, 'bottom-left')}
      ></i>
      <i
        className="grid-drag-resize__item__adjust grid-drag-resize__item__adjust--bottom-right"
        style={{ bottom: `${-adjustDistanceState}px`, right: `${-adjustDistanceState}px` }}
        onMouseDown={(e) => resizeStart(e, 'bottom-right')}
      ></i>
      {removableDefaultState && !removeHandlerState && (
        <span
          className="grid-drag-resize__item__remove"
          style={{ top: `${-removeDistanceState}px`, right: `${-removeDistanceState}px` }}
          onClick={remove}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
        ></span>
      )}
      {droppableOutDefaultState && !dropOutHandlerState && (
        <div
          className="grid-drag-resize__item__drop"
          style={{ top: droppableOutDefaultState ? `${-dropDistanceState}px` : '' }}
          draggable="true"
          onMouseDown={(e) => {
            e.stopPropagation()
            dropStart()
          }}
          onMouseMove={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onDragStart={(e) => e.stopPropagation()}
          onDragEnd={(e) => e.stopPropagation()}
        ></div>
      )}
    </div>
  )
}
