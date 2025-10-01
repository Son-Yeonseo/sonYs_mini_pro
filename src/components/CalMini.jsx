import dayjs from 'dayjs'
import { useMemo } from 'react'
import Button from './ui/Button'

// 날짜 선택과 기간 하이라이트를 지원하는 소형 월간 캘린더
export default function CalMini({
  value = dayjs(),
  selected,
  range,
  onPick,
  onChangeMonth,
  events = {}, // {YYYY-MM-DD: count}
}){
  const start = value.startOf('month').startOf('week')
  const days = useMemo(()=> Array.from({length: 42}, (_,i)=> start.add(i,'day')), [start.toString()])

  const inRange = (d)=> range && range.start && range.end && d.isAfter(range.start.subtract(1,'day')) && d.isBefore(range.end.add(1,'day'))

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 mb-1">
        <Button variant="ghost" size="sm" onClick={()=>onChangeMonth?.(value.subtract(1,'month'))}>‹</Button>
        <div className="font-bold text-text text-sm">{value.format('YYYY.MM')}</div>
        <Button variant="ghost" size="sm" onClick={()=>onChangeMonth?.(value.add(1,'month'))}>›</Button>
        <Button variant="ghost" size="sm" className="ml-auto" onClick={()=>onChangeMonth?.(dayjs())}>오늘</Button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-primary-dark text-[11px] mb-1 font-semibold text-center">
        {['일','월','화','수','목','금','토'].map(d=> <span key={d}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map(d=>{
          const isCur = d.month()===value.month()
          const isToday = d.isSame(dayjs(), 'day')
          const isSel = selected && d.isSame(selected, 'day')
          const isIn = inRange(d)
          const key = d.format('YYYY-MM-DD')
          const dot = events[key] || 0

          let cellClass = 'relative rounded-md px-1 py-1.5 bg-surface text-text cursor-pointer border border-primary-dark/20 transition text-[11px] font-semibold text-center min-h-[28px] flex items-center justify-center hover:bg-primary-light/10 hover:border-primary-dark/35 hover:scale-105'
          if (isCur) cellClass += ' bg-primary-light/10'
          if (isToday) cellClass += ' outline outline-1 outline-primary bg-primary/15'
          if (isSel) cellClass += ' bg-gradient-primary text-white'
          if (isIn) cellClass += ' bg-[#F8FAF8] text-primary-dark'

          return (
            <button key={d.toString()} className={cellClass} onClick={()=>onPick && onPick(d)}>
              <span>{d.date()}</span>
              {dot>0 && <i className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-primary rounded-full" title={`${dot} event(s)`}></i>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
