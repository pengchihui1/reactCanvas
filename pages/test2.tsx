import React, {useState, useRef, useEffect} from 'react'

interface Point {
  pageX: number
  pageY: number
}

const DrawBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [lastPoint, setLastPoint] = useState<Point | null>(null)

  function clearCanvas() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

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

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      setIsDrawing(true)
      setLastPoint(e.touches[0])
    }

    function handleTouchMove(e: TouchEvent) {
      e.preventDefault()
      const currentTouch = e.touches[0] as Point
      if (canvas && ctx && lastPoint) {
        ctx.beginPath()
        ctx.moveTo(lastPoint.pageX - canvas.offsetLeft, lastPoint.pageY - canvas.offsetTop)
        ctx.lineTo(currentTouch.pageX - canvas.offsetLeft, currentTouch.pageY - canvas.offsetTop)
        ctx.stroke()
      }
    }

    const handleTouchEnd = () => {
      setIsDrawing(false)
      setLastPoint(null)
    }

    canvas.addEventListener('touchstart', handleTouchStart, false)
    canvas.addEventListener('touchmove', handleTouchMove, false)
    canvas.addEventListener('touchend', handleTouchEnd, false)

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart, false)
      canvas.removeEventListener('touchmove', handleTouchMove, false)
      canvas.removeEventListener('touchend', handleTouchEnd, false)
    }
  }, [isDrawing, lastPoint])

  //Generate an array of all the colors from the rainbow

  return (

    <div className="w-full flex justify-center flex-col items-center">
      <button
        onClick={clearCanvas}
        className="bg-red-400 font-normal m-2 p-2 rounded-lg"
      >清楚绘画</button>
      <div>
        <p>X: {lastPoint?.pageX}</p>
        <p>Y: {lastPoint?.pageY}</p>
      </div>
      <canvas
        ref={canvasRef}
        width={1482}
        height={758}
        className="border-2 border-solid"
      />
    </div>
  )
}

export default DrawBoard
