import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// 트리거 요소에 고정되는 떠있는 패널, 바깥 클릭 시 닫힘
export default function Popover({ open, onClose, anchorClass, children }) {
  const ref = useRef()
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const [entered, setEntered] = useState(false)

  // 바깥 클릭 시 닫힘
  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (!ref.current) return
      const anchor = document.querySelector(anchorClass)
      const isInPopover = ref.current.contains(e.target)
      const isInAnchor = anchor && anchor.contains(e.target)
      if (!isInPopover && !isInAnchor) {
        onClose?.()
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open, anchorClass, onClose])

  // 앵커 바로 아래에 위치, 오른쪽 정렬
  useEffect(() => {
    if (!open) return
    const update = () => {
      const anchor = document.querySelector(anchorClass)
      const el = ref.current
      if (!anchor || !el) return
      const r = anchor.getBoundingClientRect()
      const w = el.offsetWidth
      const gap = 8
  const top = r.bottom + gap 
  // 기본적으로 앵커 기준 중앙 정렬
      let left = r.left + (r.width - w) / 2
  // 뷰포트 내에서 좌우 여백 유지
      left = Math.max(gap, Math.min(window.innerWidth - w - gap, left))
      setPos({ top, left })
    }
  // 최초 위치 계산 및 애니메이션 트리거
    const id = requestAnimationFrame(() => {
      update()
  // 레이아웃 이후 진입 애니메이션 적용
      requestAnimationFrame(() => setEntered(true))
    })
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
      setEntered(false)
    }
  }, [open, anchorClass])

  if (!open) return null
  const style = {
    position: 'fixed',
    top: pos.top,
    left: pos.left,
    zIndex: 1000,
    transform: entered ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.98)',
    opacity: entered ? 1 : 0,
    transition: 'opacity 160ms ease, transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)'
  }
  return createPortal(
    <div className="popover" ref={ref} role="dialog" style={style}>
      {children}
    </div>,
    document.body
  )
}
