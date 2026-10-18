import {
  ADDRESS_LINE,
  GOOGLE_MAPS_URL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_SHORT,
  WHATSAPP_NUMBER,
  weeklyHours,
} from '../data/restaurant'
import { LemaBadge, SectionFilete, TripleRomboSeparator } from './DesignElements'

interface ContactSectionProps {
  onOpenReservation: () => void
}

export function ContactSection({ onOpenReservation }: ContactSectionProps) {
  return (
    <section id="contacto" className="py-12 md:py-16 bg-[#0F0D0A]">
      <div className="container mx-auto px-4">
        <TripleRomboSeparator className="mb-10 md:mb-14" />

        {/* Banner CTA de Reserva de Mesa no Salón Superior ou Planta Baja */}
        <div className="max-w-5xl mx-auto mb-10 md:mb-14 bg-[#1A1611] rombos-double-frame p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#D4AF5A] font-medium mb-2">
              <span className="w-1.5 h-1.5 bg-[#D4AF5A] rotate-45" aria-hidden="true" />
              <span>RESERVAS DE MARTES A DOMINGO · SIN INTERMEDIARIOS</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-[#F1E8D4] mb-2">
              RESERVA TU MESA EN <span className="text-[#D4AF5A]">LOS ROMBOS</span>
            </h2>
            <p className="font-light text-sm text-[#C4B9A3] max-w-xl leading-relaxed">
              Elige entre nuestro <strong className="text-[#F1E8D4] font-normal">Salón Superior</strong>{' '}
              (ideal para comidas, cenas y grupos) o la{' '}
              <strong className="text-[#F1E8D4] font-normal">Planta Baja</strong> junto a la barra y
              confirma directo por WhatsApp.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenReservation}
            className="btn-poly w-full md:w-auto bg-[#D4AF5A] hover:bg-[#E9CC82] text-[#0F0D0A] px-8 py-4 font-semibold text-sm flex items-center justify-center space-x-2.5 shrink-0 cursor-pointer"
          >
            <i className="ph ph-calendar-check text-xl" aria-hidden="true" />
            <span>Reservar Mesa Ahora</span>
          </button>
        </div>

        <div className="text-center mb-8 md:mb-12">
          <LemaBadge className="mb-3">C/ DE LA TRANSICIÓN, 8 · VALLADOLID</LemaBadge>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F1E8D4] mb-2">
            <span className="text-[#D4AF5A]">VISÍTANOS</span> O CONTÁCTANOS
          </h2>
          <p className="font-light text-[#C4B9A3] text-sm sm:text-base">
            Te esperamos de martes a domingo en Bar Los Rombos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Horarios */}
          <div className="bg-[#1A1611] p-5 sm:p-8 rombos-double-frame">
            <SectionFilete title="HORARIO DE ATENCIÓN" />

            <div className="space-y-3">
              {weeklyHours.map((entry, idx) => (
                <div
                  key={entry.day}
                  className={`flex justify-between items-center py-2.5 ${
                    idx < weeklyHours.length - 1 ? 'border-b border-[#D4AF5A]/15' : ''
                  }`}
                >
                  <span className="font-light text-[#C4B9A3] text-sm">{entry.day}</span>
                  <span
                    className={`font-medium text-sm ${
                      entry.closed ? 'text-[#F08A4B]' : 'text-[#D4AF5A]'
                    }`}
                  >
                    {entry.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div className="bg-[#1A1611] p-5 sm:p-8 rombos-double-frame">
            <SectionFilete title="CONTACTO DIRECTO" />

            <div className="space-y-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=%C2%A1Hola!%20Tengo%20una%20consulta%20sobre%20Bar%20Los%20Rombos`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-4 bg-[#0F0D0A] hover:border-[#D4AF5A] border border-[#D4AF5A]/35 transition group"
              >
                <i className="ph ph-whatsapp-logo text-2xl text-[#D4AF5A]" aria-hidden="true" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#C4B9A3]">WhatsApp</p>
                  <p className="font-medium text-base text-[#F1E8D4]">{PHONE_DISPLAY}</p>
                </div>
                <i
                  className="ph ph-caret-right ml-auto text-xl text-[#D4AF5A] group-hover:translate-x-1.5 transition"
                  aria-hidden="true"
                />
              </a>

              <a
                href={`tel:+${WHATSAPP_NUMBER}`}
                className="flex items-center space-x-4 p-4 bg-[#0F0D0A] hover:border-[#D4AF5A] border border-[#D4AF5A]/25 transition group"
              >
                <i className="ph ph-phone text-2xl text-[#D4AF5A]" aria-hidden="true" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#C4B9A3]">Llamar</p>
                  <p className="font-medium text-base text-[#F1E8D4]">{PHONE_SHORT}</p>
                </div>
                <i
                  className="ph ph-caret-right ml-auto text-xl text-[#C4B9A3] group-hover:translate-x-1.5 transition"
                  aria-hidden="true"
                />
              </a>

              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-4 bg-[#0F0D0A] hover:border-[#D4AF5A] border border-[#D4AF5A]/25 transition group"
              >
                <i className="ph ph-map-pin text-2xl text-[#D4AF5A]" aria-hidden="true" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#C4B9A3]">Cómo llegar</p>
                  <p className="font-medium text-sm text-[#F1E8D4]">{ADDRESS_LINE}</p>
                </div>
                <i
                  className="ph ph-caret-right ml-auto text-xl text-[#C4B9A3] group-hover:translate-x-1.5 transition"
                  aria-hidden="true"
                />
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-4 bg-[#0F0D0A] hover:border-[#D4AF5A] border border-[#D4AF5A]/25 transition group"
              >
                <i className="ph ph-instagram-logo text-2xl text-[#D4AF5A]" aria-hidden="true" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#C4B9A3]">Instagram</p>
                  <p className="font-medium text-base text-[#F1E8D4]">{INSTAGRAM_HANDLE}</p>
                </div>
                <i
                  className="ph ph-caret-right ml-auto text-xl text-[#C4B9A3] group-hover:translate-x-1.5 transition"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
