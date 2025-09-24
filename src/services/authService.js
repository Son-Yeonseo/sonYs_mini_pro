const KEY = 'planit.user'

// 현재 로그인된 사용자 정보 반환
export function getUser(){
  try{ return JSON.parse(localStorage.getItem(KEY) || 'null') }catch{ return null }
}

// 로그인 여부 확인
export function isAuthed(){
  return !!getUser()
}

// 이메일/비밀번호로 로그인(임의 사용자 생성)
export function login(email, password){
  // 클라이언트 목업 로그인: 어떤 이메일/비밀번호도 허용
  const user = { email, name: email.split('@')[0] || 'user', token: makeToken(email) }
  localStorage.setItem(KEY, JSON.stringify(user))
  return user
}

// 로그아웃(로컬스토리지 정보 삭제)
export function logout(){
  localStorage.removeItem(KEY)
}

// 임시 토큰 생성
function makeToken(seed){
  return btoa(`${seed}-${Date.now()}`)
}

// 사용자 정보 일부 수정
export function updateProfile(patch){
  const u = getUser() || {}
  const nu = { ...u, ...patch }
  localStorage.setItem(KEY, JSON.stringify(nu))
  return nu
}


