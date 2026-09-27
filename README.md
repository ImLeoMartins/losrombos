# 🍔 Los Rombos Bar & Restaurante — Landing Page

> Landing page profissional com sistema de pedidos via WhatsApp integrado

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://imleomartins.github.io/losrombos/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Alpine.js](https://img.shields.io/badge/Alpine.js-8BC0D0?style=for-the-badge&logo=alpine.js&logoColor=black)](https://alpinejs.dev/)

---

## 📋 Sobre o Projeto

Landing page desenvolvida para **Los Rombos Bar & Restaurante** (Valladolid, Espanha) com foco em conversão direta via WhatsApp, eliminando intermediários de delivery.

**Cliente:** Los Rombos Bar  
**Localização:** C. Transición, 8 - 47013 Valladolid  

---

## ✨ Funcionalidades

### 🎨 Design & UX
- ✅ **Mobile-First** — Layout fluido para todas as resoluções de tela.
- ✅ **Identidade Dark Neon** — Visual moderno com tons escuros e botões laranja neon (`#D47100`).
- ✅ **Navegação Inteligente** — 
  - Desktop: Barra de navegação com links flutuando sobre o *hero*.
  - Mobile: Botão "Menu" inteligente (fixo no topo durante a introdução e flutuante inferior ao atingir o cardápio).
- ✅ **Botões Poligonais Customizados** — Uso de `clip-path` para cortes em formato diamante nas bordas laterais.
- ✅ **Transições Suaves** — Modais com `fade-in`, elementos interativos com `hover` glow.

### 🍽️ Menu Digital
- ✅ **Catálogo Completo** — 71 itens categorizados (Desayunos, Hamburguesas, Raciones, Bocatas, etc).
- ✅ **Filtros de Categoria Sticky** — Barra de rolagem horizontal nativa com *scroll-snap*, fixada no topo da tela enquanto navega pelos pratos. Inclui setas de navegação para Desktop.
- ✅ **Preços Claros & Descrições** — Badge de preço, informações de ingredientes.

### 🛒 Carrinho de Compras
- ✅ **Agrupamento Automático** — Itens adicionados repetidamente são somados em um único *badge*.
- ✅ **Total em Tempo Real** — Cálculo automático baseado nos itens do carrinho.
- ✅ **Gerenciamento de Pedido** — Remoção fácil de itens e campo customizado para observações (ex: "Sem cebola").
- ✅ **Integração WhatsApp Dinâmica** — Monta a estrutura da mensagem com todos os dados e abre diretamente no app.

### 📅 Reserva de Mesas (Modal)
- ✅ **Formulário Completo** — Seleção de Data, Hora, Número de Pessoas.
- ✅ **Mesas Disponíveis** — Grade interativa de seleção com base nos dados fornecidos.
- ✅ **Validação & Envio** — Confirmação via WhatsApp estruturada de forma clara para o atendente.

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Uso |
|-----------|-----|
| **HTML5** | Semântica da página, integração com Schema.org. |
| **Tailwind CSS** (via CDN) | Estilização utility-first, sem build step necessário. |
| **Alpine.js** (via CDN) | Reatividade e gerência de estado (Modais, Carrinho, Scroll events, Filtros). |
| **Phosphor Icons** | Ícones vetoriais em todas as áreas. |

---

## 📂 Estrutura do Projeto

```
los-rombos/
├── index.html              # Estrutura principal da página (CSS e JS embutidos)
├── logo.png                # Logo da marca (Header / Hero)
├── fachada.png             # Imagens ilustrativas
├── header-banner.png       # Imagens ilustrativas
└── README.md               # Este arquivo
```

---

## 🛠️ Customizações Futuras (Roadmap)

- [ ] Domínio personalizado (`losrombos.com`)
- [ ] Google Analytics integrado para rastreio de CTAs
- [ ] Galeria de fotos (Lightbox) no lugar do grid estático

---

## 🤝 Contribuindo

Este é um projeto proprietário desenvolvido sob medida. **Não aceita contribuições externas.**
Desenvolvedores podem usar a estrutura como inspiração, desde que respeitem o trabalho autoral.

---

## 📄 Licença

**Proprietary** — Todos os direitos reservados.  
© 2026 Leo Forge Factory

**Cliente:** Los Rombos Bar (uso autorizado)  
**Desenvolvedores:** 
Leo-Forge (@ImLeoMartins) | 
VN-Studio (@SrViniih)


---

**Feito com 🧡 em Valladolid**  
*De programador para restaurante — zero intermediários, 100% conversão.*
