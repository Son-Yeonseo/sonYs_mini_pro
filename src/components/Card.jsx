// 제목, 부제, 우측 액션이 포함될 수 있는 섹션 컨테이너
export default function Card({title, subtitle, right, children, className}){
  return (
    <section className={`bg-surface border border-primary-dark/15 rounded-2xl shadow backdrop-blur-sm relative overflow-hidden p-5 pt-6 ${className||''}`}>
      {(title || right) && (
        <div className="flex justify-between items-start mb-4">
          <div>
            {title && <h3 className="text-lg font-bold text-text m-0">{title}</h3>}
            {subtitle && <p className="text-sm text-text-soft mt-1">{subtitle}</p>}
          </div>
          {right && <div className="flex gap-3 items-center">{right}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  )
}
