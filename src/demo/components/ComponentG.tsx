import { useState } from 'react'

import { GridDragResize } from '@/lib/components/GridDragResize'
import type { GridDragResizeProps, GridDragResizeItemProps } from '@/lib/components/GridDragResize'

import ComponentH from './ComponentH'

// 拖入之前进行处理（同步）
function beforeDrop(cell: GridDragResizeItemProps): GridDragResizeItemProps {
  cell.data = {
    ...(cell.data ?? {}),
    time: Date.now(),
  }

  return cell
}

export default function ComponentG() {
  const [cells, setCells] = useState<GridDragResizeProps['cells']>([
    {
      rowStart: 2,
      rowEnd: 3,
      columnStart: 1,
      columnEnd: 2,
      render: () => (
        <div className="demo-item" style={{ background: '#0085ff' }}>
          Child 1
        </div>
      ),
    },
    {
      rowStart: 1,
      rowEnd: 2,
      columnStart: 2,
      columnEnd: 4,
      render: () => (
        <div className="demo-item" style={{ background: '#c2402a' }}>
          Child 2
        </div>
      ),
    },
    {
      columns: 2,
      render: () => (
        <div className="demo-item" style={{ background: '#FF6347' }}>
          Child 3
        </div>
      ),
    },
    {
      rowStart: 2,
      rowEnd: 5,
      columnStart: 3,
      columnEnd: 5,
      render: ComponentH,
      data: {
        name: 'Component H',
      },
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
        background: '#345c81',
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
        <p>Component G</p>
      </header>
      <footer
        style={{
          flexGrow: 1,
          height: 0,
          backgroundColor: '#fff',
        }}
      >
        <GridDragResize
          columns={4}
          rows={4}
          gap={4}
          beforeDrop={beforeDrop}
          cells={cells}
          updateCells={(val) => setCells(val)}
        ></GridDragResize>
      </footer>
    </div>
  )
}
