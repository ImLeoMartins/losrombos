import { useState, useEffect, useRef } from 'react'
import { GOOGLE_MAPS_URL, PHONE_DISPLAY, WHATSAPP_NUMBER } from '../data/restaurant'
import { LemaBadge } from './DesignElements'

interface HeroProps {
  isCategoryPinned: boolean
  cartCount: number
  onOpenReservation: () => void
}

export function Hero({ isCategoryPinned, cartCount, onOpenReservation }: HeroProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mobileNavOpen) return

    function handlePointerOutside(e: PointerEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileNavOpen(false)
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileNavOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerOutside)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileNavOpen])

  const mobileBtnPositionClass = isCategoryPinned
    ? cartCount > 0
      ? 'bottom-[148px] right-3.5'
      : 'bottom-[88px] right-3.5'
    : 'top-3.5 right-3.5'

  const mobileDropdownPositionClass = isCategoryPinned
    ? cartCount > 0
      ? 'bottom-[200px] right-3.5 origin-bottom-right'
      : 'bottom-[140px] right-3.5 origin-bottom-right'
    : 'top-[58px] right-3.5 origin-top-right'

  return (
    <section
      id="inicio"
      className="hero-section relative min-h-[100svh] flex items-center justify-center border-b border-[#D4AF5A]/25"
    >
      {/* Background fachada */}
      <div className="absolute inset-0 z-0">
        <img
          src="/fachada.jpg"
          alt="Bar Los Rombos - Fachada en Valladolid"
          className="w-full h-full object-cover"
          width="1920"
          height="1080"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Navlinks flutuando no topo do hero — desktop e tablets */}
      <nav className="hero-nav" aria-label="Navegación principal">
        <a href="#inicio">Inicio</a>
        <div className="hero-nav-sep" />
        <a href="#galeria">Ambiente</a>
        <div className="hero-nav-sep" />
        <a href="#menu">Carta</a>
        <div className="hero-nav-sep" />
        <a href="#nosotros">Nosotros</a>
        <div className="hero-nav-sep" />
        <a href="#contacto">Contacto</a>
      </nav>

      {/* Hamburger mobile — desce acima do WhatsApp quando a barra de categorias está fixa no topo */}
      <div ref={navRef}>
        <button
          type="button"
          className={`hero-mobile-btn fixed transition-all duration-300 ${mobileBtnPositionClass}`}
          onClick={() => setMobileNavOpen((prev) => !prev)}
          aria-expanded={mobileNavOpen}
          aria-label="Abrir menú de navegación"
        >
          <i className={`ph ${mobileNavOpen ? 'ph-x' : 'ph-list'} text-xl text-[#D4AF5A]`} aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-wider">Menú</span>
        </button>

        {mobileNavOpen && (
          <div
            className={`hero-mobile-dropdown fixed transition duration-200 ${mobileDropdownPositionClass}`}
          >
            <a href="#inicio" onClick={() => setMobileNavOpen(false)}>
              Inicio
            </a>
            <a href="#galeria" onClick={() => setMobileNavOpen(false)}>
              Ambiente
            </a>
            <a href="#menu" onClick={() => setMobileNavOpen(false)}>
              Carta Oficial
            </a>
            <a href="#nosotros" onClick={() => setMobileNavOpen(false)}>
              Nosotros
            </a>
            <a href="#contacto" onClick={() => setMobileNavOpen(false)}>
              Contacto
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileNavOpen(false)
                onOpenReservation()
              }}
              className="w-full bg-[#D4AF5A] text-[#0F0D0A] font-semibold text-xs uppercase tracking-wider py-3 px-4 text-center cursor-pointer"
            >
              Reservar Mesa
            </button>
          </div>
        )}
      </div>

      <div className="relative z-10 w-full container mx-auto px-4 pt-16 pb-10 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* ESQUERDA: Conteúdo principal (5 cols) */}
          <div className="lg:col-span-5 text-left fade-in">
            {/* Badge Google */}
            <div className="inline-flex items-center gap-2 bg-[#1A1611]/90 border border-[#D4AF5A]/45 px-3.5 py-1.5 mb-4 md:mb-6">
              <span className="w-1.5 h-1.5 bg-[#D4AF5A] rotate-45 shrink-0" aria-hidden="true" />
              <span className="text-[11px] md:text-xs uppercase tracking-[0.14em] font-medium text-[#D4AF5A]">
                4,5 / 5 EN GOOGLE · 205 RESEÑAS
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#F1E8D4] mb-2.5 leading-tight">
              BAR <span className="text-[#D4AF5A]">LOS ROMBOS</span>
            </h1>

            <div className="mb-3.5 md:mb-5">
              <LemaBadge>SABOR, COCINA Y BUENOS MOMENTOS</LemaBadge>
            </div>

            {/* Texto enxuto no mobile, completo no desktop */}
            <p className="text-sm sm:text-base md:text-lg font-light text-[#C4B9A3] mb-5 md:mb-6 max-w-lg leading-relaxed">
              Desayunos desde primera hora, raciones, sartenes, bocadillos y platos combinados en Valladolid.
            </p>

            {/* Estado aberto — visível apenas em telas maiores para não apertar o mobile */}
            <div className="hidden sm:inline-flex items-center space-x-2.5 bg-[#1A1611]/90 border border-[#D4AF5A]/30 px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-[#D4AF5A] rotate-45 shrink-0" aria-hidden="true" />
              <span className="text-xs uppercase tracking-[0.12em] text-[#F1E8D4]">
                Cocina abierta · Pide o reserva directo por WhatsApp
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4">
              <a
                href="#menu"
                className="btn-poly w-full sm:w-auto bg-[#D4AF5A] hover:bg-[#E9CC82] text-[#0F0D0A] px-8 py-3.5 sm:py-4 font-semibold text-sm flex items-center justify-center space-x-2.5"
              >
                <i className="ph ph-fork-knife text-xl" aria-hidden="true" />
                <span>Ver Carta Completa</span>
              </a>
              <button
                type="button"
                onClick={onOpenReservation}
                className="btn-poly btn-reserva-card w-full sm:w-auto px-8 py-3.5 sm:py-4 font-medium text-sm flex items-center justify-center space-x-2.5 cursor-pointer"
              >
                <i className="ph ph-calendar-check text-xl text-[#D4AF5A]" aria-hidden="true" />
                <span>Reservar Mesa</span>
              </button>
            </div>

            {/* Cards empilhados um abaixo do outro no Mobile (<1024px): HORARIO, UBICACIÓN, DIRECTO */}
            <div className="flex flex-col gap-2.5 mt-5 lg:hidden">
              <a
                href="#contacto"
                className="bg-[#1A1611]/90 backdrop-blur-sm border border-[#D4AF5A]/35 px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <i className="ph ph-clock text-xl text-[#D4AF5A] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-display text-xs text-[#F1E8D4] tracking-wider">HORARIO</p>
                    <p className="text-xs font-light text-[#C4B9A3]">
                      Mar–Vie 08:00–00:00 · Sáb–Dom 09:00–00:00
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-[#F08A4B] shrink-0 ml-2">
                  Lun cerrado
                </span>
              </a>

              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1A1611]/90 backdrop-blur-sm border border-[#D4AF5A]/35 px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <i className="ph ph-map-pin text-xl text-[#D4AF5A] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-display text-xs text-[#F1E8D4] tracking-wider">
                      UBICACIÓN
                    </p>
                    <p className="text-xs font-light text-[#C4B9A3]">
                      C/ de la Transición, 8 · 47013 Valladolid
                    </p>
                  </div>
                </div>
                <i className="ph ph-arrow-up-right text-base text-[#D4AF5A] shrink-0 ml-2" aria-hidden="true" />
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1A1611]/90 backdrop-blur-sm border border-[#D4AF5A]/35 px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <i className="ph ph-whatsapp-logo text-xl text-[#D4AF5A] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-display text-xs text-[#F1E8D4] tracking-wider">DIRECTO</p>
                    <p className="text-xs font-light text-[#C4B9A3]">
                      {PHONE_DISPLAY} · WhatsApp
                    </p>
                  </div>
                </div>
                <i className="ph ph-caret-right text-base text-[#D4AF5A] shrink-0 ml-2" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* CENTRO: Info Cards — desktop (3 cols) */}
          <div className="hero-info-cards-wrapper lg:col-span-3">
            <div className="hero-info-card backdrop-blur-sm bg-[#1A1611]/85 border border-[#D4AF5A]/30 p-5">
              <i className="ph ph-clock text-2xl text-[#D4AF5A] mb-2 block" aria-hidden="true" />
              <p className="font-display text-sm text-[#F1E8D4] mb-1.5 tracking-wider">HORARIO</p>
              <p className="text-xs font-light text-[#C4B9A3]">Mar–Vie: 08:00–00:00</p>
              <p className="text-xs font-light text-[#C4B9A3]">Sáb–Dom: 09:00–00:00</p>
              <p className="text-xs font-normal text-[#F08A4B] mt-1">Lunes: cerrado</p>
            </div>

            <div className="hero-info-card backdrop-blur-sm bg-[#1A1611]/85 border border-[#D4AF5A]/30 p-5">
              <i className="ph ph-map-pin text-2xl text-[#D4AF5A] mb-2 block" aria-hidden="true" />
              <p className="font-display text-sm text-[#F1E8D4] mb-1.5 tracking-wider">
                UBICACIÓN
              </p>
              <p className="text-xs font-light text-[#C4B9A3]">
                C/ de la Transición, 8
                <br />
                47013 Valladolid
              </p>
            </div>

            <div className="hero-info-card backdrop-blur-sm bg-[#1A1611]/85 border border-[#D4AF5A]/30 p-5">
              <i className="ph ph-phone text-2xl text-[#D4AF5A] mb-2 block" aria-hidden="true" />
              <p className="font-display text-sm text-[#F1E8D4] mb-1.5 tracking-wider">
                CONTACTO
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-light text-[#C4B9A3] hover:text-[#E9CC82] transition"
              >
                {PHONE_DISPLAY}
                <br />
                Atención directa
              </a>
            </div>
          </div>

          {/* DIREITA: Logo grande com drop-shadow — apenas no desktop (4 cols) */}
          <div className="hero-logo-container lg:col-span-4">
            <img
              src="/logo.png"
              alt="Bar Los Rombos - Logotipo oficial"
              width="340"
              height="190"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
