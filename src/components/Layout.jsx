import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getUser, logout } from '../services/authService'
import { useState } from 'react'
import Popover from './Popover'
import Avatar from './ui/Avatar'
import Button from './ui/Button'
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
    <div className="grid h-screen overflow-hidden" style={{gridTemplateColumns: '280px 1fr'}}>
      <aside className="px-5 py-6 bg-gradient-sidebar backdrop-blur-sm border-r border-primary-dark/12 relative overflow-hidden">
        <div className="font-bold text-2xl tracking-tight mb-8 text-[#0d5842]" style={{filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))'}}>Plan‑it</div>
        <nav className="flex flex-col gap-2">
          <NavLink to="/" className={({isActive})=> `flex gap-3 items-center font-medium text-[#0f5a44] no-underline px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden hover:bg-primary/15 hover:translate-x-1 ${isActive ? 'text-white font-semibold shadow-button bg-gradient-primary' : ''}`}>
            <span className="w-5 text-center text-lg" aria-hidden>🏠</span>
            <span>대시보드</span>
          </NavLink>
          <NavLink to="/trips" className={({isActive})=> `flex gap-3 items-center font-medium text-[#0f5a44] no-underline px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden hover:bg-primary/15 hover:translate-x-1 ${isActive ? 'text-white font-semibold shadow-button bg-gradient-primary' : ''}`}>
            <span className="w-5 text-center text-lg" aria-hidden>🧳</span>
            <span>여행</span>
          </NavLink>
          <NavLink to="/community" className={({isActive})=> `flex gap-3 items-center font-medium text-[#0f5a44] no-underline px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden hover:bg-primary/15 hover:translate-x-1 ${isActive ? 'text-white font-semibold shadow-button bg-gradient-primary' : ''}`}>
            <span className="w-5 text-center text-lg" aria-hidden>🗣️</span>
            <span>커뮤니티</span>
          </NavLink>
        </nav>
      </aside>
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="bg-surface rounded-t-[20px] mx-6 p-5 pb-6 backdrop-blur-sm border border-primary-dark/12 relative">
          <header className="flex gap-4 items-center py-5 px-6 bg-primary/8 backdrop-blur-sm border-b border-primary-dark/15 sticky top-0 z-10">
            <div className="flex items-center gap-3 flex-1 min-w-[420px]">
              <input className="flex-1 h-[52px] px-[22px] rounded-[26px] bg-white text-text border border-primary-dark/20 text-[15px] transition focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(16,185,129,0.12)] placeholder:text-primary-dark" placeholder="Search for your favourite destination" />
              <button className="h-[52px] px-[26px] rounded-[26px] bg-gradient-primary text-white font-semibold cursor-pointer text-[15px] transition shadow-button hover:-translate-y-px hover:shadow-lg">Search</button>
            </div>
            <div className="ml-auto flex gap-3 items-center">
              <button className="grid place-items-center w-12 h-12 rounded-xl bg-surface border border-primary-dark/15 cursor-pointer text-text transition-all duration-200 hover:bg-primary-light/10 hover:-translate-y-px bell" title="알림" onClick={()=>setOpenBell(v=>!v)}>🔔</button>
              <Popover open={openBell} onClose={()=>setOpenBell(false)} anchorClass=".bell">
                <BellContent />
              </Popover>
              {user ? (
                <div className="flex gap-3 items-center">
                  <Avatar
                    name={user.name || 'Anni'}
                    clickable={true}
                    onClick={()=>nav('/profile')}
                  />
                  <div className="flex flex-col leading-tight">
                    <div className="font-semibold text-text">{user.name || 'Anni'}</div>
                  </div>
                  <Button variant="inverse" onClick={()=>{ logout(); nav('/login') }}>로그아웃</Button>
                </div>
              ) : (
                <Button onClick={()=>nav('/login')}>로그인</Button>
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
    <div className="flex flex-col">
      {items.map((n,i)=> n.head
        ? <div key={i} className="text-sm font-medium text-text-soft mb-2 flex items-center gap-2">{n.text}</div>
        : <div key={i} className="p-3 rounded-xl bg-surface mb-2 last:mb-0 border border-primary-dark/10">{n.text}</div>
      )}
    </div>
  )
}
