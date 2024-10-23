import { useState, useRef } from 'react'

function Child({ mouseDownHandler }: { mouseDownHandler: () => void }) {
  return <div onMouseDown={mouseDownHandler}>Child</div>
}

export default function Test() {
  const [status, setStatus] = useState('init')
  const statusRef = useRef(status)

  function childMouseDownHandler() {
    statusRef.current = 'updated'
    setStatus(statusRef.current) // 修改 status 为 updated
    console.log('Child mouseDown') // 这里先执行
  }

  function parentMouseDownHandler() {
    console.log('Parent mouseDown', statusRef.current) // 这里输出最新的状态
  }

  return (
    <div
      style={{
        backgroundColor: '#aaa',
      }}
      onMouseDown={parentMouseDownHandler}
    >
      <Child mouseDownHandler={childMouseDownHandler}></Child>
    </div>
  )
}
