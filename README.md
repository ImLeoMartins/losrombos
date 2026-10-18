# 🍔 Los Rombos Bar & Restaurante — Landing Page

> Landing page profissional com sistema de pedidos via WhatsApp integrado

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://www.losrombos.es/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📋 Sobre o Projeto

Landing page desenvolvida para **Los Rombos Bar & Restaurante** (Valladolid, Espanha) com foco em conversão direta via WhatsApp, eliminando intermediários de delivery.

**Cliente:** Los Rombos Bar  
**Localização:** C. de la Transición, 8 - 47013 Valladolid  
**Site:** [www.losrombos.es](https://www.losrombos.es)

---

## ✨ Funcionalidades

### 🎨 Design & UX
- ✅ **Mobile-First** — Layout fluido para todas as resoluções de tela.
- ✅ **Sistema de Diseño Oficial** — Visual sóbrio e elegante inspirado na arquitetura do bar: Noche (`#0F0D0A`), Carbón (`#1A1611`), Oro (`#D4AF5A`), Crema (`#F1E8D4`) e Arena (`#C4B9A3`).
- ✅ **Tipografia Oficial** — Gloock 400 (display títulos) + Jost (corpo e lemas).
- ✅ **Navegação Inteligente** — 
  - Desktop: Barra de navegação com links flutuando sobre o *hero*.
  - Mobile: Botão "Menu" inteligente (fixo no topo durante a introdução e flutuante inferior ao atingir o cardápio).
- ✅ **Botões Poligonais Customizados** — Uso de `clip-path` para cortes em formato diamante nas bordas laterais.
- ✅ **Transições Suaves** — Modais com `fade-in`, elementos interativos com `hover` glow.

### 🍽️ Menu Digital
- ✅ **Catálogo Completo** — Cardápio categorizado com filtro de alérgenos.
- ✅ **Filtros de Categoria Sticky** — Barra de rolagem horizontal nativa com *scroll-snap*, fixada no topo da tela enquanto navega pelos pratos. Inclui setas de navegação para Desktop.
- ✅ **Preços Claros & Descrições** — Badge de preço, informações de ingredientes e alérgenos.

### 🛒 Carrinho de Compras
- ✅ **Agrupamento Automático** — Itens adicionados repetidamente são somados em um único *badge*.
- ✅ **Total em Tempo Real** — Cálculo automático baseado nos itens do carrinho.
- ✅ **Gerenciamento de Pedido** — Remoção fácil de itens e campo customizado para observações (ex: "Sin cebolla").
- ✅ **Integração WhatsApp Dinâmica** — Monta a estrutura da mensagem com todos os dados e abre diretamente no app.

### 📅 Reserva de Mesas (Modal)
- ✅ **Formulário Completo** — Seleção de Data, Hora, Número de Pessoas.
- ✅ **Mesas Disponíveis** — Grade interativa de seleção com base nos dados fornecidos.
- ✅ **Validação & Envio** — Confirmação via WhatsApp estruturada de forma clara para o atendente.

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Uso |
|-----------|-----|
| **React 19 + TypeScript** | Componentização e estado reativo (Carrinho, Modais, Filtros, Carrossel). |
| **Vite 6** | Bundler rápido para desenvolvimento e build otimizado de produção. |
| **Tailwind CSS v4** | Estilização utility-first compilada via `@tailwindcss/vite`. |
| **Phosphor Icons** | Ícones vetoriais em todas as áreas. |

---

## 📂 Estrutura do Projeto

```
los-rombos/
├── index.html              # Entry point HTML (SEO, Open Graph e Schema.org)
├── package.json            # Scripts e dependências (React + Vite + Tailwind)
├── vite.config.ts          # Configuração do Vite + Tailwind v4
├── public/                 # Assets estáticos (CNAME, logo, fachada.jpg, header-banner.jpg)
├── src/
│   ├── main.tsx            # Inicialização React
│   ├── App.tsx             # Estado global (carrinho, modais, scroll)
│   ├── index.css           # Tema Tailwind v4 e classes customizadas
│   ├── data/               # Dados estruturados (menu, alérgenos, galeria, horários)
│   └── components/         # Componentes da interface (Hero, Gallery, MenuSection, Modais)
├── Carta Images/           # Materiais da carta e fotos reais do bar
└── README.md               # Este arquivo
```

---

## 📄 Licença

**Proprietary** — Todos os direitos reservados.  
© 2026 Forgeon

**Cliente:** Los Rombos Bar (uso autorizado)  

