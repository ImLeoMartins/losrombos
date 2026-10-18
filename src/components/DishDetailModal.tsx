import { useState, useEffect } from 'react'
import { allergenInfo, formatAllergenLabel } from '../data/allergens'
import { categoryLabel, categoryNotes, priceLabel, type MenuItem } from '../data/menu'
import { AllergenBadge } from './AllergenBadge'
import { useModalA11y } from '../utils/useModalA11y'

interface DishDetailModalProps {
  item: MenuItem | null
  qtyInCart: number
  onClose: () => void
  onAddToCart: (item: MenuItem, qty: number) => void
}

export function DishDetailModal({
  item,
  qtyInCart,
  onClose,
  onAddToCart,
}: DishDetailModalProps) {
  const [detailQty, setDetailQty] = useState(1)
  const modalRef = useModalA11y(!!item, onClose)

  useEffect(() => {
    if (item) setDetailQty(1)
  }, [item])

  if (!item) return null

  const note = categoryNotes[item.category]
  const contieneList = item.allergens.filter((a) => a.status === 'contiene')
  const posibleList = item.allergens.filter((a) => a.status === 'posible')

  return (
    <div
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
    >
      <div onClick={onClose} className="absolute inset-0 modal-backdrop" />

      <div
        ref={modalRef}
        className="relative bg-[#0F0D0A] rombos-double-frame w-full max-w-lg max-h-[92dvh] overflow-y-auto flex flex-col"
      >
        <div className="relative h-56 sm:h-64 bg-[#1A1611] overflow-hidden border-b border-[#D4AF5A]/25 shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt={`Foto de ${item.name}`}
              width="600"
              height="400"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className="ph ph-fork-knife text-4xl text-[#D4AF5A]/50" aria-hidden="true" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0A] via-transparent to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 bg-[#0F0D0A]/85 hover:bg-[#D4AF5A] text-[#F1E8D4] hover:text-[#0F0D0A] border border-[#D4AF5A]/45 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition"
            aria-label="Cerrar detalle"
          >
            <i className="ph ph-x text-xl" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 sm:p-6 -mt-6 relative flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#D4AF5A] font-medium">
              {categoryLabel(item.category)}
            </p>
            <span className="text-[11px] text-[#C4B9A3]/70 font-mono">
              · Ref. {item.reportCode}
            </span>
          </div>

          <div className="flex items-start justify-between gap-3 mt-1">
            <h3 className="font-display text-xl sm:text-2xl leading-snug text-[#F1E8D4]">
              {item.name}
            </h3>
            <span className="bg-[#1A1611] border border-[#D4AF5A] text-[#D4AF5A] text-sm font-medium px-3 py-1 shrink-0">
              {priceLabel(item.price)}
            </span>
          </div>

          {item.description && (
            <p className="font-light text-sm text-[#C4B9A3] mt-3">
              {item.description.replace(/\.$/, '')}
            </p>
          )}
          {note && (
            <p className="text-xs italic font-light text-[#D4AF5A] mt-1.5">
              {note}
            </p>
          )}

          {/* Ficha de Alérgenos (3 Estados Oficiales) */}
          <div className="mt-5 space-y-4">
            <h4 className="font-display text-xs sm:text-sm text-[#D4AF5A] tracking-wider flex items-center gap-2 border-b border-[#D4AF5A]/25 pb-2">
              <span>FICHA DE ALÉRGENOS · REGLAMENTO (UE) 1169/2011</span>
            </h4>

            {/* Estado 1: Contiene */}
            {contieneList.length > 0 && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#D4AF5A] font-medium mb-2">
                  Contiene (ingrediente confirmado en receta)
                </p>
                <ul className="grid grid-cols-1 gap-2">
                  {contieneList.map((a) => (
                    <li
                      key={`contiene-${a.key}`}
                      className="flex items-start gap-3 bg-[#1A1611] border border-[#D4AF5A]/35 p-3"
                    >
                      <AllergenBadge allergen={a} size="lg" />
                      <div>
                        <p className="text-sm font-medium text-[#F1E8D4]">
                          {formatAllergenLabel(a)}
                        </p>
                        <p className="text-xs font-light text-[#C4B9A3]">
                          {allergenInfo[a.key].desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Estado 2: Posible según receta */}
            {posibleList.length > 0 && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#F08A4B] font-medium mb-2">
                  Puede contener / Posible según receta (confirmar en barra)
                </p>
                <ul className="grid grid-cols-1 gap-2">
                  {posibleList.map((a) => (
                    <li
                      key={`posible-${a.key}`}
                      className="flex items-start gap-3 bg-[#1A1611] border border-dashed border-[#F08A4B]/60 p-3"
                    >
                      <AllergenBadge allergen={a} size="lg" />
                      <div>
                        <p className="text-sm font-medium text-[#F1E8D4]">
                          {formatAllergenLabel(a)}
                        </p>
                        <p className="text-xs font-light text-[#C4B9A3]">
                          {allergenInfo[a.key].desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Estado 3: Consulte al personal (?) + Nota técnica del plato */}
            <div className="bg-[#1A1611] border border-[#F08A4B]/50 p-3.5">
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border-[1.5px] border-[#F08A4B] bg-[#0F0D0A] text-[#F08A4B] font-bold text-sm shrink-0">
                  ?
                </span>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#F08A4B]">
                    Consulte al personal antes de pedir
                  </p>
                  <p className="text-xs font-light text-[#F1E8D4] leading-relaxed">
                    {item.consulteNote}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[11px] font-light text-[#C4B9A3]/80 leading-relaxed">
              Aviso legal (RD 126/2015 · AESAN): En cocina se comparten freidora, plancha, tostador y
              utensilios, por lo que no se certifica la ausencia de trazas por contacto cruzado. Si
              usted padece alguna alergia o intolerancia alimentaria, indíquelo siempre al personal.
            </p>
          </div>
        </div>

        {/* Barra inferior fija de cantidad + añadir */}
        <div className="sticky bottom-0 bg-[#0F0D0A] p-4 sm:p-5 border-t border-[#D4AF5A]/25 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1A1611] border border-[#D4AF5A]/30 px-2.5 py-1.5">
              <button
                type="button"
                onClick={() => setDetailQty((q) => Math.max(1, q - 1))}
                className="qty-btn cursor-pointer"
                aria-label="Quitar uno"
              >
                <i className="ph-bold ph-minus text-sm" aria-hidden="true" />
              </button>
              <span className="w-6 text-center font-medium text-[#F1E8D4]" aria-live="polite">
                {detailQty}
              </span>
              <button
                type="button"
                onClick={() => setDetailQty((q) => q + 1)}
                className="qty-btn cursor-pointer"
                aria-label="Añadir uno"
              >
                <i className="ph-bold ph-plus text-sm" aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                onAddToCart(item, detailQty)
                onClose()
              }}
              className="btn-poly flex-1 bg-[#D4AF5A] hover:bg-[#E9CC82] text-[#0F0D0A] py-3.5 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="ph-fill ph-shopping-cart text-lg" aria-hidden="true" />
              <span>
                {item.price > 0
                  ? `Añadir · ${priceLabel(item.price * detailQty)}`
                  : 'Añadir al pedido'}
              </span>
            </button>
          </div>
          {qtyInCart > 0 && (
            <p className="text-xs font-light text-[#C4B9A3] mt-2 text-center">
              Ya tienes {qtyInCart} en tu pedido
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
