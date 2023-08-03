import React, {useState, useRef, useEffect} from 'react'

interface Point {
  x: number
  y: number
}

const DrawBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [lastPoint, setLastPoint] = useState<Point | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
  }, [])

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    setIsDrawing(true)
    const point = getTouchPoint(e)
    setLastPoint(point)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing || !lastPoint) {
      return
    }

    const point = getTouchPoint(e)
    drawLin(lastPoint, point)
    setLastPoint(point)
  }

  const handleTouchEnd = () => {
    setIsDrawing(false)
    setLastPoint(null)
  }

  const getTouchPoint = (e: React.TouchEvent<HTMLCanvasElement>): Point => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const {left, top} = canvasRef.current!.getBoundingClientRect()
    const {clientX, clientY} = e.touches[0]
    const x = clientX - left
    const y = clientY - top
    return {x, y}
  }

  const drawLin = (start: Point, end: Point) => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
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
      <div>
        <p>X: {lastPoint?.x}</p>
        <p>Y: {lastPoint?.y}</p>
      </div>
      <canvas
        ref={canvasRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        width={1482}
        height={758}
        className="border-2 border-solid"
      />
    </div>
  )
}

export default DrawBoard
