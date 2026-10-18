import { useState, useEffect, useRef } from 'react'
import { galleryPhotos } from '../data/gallery'
import { useModalA11y } from '../utils/useModalA11y'
import { LemaBadge, TripleRomboSeparator } from './DesignElements'

export function Gallery() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [autoplay, setAutoplay] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const lightboxRef = useModalA11y(lightboxOpen, () => setLightboxOpen(false))
  const touchX = useRef<number | null>(null)
  const thumbsRef = useRef<HTMLDivElement>(null)
  const interval = 4500

  useEffect(() => {
    setAutoplay(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    const container = thumbsRef.current
    if (!container) return
    const activeThumb = container.children[current] as HTMLElement | undefined
    if (activeThumb) {
      const targetScroll =
        activeThumb.offsetLeft - container.clientWidth / 2 + activeThumb.clientWidth / 2
      container.scrollTo({ left: targetScroll, behavior: 'smooth' })
    }
  }, [current])

  const go = (i: number) => {
    setCurrent((i + galleryPhotos.length) % galleryPhotos.length)
  }

  const next = () => setCurrent((c) => (c + 1) % galleryPhotos.length)
  const prev = () => setCurrent((c) => (c - 1 + galleryPhotos.length) % galleryPhotos.length)

  useEffect(() => {
    if (!lightboxOpen) return

    const handleLightboxKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      }
    }

    window.addEventListener('keydown', handleLightboxKeyDown)
    return () => window.removeEventListener('keydown', handleLightboxKeyDown)
  }, [lightboxOpen])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) {
      if (dx < 0) next()
      else prev()
    }
    touchX.current = null
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    } else if (e.key === 'Escape' && lightboxOpen) {
      setLightboxOpen(false)
    }
  }

  return (
    <section id="galeria" className="pt-14 md:pt-20 pb-8 bg-[#0F0D0A]" aria-label="Galería de fotos">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <LemaBadge className="mb-3">EL LOCAL &amp; NUESTRA BARRA</LemaBadge>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F1E8D4] mb-2">
            NUESTRO <span className="text-[#D4AF5A]">AMBIENTE</span>
          </h2>
          <p className="font-light text-[#C4B9A3] text-sm sm:text-base">
            Dos plantas amplias, barra de tapeo y salón comedor en Valladolid
          </p>
        </div>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onKeyDown={handleKeyDown}
          className="max-w-5xl mx-auto"
        >
          {/* Slide principal com Moldura Dupla e cantos retos */}
          <div
            className="gallery-stage relative overflow-hidden rombos-double-frame bg-[#1A1611]"
            tabIndex={0}
            role="region"
            aria-roledescription="carrusel"
            aria-label="Fotos de Bar Los Rombos"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {galleryPhotos.map((photo, i) => (
              <figure
                key={photo.src}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                aria-hidden={i !== current}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  width="1600"
                  height="900"
                  onClick={() => setLightboxOpen(true)}
                  className="w-full h-full object-cover cursor-zoom-in"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
                <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0F0D0A]/95 via-[#0F0D0A]/70 to-transparent px-4 sm:px-6 pt-14 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-medium text-[#D4AF5A] border border-[#D4AF5A]/50 bg-[#0F0D0A]/85 px-2.5 py-0.5 mb-1">
                      <span className="w-1.5 h-1.5 bg-[#D4AF5A] rotate-45" aria-hidden="true" />
                      {photo.tag}
                    </span>
                    <p className="text-xs sm:text-sm md:text-base font-normal text-[#F1E8D4] leading-snug">
                      {photo.caption}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="self-start sm:self-end text-[11px] sm:text-xs uppercase tracking-wider text-[#E9CC82] hover:text-[#F1E8D4] inline-flex items-center gap-1.5 bg-[#0F0D0A]/85 px-3.5 py-2 border border-[#D4AF5A]/40 cursor-pointer shrink-0"
                  >
                    <i className="ph ph-arrows-out" aria-hidden="true" />
                    <span>Ampliar</span>
                  </button>
                </figcaption>
              </figure>
            ))}

            <button
              type="button"
              onClick={prev}
              className="gallery-arrow left-2.5 sm:left-3 cursor-pointer"
              aria-label="Foto anterior"
            >
              <i className="ph-bold ph-caret-left text-lg sm:text-xl" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              className="gallery-arrow right-2.5 sm:right-3 cursor-pointer"
              aria-label="Foto siguiente"
            >
              <i className="ph-bold ph-caret-right text-lg sm:text-xl" aria-hidden="true" />
            </button>

            <span className="absolute top-3 right-3 bg-[#0F0D0A]/85 text-[#F1E8D4] border border-[#D4AF5A]/40 text-xs font-medium px-3 py-1">
              {current + 1} / {galleryPhotos.length}
            </span>

            {/* Barra de progreso del autoplay */}
            {autoplay && !lightboxOpen && (
              <div className="absolute top-0 inset-x-0 h-[2px] bg-white/10">
                <div
                  key={current}
                  className="h-full bg-[#D4AF5A] gallery-progress"
                  onAnimationEnd={next}
                  style={{
                    animationDuration: `${interval}ms`,
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                />
              </div>
            )}
          </div>

          {/* Miniaturas das 12 fotos reais com cantos retos e auto-scroll horizontal */}
          <div
            ref={thumbsRef}
            className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar pb-1"
            role="tablist"
            aria-label="Elegir foto del bar"
          >
            {galleryPhotos.map((photo, i) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => go(i)}
                role="tab"
                aria-selected={i === current}
                aria-label={`Ver foto ${i + 1}: ${photo.caption}`}
                className={`flex-shrink-0 w-20 h-14 md:w-24 md:h-16 overflow-hidden border transition cursor-pointer ${
                  i === current
                    ? 'border-[#D4AF5A] opacity-100'
                    : 'border-transparent opacity-45 hover:opacity-85'
                }`}
              >
                <img
                  src={photo.src}
                  alt=""
                  width="96"
                  height="64"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        <TripleRomboSeparator className="mt-10 md:mt-14" />
      </div>

      {/* Lightbox pantalla completa com suporte a swipe no celular */}
      {lightboxOpen && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[1000] bg-[#0F0D0A]/95 flex items-center justify-center p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={galleryPhotos[current].caption}
          onClick={() => setLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 bg-[#1A1611] hover:bg-[#D4AF5A] text-[#F1E8D4] hover:text-[#0F0D0A] w-11 h-11 rounded-full flex items-center justify-center border border-[#D4AF5A]/40 transition cursor-pointer z-10"
            aria-label="Cerrar vista ampliada"
          >
            <i className="ph ph-x text-2xl" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            className="absolute left-3 sm:left-4 bg-[#1A1611]/90 hover:bg-[#D4AF5A] text-[#F1E8D4] hover:text-[#0F0D0A] w-11 h-11 rounded-full flex items-center justify-center border border-[#D4AF5A]/40 transition cursor-pointer z-10"
            aria-label="Foto anterior"
          >
            <i className="ph-bold ph-caret-left text-xl" aria-hidden="true" />
          </button>

          <div
            className="max-w-5xl max-h-[88dvh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryPhotos[current].src}
              alt={galleryPhotos[current].caption}
              width="1600"
              height="900"
              className="max-h-[75dvh] w-auto object-contain border border-[#D4AF5A]/40"
              loading="lazy"
            />
            <div className="mt-3 text-center px-4">
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#D4AF5A] font-medium">
                {galleryPhotos[current].tag} · {current + 1}/{galleryPhotos.length}
              </span>
              <p className="text-xs sm:text-sm md:text-base text-[#F1E8D4] mt-0.5">
                {galleryPhotos[current].caption}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            className="absolute right-3 sm:right-4 bg-[#1A1611]/90 hover:bg-[#D4AF5A] text-[#F1E8D4] hover:text-[#0F0D0A] w-11 h-11 rounded-full flex items-center justify-center border border-[#D4AF5A]/40 transition cursor-pointer z-10"
            aria-label="Foto siguiente"
          >
            <i className="ph-bold ph-caret-right text-xl" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  )
}
