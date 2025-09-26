import { Link } from 'react-router-dom'
import Card from '../components/Card'
import { useEffect, useState } from 'react'
import { listTrips, removeTrip } from '../services/storageService'

// Trips : 저장된 여행 목록 표시 및 수정 화면 이동
export default function Trips(){
  const [items, setItems] = useState([])
  useEffect(()=>{ setItems(listTrips()) },[])
  const del = (id)=>{
    removeTrip(id)
    setItems(listTrips())
  }
  return (
    <Card title="여행" right={<Link className="btn" to="/trips/new">+ 새 여행</Link>}>
      <div className="trip-list">
        {items.length===0 && <div className="empty">아직 여행이 없어요. 새 여행을 추가해보세요.</div>}
        {items.map(t=> (
          <div key={t.id} className="trip-item">
            <div>
              <div className="name">{t.name}</div>
              <div className="meta">{t.city} · {t.start} ~ {t.end}</div>
            </div>
            <div className="ops">
              <Link className="btn" to={`/trips/${t.id}`}>수정</Link>
              <button className="btn danger" onClick={()=>del(t.id)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
