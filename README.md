# 🦖 CHRONOS — Career Development & Collaborative Network

CHRONOS es una plataforma web interactiva de desarrollo profesional que combina mentoría gamificada, red social colaborativa y economía de tokens Web3. Guiada por Chroni, un dinosaurio mentor virtual, transforma el crecimiento profesional en una experiencia estructurada y progresiva.

## 🧠 Sistema general

CHRONOS se compone de 4 módulos principales:

### 1. Mentor Chroni — Roadmap interactivo
Chatbot mentor que define objetivos profesionales y genera un roadmap de 5 hitos con preguntas de evaluación.
- Cada hito completado consume 1 crédito
- Recompensa: tokens $TALENT
- Progreso visual con estados (bloqueado / activo / completado)

### 2. Red Chronos — Feed social profesional
Feed tipo Twitter/X orientado a progreso profesional.
- Publicación automática de hitos completados
- Posts manuales de usuarios
- Likes, reposts y comentarios
- Propinas en $TALENT (10 tokens por interacción)
- Filtros: "Para ti", "Hitos de Carrera", "Mis Avances"

### 3. Misiones de Crédito — Tablero colaborativo
Sistema de intercambio de trabajo entre usuarios.
- Publicación de tareas (code review, feedback UX, marketing, etc.)
- Resolución de tareas para obtener créditos + tokens
- Requiere inversión inicial en $TALENT para publicar tareas
- Categorías: Programación, UI/UX, Marketing, Bases de Datos
- Sistema de recompensas: +1 crédito + tokens

### 4. Billetera $TALENT — Wallet Web3
Gestión de economía interna del sistema.
- Balance de tokens
- Historial de transacciones
- Gráfico de precio simulado (7 días)
- Swap $TALENT → USD / SOL
- Staking con 12% APY
- Compra de créditos (10 $TALENT por crédito)

## 🔄 Flujo del sistema

- El usuario consume créditos para avanzar en su roadmap
- Regenera créditos ayudando a otros en el tablero de misiones
- Gana y utiliza tokens $TALENT dentro del ecosistema
- Los hitos generan actividad social en el feed
- La wallet centraliza la economía del sistema

## 📸 Casos de uso (UI)

### Mentor Chroni — onboarding y roadmap

![Mentor Chroni - Onboarding](docs/screenshots/screenshot-1.png)

### Red Chronos — feed profesional

![Red Chronos - Social Feed](docs/screenshots/screenshot-2.png)

### Misiones de Crédito — tablero colaborativo

![Misiones de Crédito - Task Board](docs/screenshots/screenshot-3.png)

### Billetera $TALENT — wallet Web3

![Billetera $TALENT - Wallet](docs/screenshots/screenshot-4.png)

## 🏗️ Arquitectura técnica

```
idea-de-negocio/
├── public/
│   └── mascot.png
├── src/
│   ├── components/
│   │   ├── AuraAgent.tsx
│   │   ├── SocialFeed.tsx
│   │   ├── TaskBoard.tsx
│   │   └── CryptoWallet.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── docs/
│   └── screenshots/
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig*.json
```

## ⚙️ Stack tecnológico

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| React | 19.x | UI framework |
| TypeScript | 6.x | Tipado estático |
| Vite | 8.x | Build tool |
| Lucide React | 1.x | Iconos SVG |
| ESLint | 10.x | Linting |

## 🧩 Patrones y decisiones técnicas

- **Estado global en App.tsx**: manejo centralizado de créditos, tokens, posts y transacciones sin librerías externas
- **Componentes puros**: módulos independientes con props y callbacks
- **Sistema de economía circular**: créditos → consumo en desafíos | regeneración → ayuda a otros usuarios | tokens → intercambio interno
- **Tema visual "Sand"**: paleta cálida inspirada en estética prehistórica con acentos fríos

## 🚀 Cómo ejecutar

```bash
git clone https://github.com/tu-usuario/chronos.git
cd chronos
npm install
npm run dev
npm run build
npm run preview
```

## 📜 Licencia

MIT
