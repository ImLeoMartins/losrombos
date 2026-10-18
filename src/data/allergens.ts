export type AllergenKey =
  | 'gluten'
  | 'crustaceos'
  | 'huevo'
  | 'pescado'
  | 'cacahuetes'
  | 'soja'
  | 'lacteos'
  | 'frutos'
  | 'apio'
  | 'mostaza'
  | 'sesamo'
  | 'sulfitos'
  | 'altramuces'
  | 'moluscos'

export type AllergenStatus = 'contiene' | 'posible'

export interface DishAllergen {
  key: AllergenKey
  status: AllergenStatus
  /** Especie o cereal/fruto concreto conforme al Anexo II del Reglamento (UE) 1169/2011 (ej. 'trigo', 'avena', 'cebada', 'avellana', 'nuez') */
  detail?: string
}

export interface AllergenMeta {
  code: string
  icon: string
  iconSrc: string
  name: string
  legalName: string
  desc: string
}

/**
 * 14 grupos de alérgenos de declaración obligatoria
 * Reglamento (UE) 1169/2011 (Anexo II) · Real Decreto 126/2015 · Guía AESAN
 * Iconografía oficial del Sistema de Diseño Bar Los Rombos (/allergens/*.png)
 */
export const allergenInfo: Record<AllergenKey, AllergenMeta> = {
  gluten: {
    code: 'G',
    icon: '🌾',
    iconSrc: '/allergens/gluten.png',
    name: 'Gluten',
    legalName: 'Cereales que contienen gluten',
    desc: 'Trigo, centeno, cebada, avena e híbridos (se indica el cereal concreto en cada plato).',
  },
  crustaceos: {
    code: 'CR',
    icon: '🦀',
    iconSrc: '/allergens/crustaceos.png',
    name: 'Crustáceos',
    legalName: 'Crustáceos y productos a base de crustáceos',
    desc: 'Gambas, langostinos, cangrejos y posibles rellenos de marisco.',
  },
  huevo: {
    code: 'H',
    icon: '🥚',
    iconSrc: '/allergens/huevo.png',
    name: 'Huevos',
    legalName: 'Huevos y productos a base de huevo',
    desc: 'Huevo, yema, mayonesa, alioli con huevo y ciertos rebozados o empanados.',
  },
  pescado: {
    code: 'PZ',
    icon: '🐟',
    iconSrc: '/allergens/pescado.png',
    name: 'Pescado',
    legalName: 'Pescado y productos a base de pescado',
    desc: 'Salmón, atún, anchoas y salsas que los incorporen (ej. salsa Worcestershire/Perrins).',
  },
  cacahuetes: {
    code: 'CA',
    icon: '🥜',
    iconSrc: '/allergens/cacahuetes.png',
    name: 'Cacahuetes',
    legalName: 'Cacahuetes y productos a base de cacahuetes',
    desc: 'Cacahuete, crema o aceite de cacahuete (grupo propio, distinto de frutos de cáscara).',
  },
  soja: {
    code: 'SO',
    icon: '🫘',
    iconSrc: '/allergens/soja.png',
    name: 'Soja',
    legalName: 'Soja y productos a base de soja',
    desc: 'Proteínas o lecitina de soja (ej. cremas de cacao, emulgentes, marinados).',
  },
  lacteos: {
    code: 'L',
    icon: '🥛',
    iconSrc: '/allergens/lacteos.png',
    name: 'Lácteos',
    legalName: 'Leche y sus derivados (incluida la lactosa)',
    desc: 'Leche, queso, nata, mantequilla, yogur, suero lácteo y proteínas de la leche.',
  },
  frutos: {
    code: 'FC',
    icon: '🌰',
    iconSrc: '/allergens/frutos.png',
    name: 'Frutos de cáscara',
    legalName: 'Frutos de cáscara',
    desc: 'Almendra, avellana, nuez, anacardo, pacana, nuez de Brasil, pistacho o macadamia.',
  },
  apio: {
    code: 'AP',
    icon: '🥬',
    iconSrc: '/allergens/apio.png',
    name: 'Apio',
    legalName: 'Apio y productos derivados',
    desc: 'Apio fresco, caldos concentrados, mezclas de especias y determinadas salsas.',
  },
  mostaza: {
    code: 'MO',
    icon: '🟡',
    iconSrc: '/allergens/mostaza.png',
    name: 'Mostaza',
    legalName: 'Mostaza y productos derivados',
    desc: 'Semillas de mostaza, mostaza preparada y salsas compuestas que la incorporen.',
  },
  sesamo: {
    code: 'SE',
    icon: '⚪',
    iconSrc: '/allergens/sesamo.png',
    name: 'Sésamo',
    legalName: 'Granos de sésamo y productos a base de granos de sésamo',
    desc: 'Semillas de sésamo en panes de hamburguesa, tostadas, tahini o condimentos.',
  },
  sulfitos: {
    code: 'SU',
    icon: '🍷',
    iconSrc: '/allergens/sulfitos.png',
    name: 'Sulfitos',
    legalName: 'Dióxido de azufre y sulfitos',
    desc: 'Presentes en vinos de cocción, vinagres (Módena), embutidos o conservantes (>10 mg/kg o mg/l SO₂).',
  },
  altramuces: {
    code: 'AL',
    icon: '🌼',
    iconSrc: '/allergens/altramuces.png',
    name: 'Altramuces',
    legalName: 'Altramuces y productos a base de altramuces',
    desc: 'Harinas de altramuz o ingredientes de panificación y bollería si se incorporan.',
  },
  moluscos: {
    code: 'ML',
    icon: '🐚',
    iconSrc: '/allergens/moluscos.png',
    name: 'Moluscos',
    legalName: 'Moluscos y productos a base de moluscos',
    desc: 'Calamar, pota, sepia, mejillón (grupo propio, distinto de crustáceos y pescado).',
  },
}

export const allergenKeys = Object.keys(allergenInfo) as AllergenKey[]

export function formatAllergenLabel(item: DishAllergen): string {
  const base = allergenInfo[item.key].name
  return item.detail ? `${base} (${item.detail})` : base
}
