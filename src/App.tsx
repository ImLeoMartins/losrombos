import { useState, useEffect } from 'react'
import { Hero } from './components/Hero'
import { Gallery } from './components/Gallery'
import { MenuSection } from './components/MenuSection'
import { AboutSection } from './components/AboutSection'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import { CartModal, type CartItem } from './components/CartModal'
import { DishDetailModal } from './components/DishDetailModal'
import { ReservationModal } from './components/ReservationModal'
import type { AllergenKey } from './data/allergens'
import type { MenuItem } from './data/menu'

const CART_STORAGE_KEY = 'los_rombos_cart_v1'

export function App() {
  const [isCategoryPinned, setIsCategoryPinned] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [reservationOpen, setReservationOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {
      // ignora erro de storage
    }
    return []
  })
  const [excludedAllergens, setExcludedAllergens] = useState<AllergenKey[]>([])

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // ignora erro de storage
    }
  }, [cart])

  useEffect(() => {
    let rafId = 0

    const updateScrollState = () => {
      rafId = 0
      const sentinelEl = document.getElementById('menu-category-sentinel')
      const nosotrosEl = document.getElementById('nosotros')
      if (!sentinelEl || !nosotrosEl) return

      const sentinelTop = sentinelEl.getBoundingClientRect().top
      const nosotrosTop = nosotrosEl.getBoundingClientRect().top

      // Fica fixo quando o leitor passa pelo seletor de categorias (sentinelTop <= 0)
      // e volta ao lugar original assim que entra na seção "nosotros" (nosotrosTop <= 80)
      setIsCategoryPinned(sentinelTop <= 0 && nosotrosTop > 80)
    }

    const onScrollOrResize = () => {
      if (rafId === 0) {
        rafId = window.requestAnimationFrame(updateScrollState)
      }
    }

    updateScrollState()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize, { passive: true })
    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId)
      }
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [])

  const toggleAllergen = (key: AllergenKey) => {
    setExcludedAllergens((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )
  }

  const clearAllergens = () => setExcludedAllergens([])

  const addToCart = (item: MenuItem, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { ...item, qty }]
    })
  }

  const increment = (id: number) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)))
  }

  const decrement = (id: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id)
      if (!item) return prev
      if (item.qty > 1) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
      }
      return prev.filter((i) => i.id !== id)
    })
  }

  const clearCart = () => setCart([])

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const qtyInCart = detailItem ? cart.find((i) => i.id === detailItem.id)?.qty ?? 0 : 0

  return (
    <div className="bg-[#0F0D0A] text-[#F1E8D4] overflow-x-clip min-h-screen">
      <main>
        <Hero
          isCategoryPinned={isCategoryPinned}
          cartCount={cartCount}
          onOpenReservation={() => setReservationOpen(true)}
        />
        <Gallery />
        <MenuSection
          isCategoryPinned={isCategoryPinned}
          onOpenDetail={(item) => setDetailItem(item)}
          onAddToCart={(item) => addToCart(item, 1)}
          cartCount={cartCount}
          cartTotal={cartTotal}
          onOpenCart={() => setCartOpen(true)}
          excludedAllergens={excludedAllergens}
          onToggleAllergen={toggleAllergen}
          onClearAllergens={clearAllergens}
        />
        <AboutSection />
        <ContactSection onOpenReservation={() => setReservationOpen(true)} />
      </main>

      <Footer cartCount={cartCount} cartTotal={cartTotal} onOpenCart={() => setCartOpen(true)} />

      <CartModal
        open={cartOpen}
        cart={cart}
        excludedAllergens={excludedAllergens}
        onClose={() => setCartOpen(false)}
        onIncrement={increment}
        onDecrement={decrement}
        onClear={clearCart}
      />

      <DishDetailModal
        item={detailItem}
        qtyInCart={qtyInCart}
        onClose={() => setDetailItem(null)}
        onAddToCart={addToCart}
      />

      <ReservationModal
        open={reservationOpen}
        excludedAllergens={excludedAllergens}
        onClose={() => setReservationOpen(false)}
      />
    </div>
  )
}
export default App
