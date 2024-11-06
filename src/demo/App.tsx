import './App.less'

import { useState } from 'react'

// import { GridDragResize } from '../../dist'
// import type { GridDragResizeProps, GridDragResizeItemProps } from '../../dist'

// import { GridDragResize } from 'react-grid-drag-resize'
// import type { GridDragResizeProps, GridDragResizeItemProps } from 'react-grid-drag-resize'

import { GridDragResize } from '@/lib/components/GridDragResize'
import type {
  GridDragResizeProps,
  GridDragResizeItemProps,
} from '@/lib/components/GridDragResize/types'

import ComponentA from '@/demo/components/ComponentA'
import ComponentB from '@/demo/components/ComponentB'
import ComponentC from '@/demo/components/ComponentC'
import ComponentD from '@/demo/components/ComponentD'
import ComponentG from '@/demo/components/ComponentG'

// 生成 render
function candidateRender(
  columns: number,
  rows: number,
  background: string,
  props: GridDragResizeItemProps
) {
  if (
    [props.columnStart, props.columnEnd, props.rowStart, props.rowEnd].every((o) => o !== void 0)
  ) {
    return (
      <div className="demo-item" style={{ background }}>
        <div>{`${props.columns} x ${props.rows}`}</div>
        <div>{`${props.data.test}`}</div>
      </div>
    )
  } else {
    return (
      <div className="demo-item" style={{ background }}>
        <div>{`${props.columns ?? columns}x${props.rows ?? rows}`}</div>
        <div>{`${props.data.test}`}</div>
      </div>
    )
  }
}

// 生成拖入内容
function createCandidate(
  columns = 1,
  rows = 1,
  background = '#fff',
  columnStart?: number,
  rowStart?: number
) {
  return {
    columns,
    rows,
    columnStart,
    rowStart,
    render: (props: GridDragResizeItemProps) => {
      return candidateRender(columns, rows, background, props)
    },
    data: {
      test: '',
      background,
    },
  } as GridDragResizeItemProps
}

// 拖入之前进行处理（异步）
async function beforeDrop(cell: GridDragResizeItemProps): Promise<GridDragResizeItemProps> {
  return await (() =>
    new Promise((resolve) => {
      setTimeout(() => {
        cell.data = {
          ...(cell.data ?? {}),
          test: 'o_o',
          time: Date.now(),
        }
        resolve(cell)
      }, 100)
    }))()
}

function select(props: GridDragResizeItemProps | undefined) {
  if (props?.data) {
    props.data.test = '^o^'
  }
}

function App() {
  // 待拖入内容
  const [candidate, setCandidate] = useState<GridDragResizeProps['cells']>([
    createCandidate(1, 1, '#E09F6D'),
    createCandidate(2, 1, '#6c35de'),
    createCandidate(2, 2, '#282828'),
    createCandidate(3, 1, '#ffc7ff'),
    {
      columns: 2,
      removable: false,
      render: ComponentA,
      data: {
        name: 'A',
      },
    },
    {
      columns: 2,
      draggable: false,
      render: ComponentB,
      data: {
        name: 'B',
      },
    },
    {
      columns: 2,
      resizable: false,
      render: ComponentC,
      data: {
        name: 'C',
      },
    },
    {
      columns: 2,
      droppableOut: false,
      render: ComponentD,
      data: {
        name: 'D',
      },
    },
    {
      rows: 2,
      columns: 2,
      dragHandler: '.demo-item>button',
      render: () => (
        <div className="demo-item" style={{ background: '#eb9c64' }}>
          <button>Drag here</button>
        </div>
      ),
    },
    {
      rows: 2,
      columns: 2,
      dropOutHandler: '.demo-item>button',
      render: () => (
        <div className="demo-item" style={{ background: '#58BEE6' }}>
          <button>Drop out here</button>
        </div>
      ),
    },
    {
      rows: 2,
      columns: 2,
      removeHandler: '.demo-item>button',
      render: () => (
        <div className="demo-item" style={{ background: '#B73929' }}>
          <button>Remove here</button>
        </div>
      ),
    },
    {
      columns: 5,
      rows: 4,
      columnStart: 1,
      rowStart: 3,
      grid: {
        suffixClass: 'group',
        columns: 3,
        rows: 3,
        cells: [],
      },
      data: {
        name: 'Group 3 x 3',
      },
    },
    {
      columns: 5,
      rows: 2,
      columnStart: 1,
      rowStart: 7,
      grid: {
        suffixClass: 'group-undroppable',
        columns: 3,
        rows: 3,
        cells: [],
        droppableIn: false,
      },
      data: {
        name: 'Group but undroppable in',
      },
    },
    {
      columns: 5,
      rows: 2,
      columnStart: 1,
      rowStart: 9,
      readonly: true,
      grid: {
        suffixClass: 'group-readonly',
        columns: 3,
        rows: 2,
        cells: [createCandidate(1, 1, '#E09F6D', 1, 2), createCandidate(1, 1, '#E09F6D', 3, 2)],
      },
      data: {
        name: 'Group but readonly',
      },
    },
    {
      columns: 7,
      rows: 1,
      columnStart: 1,
      rowStart: 11,
      grid: {
        suffixClass: 'fixed-size-row',
        columns: 3,
        rows: 3,
        cells: [],
        droppableIn: false,
      },
      data: {
        name: 'This row size is 150px fixed',
      },
    },
  ])

  // 已拖入内容
  const [cells, setCells] = useState<GridDragResizeProps['cells']>([
    {
      rowStart: 2,
      rowEnd: 6,
      columnStart: 2,
      columnEnd: 8,
      render: ComponentG,
      data: {
        name: 'Component G',
      },
    },
  ])

  return (
    <>
      <GridDragResize suffixClass="page">
        <section style={{ padding: '4px', border: '1px solid #666' }}>
          <div
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(candidate, null, 2)
                .replace(/\n/g, '<br>')
                .replace(/\s/g, '&nbsp; '),
            }}
          ></div>
        </section>
        <section>
          <GridDragResize
            columnSize={50}
            rowSize={50}
            rowTemplate={`repeat(10, 50px) 150px`}
            gap={10}
            overflow={'hidden'}
            columns={7}
            rowExpandable={true}
            columnExpandable={true}
            cells={candidate}
            updateCells={(val) => setCandidate(val)}
            select={select}
          ></GridDragResize>
        </section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>&lt;-&gt;</span>
        </div>
        <section>
          <GridDragResize
            columnSize={50}
            rowSize={50}
            gap={10}
            overflow={'hidden'}
            rowExpandable={true}
            columnExpandable={true}
            beforeDrop={beforeDrop}
            cells={cells}
            updateCells={(val) => setCells(val)}
          ></GridDragResize>
        </section>
        <section style={{ padding: '4px', border: '1px solid #666' }}>
          <div
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(cells, null, 2)
                .replace(/\n/g, '<br>')
                .replace(/\s/g, '&nbsp; '),
            }}
          ></div>
        </section>
      </GridDragResize>
    </>
  )
}

export default App
