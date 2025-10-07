import Card from '../components/Card'
import WeatherWidget from '../components/WeatherWidget'
import CalMini from '../components/CalMini'
import dayjs from 'dayjs'
import { useState } from 'react'
import { addEvent, listByMonth, listEvents, removeEvent, updateEvent } from '../services/eventService'
import { saveTrip } from '../services/storageService'
import Button from '../components/ui/Button'
import Empty from '../components/ui/Empty'

// Home : 캘린더/메모/빠른 여행 생성/날씨 위젯
// 홈 메인 컴포넌트
export default function Home(){
  // 오늘 날짜, 월별 상태, 선택 날짜, 기간, 이벤트(메모) 목록 상태
  const today = dayjs()
  const [month, setMonth] = useState(today)
  const [sel, setSel] = useState(today)
  const [range, setRange] = useState({start: null, end: null})
  const [events, setEvents] = useState(listByMonth(month.format('YYYY-MM')))

  // 월 변경
  const onChangeMonth = (m)=>{ setMonth(m); setEvents(listByMonth(m.format('YYYY-MM'))) }
  // 날짜 클릭 (기간 선택 지원)
  const onPick = (d)=>{
    if(!range.start || (range.start && range.end)){
      setRange({start: d, end: null})
    } else if(range.start && !range.end){
      if(d.isBefore(range.start)) setRange({start: d, end: range.start})
      else setRange({start: range.start, end: d})
    }
    setSel(d)
  }

  // 메모 추가
  const addMemo = ()=>{
    const key = sel.format('YYYY-MM-DD')
    const txt = prompt(`${key} 메모를 입력하세요:`)
    if(!txt) return
    addEvent(key, txt)
    setEvents(listByMonth(month.format('YYYY-MM')))
  }

  // 메모 수정
  const editMemo = (id)=>{
    const key = sel.format('YYYY-MM-DD')
    const cur = listEvents(key).find(e=>e.id===id)
    const txt = prompt('메모 수정', cur?.text || '')
    if(txt==null) return
    updateEvent(key, id, txt)
    setEvents(listByMonth(month.format('YYYY-MM')))
  }

  // 메모 삭제
  const delMemo = (id)=>{
    const key = sel.format('YYYY-MM-DD')
    removeEvent(key, id)
    setEvents(listByMonth(month.format('YYYY-MM')))
  }

  // 선택한 기간으로 여행 일정 생성
  const createTripFromRange = ()=>{
    if(!(range.start && range.end)) return alert('기간을 먼저 선택하세요.')
    const trip = {
      id: crypto.randomUUID(),
      name: `${range.start.format('MM.DD')}~${range.end.format('MM.DD')} 여행`,
      city: '미정',
      start: range.start.format('YYYY-MM-DD'),
      end: range.end.format('YYYY-MM-DD'),
      todo: []
    }
    saveTrip(trip)
    alert('여행 일정이 생성되었습니다. 여행 메뉴에서 확인하세요.')
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex flex-col gap-6">
        <Card title="인기 여행지" subtitle="추천 여행지">
          <div className="mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              { [
                { name: '발리', days: 'Starting at', price: '', rating: '4.7', bg: 'bg-[linear-gradient(135deg,_#ff6b6b,_#ffa726)]' },
                { name: '두바이', days: 'Starting at', price: '', rating: '4.6', bg: 'bg-[linear-gradient(135deg,_#4fc3f7,_#29b6f6)]' },
                { name: '몰디브', days: 'Starting at', price: '', rating: '4.8', bg: 'bg-[linear-gradient(135deg,_#26c6da,_#00acc1)]' },
              ].map((place, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className={`h-32 ${place.bg} relative flex items-center justify-center`}>
                    <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">{place.rating}★</div>
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-text">{place.name}</div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-text-soft">{place.days}</span>
                      <span className="text-sm font-bold text-primary">{place.price}</span>
                    </div>
                  </div>
                </div>
              )) }
            </div>
          </div>
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        <Card title="2025년 9월" subtitle="">
          <CalMini value={month} selected={sel} range={range} onPick={onPick} onChangeMonth={onChangeMonth} events={events} />
          <div className="mt-3 text-text-soft text-xs">
            기간 선택: {range.start?range.start.format('MM.DD'):''} {range.end?`~ ${range.end.format('MM.DD')}`:''}</div>
          <div className="mt-2 text-text-soft text-xs flex items-center">
            해당일 메모
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={addMemo}
            >
              + 추가
            </Button>
          </div>
          <MemoList dateKey={sel.format('YYYY-MM-DD')} onEdit={editMemo} onDelete={delMemo} />
          {(range.start && range.end) && (
            <Button
              variant="primary"
              size="sm"
              className="mt-3"
              onClick={createTripFromRange}
            >
              여행 일정 만들기
            </Button>
          )}
        </Card>
        <Card title="날씨" subtitle="오늘 · 서울">
          <WeatherWidget city="Seoul" />
        </Card>
      </div>
    </div>
  )
}

// 메모 리스트 컴포넌트
function MemoList({dateKey, onEdit, onDelete}){
  const items = listEvents(dateKey)
  if(items.length===0) return (
    <Empty message="메모가 없습니다." />
  )
  return (
    <div className="flex flex-col gap-2 mt-3">
      {items.map(m=> (
        <div key={m.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
          <div className="text-sm text-text">{m.text}</div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={()=>onEdit(m.id)}>수정</Button>
            <Button variant="danger" size="sm" onClick={()=>onDelete(m.id)}>삭제</Button>
          </div>
        </div>
      ))}
    </div>
  )
}
