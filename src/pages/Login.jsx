import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '../services/authService'

// Login: 클라이언트 localStorage를 이용한 목업 로그인
export default function Login(){
  const [email,setEmail] = useState('')
  const [pw,setPw] = useState('')
  const nav = useNavigate()
  const loc = useLocation()
  const submit = (e)=>{
    e.preventDefault()
  login(email, pw)
  const back = loc.state?.from || '/'
  nav(back, { replace: true })
  }
  return (
    <div className="auth">
      <form className="card auth-card form" onSubmit={submit}>
        <div className="card-head"><h3>로그인</h3></div>
        <div className="card-body">
          <label>이메일<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
          <label>비밀번호<input type="password" value={pw} onChange={e=>setPw(e.target.value)} required /></label>
          <button className="btn primary" type="submit">로그인</button>
        </div>
      </form>
    </div>
  )
}
