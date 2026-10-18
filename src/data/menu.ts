import type { AllergenKey, DishAllergen } from './allergens'

export type CategoryKey =
  | 'internacionales'
  | 'tostadas'
  | 'tortillas'
  | 'sandwiches'
  | 'bolleria'
  | 'raciones'
  | 'sartenes'
  | 'ensaladas'
  | 'bocadillos'
  | 'hamburguesas'
  | 'platos_combinados'
  | 'plato_especial'
  | 'tablas'
  | 'postres'
  | 'extras'

export interface MenuItem {
  id: number
  code: string
  reportCode: string
  name: string
  category: CategoryKey
  price: number
  description: string
  allergens: DishAllergen[]
  /** Indica que el plato muestra el distintivo '?' (Consulte al personal) según la carta oficial y el RD 126/2015 */
  consultePersonal: boolean
  /** Nota técnica específica extraída del Informe Preliminar de Ingredientes y Alérgenos de Bar Los Rombos */
  consulteNote: string
  image: string
}

export const categories: { key: CategoryKey | 'todos'; label: string; block?: 'desayunos' | 'comidas' }[] = [
  { key: 'todos', label: 'TODOS' },
  { key: 'internacionales', label: 'INTERNACIONALES', block: 'desayunos' },
  { key: 'tostadas', label: 'TOSTADAS', block: 'desayunos' },
  { key: 'tortillas', label: 'TORTILLAS', block: 'desayunos' },
  { key: 'sandwiches', label: 'SÁNDWICHES', block: 'desayunos' },
  { key: 'bolleria', label: 'BOLLERÍA', block: 'desayunos' },
  { key: 'raciones', label: 'RACIONES', block: 'comidas' },
  { key: 'sartenes', label: 'SARTENES', block: 'comidas' },
  { key: 'ensaladas', label: 'ENSALADAS', block: 'comidas' },
  { key: 'bocadillos', label: 'BOCADILLOS', block: 'comidas' },
  { key: 'hamburguesas', label: 'HAMBURGUESAS', block: 'comidas' },
  { key: 'platos_combinados', label: 'PLATOS COMBINADOS', block: 'comidas' },
  { key: 'plato_especial', label: 'PLATO ESPECIAL', block: 'comidas' },
  { key: 'tablas', label: 'TABLAS', block: 'comidas' },
  { key: 'postres', label: 'POSTRES', block: 'comidas' },
  { key: 'extras', label: 'EXTRAS', block: 'comidas' },
]

export const categoryNotes: Partial<Record<CategoryKey, string>> = {
  sartenes: 'Todas con patatas y dos huevos',
  platos_combinados: 'Todos los platos combinados incluyen 1 huevo frito, patatas y ensalada',
  plato_especial: 'Todos vienen con pimientos, patatas o ensalada',
}

export function priceLabel(price: number): string {
  return price > 0 ? `${price.toFixed(2).replace('.', ',')} €` : '— €'
}

export function categoryLabel(key: CategoryKey): string {
  const cat = categories.find((c) => c.key === key)
  return cat ? cat.label : ''
}

const ALLERGEN_NOTE_PATTERNS: Record<AllergenKey, RegExp> = {
  gluten: /\b(gluten|trigo|cebada|centeno|avena|espelta|pan|tostada|rebozad[oa]|empanad[oa]|harina)\b/i,
  crustaceos: /\b(crust[aá]ceos?|gambas?|langostinos?|mariscos?)\b/i,
  huevo: /\b(huevos?|mayonesa|alioli)\b/i,
  pescado: /\b(pescados?|at[uú]n|bonito|anchoas?|bacalao)\b/i,
  cacahuetes: /\b(cacahuetes?|man[ií])\b/i,
  soja: /\b(soja)\b/i,
  lacteos: /\b(l[aá]cteos?|leche|quesos?|mantequilla|nata|yogur|lactosa)\b/i,
  frutos: /\b(frutos? de c[aá]scara|nueces|nuez|avellanas?|almendras?|pistachos?|anacardos?)\b/i,
  apio: /\b(apio)\b/i,
  mostaza: /\b(mostaza)\b/i,
  sesamo: /\b(s[eé]samo|ajonjol[ií])\b/i,
  sulfitos: /\b(sulfitos?|vinagre|vino)\b/i,
  altramuces: /\b(altramuces?)\b/i,
  moluscos: /\b(moluscos?|calamares?|calamar|rabas?|pota|sepia|chipirones?|mejillones?|pulpo)\b/i,
}

export function dishConsultMentionsAllergen(item: MenuItem, allergen: AllergenKey): boolean {
  if (!item.consultePersonal || !item.consulteNote) return false
  return ALLERGEN_NOTE_PATTERNS[allergen].test(item.consulteNote)
}

export function dishHasAllergen(
  item: MenuItem,
  allergen: AllergenKey,
  includePosible = true
): boolean {
  const inDeclared = item.allergens.some(
    (a) => a.key === allergen && (includePosible || a.status === 'contiene')
  )
  if (inDeclared) return true
  if (includePosible && dishConsultMentionsAllergen(item, allergen)) {
    return true
  }
  return false
}

// Todos los 64 ítems oficiales de la carta, organizados por categoría y de menor a mayor precio dentro de cada categoría
const rawMenuItems: MenuItem[] = [
  // ── DESAYUNOS: INTERNACIONALES (3,90 € → 4,90 €) ──
  {
    id: 1,
    code: 'lr-01',
    reportCode: 'A03',
    name: 'Desayuno Francés',
    category: 'internacionales',
    price: 3.9,
    description: 'Tortilla francesa jugosa recién hecha',
    allergens: [
      { key: 'huevo', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Receta base con huevo batido. Consultar al personal si se elabora con mantequilla, leche o queso, o si se acompaña de pan.',
    image: '/carta/lr-01_INTERNACIONALES_FRANCES.jpg',
  },
  {
    id: 2,
    code: 'lr-02',
    reportCode: 'A01',
    name: 'Desayuno Americano',
    category: 'internacionales',
    price: 4.9,
    description: 'Bacon, huevos y salchicha',
    allergens: [
      { key: 'huevo', status: 'contiene' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene huevo confirmado. Consultar ficha de la salchicha y del bacon (posibles trazas o ingredientes de leche, soja, gluten, mostaza o sulfitos) y pan si se añade tostada.',
    image: '/carta/lr-02_INTERNACIONALES_AMERICANO.jpg',
  },
  {
    id: 3,
    code: 'lr-03',
    reportCode: 'A02',
    name: 'Desayuno Griego',
    category: 'internacionales',
    price: 4.9,
    description: 'Yogur, fresas y avena',
    allergens: [
      { key: 'gluten', status: 'contiene', detail: 'avena' },
      { key: 'lacteos', status: 'contiene' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene leche (yogur lácteo) y cereales con gluten (avena). Consultar posibles frutos de cáscara, cacahuete o sésamo si se añade granola o topping.',
    image: '/carta/lr-03_INTERNACIONALES_GRIEGO.jpg',
  },

  // ── DESAYUNOS: TOSTADAS (3,00 € → 4,50 €) ──
  {
    id: 4,
    code: 'lr-04',
    reportCode: 'A04',
    name: 'Tostada con aceite',
    category: 'tostadas',
    price: 3.0,
    description: 'Pan tostado y aceite de oliva virgen extra',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Pan habitual de trigo. Consultar ficha del pan servido (posibles trazas de sésamo, soja o leche en panificación y uso de tostador compartido).',
    image: '/carta/lr-04_TOSTADAS_TOSTADA_CON_ACEITE.jpg',
  },
  {
    id: 5,
    code: 'lr-05',
    reportCode: 'A05',
    name: 'Tostada + mermelada',
    category: 'tostadas',
    price: 3.5,
    description: 'Pan tostado con mermelada',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Pan habitual de trigo. Consultar si se sirve con mantequilla (lácteos) y ficha de la mermelada.',
    image: '/carta/lr-05_TOSTADAS_TOSTADA_MERMELADA.jpg',
  },
  {
    id: 6,
    code: 'lr-06',
    reportCode: 'A07',
    name: 'Tostada con Nutella',
    category: 'tostadas',
    price: 3.5,
    description: 'Pan tostado con crema de cacao y avellanas Nutella',
    allergens: [
      { key: 'soja', status: 'contiene' },
      { key: 'lacteos', status: 'contiene' },
      { key: 'frutos', status: 'contiene', detail: 'avellana' },
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Nutella clásica incorpora avellanas (frutos de cáscara), leche desnatada en polvo (lácteos) y lecitina de soja. Pan habitual de trigo.',
    image: '/carta/lr-06_TOSTADAS_TOSTADA_CON_NUTELLA.jpg',
  },
  {
    id: 7,
    code: 'lr-07',
    reportCode: 'A08',
    name: 'Tostada con tomate',
    category: 'tostadas',
    price: 3.5,
    description: 'Pan tostado con tomate natural y aceite de oliva',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Pan habitual de trigo con tomate natural y aceite de oliva. Consultar ficha del pan y uso de tostador compartido.',
    image: '/carta/lr-07_TOSTADAS_TOSTADA_CON_TOMATE.jpg',
  },
  {
    id: 8,
    code: 'lr-08',
    reportCode: 'A06',
    name: 'Tostada con tomate y jamón serrano',
    category: 'tostadas',
    price: 4.5,
    description: 'Pan tostado, tomate natural y jamón serrano',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Pan habitual de trigo con tomate y jamón serrano. Consultar ficha del pan y etiqueta del jamón.',
    image: '/carta/lr-08_TOSTADAS_TOSTADA_CON_TOMATE_Y_JAMON_SERRANO.jpg',
  },
  {
    id: 9,
    code: 'lr-09',
    reportCode: 'A09',
    name: 'Tostada de aguacate con salmón',
    category: 'tostadas',
    price: 4.5,
    description: 'Pan tostado, aguacate y salmón ahumado',
    allergens: [
      { key: 'pescado', status: 'contiene' },
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene pescado (salmón) y pan habitual de trigo. Consultar si lleva queso crema (lácteos), huevo o semillas de sésamo.',
    image: '/carta/lr-09_TOSTADAS_TOSTADA_DE_AGUACATE_CON_SALMON.jpg',
  },

  // ── DESAYUNOS: TORTILLAS (3,80 €) ──
  {
    id: 10,
    code: 'lr-10',
    reportCode: 'A10',
    name: 'Tortilla de patatas',
    category: 'tortillas',
    price: 3.8,
    description: 'Pincho de tortilla de patatas tradicional',
    allergens: [
      { key: 'huevo', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Receta tradicional con patata y huevo. Consultar si se acompaña de pan (gluten) o alioli/mayonesa.',
    image: '/carta/lr-10_TORTILLAS_TORTILLA_DE_PATATAS.jpg',
  },

  // ── DESAYUNOS: SÁNDWICHES (3,80 € → 4,20 €) ──
  {
    id: 11,
    code: 'lr-11',
    reportCode: 'A11',
    name: 'Sándwich mixto',
    category: 'sandwiches',
    price: 3.8,
    description: 'Jamón York, queso y mantequilla en pan de molde',
    allergens: [
      { key: 'lacteos', status: 'contiene' },
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene lácteos (queso y mantequilla) y pan de molde habitual de trigo. Consultar posibles trazas de soja, huevo o sésamo en pan de molde y ficha del jamón York.',
    image: '/carta/lr-11_SANDWICHES_SANDWICH_MIXTO.jpg',
  },
  {
    id: 12,
    code: 'lr-12',
    reportCode: 'A13',
    name: 'Sándwich vegetal',
    category: 'sandwiches',
    price: 4.0,
    description: 'Vegetales, tomate, lechuga y cebolla en pan de molde',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Pan de molde habitual de trigo. Consultar en cocina si incorpora mayonesa/huevo cocido (huevos), atún (pescado) o mostaza en salsa.',
    image: '/carta/lr-12_SANDWICHES_SANDWICH_VEGETAL.jpg',
  },
  {
    id: 13,
    code: 'lr-13',
    reportCode: 'A12',
    name: 'Sándwich bacon',
    category: 'sandwiches',
    price: 4.2,
    description: 'Bacon y huevo en pan de molde a la plancha',
    allergens: [
      { key: 'huevo', status: 'contiene' },
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene huevo y pan de molde habitual de trigo. Consultar si incluye queso o mantequilla (lácteos) o salsas.',
    image: '/carta/lr-13_SANDWICHES_SANDWICH_BACON.jpg',
  },

  // ── DESAYUNOS: BOLLERÍA (3,00 € → 4,00 €) ──
  {
    id: 14,
    code: 'lr-14',
    reportCode: 'A14',
    name: 'Bizcocho casero',
    category: 'bolleria',
    price: 3.0,
    description: 'Porción de bizcocho casero esponjoso',
    allergens: [
      { key: 'gluten', status: 'contiene', detail: 'trigo' },
      { key: 'huevo', status: 'posible' },
      { key: 'lacteos', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Elaborado con harina de trigo (gluten). Probable presencia de huevo y lácteos (yogur/leche/mantequilla). Consultar posibles frutos de cáscara o soja según receta del día.',
    image: '/carta/lr-14_BOLLERIA_BIZCOCHO_CASERO.jpg',
  },
  {
    id: 15,
    code: 'lr-15',
    reportCode: 'A15',
    name: 'Croissant',
    category: 'bolleria',
    price: 3.0,
    description: 'Croissant hojaldrado recién horneado',
    allergens: [
      { key: 'gluten', status: 'contiene', detail: 'trigo' },
      { key: 'huevo', status: 'posible' },
      { key: 'lacteos', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene harina de trigo (gluten). Probable presencia de mantequilla/leche (lácteos) y huevo en masa o barnizado, además de posible soja en masa hojaldrada.',
    image: '/carta/lr-15_BOLLERIA_CROISSANT.jpg',
  },
  {
    id: 16,
    code: 'lr-16',
    reportCode: 'A16',
    name: 'Croissant jamón y queso',
    category: 'bolleria',
    price: 4.0,
    description: 'Croissant relleno de jamón y queso fundido',
    allergens: [
      { key: 'gluten', status: 'contiene', detail: 'trigo' },
      { key: 'lacteos', status: 'contiene' },
      { key: 'huevo', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene trigo (gluten) y queso (lácteos). Probable huevo en el acabado del croissant; consultar ficha del jamón cocido.',
    image: '/carta/lr-16_BOLLERIA_CROISSANT_JAMON_Y_QUESO.jpg',
  },

  // ── COMIDAS: RACIONES (3,00 € → 9,50 € + Consultar) ──
  {
    id: 17,
    code: 'lr-17',
    reportCode: 'B10',
    name: 'Croquetas',
    category: 'raciones',
    price: 3.0,
    description: 'Por unidad · Croquetas cremosas doradas',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
      { key: 'huevo', status: 'posible' },
      { key: 'lacteos', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Base habitual de bechamel (leche y harina de trigo) y empanado (huevo y pan rallado). Imprescindible consultar el sabor/relleno del día (posible pescado, crustáceos, moluscos, apio o soja).',
    image: '/carta/lr-17_RACIONES_CROQUETAS.jpg',
  },
  {
    id: 18,
    code: 'lr-18',
    reportCode: 'B11',
    name: 'Torrezno',
    category: 'raciones',
    price: 3.5,
    description: 'Panceta de cerdo tradicional crujiente',
    allergens: [],
    consultePersonal: true,
    consulteNote: 'Panceta de cerdo curada/adobada sin alérgenos directos en su receta base. Consultar ficha del adobo comercial y tener en cuenta el uso de freidora compartida en cocina.',
    image: '/carta/lr-18_RACIONES_TORREZNO.jpg',
  },
  {
    id: 19,
    code: 'lr-19',
    reportCode: 'B04',
    name: 'Fingers',
    category: 'raciones',
    price: 4.5,
    description: 'Tiras de pollo empanadas y crujientes',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
      { key: 'huevo', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Empanado habitual con harina/pan rallado de trigo y huevo. Consultar posibles lácteos en marinado, soja en empanado y mostaza/huevo en salsa de acompañamiento.',
    image: '/carta/lr-19_RACIONES_FINGERS.jpg',
  },
  {
    id: 20,
    code: 'lr-20',
    reportCode: 'B06',
    name: 'Patatas con bacon y queso cheddar',
    category: 'raciones',
    price: 4.5,
    description: 'Patatas fritas con bacon y queso cheddar fundido',
    allergens: [
      { key: 'lacteos', status: 'contiene' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene lácteos (queso cheddar). Consultar si incluye salsa adicional (posible huevo/mostaza), recubrimiento de patatas (gluten) y uso de freidora compartida.',
    image: '/carta/lr-20_RACIONES_PATATAS_CON_BACON_Y_QUESO_CHEDDAR.jpg',
  },
  {
    id: 21,
    code: 'lr-21',
    reportCode: 'B08',
    name: 'Lacón con patatas',
    category: 'raciones',
    price: 4.5,
    description: 'Con pimentón y aceite de oliva',
    allergens: [],
    consultePersonal: true,
    consulteNote: 'Receta tradicional con lacón cocido, patata, pimentón y aceite de oliva. Consultar etiqueta del proveedor de lacón por posibles derivados lácteos, soja o sulfitos.',
    image: '/carta/lr-21_RACIONES_LACON_CON_PATATAS.jpg',
  },
  {
    id: 22,
    code: 'lr-22',
    reportCode: 'B09',
    name: 'Morcilla',
    category: 'raciones',
    price: 5.0,
    description: 'Ración de morcilla dorada',
    allergens: [],
    consultePersonal: true,
    consulteNote: 'Variedad tradicional de arroz/cebolla sin gluten directo. Consultar con el personal si la variedad servida incorpora pan o si se enharina antes de freír (gluten).',
    image: '/carta/lr-22_RACIONES_MORCILLA.jpg',
  },
  {
    id: 23,
    code: 'lr-23',
    reportCode: 'B05',
    name: 'Patatas bravas / Alioli',
    category: 'raciones',
    price: 5.5,
    description: 'Patatas fritas a elegir con salsa brava o salsa alioli',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
      { key: 'huevo', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Dos opciones de salsa: la salsa brava puede contener harina de trigo (gluten) o caldo con apio; el alioli contiene huevo (salvo ajoaceite o lactonesa). Consultar salsa elegida y freidora compartida.',
    image: '/carta/lr-23_RACIONES_PATATAS_BRAVAS_ALIOLI.jpg',
  },
  {
    id: 24,
    code: 'lr-24',
    reportCode: 'B07',
    name: 'Salchipapas',
    category: 'raciones',
    price: 5.5,
    description: 'Patatas, salchichas y salsa',
    allergens: [
      { key: 'huevo', status: 'posible' },
      { key: 'mostaza', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Posible presencia de huevo y mostaza según las salsas servidas. Consultar ficha de la salchicha (posibles trazas de leche, soja o sulfitos) y uso de freidora compartida.',
    image: '/carta/lr-24_RACIONES_SALCHIPAPAS.jpg',
  },
  {
    id: 25,
    code: 'lr-25',
    reportCode: 'B01',
    name: 'Alitas',
    category: 'raciones',
    price: 7.5,
    description: 'Ración de alitas de pollo doradas',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Posible enharinado con trigo (gluten). Consultar si llevan adobo o marinado con soja, mostaza, lácteos o sulfitos y uso de freidora compartida.',
    image: '/carta/lr-25_RACIONES_ALITAS.jpg',
  },
  {
    id: 26,
    code: 'lr-26',
    reportCode: 'B02',
    name: 'Calamares',
    category: 'raciones',
    price: 9.5,
    description: 'Anillas de calamar fritas con limón',
    allergens: [
      { key: 'moluscos', status: 'contiene' },
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene moluscos (calamar) y rebozado habitual con harina de trigo (gluten). Consultar si el rebozado a la romana incorpora huevo o leche y si se acompaña de mayonesa.',
    image: '/carta/lr-26_RACIONES_CALAMARES.jpg',
  },
  {
    id: 27,
    code: 'lr-27',
    reportCode: 'B03',
    name: 'Rabas',
    category: 'raciones',
    price: 0,
    description: 'Tiras de calamar rebozadas y fritas',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
      { key: 'moluscos', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Elaboradas con calamar/pota (moluscos) y harina habitual de trigo (gluten). Consultar si llevan huevo en el rebozado o remojo previo en leche (lácteos).',
    image: '/carta/lr-27_RACIONES_RABAS.jpg',
  },

  // ── COMIDAS: SARTENES (5,50 € → 8,50 €) ──
  {
    id: 29,
    code: 'lr-29',
    reportCode: 'H01',
    name: 'Sartén de huevos con patatas',
    category: 'sartenes',
    price: 5.5,
    description: 'Patatas fritas con dos huevos',
    allergens: [
      { key: 'huevo', status: 'contiene' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene dos huevos. Consultar contacto cruzado en freidora de patatas y pan si se sirve como acompañamiento.',
    image: '/carta/lr-29_SARTENES_HUEVOS_CON_PATATAS.jpg',
  },
  {
    id: 30,
    code: 'lr-30',
    reportCode: 'H02-S',
    name: 'Sartén con salchichas',
    category: 'sartenes',
    price: 7.0,
    description: 'Patatas, dos huevos y salchichas',
    allergens: [
      { key: 'huevo', status: 'contiene' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene dos huevos. Consultar ficha de las salchichas (posibles trazas o ingredientes de leche, soja, gluten o sulfitos) y uso de freidora compartida.',
    image: '/carta/lr-30_SARTENES_CON_SALCHICHAS.jpg',
  },
  {
    id: 31,
    code: 'lr-31',
    reportCode: 'H03',
    name: 'Sartén con bacon',
    category: 'sartenes',
    price: 7.5,
    description: 'Patatas, dos huevos y bacon dorado',
    allergens: [
      { key: 'huevo', status: 'contiene' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene dos huevos. Consultar etiqueta del bacon preparado (posibles trazas de lactosa/proteína de leche o soja) y contacto cruzado en freidora.',
    image: '/carta/lr-31_SARTENES_CON_BACON.jpg',
  },
  {
    id: 32,
    code: 'lr-32',
    reportCode: 'H03-T',
    name: 'Sartén con torrezno',
    category: 'sartenes',
    price: 7.5,
    description: 'Patatas, dos huevos y torrezno crujiente',
    allergens: [
      { key: 'huevo', status: 'contiene' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene dos huevos. Consultar adobo del torrezno y uso de freidora compartida.',
    image: '/carta/lr-32_SARTENES_CON_TORREZNO.jpg',
  },
  {
    id: 33,
    code: 'lr-33',
    reportCode: 'H02',
    name: 'Sartén con lacón',
    category: 'sartenes',
    price: 8.0,
    description: 'Patatas, dos huevos y lacón',
    allergens: [
      { key: 'huevo', status: 'contiene' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene dos huevos. Consultar etiqueta del lacón utilizado y contacto cruzado en freidora.',
    image: '/carta/lr-33_SARTENES_CON_LACON.jpg',
  },
  {
    id: 34,
    code: 'lr-34',
    reportCode: 'H05',
    name: 'Sartén con morcilla',
    category: 'sartenes',
    price: 8.0,
    description: 'Patatas, dos huevos y morcilla',
    allergens: [
      { key: 'huevo', status: 'contiene' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene dos huevos. Consultar variedad y etiqueta de la morcilla (posible pan/harina con gluten según fabricante) y uso de freidora compartida.',
    image: '/carta/lr-34_SARTENES_CON_MORCILLA.jpg',
  },
  {
    id: 35,
    code: 'lr-35',
    reportCode: 'H06',
    name: 'Sartén con picadillo',
    category: 'sartenes',
    price: 8.0,
    description: 'Patatas, dos huevos y picadillo adobado',
    allergens: [
      { key: 'huevo', status: 'contiene' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene dos huevos. Consultar ficha del picadillo de chorizo (posibles sulfitos por vino/conservantes o derivados de leche/soja según proveedor).',
    image: '/carta/lr-35_SARTENES_CON_PICADILLO.jpg',
  },
  {
    id: 36,
    code: 'lr-36',
    reportCode: 'H04',
    name: 'Sartén con jamón',
    category: 'sartenes',
    price: 8.5,
    description: 'Patatas, dos huevos y jamón serrano',
    allergens: [
      { key: 'huevo', status: 'contiene' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene dos huevos y jamón curado. Consultar ficha del jamón y contacto cruzado de fritura.',
    image: '/carta/lr-36_SARTENES_CON_JAMON.jpg',
  },

  // ── COMIDAS: ENSALADAS (7,50 € → 9,50 €) ──
  {
    id: 37,
    code: 'lr-37',
    reportCode: 'F01',
    name: 'Ensalada Clásica',
    category: 'ensaladas',
    price: 7.5,
    description: 'Lechuga, tomate y cebolla',
    allergens: [],
    consultePersonal: true,
    consulteNote: 'Base vegetal de lechuga, tomate y cebolla. Consultar con el personal el aliño (posibles sulfitos en vinagre) o si se sirve variante con atún (pescado), huevo o mayonesa.',
    image: '/carta/lr-37_ENSALADAS_CLASICA.jpg',
  },
  {
    id: 38,
    code: 'lr-38',
    reportCode: 'F02',
    name: 'Ensalada César',
    category: 'ensaladas',
    price: 9.5,
    description: 'Lechuga romana, pollo, queso Parmesano, picatostes y salsa César',
    allergens: [
      { key: 'huevo', status: 'contiene' },
      { key: 'lacteos', status: 'contiene' },
      { key: 'gluten', status: 'posible', detail: 'trigo y cebada' },
      { key: 'pescado', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene lácteos (queso Parmesano) y huevo (yema/salsa). Probable gluten (trigo en picatostes y cebada en salsa Perrins) y pescado (anchoa en salsa César/Perrins); consultar mostaza y sulfitos.',
    image: '/carta/lr-38_ENSALADAS_CESAR.jpg',
  },
  {
    id: 39,
    code: 'lr-39',
    reportCode: 'F03',
    name: 'Ensalada Mixta',
    category: 'ensaladas',
    price: 9.5,
    description: 'Lechuga, tomate, cebolla, atún, huevo cocido y espárragos',
    allergens: [
      { key: 'huevo', status: 'posible' },
      { key: 'pescado', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Incluye habitualmente huevo cocido y atún (pescado). Consultar con el personal el aliño (posibles sulfitos en vinagre o mostaza en vinagreta).',
    image: '/carta/lr-39_ENSALADAS_MIXTA.jpg',
  },
  {
    id: 40,
    code: 'lr-40',
    reportCode: 'F04',
    name: 'Ensalada Queso de cabra',
    category: 'ensaladas',
    price: 9.5,
    description: 'Lechuga, tomate, cebolla, queso de cabra, nueces y vinagre de Módena',
    allergens: [
      { key: 'lacteos', status: 'contiene' },
      { key: 'frutos', status: 'contiene', detail: 'nuez' },
      { key: 'sulfitos', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene leche (queso de cabra) y frutos de cáscara (nueces). Posibles sulfitos en el vinagre o crema balsámica de Módena; consultar si el queso de cabra se pasa por harina/plancha.',
    image: '/carta/lr-40_ENSALADAS_QUESO_DE_CABRA.jpg',
  },

  // ── COMIDAS: BOCADILLOS (5,80 € → 8,50 €, ordenados de menor a mayor) ──
  {
    id: 41,
    code: 'lr-41',
    reportCode: 'C06',
    name: 'Bocadillo de Bacon y queso',
    category: 'bocadillos',
    price: 5.8,
    description: 'Bacon a la plancha y queso fundido',
    allergens: [
      { key: 'lacteos', status: 'contiene' },
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene lácteos (queso) y pan habitual de barra de trigo (gluten). Consultar ficha del pan, del bacon y si se añade alguna salsa (posible huevo/mostaza).',
    image: '/carta/lr-41_BOCADILLOS_BACON_Y_QUESO.jpg',
  },
  {
    id: 42,
    code: 'lr-42',
    reportCode: 'C08',
    name: 'Bocadillo de Rabas',
    category: 'bocadillos',
    price: 7.0,
    description: 'Rabas crujientes en pan de barra',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
      { key: 'moluscos', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Pan de trigo y rabas de calamar/pota (moluscos) rebozadas. Consultar si el rebozado o la salsa incorporan huevo o leche.',
    image: '/carta/lr-42_BOCADILLOS_RABAS.jpg',
  },
  {
    id: 43,
    code: 'lr-43',
    reportCode: 'C09',
    name: 'Bocadillo Vegetal',
    category: 'bocadillos',
    price: 7.0,
    description: 'Con atún, huevo duro, jamón York, tomate y lechuga',
    allergens: [
      { key: 'huevo', status: 'contiene' },
      { key: 'pescado', status: 'contiene' },
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene pescado (atún) y huevo duro en pan de trigo. Consultar ficha del jamón York (posibles trazas de leche/soja) y si incluye mayonesa o mostaza.',
    image: '/carta/lr-43_BOCADILLOS_VEGETAL.jpg',
  },
  {
    id: 44,
    code: 'lr-44',
    reportCode: 'C04',
    name: 'Bocadillo de Lomo',
    category: 'bocadillos',
    price: 7.5,
    description: 'Con queso y pimiento',
    allergens: [
      { key: 'lacteos', status: 'contiene' },
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene lácteos (queso) y pan habitual de trigo (gluten). Consultar si el lomo es fresco o adobado (posibles aditivos/sulfitos).',
    image: '/carta/lr-44_BOCADILLOS_LOMO.jpg',
  },
  {
    id: 45,
    code: 'lr-45',
    reportCode: 'C05',
    name: 'Bocadillo de Solomillo con Roquefort',
    category: 'bocadillos',
    price: 7.5,
    description: 'Solomillo a la plancha con salsa de queso Roquefort',
    allergens: [
      { key: 'lacteos', status: 'contiene' },
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene lácteos (queso Roquefort/nata) y pan habitual de trigo. Consultar si la salsa Roquefort incorpora vino (sulfitos), espesante con trigo o caldo con apio.',
    image: '/carta/lr-45_BOCADILLOS_SOLOMILLO_CON_ROQUEFORT.jpg',
  },
  {
    id: 46,
    code: 'lr-46',
    reportCode: 'C07',
    name: 'Bocadillo de Calamares',
    category: 'bocadillos',
    price: 7.5,
    description: 'Anillas de calamar fritas en pan de barra',
    allergens: [
      { key: 'moluscos', status: 'contiene' },
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene moluscos (calamares) y pan/rebozado de trigo (gluten). Consultar si lleva huevo en el rebozado a la romana o mayonesa y leche en el remojo.',
    image: '/carta/lr-46_BOCADILLOS_CALAMARES.jpg',
  },
  {
    id: 47,
    code: 'lr-47',
    reportCode: 'C03',
    name: 'Bocadillo de Pechuga de pollo a la plancha',
    category: 'bocadillos',
    price: 7.5,
    description: 'Con tomate y lechuga',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Pechuga de pollo a la plancha en pan habitual de trigo (gluten). Consultar si se añade mayonesa (huevo/mostaza) o mantequilla (lácteos).',
    image: '/carta/lr-47_BOCADILLOS_PECHUGA_DE_POLLO_A_LA_PLANCHA.jpg',
  },
  {
    id: 48,
    code: 'lr-48',
    reportCode: 'C02',
    name: 'Bocadillo de Pechuga de pollo empanada',
    category: 'bocadillos',
    price: 7.8,
    description: 'Con tomate y lechuga',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
      { key: 'huevo', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Pan de trigo y pechuga empanada con pan rallado (gluten) y huevo. Consultar posibles lácteos en marinado y si incluye mayonesa o salsas.',
    image: '/carta/lr-48_BOCADILLOS_PECHUGA_DE_POLLO_EMPANADA.jpg',
  },
  {
    id: 49,
    code: 'lr-49',
    reportCode: 'C01',
    name: 'Bocadillo de Ternera',
    category: 'bocadillos',
    price: 7.8,
    description: 'Con pimiento y queso',
    allergens: [
      { key: 'lacteos', status: 'contiene' },
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene lácteos (queso) y pan de barra habitual de trigo (gluten). Consultar ficha del pan y si se añade alguna salsa.',
    image: '/carta/lr-49_BOCADILLOS_TERNERA.jpg',
  },
  {
    id: 50,
    code: 'lr-50',
    reportCode: 'C10',
    name: 'Bocadillo Los Rombos',
    category: 'bocadillos',
    price: 8.5,
    description: 'Especial de la casa · Extras: huevo, queso y bacon',
    allergens: [
      { key: 'huevo', status: 'contiene' },
      { key: 'lacteos', status: 'contiene' },
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Incluye huevo y queso (lácteos) en su configuración completa con pan de trigo (gluten). Consultar ingredientes exactos según extras seleccionados y salsas.',
    image: '/carta/lr-50_BOCADILLOS_LOS_ROMBOS.jpg',
  },

  // ── COMIDAS: HAMBURGUESAS (7,50 € → 8,50 €) ──
  {
    id: 51,
    code: 'lr-51',
    reportCode: 'G01',
    name: 'Hamburguesa Clásica',
    category: 'hamburguesas',
    price: 7.5,
    description: 'Ternera y pollo · Lechuga, tomate, cebolla y queso',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
      { key: 'lacteos', status: 'posible' },
      { key: 'sesamo', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Pan de hamburguesa de trigo (posible sésamo y trazas de leche/huevo). Consultar ficha del preparado de carne (ternera o pollo, posibles sulfitos/soja), queso (lácteos) y salsas (huevo/mostaza).',
    image: '/carta/lr-51_HAMBURGUESAS_HAMBURGUESA_CLASICA.jpg',
  },
  {
    id: 52,
    code: 'lr-52',
    reportCode: 'G02',
    name: 'Hamburguesa Los Rombos',
    category: 'hamburguesas',
    price: 8.5,
    description: 'Ternera y pollo · Completa al estilo Los Rombos',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
      { key: 'huevo', status: 'posible' },
      { key: 'lacteos', status: 'posible' },
      { key: 'sesamo', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Pan de hamburguesa de trigo (posible sésamo). Consultar ingredientes según carne elegida (ternera o pollo), queso (lácteos), huevo, bacon y salsas (mostaza/soja/huevo).',
    image: '/carta/lr-52_HAMBURGUESAS_HAMBURGUESA_LOS_ROMBOS.jpg',
  },

  // ── COMIDAS: PLATOS COMBINADOS (8,50 € → 10,50 €) ──
  {
    id: 53,
    code: 'lr-53',
    reportCode: 'E05',
    name: 'Plato combinado de Lomo',
    category: 'platos_combinados',
    price: 8.5,
    description: 'Lomo de cerdo · Incluye 1 huevo frito, patatas y ensalada',
    allergens: [
      { key: 'huevo', status: 'contiene' },
    ],
    consultePersonal: true,
    consulteNote: 'Incluye 1 huevo frito confirmado. Consultar ficha del adobo del lomo, aliño de la ensalada de guarnición y contacto cruzado en freidora de patatas.',
    image: '/carta/lr-53_PLATOS_COMBINADOS_LOMO.jpg',
  },
  {
    id: 54,
    code: 'lr-54',
    reportCode: 'E04',
    name: 'Plato combinado de Rabas',
    category: 'platos_combinados',
    price: 9.0,
    description: 'Rabas de calamar · Incluye 1 huevo frito, patatas y ensalada',
    allergens: [
      { key: 'huevo', status: 'contiene' },
      { key: 'moluscos', status: 'contiene' },
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene moluscos (calamar) y huevo (en rebozado y huevo frito de guarnición), además de harina habitual de trigo (gluten). Consultar posible remojo en leche y aliño de la ensalada.',
    image: '/carta/lr-54_PLATOS_COMBINADOS_RABAS.jpg',
  },
  {
    id: 55,
    code: 'lr-55',
    reportCode: 'E02/E03',
    name: 'Plato combinado de Pollo empanado / a la plancha',
    category: 'platos_combinados',
    price: 9.5,
    description: 'A elegir empanado o a la plancha · Incluye 1 huevo frito, patatas y ensalada',
    allergens: [
      { key: 'huevo', status: 'contiene' },
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Incluye 1 huevo frito en ambas versiones. La versión empanada incorpora además pan rallado/harina de trigo (gluten) y huevo; la versión a la plancha no lleva rebozado (consultar plancha y freidora compartidas).',
    image: '/carta/lr-55_PLATOS_COMBINADOS_POLLO_EMPANADO_A_LA_PLANCHA.jpg',
  },
  {
    id: 56,
    code: 'lr-56',
    reportCode: 'E08',
    name: 'Plato combinado de Calamares',
    category: 'platos_combinados',
    price: 9.5,
    description: 'Calamares · Incluye 1 huevo frito, patatas y ensalada',
    allergens: [
      { key: 'huevo', status: 'contiene' },
      { key: 'moluscos', status: 'contiene' },
      { key: 'gluten', status: 'posible', detail: 'trigo' },
      { key: 'sulfitos', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene moluscos (calamares) y 1 huevo frito. Consultar si se sirven encebollados (posibles sulfitos por vino blanco) o a la romana (harina de trigo con gluten).',
    image: '/carta/lr-56_PLATOS_COMBINADOS_CALAMARES.jpg',
  },
  {
    id: 57,
    code: 'lr-57',
    reportCode: 'E01',
    name: 'Plato combinado de Filete de ternera',
    category: 'platos_combinados',
    price: 10.5,
    description: 'Filete de ternera a la plancha · Incluye 1 huevo frito, patatas y ensalada',
    allergens: [
      { key: 'huevo', status: 'contiene' },
    ],
    consultePersonal: true,
    consulteNote: 'Contiene 1 huevo frito. Filete de ternera a la plancha sin empanado; consultar aliño de la ensalada de guarnición y freidora compartida para las patatas.',
    image: '/carta/lr-57_PLATOS_COMBINADOS_FILETE_DE_TERNERA.jpg',
  },

  // ── COMIDAS: PLATO ESPECIAL (11,50 € → 22,50 €) ──
  {
    id: 58,
    code: 'lr-58',
    reportCode: 'D01',
    name: 'Entraña a la plancha',
    category: 'plato_especial',
    price: 11.5,
    description: 'Corte de vacuno a la plancha · Con pimientos, patatas o ensalada',
    allergens: [],
    consultePersonal: true,
    consulteNote: 'Carne de vacuno a la plancha sin alérgenos directos. Consultar si se acompaña de salsa chimichurri (posibles sulfitos por vinagre) y la guarnición elegida (pimientos, patatas o ensalada).',
    image: '/carta/lr-58_PLATO_ESPECIAL_ENTRANA_A_LA_PLANCHA.jpg',
  },
  {
    id: 59,
    code: 'lr-59',
    reportCode: 'D02',
    name: 'Churrasco a la plancha',
    category: 'plato_especial',
    price: 12.5,
    description: 'Tira de vacuno a la plancha · Con pimientos, patatas o ensalada',
    allergens: [],
    consultePersonal: true,
    consulteNote: 'Corte de vacuno a la plancha sin alérgenos directos. Consultar posibles salsas/adobos (sulfitos, mostaza o soja) y la guarnición elegida.',
    image: '/carta/lr-59_PLATO_ESPECIAL_CHURRASCO_A_LA_PLANCHA.jpg',
  },
  {
    id: 60,
    code: 'lr-60',
    reportCode: 'D03',
    name: 'Cachopo',
    category: 'plato_especial',
    price: 22.5,
    description: 'Ternera rellena de jamón serrano y queso fundido · Con pimientos, patatas o ensalada',
    allergens: [
      { key: 'huevo', status: 'contiene' },
      { key: 'lacteos', status: 'contiene' },
      { key: 'gluten', status: 'posible', detail: 'trigo' },
    ],
    consultePersonal: true,
    consulteNote: 'Elaborado con filetes de ternera, jamón serrano, queso para fundir (lácteos), huevo y pan rallado/harina habitual de trigo (gluten). Consultar guarnición elegida.',
    image: '/carta/lr-60_PLATO_ESPECIAL_CACHOPO.jpg',
  },

  // ── COMIDAS: TABLAS (32,90 €) ──
  {
    id: 28,
    code: 'lr-28',
    reportCode: 'I01',
    name: 'Tabla Los Rombos',
    category: 'tablas',
    price: 32.9,
    description: 'Chorizo criollo, chorizo rojo, alitas, vacío, chuletas de cerdo y churrasco',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
      { key: 'lacteos', status: 'posible' },
      { key: 'sulfitos', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Tabla combinada: el chorizo criollo y el chorizo rojo pueden contener proteínas de leche (lácteos) y sulfitos según proveedor; las alitas pueden llevar harina de trigo (gluten) o marinado. Consultar fichas individuales de cada pieza y salsas.',
    image: '/carta/lr-28_TABLAS_TABLA_LOS_ROMBOS.jpg',
  },

  // ── COMIDAS: POSTRES (3,90 € → 5,50 €) ──
  {
    id: 61,
    code: 'lr-61',
    reportCode: 'J03',
    name: 'Helado',
    category: 'postres',
    price: 3.9,
    description: 'Consulta nuestros sabores y formatos disponibles',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
      { key: 'lacteos', status: 'posible' },
      { key: 'frutos', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Los alérgenos dependen del sabor y formato elegidos: posibles lácteos, huevo, frutos de cáscara (almendra, avellana, etc.), cacahuete, lecitina de soja y trigo (cucurucho/galleta). Solicitar etiqueta del sabor concreto.',
    image: '/carta/lr-61_POSTRES_HELADO.jpg',
  },
  {
    id: 62,
    code: 'lr-62',
    reportCode: 'J01',
    name: 'Tarta de 3 chocolates',
    category: 'postres',
    price: 5.5,
    description: 'Capas de chocolate negro, con leche y blanco sobre base de galleta',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
      { key: 'lacteos', status: 'posible' },
      { key: 'soja', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Elaborada con tres chocolates, lácteos (leche/nata/mantequilla), base de galleta o bizcocho con trigo (gluten) y posible lecitina de soja, huevo o trazas de frutos de cáscara.',
    image: '/carta/lr-62_POSTRES_TARTA_DE_3_CHOCOLATES.jpg',
  },
  {
    id: 63,
    code: 'lr-63',
    reportCode: 'J02',
    name: 'Tarta de queso',
    category: 'postres',
    price: 5.5,
    description: 'Tarta de queso cremosa',
    allergens: [
      { key: 'gluten', status: 'posible', detail: 'trigo' },
      { key: 'huevo', status: 'posible' },
      { key: 'lacteos', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Receta con queso crema y nata (lácteos), huevo y posible harina o base de galleta de trigo (gluten). Consultar ficha exacta de la tarta del día.',
    image: '/carta/lr-63_POSTRES_TARTA_DE_QUESO.jpg',
  },

  // ── EXTRAS (0,50 €) ──
  {
    id: 64,
    code: 'lr-64',
    reportCode: 'EXT',
    name: 'Extra: Queso, Huevo o Bacon',
    category: 'extras',
    price: 0.5,
    description: '+0,50 € cada uno · Suplemento para añadir a tu plato o bocadillo',
    allergens: [
      { key: 'huevo', status: 'posible' },
      { key: 'lacteos', status: 'posible' },
    ],
    consultePersonal: true,
    consulteNote: 'Suplemento individual (+0,50 €): el extra de huevo contiene huevo; el extra de queso contiene leche y derivados (lácteos); para el bacon, consultar etiqueta del proveedor.',
    image: '/carta/lr-64_EXTRAS_EXTRA_QUESO_HUEVO_O_BACON.jpg',
  },
]

const categoryOrder = categories
  .filter((c): c is { key: CategoryKey; label: string } => c.key !== 'todos')
  .map((c) => c.key)

// Garantiza ordenación por categoría y, dentro de cada categoría, del menor al mayor precio (ítems "Consultar" quedan al final de la categoría)
export const menuItems: MenuItem[] = [...rawMenuItems].sort((a, b) => {
  if (a.category !== b.category) {
    return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
  }
  const priceA = a.price > 0 ? a.price : Number.POSITIVE_INFINITY
  const priceB = b.price > 0 ? b.price : Number.POSITIVE_INFINITY
  return priceA - priceB
})
