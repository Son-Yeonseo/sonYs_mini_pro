// 커뮤니티 서비스: 게시글/좋아요/댓글의 localStorage 기반 CRUD
const KEY = 'planit.community'

function read(){
  try{ return JSON.parse(localStorage.getItem(KEY) || '[]') }catch{ return [] }
}
function write(arr){ localStorage.setItem(KEY, JSON.stringify(arr)) }

// 게시글 목록(최신순) 반환
export function listPosts(){ return read().sort((a,b)=> b.created - a.created) }
// 새 게시글 추가
export function addPost({author, text, photo}){
  const post = { id: crypto.randomUUID(), author, text, photo, likes: [], comments: [], created: Date.now() }
  const arr = read(); arr.push(post); write(arr); return post
}
// 게시글 좋아요/취소
export function toggleLike(postId, userEmail){
  const arr = read(); const p = arr.find(x=>x.id===postId); if(!p) return
  const i = p.likes.indexOf(userEmail); if(i>=0) p.likes.splice(i,1); else p.likes.push(userEmail)
  write(arr); return p
}
// 게시글에 댓글 추가
export function addComment(postId, {author, text}){
  const arr = read(); const p = arr.find(x=>x.id===postId); if(!p) return
  p.comments.push({ id: crypto.randomUUID(), author, text, created: Date.now() })
  write(arr); return p
}
// 게시글 삭제
export function removePost(postId){
  write(read().filter(p=>p.id!==postId))
}


