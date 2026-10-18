import { priceLabel } from '../data/menu'
import { GOOGLE_MAPS_URL, INSTAGRAM_URL, WHATSAPP_NUMBER } from '../data/restaurant'

interface FooterProps {
  cartCount: number
  cartTotal: number
  onOpenCart: () => void
}

export function Footer({ cartCount, cartTotal, onOpenCart }: FooterProps) {
  return (
    <>
      <footer
        className={`bg-[#0F0D0A] pt-12 border-t border-[#D4AF5A]/30 ${
          cartCount > 0 ? 'pb-24 md:pb-12' : 'pb-12'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <img
                src="/logo-256.png"
                alt="Bar Los Rombos Logo"
                className="h-12 w-auto footer-logo-shadow"
                width="85"
                height="48"
              />
              <div>
                <p className="font-display text-base text-[#D4AF5A] tracking-wider">
                  BAR LOS ROMBOS
                </p>
                <p className="text-xs font-light text-[#C4B9A3]">
                  Sabor, cocina y buenos momentos · Valladolid
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1A1611] hover:bg-[#D4AF5A] hover:text-[#0F0D0A] text-[#F1E8D4] w-11 h-11 rounded-full flex items-center justify-center transition border border-[#D4AF5A]/35"
                aria-label="Instagram de Bar Los Rombos (@barlosrombos.es)"
              >
                <i className="ph ph-instagram-logo text-xl" aria-hidden="true" />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1A1611] hover:bg-[#D4AF5A] hover:text-[#0F0D0A] text-[#F1E8D4] w-11 h-11 rounded-full flex items-center justify-center transition border border-[#D4AF5A]/35"
                aria-label="WhatsApp de Bar Los Rombos"
              >
                <i className="ph ph-whatsapp-logo text-xl" aria-hidden="true" />
              </a>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1A1611] hover:bg-[#D4AF5A] hover:text-[#0F0D0A] text-[#F1E8D4] w-11 h-11 rounded-full flex items-center justify-center transition border border-[#D4AF5A]/35"
                aria-label="Ubicación de Bar Los Rombos en Google Maps"
              >
                <i className="ph ph-map-pin text-xl" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="border-t border-[#D4AF5A]/15 mt-8 pt-6 text-center text-[#C4B9A3]/80 text-xs font-light">
            <p>&copy; 2026 Bar Los Rombos · C/ de la Transición, 8, Valladolid</p>
            <p className="mt-2 flex items-center justify-center gap-1.5">
              <span>Desarrollado por</span>
              <a
                href="https://forgeon.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#F1E8D4] hover:text-[#E9CC82] font-medium transition group"
                aria-label="Forgeon — forgeon.dev"
              >
                <img
                  src="/forgeon-symbol.svg"
                  alt=""
                  aria-hidden="true"
                  width="16"
                  height="16"
                  loading="lazy"
                  className="w-4 h-4 object-contain transition-transform duration-200 group-hover:scale-110"
                />
                <span className="tracking-wider">Forgeon</span>
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Barra Inferior Fixa de Pedido no Mobile (<768px) */}
      {cartCount > 0 && (
        <div
          className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0F0D0A]/95 backdrop-blur-md border-t border-[#D4AF5A]/45 px-4 pt-2.5 pb-[calc(0.65rem+env(safe-area-inset-bottom,0px))] shadow-2xl"
        >
          <button
            type="button"
            onClick={onOpenCart}
            className="w-full bg-[#D4AF5A] active:bg-[#E9CC82] text-[#0F0D0A] py-3.5 px-5 font-semibold text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <i className="ph-fill ph-shopping-cart text-lg" aria-hidden="true" />
              <span>
                Ver Pedido ({cartCount} {cartCount === 1 ? 'ítem' : 'ítems'})
              </span>
            </span>
            <span className="font-bold text-sm">
              {cartTotal > 0 ? priceLabel(cartTotal) : 'Revisar →'}
            </span>
          </button>
        </div>
      )}

      {/* Botão Carrinho Flutuante Desktop (ESQUERDA) */}
      {cartCount > 0 && (
        <button
          type="button"
          onClick={onOpenCart}
          className="cart-float hidden md:flex bg-[#D4AF5A] hover:bg-[#E9CC82] text-[#0F0D0A] w-15 h-15 rounded-full items-center justify-center shadow-2xl transition cursor-pointer"
          aria-label="Ver tu pedido"
        >
          <i className="ph-fill ph-shopping-cart text-2xl" aria-hidden="true" />
          <span className="cart-badge">{cartCount}</span>
        </button>
      )}

      {/* WhatsApp Flutuante em formato de Rombo (DIREITA) */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=%C2%A1Hola!%20Quiero%20hacer%20un%20pedido%20en%20Bar%20Los%20Rombos`}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed right-4 md:right-5 bg-[#1A1611] hover:bg-[#D4AF5A] text-[#D4AF5A] hover:text-[#0F0D0A] whatsapp-diamond flex items-center justify-center transition z-40 ${
          cartCount > 0 ? 'bottom-20 md:bottom-5' : 'bottom-5'
        }`}
        aria-label="Pedir por WhatsApp"
      >
        <i className="ph-fill ph-whatsapp-logo text-2xl" aria-hidden="true" />
      </a>
    </>
  )
}
