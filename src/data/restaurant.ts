export interface ZoneOption {
  id: 'salon-superior' | 'planta-baja' | 'indiferente'
  name: string
  subtitle: string
  icon: string
}

export interface OccasionOption {
  id: string
  label: string
  icon: string
}

export interface TimeTurnGroup {
  id: 'desayuno' | 'comida' | 'cena'
  label: string
  subtitle: string
  icon: string
  times: string[]
}

export interface QuickDateOption {
  dateStr: string
  label: string
  sublabel: string
}

export const WHATSAPP_NUMBER = '34614692156'
export const PHONE_DISPLAY = '+34 614 69 21 56'
export const PHONE_SHORT = '614 69 21 56'
export const ADDRESS_LINE = 'C. de la Transición, 8 · 47013 Valladolid'
export const INSTAGRAM_URL = 'https://www.instagram.com/barlosrombos.es/'
export const INSTAGRAM_HANDLE = '@barlosrombos.es'
export const GOOGLE_MAPS_URL =
  'https://www.google.es/maps/place/Losrombos+Valladolid/@41.6313722,-4.726502,20z/data=!4m15!1m8!3m7!1s0xd4712d2df5fa255:0x66ecf051eba0e7a0!2sC.+de+la+Transici%C3%B3n,+8,+47013+Valladolid!3b1!8m2!3d41.6313677!4d-4.7266838!16s%2Fg%2F11bw44lwfk!3m5!1s0xd47130c6f50eaaf:0x480da27fd566fd26!8m2!3d41.6313677!4d-4.7266838!16s%2Fg%2F11zz85m_zl'

export const reservationZones: ZoneOption[] = [
  {
    id: 'salon-superior',
    name: 'Salón Superior',
    subtitle: 'Comedor amplio en planta alta · Ideal comidas, cenas y grupos',
    icon: 'ph-stairs',
  },
  {
    id: 'planta-baja',
    name: 'Planta Baja',
    subtitle: 'Zona junto a barra · Ambiente de tapeo, desayunos y raciones',
    icon: 'ph-storefront',
  },
  {
    id: 'indiferente',
    name: 'Indiferente',
    subtitle: 'Donde haya mejor disponibilidad al llegar',
    icon: 'ph-check-square-offset',
  },
]

export const occasionOptions: OccasionOption[] = [
  { id: 'cumpleanos', label: 'Cumpleaños / Celebración', icon: 'ph-confetti' },
  { id: 'grupo', label: 'Grupo / Amigos', icon: 'ph-users-three' },
  { id: 'ninos', label: 'Niños / Trona', icon: 'ph-baby' },
  { id: 'accesibilidad', label: 'Accesibilidad / Planta baja', icon: 'ph-wheelchair' },
]

export const weeklyHours = [
  { day: 'Domingo', hours: '09:00 - 00:00', closed: false },
  { day: 'Lunes', hours: 'Cerrado', closed: true },
  { day: 'Martes', hours: '08:00 - 00:00', closed: false },
  { day: 'Miércoles', hours: '08:00 - 00:00', closed: false },
  { day: 'Jueves', hours: '08:00 - 00:00', closed: false },
  { day: 'Viernes', hours: '08:00 - 00:00', closed: false },
  { day: 'Sábado', hours: '09:00 - 00:00', closed: false },
]

/**
 * Faz o parse de "YYYY-MM-DD" no fuso horário local (evitando bug de UTC midnight voltar 1 dia).
 */
export function parseLocalDate(dateStr: string): Date | null {
  if (!dateStr) return null
  const parts = dateStr.split('-').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return null
  return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0)
}

export function formatLocalDateISO(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isMondayDate(dateStr: string): boolean {
  const d = parseLocalDate(dateStr)
  return d ? d.getDay() === 1 : false
}

export function isPastDate(dateStr: string): boolean {
  const d = parseLocalDate(dateStr)
  if (!d) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const check = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
  return check < today
}

export function getBusinessHours(dateStr: string): { start: number; end: number } | null {
  const d = parseLocalDate(dateStr)
  if (!d) return null
  const dayOfWeek = d.getDay()
  if (dayOfWeek === 1) return null // Lunes cerrado
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return { start: 9, end: 24 } // Sábado-Domingo 09:00-00:00
  }
  return { start: 8, end: 24 } // Martes-Viernes 08:00-00:00
}

/**
 * Retorna os próximos 4 dias abertos como atalhos rápidos (ex. Hoy, Mañana, Sáb 24 oct...)
 */
export function getQuickDateOptions(): QuickDateOption[] {
  const options: QuickDateOption[] = []
  const now = new Date()
  const shortWeekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const shortMonths = [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic',
  ]

  for (let offset = 0; offset < 10 && options.length < 4; offset++) {
    const candidate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, 12, 0, 0)
    if (candidate.getDay() === 1) continue // Pula segunda-feira (Lunes cerrado)

    const dateStr = formatLocalDateISO(candidate)
    // Se for hoje e já passou das 22:45, pula "Hoy"
    if (offset === 0 && (now.getHours() > 22 || (now.getHours() === 22 && now.getMinutes() >= 45))) {
      continue
    }

    const dayNum = candidate.getDate()
    const monthStr = shortMonths[candidate.getMonth()]
    const weekStr = shortWeekdays[candidate.getDay()]

    let label = `${weekStr} ${dayNum}`
    if (offset === 0) label = 'Hoy'
    else if (offset === 1) label = 'Mañana'

    options.push({
      dateStr,
      label,
      sublabel: `${weekStr} ${dayNum} ${monthStr}`,
    })
  }

  return options
}

/**
 * Retorna os horários agrupados por turno (Desayuno, Comida, Cena),
 * ocultando horários que já passaram quando a data selecionada é hoje.
 */
export function getAvailableTimeTurns(dateStr: string): TimeTurnGroup[] {
  const hours = getBusinessHours(dateStr)
  if (!hours) return []

  const todayISO = formatLocalDateISO(new Date())
  const isToday = dateStr === todayISO
  const now = new Date()
  const minMinutesToday = now.getHours() * 60 + now.getMinutes() + 20

  const isSlotValid = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number)
    if (h < hours.start) return false
    if (isToday && h * 60 + m < minMinutesToday) return false
    return true
  }

  const desayunoRaw = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
  ]
  const comidaRaw = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']
  const cenaRaw = [
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
  ]

  const groups: TimeTurnGroup[] = [
    {
      id: 'desayuno',
      label: 'Desayuno & Almuerzo',
      subtitle: `${hours.start === 8 ? '08:00' : '09:00'} – 12:30`,
      icon: 'ph-coffee',
      times: desayunoRaw.filter(isSlotValid),
    },
    {
      id: 'comida',
      label: 'Comida & Mediodía',
      subtitle: '13:00 – 16:30',
      icon: 'ph-sun',
      times: comidaRaw.filter(isSlotValid),
    },
    {
      id: 'cena',
      label: 'Tardeo & Cena',
      subtitle: '19:00 – 23:00',
      icon: 'ph-moon-stars',
      times: cenaRaw.filter(isSlotValid),
    },
  ]

  return groups.filter((g) => g.times.length > 0)
}
