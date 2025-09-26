import Card from '../components/Card'
import { getUser, updateProfile } from '../services/authService'
import { useState, useRef } from 'react'

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
    <Card title="프로필 편집" className="profile-card">
      <form className="profile-form" onSubmit={e=>{e.preventDefault();save()}}>
        <div className="profile-row">
          <div className={`avatar big profile-avatar ${avatar ? 'has-image' : ''}`}>
            {avatar ? <img src={avatar} alt="아바타" /> : (name?.[0]?.toUpperCase()||'U')}
          </div>
          <div className="profile-fields">
            <label>
              <span className="label-text">닉네임</span>
              <input value={name} onChange={e=>setName(e.target.value)} />
            </label>
            <div className="profile-upload-row">
              <span className="label-text">아바타 이미지</span>
              <div className="profile-avatar-upload">
                <button type="button" className="upload-btn" onClick={()=>fileRef.current?.click()}>업로드</button>
                <div className="file-name">{avatarFileName || '선택된 파일 없음'}</div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={e=>onUpload(e.target.files?.[0])} className="hidden" />
            </div>
          </div>
        </div>
        <button className="btn primary profile-save" type="submit">저장</button>
      </form>
    </Card>
  )
}
