import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getUser, logout } from '../services/authService'
import { useState } from 'react'
import Popover from './Popover'
import dayjs from 'dayjs'
import { listTrips } from '../services/storageService'
import { getWeather } from '../services/weatherService'

// 앱 크롬(사이드바 + 상단바)과 로그아웃 동작 담당
export default function Layout(){
  const loc = useLocation()
  const nav = useNavigate()
  const user = getUser()
  const [openBell, setOpenBell] = useState(false)
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Plan‑it</div>
        <nav>
          <NavLink to="/" className={({isActive})=> `nav-item${isActive? ' active' : ''}`}>
            <span className="ico" aria-hidden>🏠</span>
            <span className="label">대시보드</span>
          </NavLink>
          <NavLink to="/trips" className={({isActive})=> `nav-item${isActive? ' active' : ''}`}>
            <span className="ico" aria-hidden>🧳</span>
            <span className="label">여행</span>
          </NavLink>
          <NavLink to="/community" className={({isActive})=> `nav-item${isActive? ' active' : ''}`}>
            <span className="ico" aria-hidden>🗣️</span>
            <span className="label">커뮤니티</span>
          </NavLink>
        </nav>
      </aside>
      <div className="main">
        <div className="content board">
          <header className="topbar">
            <div className="searchbar">
              <input className="search-input" placeholder="Search for your favourite destination" />
              <button className="search-btn">Search</button>
            </div>
            <div className="actions">
              <button className="icon-btn bell" title="알림" onClick={()=>setOpenBell(v=>!v)}>🔔</button>
              <Popover open={openBell} onClose={()=>setOpenBell(false)} anchorClass=".bell">
                <BellContent />
              </Popover>
              {user ? (
                <div className="user-box">
                  <div className="avatar clickable" onClick={()=>nav('/profile')}>{user.name?.[0]?.toUpperCase()||'U'}</div>
                  <div className="user-meta">
                    <div className="user-name">{user.name || 'Anni'}</div>
                  </div>
                  <button className="btn inverse" onClick={()=>{ logout(); nav('/login') }}>로그아웃</button>
                </div>
              ) : (
                <button className="btn" onClick={()=>nav('/login')}>로그인</button>
              )}
            </div>
          </header>
          <Outlet key={loc.key} />
        </div>
      </div>
    </div>
  )
}

// 여행 일정과 날씨 정보를 합쳐 알림 목록 생성
function BellContent(){
  const [items, setItems] = useState([])
  useState(()=>{
    const trips = listTrips()
    const now = dayjs()
    const tripNotis = trips.map(t=>{
      const d = dayjs(t.start)
      const diff = d.diff(now,'day')
      return { text: `여행 "${t.name}" D${diff>=0?'-'+diff:'+'+Math.abs(diff)}` }
    })
    getWeather('Seoul').then(w=>{
      const rain = (w.main||'').toLowerCase().includes('rain')
      const wx = rain ? [{ text: '오늘 비 소식 — 우산을 챙기세요.' }] : []
      setItems([{ text:'알림' , head:true }, ...tripNotis, ...wx])
    })
  })
  return (
    <div className="noti">
      {items.map((n,i)=> n.head? <div key={i} className="noti-head">{n.text}</div> : <div key={i} className="noti-item">{n.text}</div>)}
    </div>
  )
}
