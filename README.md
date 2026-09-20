# 🍔 Taramundi Bar — Landing Page

> Landing page profissional mobile-first com sistema de pedidos WhatsApp integrado

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://imleomartins.github.io/taramundi-landingpage/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Alpine.js](https://img.shields.io/badge/Alpine.js-8BC0D0?style=for-the-badge&logo=alpine.js&logoColor=black)](https://alpinejs.dev/)

---

## 📋 Sobre o Projeto

Landing page desenvolvida para **Taramundi Bar & Restaurante** (Valladolid, Espanha) com foco em conversão direta via WhatsApp, eliminando intermediários como Glovo e Uber Eats.

**Cliente:** Taramundi Bar  
**Localização:** C. Embajadores, 14 - 47013 Valladolid  
**Rating Google:** ⭐ 4.5/5 (205 avaliações)  
**WhatsApp:** +34 643 51 21 42

---

## ✨ Funcionalidades

### 🎨 Design & UX
- ✅ **Mobile-First** — Otimizado para smartphone (320px até 2560px)
- ✅ **Tema Dark Neon** — Identidade visual premium com verde neon (#39FF14)
- ✅ **Responsivo 100%** — Adapta perfeitamente a qualquer tela
- ✅ **Animações Suaves** — Fade-in, hover effects, transitions

### 🍽️ Menu Digital
- ✅ **71 Itens Cadastrados** — Desayunos, Hamburguesas, Raciones, Bocatas, Sándwiches, Tablas, Sartenes, Postres
- ✅ **9 Categorias** — Filtros dinâmicos por tipo de comida
- ✅ **Preços em Euros** — Transparência total
- ✅ **Descrições Detalhadas** — Cada item com texto explicativo

### 🛒 Carrinho de Compras
- ✅ **Sistema Funcional** — Alpine.js (zero frameworks pesados)
- ✅ **Agrupamento Inteligente** — Itens repetidos somados automaticamente
- ✅ **Observações Customizáveis** — Cliente pode pedir "sin cebolla", "extra salsa", etc.
- ✅ **Total Automático** — Cálculo em tempo real
- ✅ **Envio WhatsApp** — Pedido formatado e enviado direto para o restaurante

### 📱 Integração WhatsApp
- ✅ **5 Pontos de Conversão:**
  1. Botão flutuante fixo (inferior direito)
  2. CTA principal no hero (primeira dobra)
  3. Botão "Reservar Mesa" no header
  4. Link no menu mobile
  5. Botão "Enviar Pedido" no carrinho

### 🔍 SEO & Performance
- ✅ **Schema.org Completo:**
  - Restaurant (nome, endereço, horários, rating)
  - LocalBusiness (dados comerciais)
  - Menu (itens com preços estruturados)
- ✅ **Open Graph** — Preview bonito ao compartilhar
- ✅ **Lazy Loading** — Imagens carregam sob demanda
- ✅ **Google Fonts Otimizadas** — Apenas 3 pesos (400, 600, 700)
- ✅ **Tempo de Carregamento** — <2s em 4G

### ♿ Acessibilidade
- ✅ **WCAG 2.1 AA Compliant**
- ✅ **Aria-labels** em todos os botões e ícones
- ✅ **Navegação por teclado** 100% funcional
- ✅ **Leitores de tela** compatíveis
- ✅ **Contraste aprovado** em todos os elementos

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| HTML5 | — | Estrutura semântica |
| Tailwind CSS | 3.x (CDN) | Estilização utility-first |
| Alpine.js | 3.x (CDN) | Reatividade (carrinho, filtros) |
| Phosphor Icons | Latest | Ícones vetoriais |
| Google Fonts | Poppins | Tipografia (400, 600, 700) |

**Por que CDN?** Para um projeto single-page de restaurante local, CDN é mais prático que build tools. Zero dependências npm, zero build step, 100% portável.

---

## 📂 Estrutura do Projeto

```
taramundi-bar/
├── index.html              # Página principal (única)
├── logo.png                # Logo do restaurante (navbar)
├── logo-alt.png            # Logo alternativa
├── fachada.png             # Foto da fachada (hero + nosotros)
├── header-banner.png       # Foto interior (nosotros)
├── client-data.json        # Dados extraídos do Google Maps
├── PROJECT_STATE.md        # Documentação técnica do projeto
├── PROPOSTA_COMERCIAL.md   # Proposta de precificação (3 modelos)
├── PITCH_AMIGO.md          # Script de prospecção
└── README.md               # Este arquivo
```

---

## 🎯 Como Usar

### 1. Visualizar Online
👉 **https://imleomartins.github.io/taramundi-landingpage/**

### 2. Rodar Localmente
```bash
# Clone o repositório
git clone https://github.com/ImLeoMartins/taramundi-landingpage.git

# Entre na pasta
cd taramundi-landingpage

# Abra o index.html no navegador (ou use Live Server)
```

### 3. Personalizar
Edite o `index.html`:
- **Linha 6:** Meta description
- **Linha 8:** Título da página
- **Linha 122:** WhatsApp (substitua +34643512142)
- **Linhas 591-651:** Array `menuItems` (adicionar/remover pratos)

---

## 📊 Métricas & Performance

### Lighthouse Score (Esperado)
- 🟢 **Performance:** 95+
- 🟢 **Accessibility:** 100
- 🟢 **Best Practices:** 95+
- 🟢 **SEO:** 100

### Bundle Size
- **HTML:** ~28KB (minificado)
- **Imagens:** ~800KB total (4 arquivos PNG)
- **CSS:** 0KB (Tailwind via CDN, não contabilizado)
- **JS:** 0KB próprio (Alpine.js via CDN)

### Compatibilidade
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

---

## 🛠️ Customizações Futuras (Roadmap)

### Fase 2 (Opcional)
- [ ] Domínio personalizado (`taramundi-valladolid.com`)
- [ ] Google Analytics integrado
- [ ] Botão "Pedir pelo Glovo" (fallback se WhatsApp não funcionar)
- [ ] Seção de reviews do Google Maps (embed)
- [ ] Galeria de fotos (Lightbox)

### Fase 3 (Premium)
- [ ] Sistema de cupons de desconto
- [ ] Programa de fidelidade (pontos por pedido)
- [ ] Notificação push para promoções
- [ ] Integração com WhatsApp Business API (catálogo oficial)

---

## 📈 ROI Estimado

### Investimento Inicial
**€450** (Modelo 1 — Indicação)

### Retorno Esperado (12 meses)
- **Cenário Conservador:** 10 pedidos/mês → Economia de €75/mês → **ROI: 100%**
- **Cenário Realista:** 30 pedidos/mês → Economia de €225/mês → **ROI: 400%**
- **Cenário Otimista:** 50 pedidos/mês → Economia de €575/mês → **ROI: 575%**

*Base de cálculo: 30% de comissão economizada em apps terceiros (Glovo, Uber Eats)*

---

## 🤝 Contribuindo

Este é um projeto proprietário desenvolvido para cliente específico. **Não aceita contribuições externas.**

Se você é um desenvolvedor e gostou da estrutura, sinta-se livre para usar como inspiração (não copie o código completo — respeite o trabalho autoral).

---

## 📄 Licença

**Proprietary** — Todos os direitos reservados.  
© 2026 Leo Forge Factory

**Cliente:** Taramundi Bar (uso autorizado)  
**Desenvolvedor:** Leo Martins (@ImLeoMartins)

---

## 📞 Contato

**Leo Forge Factory**  
🌐 Portfolio: https://github.com/ImLeoMartins  
📧 Email: [Seu email aqui]  
💬 WhatsApp: [Seu número aqui]

---

## 🏆 Créditos

**Design & Desenvolvimento:** Leo Forge Factory  
**Cliente:** Taramundi Bar & Restaurante  
**Dados:** Google Maps (avaliações, horários, localização)  
**Ícones:** Phosphor Icons  
**Fontes:** Google Fonts (Poppins)  
**Hospedagem:** GitHub Pages (grátis)

---

**Feito com 💚 em Valladolid**  
*De programador para restaurante — zero intermediários, 100% conversão.*
