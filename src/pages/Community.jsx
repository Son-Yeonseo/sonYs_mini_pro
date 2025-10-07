import { useEffect, useRef, useState } from 'react'
import Card from '../components/Card'
import { addComment, addPost, listPosts, removePost, toggleLike } from '../services/communityService'
import { getUser } from '../services/authService'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

// 페이지: 좋아요/댓글 기능이 있는 간단한 게시글, localStorage 저장
// 커뮤니티 메인 컴포넌트
export default function Community(){
  // 글 내용, 사진, 게시글 목록, 파일 input ref, 로그인 유저 상태
  const [text, setText] = useState('')
  const [photo, setPhoto] = useState('')
  const [posts, setPosts] = useState([])
  const [fileName, setFileName] = useState('')
  const fileRef = useRef()
  const user = getUser()

  // 게시글 목록 새로고침
  const refresh = ()=> setPosts(listPosts())
  useEffect(()=>{ refresh() },[])

  // 이미지 업로드 핸들러
  const onUpload = async (file)=>{
    if(!file) return
    const reader = new FileReader()
    reader.onload = ()=> setPhoto(reader.result)
    reader.readAsDataURL(file)
    setFileName(file.name)
  }

  // 게시글 등록 핸들러
  const submit = (e)=>{
    e.preventDefault()
    if(!text && !photo) return
    addPost({ author: user.email, text, photo })
    setText(''); setPhoto(''); setFileName(''); fileRef.current.value=''
    refresh()
  }

  // 좋아요, 댓글, 삭제 핸들러
  const like = (id)=>{ toggleLike(id, user.email); refresh() }
  const comment = (id, val)=>{ if(!val) return; addComment(id, {author:user.email, text:val}); refresh() }
  const del = (id)=>{ removePost(id); refresh() }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2">
        <Card title="새 후기" subtitle="사진은 선택입니다.">
          <form className="flex flex-col gap-4" onSubmit={submit}>
            <textarea
              className="w-full border border-primary-dark/20 rounded-lg bg-white text-text p-3 text-sm transition-all duration-200 focus:outline-none focus:border-primary focus:shadow-[0_0_0_0.25rem_rgba(16,185,129,0.15)] min-h-[100px] resize-none"
              value={text}
              onChange={e=>setText(e.target.value)}
              placeholder="여행 후기를 적어주세요..."
            />
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={()=>fileRef.current?.click()}>파일 선택</Button>
                <span className="text-sm text-text-soft">{fileName || '선택된 파일 없음'}</span>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={e=>onUpload(e.target.files?.[0])} className="hidden" />
              {photo && <img className="w-full h-64 object-cover rounded-lg" src={photo} alt="preview" />}
            </div>
            <Button variant="primary" type="submit">올리기</Button>
          </form>
        </Card>
      </div>

      <div className="lg:col-span-2 flex flex-col gap-6">
        {posts.map(p=> (
          <Card key={p.id} title={p.author}
            right={<Button variant="ghost" size="sm" onClick={()=>del(p.id)}>삭제</Button>}>
            <div className="flex flex-col gap-3">
              {p.photo && <img className="w-full h-80 object-cover rounded-lg" src={p.photo} alt="post" />}
              {p.text && <p className="text-text">{p.text}</p>}
              <div>
                <Button variant="ghost" size="sm" onClick={()=>like(p.id)}>❤ {p.likes.length}</Button>
              </div>
              <div className="flex flex-col gap-2">
                {p.comments.map(c=> (
                  <div key={c.id} className="text-sm text-text bg-surface p-2 rounded"><b>{c.author}:</b> {c.text}</div>
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
