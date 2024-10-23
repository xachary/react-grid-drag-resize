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

import type { GridDragResizeItemProps } from './types'

type GridDragResizeItemComponent = GridDragResizeItemProps & {
  className?: string
  style?: CSSProperties
} & DOMAttributes<HTMLDivElement>

import { GridDragResizeContext, type GridDragResizeContextType } from './context'

export default function GridDragResizeItem(props: GridDragResizeItemComponent) {
  // console.log('GridDragResizeItem', props)

  const context = useContext(GridDragResizeContext)

  const columnsParsed = useMemo(() => props?.columns || 1, [props?.columns])
  const rowsParsed = useMemo(() => props?.rows || 1, [props?.rows])

  const columnStartParsed = useMemo(
    () => ((props?.columnStart ?? 0) < 1 ? 1 : props?.columnStart),
    [props?.columnStart]
  )
  const columnEndParsed = useMemo(
    () => ((props?.columnEnd ?? 0) < 2 ? 2 : props?.columnEnd),
    [props?.columnEnd]
  )
  const rowStartParsed = useMemo(
    () => ((props?.rowStart ?? 0) < 1 ? 1 : props?.rowStart),
    [props?.rowStart]
  )
  const rowEndParsed = useMemo(
    () => ((props?.rowEnd ?? 0) < 2 ? 2 : props?.rowEnd),
    [props?.rowEnd]
  )

  // 穿透 Props 处理
  const dragHandlerParsed = useMemo(
    () => props?.dragHandler || context?.gird?.props.dragHandler,
    [props?.dragHandler, context?.gird?.props.dragHandler]
  )
  const dropOutHandlerParsed = useMemo(
    () => props?.dropOutHandler || context?.gird?.props.dropOutHandler,
    [props?.dropOutHandler, context?.gird?.props.dropOutHandler]
  )
  const removeHandlerParsed = useMemo(
    () => props?.removeHandler || context?.gird?.props.removeHandler,
    [props?.removeHandler, context?.gird?.props.removeHandler]
  )
  const overflowParsed = useMemo(
    () => props?.overflow || context?.gird?.props.overflow,
    [props?.overflow, context?.gird?.props.overflow]
  )
  //
  const readonlyParsed = useMemo(
    () => props?.readonly ?? context?.gird?.props.readonly,
    [props?.readonly, context?.gird?.props.readonly]
  )
  //
  const draggableParsed = useMemo(
    () => (readonlyParsed ? false : (props?.draggable ?? context?.gird?.props.draggable)),
    [readonlyParsed, props?.draggable, context?.gird?.props.draggable]
  )
  const resizableParsed = useMemo(
    () => (readonlyParsed ? false : (props?.resizable ?? context?.gird?.props.resizable)),
    [readonlyParsed, props?.resizable, context?.gird?.props.resizable]
  )
  const removableParsed = useMemo(
    () => (readonlyParsed ? false : (props?.removable ?? context?.gird?.props.removable)),
    [readonlyParsed, props?.removable, context?.gird?.props.removable]
  )
  const droppableOutParsed = useMemo(
    () =>
      readonlyParsed
        ? false
        : (context?.gird?.props?.droppableOut ??
          props?.droppableOut ??
          context?.gird?.props.droppableOut),
    [readonlyParsed, props?.droppableOut, context?.gird?.props.droppableOut]
  )
  //
  const debugParsed = useMemo(
    () => props?.debug ?? context?.gird?.props.debug,
    [props?.debug, context?.gird?.props.debug]
  )

  // 默认值处理
  const draggableDefault = useMemo(() => draggableParsed ?? true, [draggableParsed])
  const resizableDefault = useMemo(() => resizableParsed ?? true, [resizableParsed])
  const removableDefault = useMemo(() => removableParsed ?? true, [removableParsed])
  const droppableOutDefault = useMemo(() => droppableOutParsed ?? true, [droppableOutParsed])

  if (debugParsed) {
    console.log(context?.gird?.props)
  }

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
    ]
  )

  const contextNext: GridDragResizeContextType | undefined = context
    ? {
        gird: {
          props: providePropsRef,
        },
        state: context.state,
      }
    : undefined

  // 数据整理
  useEffect(() => {
    if (props?.rows !== rowsParsed) {
      props?.updateRows?.(rowsParsed)
    }

    if (props?.columns !== columnsParsed) {
      props?.updateColumns?.(columnsParsed)
    }
  }, [props, rowsParsed, columnsParsed, props?.rows, props?.columns])

  useEffect(() => {
    let columnStart = props?.columnStart ?? 0
    let columnEnd = props?.columnEnd ?? 0
    let columns = props?.columns ?? 0
    let rowStart = props?.rowStart ?? 0
    let rowEnd = props?.rowEnd ?? 0
    let rows = props?.rows ?? 0

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

      if (columns < 1 || columnEnd - columnStart) {
        if (columnStart !== void 0 && columnEnd !== void 0) {
          columns = columnEnd - columnStart
        }
      }

      if (rows < 1 || rows > rowEnd - rowStart) {
        if (rowEnd !== void 0 && rowStart !== void 0) {
          rows = rowEnd - rowStart
        }
      }
    }

    props?.updateColumnStart?.(columnStart)
    props?.updateColumnEnd?.(columnEnd)
    props?.updateColumns?.(columns)

    props?.updateRowStart?.(rowStart)
    props?.updateRowEnd?.(rowEnd)
    props?.updateRows?.(rows)
  }, [
    props,
    props?.columnEnd,
    props?.columnStart,
    props?.columns,
    props?.rowEnd,
    props?.rowStart,
    props?.rows,
  ])

  // 样式
  const style = useMemo(() => {
    return {
      gridColumnStart: columnStartParsed ?? '',
      gridColumnEnd: columnEndParsed ?? '',
      gridRowStart: rowStartParsed ?? '',
      gridRowEnd: rowEndParsed ?? '',
    }
  }, [columnStartParsed, columnEndParsed, rowStartParsed, rowEndParsed])

  const itemEle = useRef<HTMLDivElement | null>(null)
  const [itemEleState, setItemEleState] = useState(itemEle.current)
  useEffect(() => {
    setItemEleState(itemEle.current)
  }, [itemEle])

  // 拖动开始
  const dragstart = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (draggableDefault) {
        console.log('item dragstart')
        // 通知父组件 当前拖动子组件
        props?.startDrag?.({
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
    [props, draggableDefault]
  )

  const dropEnd = useCallback(() => {
    props?.dropEnd?.()
  }, [props])

  const dropStart = useCallback(() => {
    props?.dropStart?.({
      ele: itemEle.current,
      remove: () => {
        if (removableDefault) {
          props?.remove?.()
        }
      },
    })
  }, [props, removableDefault])

  // 移除
  const remove = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.stopPropagation()

      props?.remove?.()
    },
    [props]
  )

  // dragHandler 定位、处理、事件绑定
  useEffect(() => {
    if (draggableDefault && dragHandlerParsed && itemEle.current) {
      const handlerEle = itemEle.current.querySelector(dragHandlerParsed)
      if (handlerEle instanceof HTMLElement) {
        handlerEle.style.cursor = 'move'

        handlerEle.addEventListener('mousedown', dragstart)
      }
    }
  }, [dragHandlerParsed, draggableDefault, dragstart])

  // dropOutHandler 定位、处理、事件绑定
  useEffect(() => {
    if (droppableOutDefault && dropOutHandlerParsed && itemEle.current) {
      const handlerEle = itemEle.current.querySelector(dropOutHandlerParsed)
      if (handlerEle instanceof HTMLElement) {
        handlerEle.style.cursor = 'grab'

        handlerEle.setAttribute('draggable', 'true')

        handlerEle.addEventListener('mousedown', (e: MouseEvent) => {
          e.stopPropagation()
          dropStart()
        })
        handlerEle.addEventListener('mousemove', (e: MouseEvent) => {
          e.stopPropagation()
        })
        handlerEle.addEventListener('mouseup', (e: MouseEvent) => {
          e.stopPropagation()
        })
        handlerEle.addEventListener('dragstart', (e: MouseEvent) => {
          e.stopPropagation()
        })
        handlerEle.addEventListener('dragend', (e: MouseEvent) => {
          e.stopPropagation()
          dropEnd()
        })
      }
    }
  }, [dropStart, dropEnd, dropOutHandlerParsed, droppableOutDefault])

  // removeHandler 定位、处理、事件绑定
  useEffect(() => {
    if (removableDefault && removeHandlerParsed && itemEle.current) {
      const handlerEle = itemEle.current.querySelector(removeHandlerParsed)
      if (handlerEle instanceof HTMLElement) {
        handlerEle.style.cursor = 'pointer'

        handlerEle.addEventListener('click', (e: MouseEvent) => {
          remove(e)
        })

        handlerEle.addEventListener('mousedown', (e: MouseEvent) => {
          e.stopPropagation()
        })
        handlerEle.addEventListener('mousemove', (e: MouseEvent) => {
          e.stopPropagation()
        })
        handlerEle.addEventListener('mouseup', (e: MouseEvent) => {
          e.stopPropagation()
        })
      }
    }
  }, [remove, removableDefault, removeHandlerParsed])

  // 选中
  function selectAndResizing(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    if (!readonlyParsed) {
      e.stopPropagation()

      // 通知父组件 选中子组件
      props?.select?.()
    }

    if (resizableDefault) {
      e.stopPropagation()

      // 通知父组件 选中子组件
      props?.selectResizing?.()
    }
  }

  // 开始改变大小
  function resizeStart(
    e: MouseEvent | React.MouseEvent<HTMLElement, MouseEvent>,
    direction: string
  ) {
    if (resizableDefault) {
      e.stopPropagation()

      props?.startResize?.({
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
  }

  // 自适应间距
  const removeDistance = useMemo(() => {
    const size = 13 / 2
    const gap = context?.gird?.props?.gap ?? 0
    return gap < size ? gap : size
  }, [context?.gird?.props?.gap])

  // 自适应间距
  const adjustDistance = useMemo(() => {
    const size = 10 / 2
    const gap = context?.gird?.props?.gap ?? 0
    return gap < size ? gap : size
  }, [context?.gird?.props?.gap])

  // 自适应间距
  const dropDistance = useMemo(() => {
    const size = 16 / 2
    const gap = context?.gird?.props?.gap ?? 0
    return gap < size ? gap : size
  }, [context?.gird?.props?.gap])

  function mouseover(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    if (context?.state && e.currentTarget instanceof HTMLElement) {
      context.state.hoverEle = e.currentTarget
    }
  }

  function mouseleave() {
    if (context?.state) {
      context.state.hoverEle = undefined
    }
  }

  const hover = useMemo(() => {
    return context?.state?.hoverEle === itemEleState
  }, [context?.state?.hoverEle, itemEleState])

  return (
    <GridDragResizeContext.Provider value={contextNext}>
      <div
        className={`grid-drag-resize__item ${[
          ...(draggableDefault ? ['grid-drag-resize__item--draggable'] : []),
          ...(draggableDefault && !dragHandlerParsed
            ? ['grid-drag-resize__item--draggable-full']
            : []),
          ...(hover && !context?.state?.dragging && !context?.state?.resizing
            ? ['grid-drag-resize__item--hover']
            : []),
          ...(props.className ? [props.className] : []),
        ].join(' ')}`}
        style={{ ...style, ...props.style }}
        onMouseDown={(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
          dragHandlerParsed ? undefined : dragstart(e)
        }
        onClick={selectAndResizing}
        onMouseOver={mouseover}
        onMouseLeave={mouseleave}
        ref={itemEle}
      >
        <div className="grid-drag-resize__item__group" style={{ overflow: overflowParsed }}>
          {props.children}
        </div>
        <b className="grid-drag-resize__item__border grid-drag-resize__item__border--top"></b>
        <b className="grid-drag-resize__item__border grid-drag-resize__item__border--bottom"></b>
        <b className="grid-drag-resize__item__border grid-drag-resize__item__border--left"></b>
        <b className="grid-drag-resize__item__border grid-drag-resize__item__border--right"></b>
        <i
          className="grid-drag-resize__item__adjust grid-drag-resize__item__adjust--top"
          style={{ top: `${-adjustDistance}px` }}
          onMouseDown={(e) => resizeStart(e, 'top')}
        ></i>
        <i
          className="grid-drag-resize__item__adjust grid-drag-resize__item__adjust--right"
          style={{ right: `${-adjustDistance}px` }}
          onMouseDown={(e) => resizeStart(e, 'right')}
        ></i>
        <i
          className="grid-drag-resize__item__adjust grid-drag-resize__item__adjust--bottom"
          style={{ bottom: `${-adjustDistance}px` }}
          onMouseDown={(e) => resizeStart(e, 'bottom')}
        ></i>
        <i
          className="grid-drag-resize__item__adjust grid-drag-resize__item__adjust--left"
          style={{ left: `${-adjustDistance}px` }}
          onMouseDown={(e) => resizeStart(e, 'left')}
        ></i>
        <i
          className="grid-drag-resize__item__adjust grid-drag-resize__item__adjust--top-left"
          style={{ top: `${-adjustDistance}px`, left: `${-adjustDistance}px` }}
          onMouseDown={(e) => resizeStart(e, 'top-left')}
        ></i>
        <i
          className="grid-drag-resize__item__adjust grid-drag-resize__item__adjust--top-right"
          style={{ top: `${-adjustDistance}px`, right: `${-adjustDistance}px` }}
          onMouseDown={(e) => resizeStart(e, 'top-right')}
        ></i>
        <i
          className="grid-drag-resize__item__adjust grid-drag-resize__item__adjust--bottom-left"
          style={{ bottom: `${-adjustDistance}px`, left: `${-adjustDistance}px` }}
          onMouseDown={(e) => resizeStart(e, 'bottom-left')}
        ></i>
        <i
          className="grid-drag-resize__item__adjust grid-drag-resize__item__adjust--bottom-right"
          style={{ bottom: `${-adjustDistance}px`, right: `${-adjustDistance}px` }}
          onMouseDown={(e) => resizeStart(e, 'bottom-right')}
        ></i>
        <span
          className="grid-drag-resize__item__remove"
          style={{ top: `${-removeDistance}px`, right: `${-removeDistance}px` }}
          onClick={remove}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          v-if="removableDefault && !removeHandlerParsed"
        ></span>
        <div
          className="grid-drag-resize__item__drop"
          style={{ top: droppableOutDefault ? `${-dropDistance}px` : '' }}
          draggable="true"
          onMouseDown={(e) => {
            e.stopPropagation()
            dropStart()
          }}
          onMouseMove={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onDragStart={(e) => e.stopPropagation()}
          onDragEnd={(e) => e.stopPropagation()}
          v-if="droppableOutDefault && !dropOutHandlerParsed"
        ></div>
      </div>
    </GridDragResizeContext.Provider>
  )
}
