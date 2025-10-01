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
    return <div className="rounded-[20px] text-primary-dark p-6 min-h-[120px] bg-bg-card backdrop-blur-sm">날씨 불러오는 중...</div>
  }

  const themeBg = {
    clear: 'bg-gradient-weather-clear',
    night: 'bg-gradient-weather-night',
    sand: 'bg-gradient-weather-sand',
  }[theme] || 'bg-gradient-weather'

  const overlayStyle = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
    pointerEvents: 'none'
  }

  return (
    <div className={`rounded-[20px] text-text p-[26px] min-h-[252px] flex flex-col gap-[18px] relative overflow-hidden ${themeBg}`}>
      <div className="absolute inset-0" style={overlayStyle}></div>
      <div className="relative z-[1]">
        <div>
          <h3 className="m-0 mb-2.5 font-bold text-[17px] leading-tight">{data.city}</h3>
          <div className="text-[44px] font-extrabold relative z-[1] leading-tight">{Math.round(data.temp)}°</div>
          <p className="mt-0.5 relative z-[1] text-[13.5px] leading-normal">{data.main} · {data.desc}</p>
        </div>
      </div>
      <div className="flex gap-3 relative z-[1] flex-wrap">
        <div className="bg-white/25 px-2.5 py-[7px] rounded-[13px] text-[10.5px] font-semibold backdrop-blur-sm">💧 {data.humidity}%</div>
        <div className="bg-white/25 px-2.5 py-[7px] rounded-[13px] text-[10.5px] font-semibold backdrop-blur-sm">🌬️ {data.wind} m/s</div>
        <div className="bg-white/25 px-2.5 py-[7px] rounded-[13px] text-[10.5px] font-semibold backdrop-blur-sm">☁️ {data.clouds}%</div>
      </div>
      <div className="grid grid-cols-6 gap-2.5 relative z-[1]">
        {data.hourly.slice(0,6).map((h,i)=> (
          <div key={i} className="bg-primary-light/90 px-2.5 py-[9px] text-center rounded-xl backdrop-blur-sm">
            <div className="text-[11px] opacity-90">{h.t}</div>
            <div>{h.i}</div>
            <div className="font-bold mt-0.5 text-[13px]">{Math.round(h.temp)}°</div>
          </div>
        ))}
      </div>
    </div>
  )
}
