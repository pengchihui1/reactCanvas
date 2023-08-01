import {useState, TouchEvent, useRef} from 'react'

type Point = {
  x: number
  y: number
}

// React.MutableRefObject<HTMLCanvasElement>
export default function Draw() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [isDrawing, setIsDrawing] = useState(false)
  const [touchPosition, setTouchPosition] = useState<Point | null>(null)

  function startTouch(event: TouchEvent) {
    const {clientX, clientY} = event.touches[0]
    const {left, top} = canvasRef.current?.getBoundingClientRect() || {left: 0, top: 0}
    const offsetX = clientX - left
    const offsetY = clientY - top
    setTouchPosition({x: offsetX, y: offsetY})
    setIsDrawing(true)
  }

  function endTouch() {
    setIsDrawing(false)
  }

  function moveTouch(event: TouchEvent) {
    if (isDrawing) {
      const {clientX, clientY} = event.touches[0]
      if (clientX === null || clientY === null) return
      const {left, top} = canvasRef.current?.getBoundingClientRect() || {left: 0, top: 0}
      const offsetX = clientX - left
      const offsetY = clientY - top
      const canvas = canvasRef.current
      const context = canvas?.getContext('2d')
      if (context && touchPosition) {
        context.beginPath()
        context.moveTo(touchPosition?.x, touchPosition?.y)
        context.lineTo(offsetX, offsetY)
        context.stroke()
        setTouchPosition({x: offsetX, y: offsetY})
      }
    }
  }

  function clearCanvas() {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  return (
    <div className="w-full flex justify-center flex-col items-center">
      <button
        onClick={clearCanvas}
        className="bg-red-400 font-normal m-2 p-2 rounded-lg"
      >清楚绘画</button>
      <canvas
        ref={canvasRef}
        onTouchStart={startTouch}
        onTouchEnd={endTouch}
        onTouchMove={moveTouch}
        width={1482}
        height={758}
        className="border-2 border-solid"
      />
    </div>
  )
}

