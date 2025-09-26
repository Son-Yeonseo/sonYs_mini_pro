import dayjs from 'dayjs'
import { useMemo } from 'react'

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
    <div className="cal">
      <div className="cal-bar">
        <button className="btn ghost sm" onClick={()=>onChangeMonth?.(value.subtract(1,'month'))}>‹</button>
        <div className="cal-title">{value.format('YYYY.MM')}</div>
        <button className="btn ghost sm" onClick={()=>onChangeMonth?.(value.add(1,'month'))}>›</button>
  <button className="btn ghost sm ml-auto" onClick={()=>onChangeMonth?.(dayjs())}>오늘</button>
      </div>
      <div className="cal-head">
        {['일','월','화','수','목','금','토'].map(d=> <span key={d}>{d}</span>)}
      </div>
      <div className="cal-grid">
        {days.map(d=>{
          const isCur = d.month()===value.month()
          const isToday = d.isSame(dayjs(), 'day')
          const isSel = selected && d.isSame(selected, 'day')
          const isIn = inRange(d)
          const key = d.format('YYYY-MM-DD')
          const dot = events[key] || 0
          return (
            <button key={d.toString()} className={`cell ${isCur? 'cur':''} ${isToday? 'today':''} ${isSel? 'sel':''} ${isIn? 'in':''}`} onClick={()=>onPick && onPick(d)}>
              <span>{d.date()}</span>
              {dot>0 && <i className="dot" title={`${dot} event(s)`}></i>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
