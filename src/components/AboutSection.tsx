import { LemaBadge, TripleRomboSeparator } from './DesignElements'

export function AboutSection() {
  return (
    <section id="nosotros" className="py-12 md:py-16 bg-[#0F0D0A]">
      <div className="container mx-auto px-4">
        <TripleRomboSeparator className="mb-10 md:mb-14" />

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            {/* Imagen del local con moldura dupla e cantos retos */}
            <div className="mb-8 overflow-hidden rombos-double-frame bg-[#1A1611]">
              <img
                src="/fachada.jpg"
                alt="Bar Los Rombos - Fachada del local en Valladolid"
                className="w-full h-56 md:h-64 object-cover hover:scale-105 transition duration-500"
                loading="lazy"
                width="800"
                height="600"
              />
            </div>

            <LemaBadge className="mb-3">NUESTRA CASA EN VALLADOLID</LemaBadge>
            <h2 className="font-display text-3xl md:text-4xl text-[#F1E8D4] mb-6">
              ¿POR QUÉ <span className="text-[#D4AF5A]">LOS ROMBOS</span>?
            </h2>

            <div className="space-y-5">
              <div className="flex items-start space-x-4">
                <div className="bg-[#1A1611] border border-[#D4AF5A]/35 p-3 flex-shrink-0">
                  <i className="ph-fill ph-star text-xl text-[#D4AF5A]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-medium uppercase tracking-wider text-sm text-[#F1E8D4] mb-1">
                    205 RESEÑAS POSITIVAS
                  </h3>
                  <p className="font-light text-[#C4B9A3] text-sm">
                    Nuestros vecinos y clientes nos avalan con 4,5 sobre 5 en Google Maps
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#1A1611] border border-[#D4AF5A]/35 p-3 flex-shrink-0">
                  <i className="ph ph-sun text-xl text-[#D4AF5A]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-medium uppercase tracking-wider text-sm text-[#F1E8D4] mb-1">
                    EMPIEZA EL DÍA CON BUEN PIE
                  </h3>
                  <p className="font-light text-[#C4B9A3] text-sm">
                    Desayunos desde las 08:00, raciones, bocadillos, sartenes y cenas hasta medianoche
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#1A1611] border border-[#D4AF5A]/35 p-3 flex-shrink-0">
                  <i className="ph ph-fire text-xl text-[#D4AF5A]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-medium uppercase tracking-wider text-sm text-[#F1E8D4] mb-1">
                    SABOR, COCINA Y BUENOS MOMENTOS
                  </h3>
                  <p className="font-light text-[#C4B9A3] text-sm">
                    Dos plantas amplias: barra de tapeo y salón comedor superior para comidas, cenas y grupos
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#1A1611] border border-[#D4AF5A]/35 p-3 flex-shrink-0">
                  <i className="ph ph-whatsapp-logo text-xl text-[#D4AF5A]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-medium uppercase tracking-wider text-sm text-[#F1E8D4] mb-1">
                    TRATO DIRECTO Y SIN INTERMEDIARIOS
                  </h3>
                  <p className="font-light text-[#C4B9A3] text-sm">
                    Pide o reserva tu mesa directamente por WhatsApp con información clara de alérgenos
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative overflow-hidden rombos-double-frame bg-[#1A1611]">
              <img
                src="/galeria/bar-12-fachada-upgrade.jpg"
                alt="Ambiente en el salón de Bar Los Rombos"
                className="w-full h-72 md:h-80 object-cover hover:scale-105 transition duration-500"
                loading="lazy"
                width="1600"
                height="900"
              />
              <div className="absolute bottom-3 right-3 bg-[#0F0D0A]/90 border border-[#D4AF5A] text-[#D4AF5A] px-4 py-1.5 font-medium uppercase tracking-wider text-xs inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#D4AF5A] rotate-45" aria-hidden="true" />
                <span>4,5 / 5 EN GOOGLE</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="overflow-hidden border border-[#D4AF5A]/30 h-44 bg-[#1A1611]">
                <img
                  src="/galeria/bar-02-img5324.jpg"
                  alt="Mural artístico de Bar Los Rombos y escalera al salón superior"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  loading="lazy"
                  width="800"
                  height="600"
                />
              </div>
              <div className="overflow-hidden border border-[#D4AF5A]/30 h-44 bg-[#1A1611]">
                <img
                  src="/galeria/bar-03-img5325.jpg"
                  alt="Salón comedor de la planta superior de Bar Los Rombos"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  loading="lazy"
                  width="800"
                  height="600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
