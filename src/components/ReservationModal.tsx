import { useState, useEffect, useMemo, useRef } from 'react'
import { allergenInfo, type AllergenKey } from '../data/allergens'
import {
  formatLocalDateISO,
  getAvailableTimeTurns,
  getQuickDateOptions,
  isMondayDate,
  isPastDate,
  occasionOptions,
  parseLocalDate,
  reservationZones,
  WHATSAPP_NUMBER,
  type ZoneOption,
} from '../data/restaurant'
import { useModalA11y } from '../utils/useModalA11y'

const STORAGE_KEY = 'los_rombos_customer_v1'

interface ReservationModalProps {
  open: boolean
  excludedAllergens: AllergenKey[]
  onClose: () => void
}

export function ReservationModal({ open, excludedAllergens, onClose }: ReservationModalProps) {
  const modalRef = useModalA11y<HTMLDivElement>(open, onClose)
  const closeTimerRef = useRef<number | null>(null)
  const quickDates = getQuickDateOptions()
  const defaultDate = quickDates[0]?.dateStr ?? formatLocalDateISO(new Date())

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState(defaultDate)
  const [showCustomDate, setShowCustomDate] = useState(false)
  const [activeTurn, setActiveTurn] = useState<'desayuno' | 'comida' | 'cena'>('comida')
  const [time, setTime] = useState('')
  const [people, setPeople] = useState(2)
  const [isLargeGroup, setIsLargeGroup] = useState(false)
  const [selectedZone, setSelectedZone] = useState<ZoneOption['id']>('salon-superior')
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [hasAllergyAlert, setHasAllergyAlert] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [missingFields, setMissingFields] = useState<Record<string, boolean>>({})

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  // Carrega Nome e Telefone salvos no navegador
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as { name?: string; phone?: string }
        if (parsed.name) setName(parsed.name)
        if (parsed.phone) setPhone(parsed.phone)
      }
    } catch {
      // ignora erro de storage
    }
  }, [])

  useEffect(() => {
    setHasAllergyAlert(excludedAllergens.length > 0)
  }, [excludedAllergens])

  const timeTurns = useMemo(() => getAvailableTimeTurns(date), [date])

  // Ajusta automaticamente a aba de turno se o turno atual não tiver horários disponíveis hoje, e limpa time se inválido
  useEffect(() => {
    if (timeTurns.length > 0 && !timeTurns.some((t) => t.id === activeTurn)) {
      setActiveTurn(timeTurns[0].id)
    }
    if (time && !timeTurns.some((turn) => turn.times.includes(time))) {
      setTime('')
    }
  }, [date, timeTurns, activeTurn, time])

  if (!open) return null

  const toggleOccasion = (id: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const handleSelectPeople = (count: number) => {
    setIsLargeGroup(false)
    setPeople(count)
    setErrorMsg(null)
  }

  const handleSelectLargeGroup = () => {
    setIsLargeGroup(true)
    if (people < 9) setPeople(9)
    setSelectedZone('salon-superior')
    setErrorMsg(null)
  }

  const mondaySelected = isMondayDate(date)
  const pastSelected = isPastDate(date)
  const currentTurnGroup = timeTurns.find((t) => t.id === activeTurn) ?? timeTurns[0]
  const currentZoneObj =
    reservationZones.find((z) => z.id === selectedZone) ?? reservationZones[0]

  const parsedDate = parseLocalDate(date)
  const formattedLongDate = parsedDate
    ? parsedDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : date

  const formattedShortDate = parsedDate
    ? parsedDate.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    : date

  const validateAndSend = () => {
    const nextMissing: Record<string, boolean> = {}

    if (!date || pastSelected) {
      nextMissing.date = true
      setErrorMsg('Por favor, selecciona una fecha válida a partir de hoy.')
      setMissingFields(nextMissing)
      return
    }

    if (mondaySelected) {
      nextMissing.date = true
      setErrorMsg('Los lunes permanecemos cerrados por descanso. Elige un día de martes a domingo.')
      setMissingFields(nextMissing)
      return
    }

    if (!time) {
      nextMissing.time = true
      setErrorMsg('Selecciona la hora de tu reserva en uno de los turnos disponibles.')
      setMissingFields(nextMissing)
      return
    }

    if (!name.trim()) {
      nextMissing.name = true
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 6) {
      nextMissing.phone = true
    }

    if (nextMissing.name || nextMissing.phone) {
      setMissingFields(nextMissing)
      setErrorMsg(
        nextMissing.name && nextMissing.phone
          ? 'Indica tu nombre y teléfono de contacto para confirmar la reserva.'
          : nextMissing.name
            ? 'Por favor, escribe tu nombre para la reserva.'
            : 'Indica un número de teléfono válido para poder confirmarte la mesa.',
      )
      return
    }

    setMissingFields({})
    setErrorMsg(null)

    // Salva nome e telefone para futuras reservas
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      )
    } catch {
      // ignora erro de storage
    }

    const turnLabel =
      timeTurns.find((g) => g.times.includes(time))?.label ?? 'Horario seleccionado'
    const occasionsLabels = occasionOptions
      .filter((o) => selectedOccasions.includes(o.id))
      .map((o) => o.label)

    let msg = '*RESERVA DE MESA — BAR LOS ROMBOS*\n'
    msg += '━━━━━━━━━━━━━━━━━━\n\n'
    msg += `*Cliente:* ${name.trim()}\n`
    msg += `*Teléfono:* ${phone.trim()}\n\n`
    msg += `*Fecha:* ${formattedLongDate}\n`
    msg += `*Hora:* ${time} (${turnLabel})\n`
    msg += `*Comensales:* ${people} ${people === 1 ? 'persona' : 'personas'}\n`
    msg += `*Zona preferida:* ${currentZoneObj.name}\n`

    if (occasionsLabels.length > 0) {
      msg += `*Preferencias:* ${occasionsLabels.join(', ')}\n`
    }

    msg += '\n'

    if (hasAllergyAlert) {
      msg += '*AVISO DE ALERGIA / INTOLERANCIA EN LA MESA*\n'
      if (excludedAllergens.length > 0) {
        msg += `Alérgenos indicados: *${excludedAllergens.map((k) => allergenInfo[k].name).join(', ')}*\n\n`
      } else {
        msg += 'Comensal con alergia o intolerancia alimentaria (consultar al llegar).\n\n'
      }
    }

    if (notes.trim()) {
      msg += `*Observaciones:* ${notes.trim()}\n\n`
    }

    msg += '━━━━━━━━━━━━━━━━━━\n'
    msg += '¿Me confirmáis disponibilidad para esta reserva? ¡Gracias!'

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
    }
    closeTimerRef.current = window.setTimeout(() => {
      onClose()
      setErrorMsg(null)
      setMissingFields({})
    }, 900)
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Reservar Mesa"
    >
      <div onClick={onClose} className="absolute inset-0 modal-backdrop" />

      <div
        ref={modalRef}
        className="relative bg-[#0F0D0A] rombos-double-frame w-full max-w-2xl max-h-[92dvh] overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0F0D0A]/95 backdrop-blur-md p-4 sm:p-6 border-b border-[#D4AF5A]/25 flex items-center justify-between z-20">
          <div>
            <h3 className="font-display text-xl sm:text-2xl flex items-center space-x-2.5 text-[#F1E8D4]">
              <i className="ph ph-calendar-check text-[#D4AF5A]" aria-hidden="true" />
              <span>RESERVAR MESA</span>
            </h3>
            <p className="text-xs font-light uppercase tracking-wider text-[#C4B9A3] mt-0.5">
              Confirmación directa y sin intermediarios por WhatsApp
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center text-[#C4B9A3] hover:text-[#F1E8D4] border border-[#D4AF5A]/25 cursor-pointer"
            aria-label="Cerrar reserva"
          >
            <i className="ph ph-x text-2xl" aria-hidden="true" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 sm:p-6 space-y-6 flex-1">
          {/* 1. NÚMERO DE PERSONAS */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs uppercase tracking-[0.14em] text-[#D4AF5A] font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#D4AF5A] rotate-45" aria-hidden="true" />
                <span>1. ¿Cuántas personas sois?</span>
              </h4>
              <span className="text-xs text-[#C4B9A3]">
                Seleccionado: <strong className="text-[#F1E8D4]">{people} pax</strong>
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                const active = !isLargeGroup && people === num
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSelectPeople(num)}
                    aria-pressed={active}
                    className={`py-2.5 px-2 text-xs font-medium border transition cursor-pointer ${
                      active
                        ? 'bg-[#D4AF5A] text-[#0F0D0A] border-[#D4AF5A] font-semibold'
                        : 'bg-[#1A1611] text-[#F1E8D4] border-[#D4AF5A]/30 hover:border-[#D4AF5A]'
                    }`}
                  >
                    {num}
                  </button>
                )
              })}
              <button
                type="button"
                onClick={handleSelectLargeGroup}
                aria-pressed={isLargeGroup}
                className={`col-span-2 sm:col-span-1 py-2.5 px-2 text-xs font-medium border transition cursor-pointer ${
                  isLargeGroup
                    ? 'bg-[#D4AF5A] text-[#0F0D0A] border-[#D4AF5A] font-semibold'
                    : 'bg-[#1A1611] text-[#D4AF5A] border-[#D4AF5A]/45 hover:border-[#D4AF5A]'
                }`}
              >
                +8 Grupo
              </button>
            </div>

            {isLargeGroup && (
              <div className="mt-3 p-3 bg-[#1A1611] border border-[#D4AF5A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-[#C4B9A3] font-light">
                  <strong className="text-[#D4AF5A] font-medium uppercase tracking-wider block">
                    Reserva para grupo en Salón Superior
                  </strong>
                  Indica el número aproximado de comensales para preparar vuestras mesas:
                </div>
                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setPeople((p) => Math.max(9, p - 1))}
                    className="qty-btn cursor-pointer"
                    aria-label="Restar comensal"
                  >
                    <i className="ph-bold ph-minus text-sm" aria-hidden="true" />
                  </button>
                  <span className="w-12 text-center font-semibold text-sm text-[#F1E8D4]">
                    {people} pax
                  </span>
                  <button
                    type="button"
                    onClick={() => setPeople((p) => Math.min(30, p + 1))}
                    className="qty-btn cursor-pointer"
                    aria-label="Sumar comensal"
                  >
                    <i className="ph-bold ph-plus text-sm" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. ZONA / AMBIENTE PREFERIDO */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.14em] text-[#D4AF5A] font-medium flex items-center gap-1.5 mb-2.5">
              <span className="w-1.5 h-1.5 bg-[#D4AF5A] rotate-45" aria-hidden="true" />
              <span>2. Elige zona o ambiente</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {reservationZones.map((zone) => {
                const active = selectedZone === zone.id
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZone(zone.id)}
                    aria-pressed={active}
                    className={`p-3.5 text-left border transition flex flex-col justify-between cursor-pointer ${
                      active
                        ? 'bg-[#D4AF5A]/15 border-[#D4AF5A] text-[#F1E8D4]'
                        : 'bg-[#1A1611] border-[#D4AF5A]/25 text-[#C4B9A3] hover:border-[#D4AF5A]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="inline-flex items-center gap-2 font-medium text-xs uppercase tracking-wider text-[#F1E8D4]">
                        <i className={`ph ${zone.icon} text-base text-[#D4AF5A]`} aria-hidden="true" />
                        <span>{zone.name}</span>
                      </span>
                      <span
                        className={`w-2 h-2 rotate-45 shrink-0 ${
                          active ? 'bg-[#D4AF5A]' : 'border border-[#D4AF5A]/50'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-[11px] font-light text-[#C4B9A3] leading-snug">
                      {zone.subtitle}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3. FECHA DE LA RESERVA */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs uppercase tracking-[0.14em] text-[#D4AF5A] font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#D4AF5A] rotate-45" aria-hidden="true" />
                <span>3. Fecha de la reserva</span>
              </h4>
              <span className="text-xs text-[#C4B9A3] capitalize">{formattedShortDate}</span>
            </div>

            {/* Atalhos rápidos + botão Otra fecha */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2.5">
              {quickDates.map((q) => {
                const active = !showCustomDate && date === q.dateStr
                return (
                  <button
                    key={q.dateStr}
                    type="button"
                    onClick={() => {
                      setDate(q.dateStr)
                      setShowCustomDate(false)
                      setTime('')
                      setErrorMsg(null)
                      setMissingFields((prev) => ({ ...prev, date: false }))
                    }}
                    aria-pressed={active}
                    className={`py-2 px-3 border text-left transition cursor-pointer ${
                      active
                        ? 'bg-[#D4AF5A] text-[#0F0D0A] border-[#D4AF5A]'
                        : 'bg-[#1A1611] text-[#F1E8D4] border-[#D4AF5A]/30 hover:border-[#D4AF5A]'
                    }`}
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider">{q.label}</div>
                    <div
                      className={`text-[11px] ${
                        active ? 'text-[#0F0D0A]/80 font-medium' : 'text-[#C4B9A3] font-light'
                      }`}
                    >
                      {q.sublabel}
                    </div>
                  </button>
                )
              })}

              <button
                type="button"
                onClick={() => setShowCustomDate((prev) => !prev)}
                aria-pressed={showCustomDate}
                className={`col-span-2 sm:col-span-1 py-2 px-3 border text-left transition flex sm:flex-col items-center sm:items-start justify-between sm:justify-center cursor-pointer ${
                  showCustomDate
                    ? 'bg-[#D4AF5A]/20 border-[#D4AF5A] text-[#D4AF5A]'
                    : 'bg-[#1A1611] border-[#D4AF5A]/35 text-[#F1E8D4] hover:border-[#D4AF5A]'
                }`}
              >
                <div className="text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <i className="ph ph-calendar-blank text-sm text-[#D4AF5A]" aria-hidden="true" />
                  <span>Otra fecha</span>
                </div>
                <div className="text-[11px] text-[#C4B9A3] font-light">Calendario</div>
              </button>
            </div>

            {showCustomDate && (
              <div className="mt-2">
                <label htmlFor="res-date" className="sr-only">
                  Seleccionar fecha
                </label>
                <input
                  type="date"
                  id="res-date"
                  min={formatLocalDateISO(new Date())}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value)
                    setTime('')
                    setErrorMsg(null)
                    setMissingFields((prev) => ({ ...prev, date: false }))
                  }}
                  className={`w-full bg-[#1A1611] border px-4 py-2.5 text-[#F1E8D4] focus:border-[#D4AF5A] focus:outline-none text-sm ${
                    missingFields.date ? 'border-[#F08A4B]' : 'border-[#D4AF5A]/45'
                  }`}
                />
              </div>
            )}

            {/* Aviso caso o cliente escolha uma segunda-feira (Lunes cerrado) */}
            {mondaySelected && (
              <div className="mt-2.5 p-3 bg-[#F08A4B]/15 border border-[#F08A4B] text-xs text-[#F1E8D4] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2">
                  <i
                    className="ph-fill ph-warning-circle text-[#F08A4B] text-base shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    <strong className="text-[#F08A4B] uppercase tracking-wider block">
                      Lunes cerrado por descanso
                    </strong>
                    Abiertos de martes a domingo. Selecciona otro día para ver los horarios.
                  </span>
                </div>
                {quickDates[0] && (
                  <button
                    type="button"
                    onClick={() => {
                      setDate(quickDates[0].dateStr)
                      setShowCustomDate(false)
                      setTime('')
                      setErrorMsg(null)
                    }}
                    className="self-start sm:self-auto bg-[#F08A4B] text-[#0F0D0A] font-semibold text-[11px] uppercase tracking-wider px-3 py-1.5 shrink-0 cursor-pointer"
                  >
                    Ver {quickDates[0].label}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 4. HORA AGRUPADA POR TURNO */}
          {!mondaySelected && !pastSelected && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs uppercase tracking-[0.14em] text-[#D4AF5A] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#D4AF5A] rotate-45" aria-hidden="true" />
                  <span>4. Selecciona turno y hora</span>
                </h4>
                {time && (
                  <span className="text-xs text-[#D4AF5A] font-medium">Hora: {time}</span>
                )}
              </div>

              {timeTurns.length > 0 ? (
                <div
                  className={`p-3.5 bg-[#1A1611] border ${
                    missingFields.time ? 'border-[#F08A4B]' : 'border-[#D4AF5A]/25'
                  }`}
                >
                  {/* Abas de Turno (Desayuno, Comida, Cena) */}
                  <div className="grid grid-cols-3 gap-1.5 mb-3 pb-3 border-b border-[#D4AF5A]/15">
                    {timeTurns.map((turn) => {
                      const isTurnActive = currentTurnGroup?.id === turn.id
                      return (
                        <button
                          key={turn.id}
                          type="button"
                          onClick={() => {
                            setActiveTurn(turn.id)
                            if (time && !turn.times.includes(time)) {
                              setTime('')
                            }
                          }}
                          aria-pressed={isTurnActive}
                          className={`py-2 px-2 text-center border transition cursor-pointer ${
                            isTurnActive
                              ? 'bg-[#D4AF5A]/20 border-[#D4AF5A] text-[#F1E8D4]'
                              : 'bg-[#0F0D0A] border-[#D4AF5A]/20 text-[#C4B9A3] hover:border-[#D4AF5A]/50'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                            <i className={`ph ${turn.icon} text-[#D4AF5A]`} aria-hidden="true" />
                            <span className="truncate">{turn.label.split(' ')[0]}</span>
                          </div>
                          <div className="text-[10px] text-[#C4B9A3] font-light mt-0.5">
                            {turn.subtitle}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Botões de horário do turno selecionado */}
                  {currentTurnGroup && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {currentTurnGroup.times.map((slot) => {
                        const selected = time === slot
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              setTime(slot)
                              setErrorMsg(null)
                              setMissingFields((prev) => ({ ...prev, time: false }))
                            }}
                            aria-pressed={selected}
                            className={`py-2 text-xs font-medium border transition cursor-pointer ${
                              selected
                                ? 'bg-[#D4AF5A] text-[#0F0D0A] border-[#D4AF5A] font-semibold'
                                : 'bg-[#0F0D0A] text-[#F1E8D4] border-[#D4AF5A]/30 hover:border-[#D4AF5A]'
                            }`}
                          >
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3.5 bg-[#1A1611] border border-[#F08A4B]/50 text-xs text-[#C4B9A3]">
                  Ya no quedan turnos disponibles para hoy. Por favor, selecciona{' '}
                  <strong className="text-[#D4AF5A]">Mañana</strong> u otra fecha.
                </div>
              )}
            </div>
          )}

          {/* 5. OCASIÓN / PREFERENCIAS EN 1 TOQUE */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.14em] text-[#D4AF5A] font-medium flex items-center gap-1.5 mb-2.5">
              <span className="w-1.5 h-1.5 bg-[#D4AF5A] rotate-45" aria-hidden="true" />
              <span>5. Ocasión o preferencia (opcional)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {occasionOptions.map((occ) => {
                const active = selectedOccasions.includes(occ.id)
                return (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => toggleOccasion(occ.id)}
                    aria-pressed={active}
                    className={`py-2.5 px-3 border text-xs flex items-center gap-2 transition cursor-pointer ${
                      active
                        ? 'bg-[#D4AF5A]/20 border-[#D4AF5A] text-[#F1E8D4] font-medium'
                        : 'bg-[#1A1611] border-[#D4AF5A]/25 text-[#C4B9A3] hover:border-[#D4AF5A]/60'
                    }`}
                  >
                    <i className={`ph ${occ.icon} text-base text-[#D4AF5A] shrink-0`} aria-hidden="true" />
                    <span className="truncate">{occ.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 6. TUS DATOS Y ALÉRGENOS */}
          <div className="border-t border-[#D4AF5A]/20 pt-5">
            <h4 className="text-xs uppercase tracking-[0.14em] text-[#D4AF5A] font-medium flex items-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 bg-[#D4AF5A] rotate-45" aria-hidden="true" />
              <span>6. Tus datos de contacto</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label
                  htmlFor="res-name"
                  className="text-xs uppercase tracking-wider text-[#C4B9A3] block mb-1"
                >
                  Nombre *
                </label>
                <input
                  type="text"
                  id="res-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (missingFields.name) {
                      setMissingFields((prev) => ({ ...prev, name: false }))
                      setErrorMsg(null)
                    }
                  }}
                  placeholder="Tu nombre y apellidos"
                  autoComplete="name"
                  className={`w-full bg-[#1A1611] border px-4 py-2.5 text-[#F1E8D4] placeholder-[#C4B9A3]/50 focus:border-[#D4AF5A] focus:outline-none text-sm ${
                    missingFields.name ? 'border-[#F08A4B]' : 'border-[#D4AF5A]/35'
                  }`}
                />
              </div>

              <div>
                <label
                  htmlFor="res-phone"
                  className="text-xs uppercase tracking-wider text-[#C4B9A3] block mb-1"
                >
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="res-phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    if (missingFields.phone) {
                      setMissingFields((prev) => ({ ...prev, phone: false }))
                      setErrorMsg(null)
                    }
                  }}
                  placeholder="Ej. 612 34 56 78"
                  autoComplete="tel"
                  className={`w-full bg-[#1A1611] border px-4 py-2.5 text-[#F1E8D4] placeholder-[#C4B9A3]/50 focus:border-[#D4AF5A] focus:outline-none text-sm ${
                    missingFields.phone ? 'border-[#F08A4B]' : 'border-[#D4AF5A]/35'
                  }`}
                />
              </div>
            </div>

            {/* Alerta rápida de alergia / intolerancia en reserva */}
            <div className="p-3 border border-[#F08A4B]/50 bg-[#1A1611] mb-3">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasAllergyAlert}
                  onChange={(e) => setHasAllergyAlert(e.target.checked)}
                  className="accent-[#F08A4B] w-4 h-4 mt-0.5 shrink-0 cursor-pointer"
                />
                <span className="text-xs text-[#F1E8D4] leading-snug">
                  <strong className="text-[#F08A4B] font-medium uppercase tracking-wider">
                    Algún comensal tiene alergia o intolerancia alimentaria
                  </strong>
                  {excludedAllergens.length > 0 && (
                    <span className="block text-[11px] font-light text-[#C4B9A3] mt-0.5">
                      Alérgenos filtrados incluidos en la reserva:{' '}
                      <strong className="text-[#F08A4B] font-medium">
                        {excludedAllergens.map((k) => allergenInfo[k].name).join(', ')}
                      </strong>
                    </span>
                  )}
                </span>
              </label>
            </div>

            <div>
              <label
                htmlFor="res-notes"
                className="text-xs uppercase tracking-wider text-[#C4B9A3] block mb-1"
              >
                Observaciones o detalle de alergias (opcional)
              </label>
              <textarea
                id="res-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Carrito de bebé, alérgico al gluten, mesa tranquila..."
                className="w-full bg-[#1A1611] border border-[#D4AF5A]/35 px-4 py-2.5 text-[#F1E8D4] placeholder-[#C4B9A3]/50 focus:border-[#D4AF5A] focus:outline-none text-sm h-16 resize-none"
              />
            </div>
          </div>

          {/* 7. RESUMO ESTILO "TICKET DE RESERVA" COM MOLDURA DUPLA DOURADA */}
          <div className="bg-[#1A1611] rombos-double-frame p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-[#D4AF5A]/25 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#D4AF5A] rotate-45" aria-hidden="true" />
                <h4 className="font-display text-xs sm:text-sm text-[#D4AF5A] tracking-wider">
                  RESUMEN DE TU RESERVA · BAR LOS ROMBOS
                </h4>
              </div>
              <span className="text-[11px] uppercase tracking-wider text-[#C4B9A3]">
                Valladolid
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C4B9A3] block">
                  Comensales
                </span>
                <strong className="text-[#F1E8D4] font-medium">
                  {people} {people === 1 ? 'persona' : 'personas'}
                </strong>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C4B9A3] block">
                  Ambiente
                </span>
                <strong className="text-[#D4AF5A] font-medium">{currentZoneObj.name}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C4B9A3] block">
                  Fecha
                </span>
                <strong className="text-[#F1E8D4] font-medium capitalize">
                  {mondaySelected ? 'Lunes (Cerrado)' : formattedShortDate}
                </strong>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C4B9A3] block">
                  Hora
                </span>
                <strong className={time ? 'text-[#D4AF5A] font-semibold' : 'text-[#F08A4B]'}>
                  {time || 'Pendiente elegir'}
                </strong>
              </div>
            </div>

            {(selectedOccasions.length > 0 || hasAllergyAlert) && (
              <div className="mt-3 pt-2.5 border-t border-[#D4AF5A]/15 flex flex-wrap items-center gap-2 text-[11px]">
                {occasionOptions
                  .filter((o) => selectedOccasions.includes(o.id))
                  .map((o) => (
                    <span
                      key={o.id}
                      className="bg-[#0F0D0A] border border-[#D4AF5A]/35 text-[#F1E8D4] px-2 py-0.5"
                    >
                      {o.label}
                    </span>
                  ))}
                {hasAllergyAlert && (
                  <span className="bg-[#F08A4B]/15 border border-[#F08A4B] text-[#F08A4B] px-2 py-0.5 font-medium">
                    Aviso de Alergia / Intolerancia incluido
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer com validação visual e botão de confirmação */}
        <div className="sticky bottom-0 bg-[#0F0D0A]/95 backdrop-blur-md p-3 sm:p-5 border-t border-[#D4AF5A]/25 space-y-2 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] z-20">
          {errorMsg && (
            <div
              role="alert"
              className="p-3 bg-[#F08A4B]/15 border border-[#F08A4B] text-xs text-[#F1E8D4] flex items-center gap-2.5"
            >
              <i
                className="ph-fill ph-warning-circle text-lg text-[#F08A4B] shrink-0"
                aria-hidden="true"
              />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="button"
            onClick={validateAndSend}
            className="btn-poly w-full bg-[#D4AF5A] hover:bg-[#E9CC82] text-[#0F0D0A] py-4 font-semibold text-sm transition flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            <i className="ph ph-whatsapp-logo text-xl" aria-hidden="true" />
            <span>Confirmar Reserva por WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full text-[#C4B9A3] hover:text-[#F1E8D4] py-1.5 text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
