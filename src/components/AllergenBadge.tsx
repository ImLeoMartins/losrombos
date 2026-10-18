import { allergenInfo, DishAllergen, formatAllergenLabel } from '../data/allergens'

interface AllergenBadgeProps {
  allergen: DishAllergen
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  decorative?: boolean
}

export function AllergenBadge({
  allergen,
  size = 'sm',
  showLabel = false,
  decorative = false,
}: AllergenBadgeProps) {
  const meta = allergenInfo[allergen.key]
  const label = formatAllergenLabel(allergen)
  const isPosible = allergen.status === 'posible'
  const stateLabel = isPosible ? 'Posible según receta' : 'Contiene'

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-8 h-8',
  }[size]

  const pxSize = size === 'lg' ? 32 : size === 'md' ? 28 : 24

  if (showLabel) {
    return (
      <div
        className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-sm border text-xs transition ${
          isPosible
            ? 'border-dashed border-[#F08A4B]/70 bg-[#F08A4B]/10 text-[#F1E8D4]'
            : 'border-[#D4AF5A]/50 bg-[#D4AF5A]/10 text-[#F1E8D4]'
        }`}
        title={`${stateLabel}: ${label} — ${meta.desc}`}
      >
        <span
          className={`relative inline-flex items-center justify-center rounded-full shrink-0 ${sizeClasses} ${
            isPosible ? 'border border-dashed border-[#F08A4B] p-0.5' : ''
          }`}
          aria-hidden="true"
        >
          <img
            src={meta.iconSrc}
            alt=""
            width={pxSize}
            height={pxSize}
            className={`w-full h-full object-contain rounded-full ${isPosible ? 'opacity-55' : 'opacity-100'}`}
            loading="lazy"
          />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-[#F1E8D4]">{label}</span>
          <span className={`text-[10px] uppercase tracking-wider ${isPosible ? 'text-[#F08A4B]' : 'text-[#D4AF5A]'}`}>
            {stateLabel}
          </span>
        </div>
      </div>
    )
  }

  return (
    <span
      title={`${stateLabel}: ${label}`}
      aria-label={decorative ? undefined : `${stateLabel}: ${label}`}
      aria-hidden={decorative ? 'true' : undefined}
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 transition-transform hover:scale-110 ${sizeClasses} ${
        isPosible
          ? 'border-[1.5px] border-dashed border-[#F08A4B] p-[1.5px] bg-[#0F0D0A]/80'
          : 'ring-1 ring-[#D4AF5A]/30'
      }`}
    >
      <img
        src={meta.iconSrc}
        alt=""
        aria-hidden="true"
        width={pxSize}
        height={pxSize}
        className={`w-full h-full object-contain rounded-full ${isPosible ? 'opacity-55' : 'opacity-100'}`}
        loading="lazy"
      />
    </span>
  )
}

interface ConsulteBadgeProps {
  note?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  decorative?: boolean
}

export function ConsulteBadge({
  note = 'Consulte al personal antes de pedir (variantes, marcas o trazas de cocina)',
  size = 'sm',
  showLabel = false,
  decorative = false,
}: ConsulteBadgeProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[11px]',
    md: 'w-7 h-7 text-xs',
    lg: 'w-8 h-8 text-sm',
  }[size]

  if (showLabel) {
    return (
      <div
        className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-sm border border-[#F08A4B]/60 bg-[#F08A4B]/10 text-xs text-[#F1E8D4]"
        title={note}
      >
        <span
          className={`inline-flex items-center justify-center rounded-full border-[1.5px] border-[#F08A4B] bg-[#0F0D0A] text-[#F08A4B] font-bold shrink-0 ${sizeClasses}`}
          aria-hidden="true"
        >
          ?
        </span>
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-[#F08A4B]">Consulte al personal</span>
          <span className="text-[11px] text-[#C4B9A3]">{note}</span>
        </div>
      </div>
    )
  }

  return (
    <span
      title={`Consulte al personal: ${note}`}
      aria-label={decorative ? undefined : `Consulte al personal: ${note}`}
      aria-hidden={decorative ? 'true' : undefined}
      className={`inline-flex items-center justify-center rounded-full border-[1.5px] border-[#F08A4B] bg-[#0F0D0A] text-[#F08A4B] font-bold shrink-0 transition-transform hover:scale-110 cursor-help ${sizeClasses}`}
    >
      ?
    </span>
  )
}
