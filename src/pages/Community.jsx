import { useEffect, useRef, useState } from 'react'
import Card from '../components/Card'
import { addComment, addPost, listPosts, removePost, toggleLike } from '../services/communityService'
import { getUser } from '../services/authService'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

// 페이지: 좋아요/댓글 기능이 있는 간단한 게시글, localStorage 저장
export default function Community(){
  const [text, setText] = useState('')
  const [photo, setPhoto] = useState('')
  const [posts, setPosts] = useState([])
  const [fileName, setFileName] = useState('')
  const fileRef = useRef()
  const user = getUser()

  const refresh = ()=> setPosts(listPosts())
  useEffect(()=>{ refresh() },[])

  const onUpload = async (file)=>{
    if(!file) return
    const reader = new FileReader()
    reader.onload = ()=> setPhoto(reader.result)
    reader.readAsDataURL(file)
    setFileName(file.name)
  }

  const submit = (e)=>{
    e.preventDefault()
    if(!text && !photo) return
    addPost({ author: user.email, text, photo })
    setText(''); setPhoto(''); setFileName(''); fileRef.current.value=''
    refresh()
  }

  const like = (id)=>{ toggleLike(id, user.email); refresh() }
  const comment = (id, val)=>{ if(!val) return; addComment(id, {author:user.email, text:val}); refresh() }
  const del = (id)=>{ removePost(id); refresh() }

  return (
    <div className="grid gap-6 relative z-[1] mt-6 grid-cols-1">
      <div className="col-span-full">
        <Card title="새 후기" subtitle="사진은 선택입니다.">
          <form className="flex flex-col gap-3" onSubmit={submit}>
            <textarea
              className="w-full min-h-[160px] rounded-lg p-4 bg-white/55 backdrop-blur border border-primary-dark/12 text-text text-sm leading-relaxed resize-y outline-none transition shadow-sm focus:border-primary focus:shadow-[0_0_0_3px_rgba(16,185,129,0.18)] focus:bg-white/70 placeholder:text-text-soft/70"
              value={text}
              onChange={e=>setText(e.target.value)}
              placeholder="여행 후기를 적어주세요..."
            />
            <div className="flex items-center gap-2.5 w-full max-w-[520px]">
              <button type="button" className="px-3.5 py-2.5 rounded-xl bg-gradient-primary text-white border-0 shadow-sm text-sm" onClick={()=>fileRef.current?.click()}>파일 선택</button>
              <div className="flex-1 min-h-[40px] flex items-center px-3.5 border border-primary-dark/16 rounded-xl bg-white text-text text-sm min-w-[220px]">{fileName || '선택된 파일 없음'}</div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={e=>onUpload(e.target.files?.[0])} className="hidden" />
            {photo && <img className="mt-2 max-h-[220px] rounded-xl shadow" src={photo} alt="preview" />}
            <Button variant="primary" type="submit">올리기</Button>
          </form>
        </Card>
      </div>

      <div className="col-span-full flex flex-col gap-6">
        {posts.map(p=> (
          <Card key={p.id} title={p.author}
            right={<Button variant="ghost" size="sm" onClick={()=>del(p.id)}>삭제</Button>}>
            <div className="flex flex-col gap-2.5">
              {p.photo && <img className="w-full max-h-[360px] object-cover rounded-xl" src={p.photo} alt="post" />}
              {p.text && <p className="my-2.5">{p.text}</p>}
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={()=>like(p.id)}>❤ {p.likes.length}</Button>
              </div>
              <div className="flex flex-col gap-2 mt-2.5">
                {p.comments.map(c=> (
                  <div key={c.id} className="bg-surface border border-primary-dark/16 px-2.5 py-2 rounded-lg text-sm"><b>{c.author}:</b> {c.text}</div>
                ))}
                <CommentInput onSubmit={(v)=>comment(p.id, v)} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// 댓글 입력 컴포넌트
function CommentInput({onSubmit}){
  const [v, setV] = useState('')
  return (
    <div className="flex gap-2">
      <Input
        className="flex-1"
        placeholder="댓글 달기"
        value={v}
        onChange={e=>setV(e.target.value)}
      />
      <Button variant="ghost" size="sm" onClick={()=>{ onSubmit(v); setV('') }}>게시</Button>
    </div>
  )
}
