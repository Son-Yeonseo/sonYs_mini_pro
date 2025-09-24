// 제목, 부제, 우측 액션이 포함될 수 있는 섹션 컨테이너
export default function Card({title, subtitle, right, children, className}){
  return (
    <section className={`card ${className||''}`}>
      {(title || right) && (
        <div className="card-head">
          <div>
            {title && <h3>{title}</h3>}
            {subtitle && <p className="sub">{subtitle}</p>}
          </div>
          {right && <div className="actions">{right}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </section>
  )
}
