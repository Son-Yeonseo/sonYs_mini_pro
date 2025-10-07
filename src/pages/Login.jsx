import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '../services/authService'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'

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
    <div className="min-h-dvh flex items-center justify-center bg-bg p-4">
      <form className="bg-panel rounded-lg shadow-lg w-full max-w-md p-6 flex flex-col gap-6" onSubmit={submit}>
        <div className="text-center">
          <h3 className="text-xl font-bold text-text">로그인</h3>
        </div>
        <div className="flex flex-col gap-4">
          <FormField
            label="이메일"
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
          />
          <FormField
            label="비밀번호"
            type="password"
            value={pw}
            onChange={e=>setPw(e.target.value)}
            required
          />
          <Button variant="primary" type="submit">로그인</Button>
        </div>
      </form>
    </div>
  )
}
