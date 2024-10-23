import { createContext } from 'react'

import type { GridDragResizeProps, GridDragResizeItemProps } from './types'

export type GridDragResizeContextType = {
  gird?: {
    props: GridDragResizeProps
  }
  cell?: {
    props: GridDragResizeItemProps
  }
  state?: {
    actionEle?: HTMLElement
    droppingChild?: GridDragResizeItemProps
    droppingChildEle?: HTMLElement
    droppingChildRaw?: GridDragResizeItemProps
    droppingChildRemove?: () => void
    droppingEle?: HTMLElement
    hoverEle?: HTMLElement
    dragging: boolean
    resizing: boolean
    selectedChild?: GridDragResizeItemProps
  }
}

export const GridDragResizeContext = createContext<GridDragResizeContextType | undefined>(undefined)
