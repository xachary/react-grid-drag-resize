import { createContext } from 'react'

import type { GridDragResizeItemProps } from './types'

export type GridDragResizeContextState = {
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

// type ExtractType<T> = T extends React.MutableRefObject<infer U> ? U : never;

export type GridDragResizeContextType = {
  // grid?: React.MutableRefObject<GridDragResizeProps>
  // cell?: React.MutableRefObject<GridDragResizeItemProps>
  state: GridDragResizeContextState
  setState: React.Dispatch<React.SetStateAction<GridDragResizeContextState>>
}

export const GridDragResizeContext = createContext<GridDragResizeContextType | undefined>(undefined)
