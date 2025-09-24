import { useEffect, useRef, useState } from 'react'
import Card from '../components/Card'
import { addComment, addPost, listPosts, removePost, toggleLike } from '../services/communityService'
import { getUser } from '../services/authService'

// 페이지: 좋아요/댓글 기능이 있는 간단한 게시글, localStorage 저장
// 커뮤니티 메인 컴포넌트
export default function Community(){
  // 글 내용, 사진, 게시글 목록, 파일 input ref, 로그인 유저 상태
  const [text, setText] = useState('')
  const [photo, setPhoto] = useState('')
  const [posts, setPosts] = useState([])
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
  }

  // 게시글 등록 핸들러
  const submit = (e)=>{
    e.preventDefault()
    if(!text && !photo) return
    addPost({ author: user.email, text, photo })
    setText(''); setPhoto(''); fileRef.current.value=''
    refresh()
  }

  // 좋아요, 댓글, 삭제 핸들러
  const like = (id)=>{ toggleLike(id, user.email); refresh() }
  const comment = (id, val)=>{ if(!val) return; addComment(id, {author:user.email, text:val}); refresh() }
  const del = (id)=>{ removePost(id); refresh() }

  return (
    <div className="grid">
      <div className="col span-2">
        <Card title="새 후기" subtitle="사진은 선택입니다.">
          <form className="post-form" onSubmit={submit}>
            <textarea className="post-text" value={text} onChange={e=>setText(e.target.value)} placeholder="여행 후기를 적어주세요..." />
            <div className="uploader">
              <input ref={fileRef} type="file" accept="image/*" onChange={e=>onUpload(e.target.files?.[0])} />
              {photo && <img className="preview" src={photo} alt="preview" />}
            </div>
            <div className="form-actions">
              <button className="btn primary" type="submit">올리기</button>
            </div>
          </form>
        </Card>
      </div>

      <div className="col span-2">
        {posts.map(p=> (
          <Card key={p.id} title={p.author}
                right={<button className="btn ghost" onClick={()=>del(p.id)}>삭제</button>}>
            <div className="post">
              {p.photo && <img className="post-img" src={p.photo} alt="post" />}
              {p.text && <p className="post-txt">{p.text}</p>}
              <div className="post-ops">
                <button className="btn ghost" onClick={()=>like(p.id)}>❤ {p.likes.length}</button>
              </div>
              <div className="comments">
                {p.comments.map(c=> (
                  <div key={c.id} className="comment"><b>{c.author}:</b> {c.text}</div>
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
    <div className="comment-input">
      <input placeholder="댓글 달기" value={v} onChange={e=>setV(e.target.value)} />
      <button className="btn" onClick={()=>{ onSubmit(v); setV('') }}>게시</button>
    </div>
  )
}
