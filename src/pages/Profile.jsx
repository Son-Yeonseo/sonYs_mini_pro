import Card from '../components/Card'
import { getUser, updateProfile } from '../services/authService'
import { useState, useRef } from 'react'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'

// Profile : 닉네임/아바타 편집
export default function Profile(){
  const init = getUser()
  const [name, setName] = useState(init?.name||'')
  const [avatar, setAvatar] = useState(init?.avatar||'')
  const [avatarFileName, setAvatarFileName] = useState('')
  const fileRef = useRef()
  const save = ()=>{
    updateProfile({ name, avatar })
    alert('저장되었습니다')
  }
  const onUpload = (f)=>{
    if(!f) return
    const reader = new FileReader();
    reader.onload=()=> setAvatar(reader.result);
    reader.readAsDataURL(f)
    setAvatarFileName(f.name)
  }
  return (
    <Card title="프로필 편집">
      <form className="flex flex-col gap-6" onSubmit={e=>{e.preventDefault();save()}}>
        <div className="flex items-center gap-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${avatar ? 'bg-transparent' : 'bg-primary text-white'} overflow-hidden`}>
            {avatar ? <img src={avatar} alt="아바타" className="w-full h-full object-cover" /> : (name?.[0]?.toUpperCase()||'U')}
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <FormField
              label="닉네임"
              value={name}
              onChange={e=>setName(e.target.value)}
            />
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-text-soft">아바타 이미지</span>
              <div className="flex items-center gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={()=>fileRef.current?.click()}>업로드</Button>
                <span className="text-sm text-text-soft">{avatarFileName || '선택된 파일 없음'}</span>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={e=>onUpload(e.target.files?.[0])} className="hidden" />
            </div>
          </div>
        </div>
        <Button variant="primary" type="submit">저장</Button>
      </form>
    </Card>
  )
}
