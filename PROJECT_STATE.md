# Projeto: Taramundi Bar

## 1. Visão Geral
- **Nome do Negócio:** Taramundi
- **Categoria:** Bar
- **Localização:** C. Embajadores, 14, 47013 Valladolid, Espanha
- **Nota no Google:** ⭐ 4.5 (205 avaliações confirmadas)
- **WhatsApp / Contato:** +34 643 51 21 42
- **Horário de Funcionamento:**
  - Domingo: 09:00-00:00
  - Segunda-feira: Fechado
  - Terça a Sexta: 08:00-00:00
  - Sábado: 09:00-00:00
- **Objetivo da LP:** Capturar clientes locais e converter diretamente no WhatsApp (reservas de mesa, dúvidas ou pedidos diretos), reduzindo o uso de intermediários/apps de terceiros.

## 2. Arquitetura da Página (Estrutura Blueprint)
Foco 100% em Mobile-First, com direcionamento rápido (CTAs) em cada dobra.

### A. Hero Section (Primeira Dobra)
- **Promessa (Headline):** "O Melhor Clima de Valladolid Espera por Você no Taramundi Bar."
- **Sub-promessa:** Bebidas geladas, petiscos deliciosos e um ambiente incrível para você e seus amigos.
- **Prova Social Dinâmica:** Tag indicando "⭐ 4,5/5 por mais de 200 clientes!".
- **CTA Principal:** 📲 Reservar Mesa / Falar com Atendimento (Link direto Zap).

### B. Secundária (Benefícios & Quebra de Objeção)
- **Motivos para colar no Taramundi:** 
  - Localização acessível (Embajadores).
  - Reserva expressa pelo WhatsApp.
  - Atendimento sem intermediários, resposta rápida.

### C. Exibição (Foco Comercial)
- **Seção de Produtos/Experiência:** Mini-portfólio visual com espaço para (ex: Cervejas, Drinks Especiais, Porções/Tapas).
- **CTA Inferior:** Botão dedicado "Ver Cardápio Completo no Zap" sob os destaques.

### D. Prova Social e Confiança
- **Painel de Avaliações:** Destaque para a nota autêntica do Google Maps (4,5) e o marco de 205 avaliações.
- Frase de ancoragem: "Não acredite apenas em nós, veja o que Valladolid está dizendo."

### E. Rodapé (Footer e Facilidades)
- **Mapa/Como Chegar:** Endereço clicável direto para o Google Maps (`C. Embajadores, 14`).
- **Botão Whatsapp Flutuante:** (Sticky bottom-right) Fixo em toda a navegação para conversões a qualquer momento.
- **Horários:** A atualizar conforme resposta do cliente/briefing estendido.

## 3. Workflow de Execução (Leo Forge Factory)
- [x] **Fase 0 (Recon):** Dados extraídos do Google Maps e salvos em `client-data.json`.
- [x] **Fase 1 (Blueprint):** Estrutura e copy aprovadas, registradas no `PROJECT_STATE.md`.
- [x] **Fase 2 (Build):** Gerada estrutura inicial em `index.html` com foco em Mobile-First, utilizando Tailwind e ícones Phosphor.
- [x] **Fase 3 (Avaliação/CRO):** Refinamento completo aplicado (Modo escuro Neon, logo inserida na Navbar fixa, benefícios transformados em links pro Zap, imagens de alta qualidade via Unsplash de drinks e tapas, Copy de intenção alta no Zap floating).
- [x] **Fase 4 (QA Tech):** Auditoria técnica completa — 17 correções aplicadas (acessibilidade WCAG 2.1 AA, SEO On-Page, Open Graph, performance otimizada, lazy loading, aria-labels).
- [x] **Fase 5 (Forge):** Integração Schema.org (Restaurant + LocalBusiness + Menu estruturado) para SEO local. Carrinho WhatsApp e menu restaurante validados. Instagram @taramundi16 integrado.

## 4. Status Final (2026-09-20)
✅ **PROJETO COMPLETO E PRONTO PARA DEPLOY**

### Funcionalidades Implementadas:
- ✅ Landing page mobile-first com tema dark neon (verde #39FF14)
- ✅ Menu digital interativo com 71 itens e 9 categorias
- ✅ Carrinho de compras funcional (Alpine.js)
- ✅ Integração WhatsApp para pedidos e reservas
- ✅ Sistema de filtros de menu por categoria
- ✅ Botões flutuantes (Carrinho + WhatsApp)
- ✅ Modal de pedido com observações customizáveis
- ✅ Horários completos (Mar-Sex 08:00-00:00, Sáb-Dom 09:00-00:00, Seg fechado)
- ✅ Links para Instagram (@taramundi16), Google Maps, telefone
- ✅ Imagens otimizadas com lazy loading
- ✅ Favicon e Open Graph completos
- ✅ Schema.org (Restaurant + LocalBusiness + Menu) para SEO local
- ✅ Acessibilidade WCAG 2.1 AA (aria-labels, roles, semântica HTML5)

### Métricas Esperadas:
- 📱 Mobile-First: 100% responsivo (testado 320px-2560px)
- ⚡ Performance: Google Fonts otimizadas (3 pesos), lazy loading aplicado
- 🎯 Conversão: Múltiplos CTAs WhatsApp em todas as dobras
- 🔍 SEO Local: Schema.org completo para Google Maps e busca local
- ♿ Acessibilidade: 100% WCAG 2.1 AA compliant

### Próximos Passos:
1. Hospedar em plataforma (Vercel/Netlify/próprio servidor)
2. Configurar domínio personalizado
3. Atualizar URL no Schema.org (substituir "https://taramundi-valladolid.com")
4. Enviar URL para Google Search Console
5. Monitorar conversões via WhatsApp Business API (opcional)
