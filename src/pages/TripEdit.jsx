import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../components/Card'
import { getTrip, saveTrip } from '../services/storageService'

// TripEdit : 날짜와 체크리스트로 여행을 생성/수정하는 페이지
export default function TripEdit(){
  const { id } = useParams()
  const nav = useNavigate()
  const isNew = !id // id가 없으면 신규 여행

  // 여행 초기값 useMemo로 생성 (id, 이름, 도시, 날짜, 체크리스트)
  const initial = useMemo(()=> ({
    id: id || crypto.randomUUID(),
    name: '',
    city: '',
    start: '',
    end: '',
    todo: []
  }),[id])
  // 여행 정보 상태 관리
  const [trip,setTrip] = useState(initial)

  // id가 있으면 기존 여행 정보 불러오기
  useEffect(()=>{
    if(id){
      const t = getTrip(id)
      if(t) setTrip(t)
    }
  },[id])

  // 체크리스트 항목 추가
  const addTodo = ()=> setTrip(t=> ({...t, todo: [...t.todo, {id:crypto.randomUUID(), text:'', done:false}]}))
  // 수정
  const setTodo = (tid, patch)=> setTrip(t=> ({...t, todo: t.todo.map(it=> it.id===tid? {...it, ...patch}: it)}))
  // 삭제
  const removeTodo = (tid)=> setTrip(t=> ({...t, todo: t.todo.filter(it=> it.id!==tid)}))

  // 폼 제출 시 여행 저장 및 목록으로 이동
  const submit = (e)=>{
    e.preventDefault()
    saveTrip(trip)
    nav('/trips')
  }

  return (
    <Card title={isNew? '새 여행' : '여행 수정'}>
      <form className="form" onSubmit={submit}>
        <div className="grid-2">
          <label>여행 이름<input value={trip.name} onChange={e=>setTrip({...trip, name:e.target.value})} required /></label>
          <label>도시<input value={trip.city} onChange={e=>setTrip({...trip, city:e.target.value})} required /></label>
          <label>출발일<input type="date" value={trip.start} onChange={e=>setTrip({...trip, start:e.target.value})} required /></label>
          <label>도착일<input type="date" value={trip.end} onChange={e=>setTrip({...trip, end:e.target.value})} required /></label>
        </div>
        <div className="sep"/>
        <h4>준비물 체크리스트</h4>
        <div className="todo">
          {trip.todo.map(item=> (
            <div key={item.id} className="todo-row">
              <input type="checkbox" checked={item.done} onChange={e=>setTodo(item.id,{done:e.target.checked})} />
              <input className="todo-input" placeholder="예: 여권" value={item.text} onChange={e=>setTodo(item.id,{text:e.target.value})} />
              <button type="button" className="icon-btn" onClick={()=>removeTodo(item.id)}>🗑️</button>
            </div>
          ))}
          <button type="button" className="btn" onClick={addTodo}>+ 항목 추가</button>
        </div>
        <div className="form-actions">
          <button className="btn primary" type="submit">저장</button>
          <button className="btn ghost" type="button" onClick={()=>nav(-1)}>취소</button>
        </div>
      </form>
    </Card>
  )
}
