interface LemaBadgeProps {
  children: React.ReactNode
  className?: string
}

/**
 * Lema entre losangos — subtítulos e assinaturas curtas (04 ELEMENTOS)
 */
export function LemaBadge({ children, className = '' }: LemaBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-3 text-xs md:text-sm font-lema text-[#D4AF5A] ${className}`}
    >
      <span className="inline-block w-2 h-2 bg-[#D4AF5A] rotate-45 shrink-0" aria-hidden="true" />
      <span>{children}</span>
      <span className="inline-block w-2 h-2 bg-[#D4AF5A] rotate-45 shrink-0" aria-hidden="true" />
    </div>
  )
}

/**
 * Separador triplo — entre grandes blocos (Desayunos / Comidas / Seções) (04 ELEMENTOS)
 */
export function TripleRomboSeparator({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 py-4 select-none ${className}`}
      aria-hidden="true"
    >
      <span className="w-16 sm:w-28 h-[1px] bg-[#D4AF5A]/40" />
      <span className="w-2 h-2 bg-[#D4AF5A] rotate-45" />
      <span className="w-2.5 h-2.5 bg-[#D4AF5A] rotate-45" />
      <span className="w-2 h-2 bg-[#D4AF5A] rotate-45" />
      <span className="w-16 sm:w-28 h-[1px] bg-[#D4AF5A]/40" />
    </div>
  )
}

interface SectionFileteProps {
  title: string
  count?: number
  note?: string
  as?: 'h3' | 'h4'
}

/**
 * Filete de secção — título Gloock 400 em maiúsculas + linha a 40% de ouro (04 ELEMENTOS)
 */
export function SectionFilete({ title, count, note, as: HeadingTag = 'h3' }: SectionFileteProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        <HeadingTag className="font-display text-xl md:text-2xl text-[#D4AF5A] tracking-[0.06em] shrink-0">
          {title}
        </HeadingTag>
        {typeof count === 'number' && (
          <span className="text-xs font-light text-[#C4B9A3] tracking-wider">({count})</span>
        )}
        <div className="flex-1 rombos-section-line" />
      </div>
      {note && (
        <p className="text-xs italic font-light text-[#D4AF5A]/90 mt-1.5 tracking-wide">
          {note}
        </p>
      )}
    </div>
  )
}
