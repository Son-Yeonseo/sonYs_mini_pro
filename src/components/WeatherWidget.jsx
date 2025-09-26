import { useEffect, useState } from 'react'
import { getWeather } from '../services/weatherService'

// 현재 날씨를 조회/표시, API 키 없으면 '목업' 데이터로 대체
export default function WeatherWidget({city='Seoul'}){
  const [data,setData] = useState(null)
  const [theme,setTheme] = useState('clear')

  useEffect(()=>{
    let on = true
    getWeather(city).then(w=>{
      if(!on) return
      setData(w)
      const code = (w.main||'').toLowerCase()
      if(code.includes('clear')) setTheme('clear')
      else if(code.includes('night')|| code.includes('cloud')) setTheme('night')
      else setTheme('sand')
    })
    return ()=>{ on=false }
  },[city])

  if(!data){
    return <div className="weather loading">날씨 불러오는 중...</div>
  }

  const themeBg = {
    clear: 'bg-[linear-gradient(160deg,_#6EA1FF,_#3E67F0)]',
    night: 'bg-[linear-gradient(160deg,_#233A7A,_#0D1B3D)]',
    sand: 'bg-[linear-gradient(160deg,_#FFA46E,_#FF6D6D)]',
  }[theme] || 'bg-[linear-gradient(160deg,_#6EE7B7,_#34D399)]'
  return (
    <div className={`weather ${themeBg}`}>
      <div className="w-top">
        <div>
          <h3>{data.city}</h3>
          <div className="w-main">{Math.round(data.temp)}°</div>
          <p className="w-desc">{data.main} · {data.desc}</p>
        </div>
      </div>
      <div className="w-rows">
        <div className="w-chip">💧 {data.humidity}%</div>
        <div className="w-chip">🌬️ {data.wind} m/s</div>
        <div className="w-chip">☁️ {data.clouds}%</div>
      </div>
      <div className="w-hourly">
        {data.hourly.slice(0,6).map((h,i)=> (
          <div key={i} className="w-hour">
            <div className="t">{h.t}</div>
            <div className="i">{h.i}</div>
            <div className="v">{Math.round(h.temp)}°</div>
          </div>
        ))}
      </div>
    </div>
  )
}
