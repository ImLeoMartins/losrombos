import { useState, useEffect, useRef } from 'react'
import { allergenInfo, type AllergenKey } from '../data/allergens'
import { priceLabel, type MenuItem, dishHasAllergen } from '../data/menu'
import { WHATSAPP_NUMBER } from '../data/restaurant'
import { useModalA11y } from '../utils/useModalA11y'

export interface CartItem extends MenuItem {
  qty: number
}

interface CartModalProps {
  open: boolean
  cart: CartItem[]
  excludedAllergens: AllergenKey[]
  onClose: () => void
  onIncrement: (id: number) => void
  onDecrement: (id: number) => void
  onClear: () => void
}

export function CartModal({
  open,
  cart,
  excludedAllergens,
  onClose,
  onIncrement,
  onDecrement,
  onClear,
}: CartModalProps) {
  const modalRef = useModalA11y<HTMLDivElement>(open, onClose)
  const closeTimerRef = useRef<number | null>(null)
  const [orderNotes, setOrderNotes] = useState('')
  const [hasAllergyAlert, setHasAllergyAlert] = useState(false)

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setHasAllergyAlert(excludedAllergens.length > 0)
  }, [excludedAllergens])

  if (!open) return null

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const allPriced = cart.length > 0 && cart.every((i) => i.price > 0)

  const sendOrderWhatsApp = () => {
    if (cart.length === 0) return

    let msg = '*PEDIDO — BAR LOS ROMBOS*\n'
    msg += '━━━━━━━━━━━━━━━━━━\n\n'

    if (hasAllergyAlert) {
      msg += '*AVISO IMPORTANTE DE ALERGIA / INTOLERANCIA ALIMENTARIA*\n'
      if (excludedAllergens.length > 0) {
        msg += `Sin: *${excludedAllergens.map((k) => allergenInfo[k].name).join(', ')}*\n`
      } else {
        msg += 'El cliente indica alergia o intolerancia alimentaria (confirmar ingredientes y contacto cruzado en cocina).\n'
      }
      msg += '━━━━━━━━━━━━━━━━━━\n\n'
    }

    cart.forEach((item, i) => {
      const subtotal = item.price * item.qty
      if (item.price <= 0) {
        msg += `${i + 1}. ${item.name.toUpperCase()}${item.qty > 1 ? ' x' + item.qty : ''} (Precio a consultar)\n\n`
      } else if (item.qty > 1) {
        msg += `${i + 1}. ${item.name.toUpperCase()} x${item.qty}\n   ${priceLabel(item.price)} c/u → ${priceLabel(subtotal)}\n\n`
      } else {
        msg += `${i + 1}. ${item.name.toUpperCase()}\n   ${priceLabel(item.price)}\n\n`
      }
    })

    msg += '━━━━━━━━━━━━━━━━━━\n'
    if (allPriced) {
      msg += `*TOTAL: ${priceLabel(cartTotal)}*\n\n`
    } else if (cartTotal > 0) {
      msg += `*SUBTOTAL: ${priceLabel(cartTotal)}* (+ ítems a consultar)\n\n`
    } else {
      msg += '*TOTAL: Precio a consultar en barra*\n\n'
    }

    if (orderNotes.trim()) {
      msg += `*Notas:* ${orderNotes}\n\n`
    }

    msg += '¿Para comer aquí o para llevar?\n'
    msg += '¿A qué hora lo necesitas?\n'

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
    }
    closeTimerRef.current = window.setTimeout(() => {
      onClose()
    }, 1000)
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Tu pedido"
    >
      <div onClick={onClose} className="absolute inset-0 modal-backdrop" />

      <div
        ref={modalRef}
        className="relative bg-[#0F0D0A] rombos-double-frame w-full max-w-2xl max-h-[92dvh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0F0D0A] p-4 sm:p-6 border-b border-[#D4AF5A]/25 flex items-center justify-between z-10">
          <div>
            <h3 className="font-display text-xl sm:text-2xl flex items-center space-x-2.5 text-[#F1E8D4]">
              <i className="ph-fill ph-shopping-cart text-[#D4AF5A]" aria-hidden="true" />
              <span>TU PEDIDO</span>
            </h3>
            <p className="text-xs font-light uppercase tracking-wider text-[#C4B9A3] mt-1">
              {cartCount} {cartCount === 1 ? 'ítem' : 'ítems'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center text-[#C4B9A3] hover:text-[#F1E8D4] border border-[#D4AF5A]/25 cursor-pointer"
            aria-label="Cerrar pedido"
          >
            <i className="ph ph-x text-2xl" aria-hidden="true" />
          </button>
        </div>

        {/* Lista */}
        <div className="p-4 sm:p-6 space-y-3">
          {cart.map((item) => {
            const itemConflicts =
              excludedAllergens.length > 0
                ? excludedAllergens.filter((k) => dishHasAllergen(item, k, true))
                : []

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-[#1A1611] p-3.5 sm:p-4 border border-[#D4AF5A]/25"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium uppercase tracking-wider text-sm truncate text-[#F1E8D4]">
                    {item.name}
                  </h4>
                  <p className="text-xs font-light text-[#C4B9A3]">
                    {item.price > 0 ? `${priceLabel(item.price)} c/u` : 'Precio a consultar'}
                  </p>
                  {item.price > 0 && (
                    <p className="text-sm text-[#D4AF5A] font-medium mt-0.5">
                      {priceLabel(item.price * item.qty)}
                    </p>
                  )}
                  {itemConflicts.length > 0 && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#F08A4B]">
                      <i className="ph-fill ph-warning text-xs shrink-0" aria-hidden="true" />
                      <span className="truncate">
                        Contiene o puede contener:{' '}
                        <strong>{itemConflicts.map((k) => allergenInfo[k].name).join(', ')}</strong>
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className="flex items-center gap-2"
                  role="group"
                  aria-label={`Cantidad de ${item.name}`}
                >
                  <button
                    type="button"
                    onClick={() => onDecrement(item.id)}
                    className="qty-btn cursor-pointer"
                    aria-label={
                      item.qty === 1 ? `Eliminar ${item.name}` : `Quitar uno de ${item.name}`
                    }
                  >
                    <i
                      className={`ph-bold text-sm ${
                        item.qty === 1 ? 'ph-trash text-[#F08A4B]' : 'ph-minus'
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  <span className="w-7 text-center font-medium text-[#F1E8D4]" aria-live="polite">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onIncrement(item.id)}
                    className="qty-btn cursor-pointer"
                    aria-label={`Añadir otro ${item.name}`}
                  >
                    <i className="ph-bold ph-plus text-sm" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )
          })}

          {cart.length === 0 && (
            <div className="text-center py-12">
              <i
                className="ph ph-shopping-cart-simple text-5xl text-[#D4AF5A]/40 mb-3 block"
                aria-hidden="true"
              />
              <p className="font-light text-[#C4B9A3]">Tu pedido está vacío</p>
            </div>
          )}
        </div>

        {/* Footer Total */}
        {cart.length > 0 && (
          <div className="sticky bottom-0 bg-[#0F0D0A] p-4 sm:p-6 border-t border-[#D4AF5A]/25 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            {/* Alerta rápida de alergia / intolerancia alimentaria */}
            <div className="mb-3 p-3 border border-[#F08A4B]/50 bg-[#1A1611]">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasAllergyAlert}
                  onChange={(e) => setHasAllergyAlert(e.target.checked)}
                  className="accent-[#F08A4B] w-4 h-4 mt-0.5 shrink-0 cursor-pointer"
                />
                <span className="text-xs text-[#F1E8D4] leading-snug">
                  <strong className="text-[#F08A4B] font-medium uppercase tracking-wider">
                    Es un pedido con alergia o intolerancia alimentaria
                  </strong>
                  {excludedAllergens.length > 0 && (
                    <span className="block text-[11px] font-light text-[#C4B9A3] mt-0.5">
                      Alérgenos filtrados incluidos en el aviso:{' '}
                      <strong className="text-[#F08A4B] font-medium">
                        {excludedAllergens.map((k) => allergenInfo[k].name).join(', ')}
                      </strong>
                    </span>
                  )}
                </span>
              </label>
            </div>

            <div className="mb-4">
              <label
                htmlFor="order-notes"
                className="text-xs uppercase tracking-wider text-[#C4B9A3] block mb-1.5"
              >
                Observaciones o detalle de alergias (opcional)
              </label>
              <input
                type="text"
                id="order-notes"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Ej. Alérgico a frutos de cáscara, sin cebolla..."
                className="w-full bg-[#1A1611] border border-[#D4AF5A]/35 px-4 py-2.5 text-sm text-[#F1E8D4] placeholder-[#C4B9A3]/50 focus:border-[#D4AF5A] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-lg text-[#F1E8D4]">TOTAL</span>
              <span className="text-2xl font-medium text-[#D4AF5A]">
                {allPriced
                  ? priceLabel(cartTotal)
                  : cartTotal > 0
                    ? `${priceLabel(cartTotal)} + consultar`
                    : '— €'}
              </span>
            </div>

            <button
              type="button"
              onClick={sendOrderWhatsApp}
              className="btn-poly w-full bg-[#D4AF5A] hover:bg-[#E9CC82] text-[#0F0D0A] py-4 font-semibold text-sm transition flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <i className="ph ph-whatsapp-logo text-xl" aria-hidden="true" />
              <span>Enviar Pedido por WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={onClear}
              className="w-full mt-2.5 text-[#C4B9A3] hover:text-[#F08A4B] py-2 text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Vaciar Pedido
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
