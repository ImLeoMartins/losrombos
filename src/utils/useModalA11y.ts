import { useEffect, useRef } from 'react'

let activeModalCount = 0
let savedOverflow = ''

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Garante acessibilidade e UX consistente para modais e lightboxes:
 * 1. Trava o scroll do `document.body` com contagem de referência (evita scroll leaking no mobile/desktop).
 * 2. Fecha o modal ao pressionar `Escape` em qualquer ponto da janela.
 * 3. Mantém o foco preso dentro do modal (`Focus Trap` com Tab / Shift+Tab) e restaura o foco ao fechar.
 */
export function useModalA11y<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean,
  onClose: () => void,
) {
  const containerRef = useRef<T>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!isOpen) return

    const previousFocused = document.activeElement as HTMLElement | null

    if (activeModalCount === 0) {
      savedOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    activeModalCount += 1

    const focusTimer = window.setTimeout(() => {
      const container = containerRef.current
      if (!container) return
      if (!container.contains(document.activeElement)) {
        const firstFocusable = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
        if (firstFocusable) {
          firstFocusable.focus({ preventScroll: true })
        } else {
          container.focus({ preventScroll: true })
        }
      }
    }, 20)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onCloseRef.current()
        return
      }

      if (e.key === 'Tab') {
        const container = containerRef.current
        if (!container) return
        const focusables = Array.from(
          container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        ).filter((el) => el.offsetParent !== null)

        if (focusables.length === 0) {
          e.preventDefault()
          return
        }

        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement as HTMLElement | null

        if (e.shiftKey) {
          if (active === first || !container.contains(active)) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (active === last || !container.contains(active)) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleKeyDown)
      activeModalCount = Math.max(0, activeModalCount - 1)
      if (activeModalCount === 0) {
        document.body.style.overflow = savedOverflow
      }
      if (previousFocused && typeof previousFocused.focus === 'function') {
        previousFocused.focus({ preventScroll: true })
      }
    }
  }, [isOpen])

  return containerRef
}
