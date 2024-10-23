import { useState } from 'react'

import { GridDragResize } from '@/lib/components/GridDragResize'
import type { GridDragResizeProps, GridDragResizeItemProps } from '@/lib/components/GridDragResize'

// 拖入之前进行处理（同步）
function beforeDrop(cell: GridDragResizeItemProps): GridDragResizeItemProps {
  cell.data = {
    ...(cell.data ?? {}),
    time: Date.now(),
  }

  return cell
}

export default function ComponentH() {
  const [cells, setCells] = useState<GridDragResizeProps['cells']>([
    {
      render: () => (
        <div className="demo-item" style={{ background: '#8e5c6a' }}>
          A
        </div>
      ),
    },
    {
      rowStart: 2,
      rowEnd: 3,
      columnStart: 2,
      columnEnd: 3,
      render: () => (
        <div className="demo-item" style={{ background: '#F2BAC9' }}>
          B
        </div>
      ),
    },
  ])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        padding: '10px',
        background: '#3c3c3c',
        color: '#fff',
        lineHeight: '1.1em',
      }}
    >
      <header
        style={{
          flexShrink: 0,
          paddingBottom: '10px',
          textAlign: 'center',
        }}
      >
        <p>Component H</p>
      </header>
      <footer
        style={{
          flexGrow: 1,
          height: 0,
          backgroundColor: '#fff',
        }}
      >
        <GridDragResize
          columns={2}
          rows={2}
          gap={4}
          beforeDrop={beforeDrop}
          cells={cells}
          updateCells={(val) => setCells(val)}
        ></GridDragResize>
      </footer>
    </div>
  )
}
