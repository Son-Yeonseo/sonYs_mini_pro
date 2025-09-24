import Card from '../components/Card'
import WeatherWidget from '../components/WeatherWidget'
import CalMini from '../components/CalMini'
import dayjs from 'dayjs'
import { useState } from 'react'
import { addEvent, listByMonth, listEvents, removeEvent, updateEvent } from '../services/eventService'
import { saveTrip } from '../services/storageService'

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
    <div className="grid">
      <div className="col">
        <Card title="인기 여행지" subtitle="추천 여행지" className="destinations-card">
          <div style={{marginTop: 8}}>
            <div className="cards-row">
              { [
                { 
                  name: '발리', 
                  days: 'Starting at', 
                  price: '', 
                  rating: '4.7',
                  gradient: 'linear-gradient(135deg, #ff6b6b, #ffa726)'
                },
                { 
                  name: '두바이',
                  days: 'Starting at',
                  price: '',
                  rating: '4.6',
                  gradient: 'linear-gradient(135deg, #4fc3f7, #29b6f6)'
                },
                { 
                  name: '몰디브', 
                  days: 'Starting at', 
                  price: '', 
                  rating: '4.8',
                  gradient: 'linear-gradient(135deg, #26c6da, #00acc1)'
                },
              ].map((place, i) => (
                <div key={i} className="place-card">
                  <div className="img" style={{background: place.gradient}}>
                    <div className="badge purple rating-badge">{place.rating}★</div>
                  </div>
                  <div className="txt">
                    <div className="name">{place.name}</div>
                    <div className="price-bar">
                      <span className="muted">{place.days}</span>
                      <span className="price-tag">{place.price}</span>
                    </div>
                  </div>
                </div>
              )) }
            </div>
          </div>
        </Card>
      </div>
      <div className="col">
        <Card title="2025년 9월" subtitle="" className="calendar-card"
              right={<div className="cal-actions" />}
        >
          <CalMini value={month} selected={sel} range={range} onPick={onPick} onChangeMonth={onChangeMonth} events={events} />
          <div className="meta" style={{marginTop:12,color:'#8a94c7',fontSize:'12px'}}>
            기간 선택: {range.start?range.start.format('MM.DD'):''} {range.end?`~ ${range.end.format('MM.DD')}`:''}</div>
          <div className="meta" style={{marginTop:8,color:'#8a94c7',fontSize:'12px'}}>
            해당일 메모
            <button 
              className="btn sm" 
              style={{marginLeft:8, padding:'4px 8px', fontSize:'11px'}}
              onClick={addMemo}
            >
              + 추가
            </button>
          </div>
          <MemoList dateKey={sel.format('YYYY-MM-DD')} onEdit={editMemo} onDelete={delMemo} />
          {(range.start && range.end) && (
            <button 
              className="btn sm" 
              style={{marginTop:12, background:'var(--gradient-primary)'}}
              onClick={createTripFromRange}
            >
              여행 일정 만들기
            </button>
          )}
        </Card>
        <Card title="날씨" subtitle="오늘 · 서울" className="weather-card">
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
    <div className="empty" style={{
      color:'#8a94c7', 
      fontSize:'12px', 
      padding:'12px 0',
      textAlign:'center'
    }}>
      메모가 없습니다.
    </div>
  )
  return (
    <div className="memo-list">
      {items.map(m=> (
        <div key={m.id} className="memo-item">
          <div className="text">{m.text}</div>
          <div className="ops">
            <button className="btn sm ghost" onClick={()=>onEdit(m.id)}>수정</button>
            <button className="btn sm danger" onClick={()=>onDelete(m.id)}>삭제</button>
          </div>
        </div>
      ))}
    </div>
  )
}
