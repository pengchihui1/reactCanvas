import {useState, useEffect, useRef} from 'react'

interface Mouse {
  x: number
  y: number
}

const Canvas: React.FC = () => {
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastMouse, setLastMouse] = useState<Mouse | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  function clearCanvas() {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
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

    const handleMouseDown = (e: MouseEvent) => {
      setIsDrawing(true)
      setLastMouse({x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop})
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) {
        return
      }
      const currentMouse = {x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop}
      ctx.beginPath()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ctx.moveTo(lastMouse!.x, lastMouse!.y)
      ctx.lineTo(currentMouse.x, currentMouse.y)
      ctx.stroke()
      setLastMouse(currentMouse)
    }

    const handleMouseUp = () => {
      setIsDrawing(false)
      setLastMouse(null)
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDrawing, lastMouse])

  useEffect(() => {
    // 禁用雙指放大
    document.documentElement.addEventListener('touchstart', function (event) {
      if (event.touches.length > 1) {
        event.preventDefault()
      }
    }, {passive: false})

    // 禁用雙擊放大
    let lastTouchEnd = 0
    document.documentElement.addEventListener('touchend', function (event) {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        event?.preventDefault()
      }
      lastTouchEnd = now
    }, {passive: false})

    // 禁止鼠標縮放
    function handleWheelEvent(e: { ctrlKey: unknown; preventDefault: () => void }) {
      if (e.ctrlKey) {
        e.preventDefault()
      }
    }
    window.addEventListener('wheel', handleWheelEvent, {passive: false})
    return () => window.removeEventListener('wheel', handleWheelEvent)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full flex justify-center flex-col items-center">
      <button
        onClick={clearCanvas}
        className="bg-red-400 font-normal m-2 p-2 rounded-lg"
      >清楚绘画</button>
      <canvas
        ref={canvasRef}
        width={1482}
        height={758}
        style={{border: '1px solid black'}}
      />
    </div>
  )
}

export default Canvas

