import { useState, useRef, useEffect } from 'react'
import {
  allergenInfo,
  allergenKeys,
  formatAllergenLabel,
  type AllergenKey,
} from '../data/allergens'
import {
  categories,
  categoryLabel,
  categoryNotes,
  dishConsultMentionsAllergen,
  dishHasAllergen,
  menuItems,
  priceLabel,
  type CategoryKey,
  type MenuItem,
} from '../data/menu'
import { AllergenBadge, ConsulteBadge } from './AllergenBadge'
import { LemaBadge, SectionFilete, TripleRomboSeparator } from './DesignElements'

interface MenuSectionProps {
  isCategoryPinned: boolean
  onOpenDetail: (item: MenuItem) => void
  onAddToCart: (item: MenuItem) => void
  cartCount: number
  cartTotal: number
  onOpenCart: () => void
  excludedAllergens: AllergenKey[]
  onToggleAllergen: (key: AllergenKey) => void
  onClearAllergens: () => void
}

export function MenuSection({
  isCategoryPinned,
  onOpenDetail,
  onAddToCart,
  cartCount,
  cartTotal,
  onOpenCart,
  excludedAllergens,
  onToggleAllergen,
  onClearAllergens,
}: MenuSectionProps) {
  const [filterCategory, setFilterCategory] = useState<CategoryKey | 'todos'>('todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [allergenPanel, setAllergenPanel] = useState(false)
  const [hidePosible, setHidePosible] = useState(true)
  const [addedItemIds, setAddedItemIds] = useState<Record<number, boolean>>({})
  const addedTimersRef = useRef<Record<number, number>>({})
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const checkScroll = () => {
    const el = scrollContainerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    const timer = setTimeout(checkScroll, 200)
    window.addEventListener('resize', checkScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  useEffect(() => {
    return () => {
      Object.values(addedTimersRef.current).forEach((timerId) => {
        window.clearTimeout(timerId)
      })
    }
  }, [])

  const normalizedSearch = searchQuery
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const filteredMenu = menuItems.filter((item) => {
    if (filterCategory !== 'todos' && item.category !== filterCategory) return false
    if (normalizedSearch) {
      const haystack = `${item.name} ${item.description} ${categoryLabel(item.category)}`
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
      if (!haystack.includes(normalizedSearch)) return false
    }
    if (excludedAllergens.length === 0) return true
    return !excludedAllergens.some((allergenKey) =>
      dishHasAllergen(item, allergenKey, hidePosible),
    )
  })

  const activeCategories = categories.filter(
    (c): c is { key: CategoryKey; label: string; block?: 'desayunos' | 'comidas' } =>
      c.key !== 'todos' && (filterCategory === 'todos' || c.key === filterCategory),
  )

  const handleAddClick = (item: MenuItem) => {
    onAddToCart(item)
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }))
    if (addedTimersRef.current[item.id]) {
      window.clearTimeout(addedTimersRef.current[item.id])
    }
    addedTimersRef.current[item.id] = window.setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }))
      delete addedTimersRef.current[item.id]
    }, 800)
  }

  const handleCategorySelect = (
    key: CategoryKey | 'todos',
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setFilterCategory(key)
    e.currentTarget.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
    if (isCategoryPinned) {
      const sentinel = document.getElementById('menu-category-sentinel')
      if (sentinel) {
        const y = sentinel.getBoundingClientRect().top + window.scrollY + 4
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
  }

  const cleanDesc = (desc: string) => desc.replace(/\.$/, '')

  const renderCard = (item: MenuItem) => {
    const isAdded = !!addedItemIds[item.id]
    const matchingPosible = !hidePosible
      ? item.allergens.filter(
          (a) => a.status === 'posible' && excludedAllergens.includes(a.key),
        )
      : []
    const matchingConsult = !hidePosible
      ? excludedAllergens.filter(
          (k) =>
            dishConsultMentionsAllergen(item, k) &&
            !matchingPosible.some((a) => a.key === k),
        )
      : []
    const cautionAlerts = [
      ...matchingPosible.map((a) => formatAllergenLabel(a)),
      ...matchingConsult.map((k) => allergenInfo[k].name),
    ]

    return (
      <div
        key={item.id}
        className="rombos-wood-panel card-hover overflow-hidden flex flex-col justify-between"
      >
        <div
          className="h-48 sm:h-52 bg-[#0F0D0A] flex items-center justify-center overflow-hidden relative cursor-pointer group border-b border-[#D4AF5A]/20"
          onClick={() => onOpenDetail(item)}
        >
          {item.image ? (
            <img
              src={item.image}
              alt={`Foto de ${item.name}`}
              width="600"
              height="400"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <i className="ph ph-fork-knife text-4xl text-[#D4AF5A]/40" aria-hidden="true" />
            </div>
          )}
          <div className="absolute top-3 right-3 bg-[#0F0D0A]/90 border border-[#D4AF5A] text-[#D4AF5A] text-xs font-medium px-3 py-1 shadow-lg">
            <span>{priceLabel(item.price)}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0F0D0A]/85 to-transparent h-12" />
        </div>

        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-baseline justify-between gap-2 mb-1.5">
              <button
                type="button"
                onClick={() => onOpenDetail(item)}
                className="text-left cursor-pointer flex-1"
              >
                <h4 className="font-medium text-base uppercase tracking-[0.04em] text-[#F1E8D4] hover:text-[#E9CC82] transition leading-snug">
                  {item.name}
                </h4>
              </button>
            </div>

            {item.description && (
              <p className="font-light text-xs text-[#C4B9A3] mb-3 leading-relaxed">
                {cleanDesc(item.description)}
              </p>
            )}

            {cautionAlerts.length > 0 && (
              <div className="mb-3 px-2.5 py-1.5 border border-dashed border-[#F08A4B]/70 bg-[#F08A4B]/10 text-[11px] text-[#F08A4B] flex items-center gap-1.5">
                <i className="ph-fill ph-warning-circle shrink-0" aria-hidden="true" />
                <span>
                  Posible según receta:{' '}
                  {cautionAlerts.join(', ')}
                </span>
              </div>
            )}
          </div>

          <div>
            {/* Alérgenos (3 estados oficiais) */}
            <div className="flex items-center flex-wrap gap-1.5 py-2.5 mb-3 border-t border-[#D4AF5A]/15">
              {item.allergens.map((a) => (
                <button
                  key={`${a.key}-${a.status}`}
                  type="button"
                  onClick={() => onOpenDetail(item)}
                  className="cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D4AF5A] focus-visible:outline-offset-2 p-1"
                  aria-label={`${a.status === 'contiene' ? 'Contiene' : 'Posible según receta'}: ${formatAllergenLabel(a)}`}
                >
                  <AllergenBadge allergen={a} size="sm" decorative />
                </button>
              ))}

              {item.consultePersonal && (
                <button
                  type="button"
                  onClick={() => onOpenDetail(item)}
                  className="cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D4AF5A] focus-visible:outline-offset-2 p-1"
                  aria-label={`Consulte al personal sobre alérgenos de ${item.name}`}
                >
                  <ConsulteBadge note={item.consulteNote} size="sm" decorative />
                </button>
              )}

              <button
                type="button"
                onClick={() => onOpenDetail(item)}
                className="ml-auto text-[11px] uppercase tracking-wider text-[#C4B9A3] hover:text-[#E9CC82] transition flex items-center gap-1 py-1.5 px-2.5 cursor-pointer"
              >
                <i className="ph ph-info text-sm" aria-hidden="true" /> Ficha
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleAddClick(item)}
              className={`btn-poly w-full py-3 font-medium text-xs flex items-center justify-center space-x-2 border cursor-pointer ${
                isAdded
                  ? 'bg-[#D4AF5A] text-[#0F0D0A] border-[#D4AF5A]'
                  : 'bg-[#0F0D0A] hover:bg-[#D4AF5A] text-[#F1E8D4] hover:text-[#0F0D0A] border-[#D4AF5A]/35 hover:border-[#D4AF5A]'
              }`}
            >
              <i
                className={`ph ${isAdded ? 'ph-fill ph-check-circle' : 'ph-plus-circle'} text-base`}
                aria-hidden="true"
              />
              <span>{isAdded ? 'Añadido al pedido' : 'Añadir al pedido'}</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const desayunosCategories = activeCategories.filter((c) => c.block === 'desayunos')
  const comidasCategories = activeCategories.filter((c) => c.block === 'comidas')

  return (
    <section id="menu" className="py-14 md:py-20 bg-[#0F0D0A]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <LemaBadge className="mb-3">CARTA OFICIAL · BAR LOS ROMBOS</LemaBadge>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F1E8D4] mb-2">
            NUESTRA <span className="text-[#D4AF5A]">CARTA</span>
          </h2>
          <p className="font-light text-[#C4B9A3] text-sm sm:text-base">
            Selecciona tus platos y realiza tu pedido directo por WhatsApp
          </p>
        </div>

        {/* Buscador Rápido + Leyenda Oficial de Alérgenos · 3 Estados + Filtro Interactivo */}
        <div className="max-w-5xl mx-auto mb-8 md:mb-10 bg-[#1A1611] rombos-double-frame p-4 sm:p-5 md:p-6">
          {/* Fila 1: Buscador de platos + Botón de filtro de alérgenos */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pb-4 border-b border-[#D4AF5A]/20">
            <div className="relative flex-1">
              <i
                className="ph ph-magnifying-glass text-[#D4AF5A] text-base absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar plato o ingrediente (ej. cachopo, torrezno, tortilla...)"
                aria-label="Buscar plato en la carta"
                className="w-full bg-[#0F0D0A] border border-[#D4AF5A]/35 pl-10 pr-9 py-2.5 text-sm text-[#F1E8D4] placeholder-[#C4B9A3]/60 focus:border-[#D4AF5A] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#C4B9A3] hover:text-[#F1E8D4] p-2 cursor-pointer"
                  aria-label="Limpiar búsqueda"
                >
                  <i className="ph ph-x text-base" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setAllergenPanel((p) => !p)}
                aria-expanded={allergenPanel}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-medium px-4 py-2.5 border transition cursor-pointer ${
                  excludedAllergens.length
                    ? 'bg-[#F08A4B]/15 border-[#F08A4B] text-[#F08A4B]'
                    : 'bg-[#0F0D0A] border-[#D4AF5A]/45 text-[#F1E8D4] hover:border-[#E9CC82]'
                }`}
              >
                <i className="ph ph-shield-warning text-base" aria-hidden="true" />
                <span>Filtrar alérgenos</span>
                {excludedAllergens.length > 0 && (
                  <span className="bg-[#F08A4B] text-[#0F0D0A] font-bold text-[11px] px-1.5 py-0.5">
                    {excludedAllergens.length}
                  </span>
                )}
                <i
                  className={`ph ph-caret-down transition ${allergenPanel ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {excludedAllergens.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAllergens}
                  className="text-xs text-[#C4B9A3] hover:text-[#F1E8D4] underline px-2 py-2 cursor-pointer shrink-0"
                >
                  Restablecer
                </button>
              )}
            </div>
          </div>

          {/* Fila 2: Leyenda 3 estados del Sistema de Diseño */}
          <div className="pt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[#D4AF5A] font-medium w-full sm:w-auto">
              Leyenda de alérgenos (3 estados):
            </span>

            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-[#F1E8D4]">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full ring-1 ring-[#D4AF5A]/40 inline-flex items-center justify-center shrink-0">
                <img
                  src="/allergens/gluten.png"
                  alt="Icono Contiene"
                  width="24"
                  height="24"
                  loading="lazy"
                  className="w-full h-full object-contain rounded-full"
                />
              </span>
              <span>
                <strong className="text-[#D4AF5A] font-medium">Contiene</strong>
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-[#F1E8D4]">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-[1.5px] border-dashed border-[#F08A4B] p-[1.5px] bg-[#0F0D0A] inline-flex items-center justify-center shrink-0">
                <img
                  src="/allergens/gluten.png"
                  alt="Icono Puede contener"
                  width="24"
                  height="24"
                  loading="lazy"
                  className="w-full h-full object-contain rounded-full opacity-55"
                />
              </span>
              <span>
                <strong className="text-[#F08A4B] font-medium">Puede contener</strong>
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-[#F1E8D4]">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-[1.5px] border-[#F08A4B] bg-[#0F0D0A] text-[#F08A4B] font-bold text-[10px] sm:text-[11px] inline-flex items-center justify-center shrink-0">
                ?
              </span>
              <span>
                <strong className="text-[#F08A4B] font-medium">Consulte al personal</strong>
              </span>
            </div>
          </div>

          {allergenPanel && (
            <div className="mt-4 pt-4 border-t border-[#D4AF5A]/20">
              <p className="text-xs font-light text-[#C4B9A3] mb-3 text-center">
                Selecciona los alérgenos que deseas <strong className="text-[#F1E8D4] font-medium">excluir</strong> de la carta (Reglamento UE 1169/2011 · 14 grupos):
              </p>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2">
                {allergenKeys.map((key) => {
                  const info = allergenInfo[key]
                  const excluded = excludedAllergens.includes(key)
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onToggleAllergen(key)}
                      aria-pressed={excluded}
                      className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-2 border transition cursor-pointer ${
                        excluded
                          ? 'bg-[#F08A4B]/20 border-[#F08A4B] text-[#F08A4B] line-through'
                          : 'bg-[#0F0D0A] border-[#D4AF5A]/25 text-[#F1E8D4] hover:border-[#D4AF5A]'
                      }`}
                    >
                      <img
                        src={info.iconSrc}
                        alt={info.name}
                        width="20"
                        height="20"
                        loading="lazy"
                        className={`w-5 h-5 object-contain rounded-full shrink-0 ${
                          excluded ? 'opacity-50 grayscale' : ''
                        }`}
                      />
                      <span className="truncate">{info.name}</span>
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-[#C4B9A3] bg-[#0F0D0A] border border-[#D4AF5A]/20 px-3.5 py-2.5">
                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hidePosible}
                    onChange={(e) => setHidePosible(e.target.checked)}
                    className="accent-[#D4AF5A] w-4 h-4 shrink-0 cursor-pointer"
                  />
                  <span>
                    <strong className="text-[#F1E8D4] font-medium">Modo seguro (recomendado por AESAN):</strong>{' '}
                    ocultar también platos con presencia <em>«Posible según receta»</em>
                  </span>
                </label>
              </div>
            </div>
          )}

          {excludedAllergens.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#D4AF5A]/20 flex flex-wrap items-center justify-between gap-2 text-xs">
              <p className="text-[#F1E8D4]">
                Mostrando <strong className="text-[#D4AF5A]">{filteredMenu.length}</strong> platos
                excluido{excludedAllergens.length > 1 ? 's' : ''}:{' '}
                <strong className="text-[#F08A4B]">
                  {excludedAllergens.map((k) => allergenInfo[k].name).join(', ')}
                </strong>{' '}
                <span className="text-[#C4B9A3] font-light">
                  ({hidePosible ? 'ocultando confirmados y posibles' : 'ocultando solo confirmados'})
                </span>
              </p>
              <span className="text-[11px] text-[#F08A4B]">
                Tu selección se incluirá como aviso al pedir por WhatsApp
              </span>
            </div>
          )}
        </div>

        {/* Sentinel + Barra de Categorías (fixa no topo ao passar por ela dentro da Carta, e volta ao lugar ao sair para Nosotros) */}
        <div id="menu-category-sentinel" className="mb-8 md:mb-10">
          {isCategoryPinned && <div className="h-[58px]" aria-hidden="true" />}
          <div
            className={
              isCategoryPinned
                ? 'fixed top-0 left-0 right-0 z-40 bg-[#0F0D0A]/95 backdrop-blur-md py-3 px-4 border-b border-[#D4AF5A]/35 shadow-2xl'
                : 'bg-[#0F0D0A]/95 backdrop-blur-sm py-3 -mx-4 px-4 border-y border-[#D4AF5A]/20'
            }
          >
            <div className="relative max-w-7xl mx-auto group">
              {canScrollLeft && (
                <>
                  <div
                    className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0F0D0A] to-transparent z-[5] md:hidden"
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      scrollContainerRef.current?.scrollBy({ left: -250, behavior: 'smooth' })
                    }
                    className="absolute left-0 top-0 z-10 h-full px-2 bg-gradient-to-r from-[#0F0D0A] via-[#0F0D0A]/90 to-transparent items-center text-[#D4AF5A] hover:text-[#E9CC82] transition hidden md:flex cursor-pointer"
                    aria-label="Desplazar categorías a la izquierda"
                  >
                    <i className="ph-bold ph-caret-left text-xl" aria-hidden="true" />
                  </button>
                </>
              )}

              <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="flex overflow-x-auto hide-scrollbar gap-2 w-full px-1 sm:px-4"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {categories.map((cat) => {
                  const active = filterCategory === cat.key
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={(e) => handleCategorySelect(cat.key, e)}
                      className={`btn-poly px-4 sm:px-6 py-2.5 font-medium transition text-xs flex-shrink-0 whitespace-nowrap inline-flex items-center gap-2 cursor-pointer ${
                        active
                          ? 'bg-[#D4AF5A] text-[#0F0D0A] font-semibold'
                          : 'bg-[#1A1611] hover:border-[#D4AF5A]/60 text-[#F1E8D4] border border-[#D4AF5A]/25'
                      }`}
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <span
                        className={`w-1.5 h-1.5 rotate-45 ${
                          active ? 'bg-[#0F0D0A]' : 'bg-[#D4AF5A]'
                        }`}
                        aria-hidden="true"
                      />
                      <span>{cat.label}</span>
                    </button>
                  )
                })}
              </div>

              {canScrollRight && (
                <>
                  <div
                    className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#0F0D0A] to-transparent z-[5] md:hidden"
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      scrollContainerRef.current?.scrollBy({ left: 250, behavior: 'smooth' })
                    }
                    className="absolute right-0 top-0 z-10 h-full px-2 bg-gradient-to-l from-[#0F0D0A] via-[#0F0D0A]/90 to-transparent items-center text-[#D4AF5A] hover:text-[#E9CC82] transition hidden md:flex cursor-pointer"
                    aria-label="Desplazar categorías a la derecha"
                  >
                    <i className="ph-bold ph-caret-right text-xl" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* BLOCO 1: DESAYUNOS */}
        {desayunosCategories.some(
          (cat) => filteredMenu.filter((item) => item.category === cat.key).length > 0,
        ) && (
          <div className="mb-12 md:mb-14">
            <div className="text-center mb-8 md:mb-10">
              <h3 className="font-display text-3xl md:text-4xl text-[#F1E8D4] mb-2">DESAYUNOS</h3>
              <LemaBadge>EMPIEZA EL DÍA CON BUEN PIE</LemaBadge>
            </div>

            <div className="space-y-10 md:space-y-12">
              {desayunosCategories.map((cat) => {
                const catItems = filteredMenu.filter((item) => item.category === cat.key)
                if (catItems.length === 0) return null
                return (
                  <div key={cat.key}>
                    <SectionFilete
                      title={cat.label}
                      count={catItems.length}
                      note={categoryNotes[cat.key]}
                      as="h4"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                      {catItems.map(renderCard)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Separador triplo entre Desayunos e Comidas */}
        {desayunosCategories.some(
          (cat) => filteredMenu.filter((item) => item.category === cat.key).length > 0,
        ) &&
          comidasCategories.some(
            (cat) => filteredMenu.filter((item) => item.category === cat.key).length > 0,
          ) && <TripleRomboSeparator className="my-10 md:my-12" />}

        {/* BLOCO 2: COMIDAS */}
        {comidasCategories.some(
          (cat) => filteredMenu.filter((item) => item.category === cat.key).length > 0,
        ) && (
          <div>
            <div className="text-center mb-8 md:mb-10">
              <h3 className="font-display text-3xl md:text-4xl text-[#F1E8D4] mb-2">COMIDAS</h3>
              <LemaBadge>TARDE &amp; NOCHE</LemaBadge>
            </div>

            <div className="space-y-10 md:space-y-12">
              {comidasCategories.map((cat) => {
                const catItems = filteredMenu.filter((item) => item.category === cat.key)
                if (catItems.length === 0) return null
                return (
                  <div key={cat.key}>
                    <SectionFilete
                      title={cat.label}
                      count={catItems.length}
                      note={categoryNotes[cat.key]}
                      as="h4"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                      {catItems.map(renderCard)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {filteredMenu.length === 0 && (
          <div className="text-center py-12 text-[#C4B9A3]">
            <i className="ph ph-bowl-food text-5xl mb-3 block text-[#D4AF5A]" aria-hidden="true" />
            <p>No hemos encontrado platos con los filtros actuales.</p>
            {(searchQuery || excludedAllergens.length > 0 || filterCategory !== 'todos') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setFilterCategory('todos')
                  onClearAllergens()
                }}
                className="mt-4 btn-poly bg-[#1A1611] border border-[#D4AF5A]/50 text-[#D4AF5A] px-5 py-2.5 text-xs uppercase tracking-wider cursor-pointer"
              >
                Ver toda la carta
              </button>
            )}
          </div>
        )}

        {/* Aviso normativo RD 126/2015 · Reglamento (UE) 1169/2011 · AESAN */}
        <div className="max-w-4xl mx-auto mt-12 md:mt-14 p-4 sm:p-5 bg-[#1A1611] border border-[#F08A4B]/40 text-xs text-[#C4B9A3] leading-relaxed">
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-[1.5px] border-[#F08A4B] bg-[#0F0D0A] text-[#F08A4B] font-bold text-sm shrink-0 mt-0.5">
              ?
            </span>
            <div className="space-y-1.5 font-light">
              <p className="font-medium text-[#F1E8D4] uppercase tracking-wider">
                Información obligatoria sobre alérgenos — Reglamento (UE) 1169/2011 y Real Decreto 126/2015
              </p>
              <p>
                En nuestra cocina se elaboran platos con los 14 grupos de alérgenos del Anexo II y se
                comparten equipos de cocción (freidoras, plancha, tostador y zonas de preparación), por
                lo que <strong className="text-[#F08A4B] font-medium">no es posible garantizar la ausencia total de trazas por contacto cruzado</strong>.
              </p>
              <p>
                Antes de realizar su pedido, <strong className="text-[#F1E8D4] font-medium">consulte siempre a nuestro personal</strong>, quien dispone de las fichas e información actualizada de los productos.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Pedir tras el menú */}
        {cartCount > 0 && (
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={onOpenCart}
              className="btn-poly bg-[#D4AF5A] hover:bg-[#E9CC82] text-[#0F0D0A] px-10 sm:px-12 py-4 font-semibold text-sm transition inline-flex items-center space-x-3 cursor-pointer"
            >
              <i className="ph-fill ph-shopping-cart text-xl" aria-hidden="true" />
              <span>
                Ver Pedido ({cartCount} {cartCount === 1 ? 'ítem' : 'ítems'}){' '}
                {cartTotal > 0 ? `· ${priceLabel(cartTotal)}` : ''}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
