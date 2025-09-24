import Card from '../components/Card'
import { getUser, updateProfile } from '../services/authService'
import { useState, useRef } from 'react'

// Profile : 닉네임/아바타 편집
export default function Profile(){
  const init = getUser()
  const [name, setName] = useState(init?.name||'')
  const [avatar, setAvatar] = useState(init?.avatar||'')
  const fileRef = useRef()
  const save = ()=>{
    updateProfile({ name, avatar })
    alert('저장되었습니다')
  }
  const onUpload = (f)=>{
    const reader = new FileReader(); reader.onload=()=> setAvatar(reader.result); if(f) reader.readAsDataURL(f)
  }
  return (
    <Card title="프로필 편집">
      <form className="profile-form" onSubmit={e=>{e.preventDefault();save()}}>
        <div className="profile-row">
          <div className="avatar big" style={avatar?{backgroundImage:`url(${avatar})`, backgroundSize:'cover', backgroundPosition:'center', color:'transparent'}:{}}>
            {(!avatar && (name?.[0]?.toUpperCase()||'U'))}
          </div>
          <div className="profile-fields">
            <label>닉네임<input value={name} onChange={e=>setName(e.target.value)} /></label>
            <label>아바타 이미지<input ref={fileRef} type="file" accept="image/*" onChange={e=>onUpload(e.target.files?.[0])} /></label>
          </div>
        </div>
        <button className="btn primary profile-save" type="submit">저장</button>
      </form>
    </Card>
  )
}
