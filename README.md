# Digital Logic Circuit Simulator

<div align="center">

**A browser-based digital logic circuit simulator for education.**

Build, simulate, and learn digital circuits right in your browser.

</div>


##  Overview

LogicLab is a fully client-side web application for designing, simulating, and learning digital logic circuits. Inspired by **Logisim Evolution**, **Falstad**, and **CircuitVerse**, but with a modern, premium dark UI.

**No backend. No installation. Just open and build circuits.**

### Who is this for?

-  Electrical Engineering students
-  Computer Engineering students
-  Digital Logic Design courses
-  Computer Architecture courses
-  Embedded Systems beginners
-  Hobbyists learning logic circuits

---

## Features

### Core
-  **Drag & Drop** — Drag components from the sidebar onto the canvas
-  **Real-Time Simulation** — Instant circuit evaluation using topological sort
-  **Smart Wiring** — Click-to-connect with signal-state coloring (green/gray/red)
-  **Truth Table Generator** — Auto-detects inputs/outputs and generates full truth table
-  **Properties Panel** — Educational info, formula, and truth table for each component
-  **Auto-Save** — Circuits persist in localStorage
-  **Undo/Redo** — Full history with Ctrl+Z / Ctrl+Y
-  **Import/Export** — JSON and PNG export

### Components
| Category | Components |
|----------|-----------|
| **Inputs** | Toggle Switch, Push Button, Clock Source, Logic 0, Logic 1 |
| **Logic Gates** | AND, OR, NOT, NAND, NOR, XOR, XNOR |
| **Outputs** | LED, 7-Segment Display, Logic Probe, Binary Display |

### UI/UX
-  Premium dark theme with glassmorphism
-  Custom SVG gate rendering with IEEE standard shapes
-  Signal glow animations on HIGH wires
-  Minimap navigation
-  Snap-to-grid placement
-  Full keyboard shortcuts

---

##  Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/yourusername/LogicLab.git
cd LogicLab
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready for static hosting.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Canvas | React Flow (`@xyflow/react`) |
| State | Zustand |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Animation | Framer Motion |
| Charts | Recharts |
| Export | html-to-image |

---

## 📂 Project Structure

```
src/
├── components/       # UI components (layout, panels, modals)
├── nodes/            # React Flow custom node components
├── edges/            # Custom wire edge component
├── simulator/        # Simulation engine (topological sort, evaluation)
├── store/            # Zustand state management
├── hooks/            # Custom hooks (shortcuts, auto-save)
├── data/             # Component library definitions
├── types/            # TypeScript type definitions
└── utils/            # Utilities (ID gen, colors)
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+S` | Save |
| `Delete` | Delete selected |
| `Shift+Drag` | Multi-select |


## 👤 Contact

**Talha Bin Qasim**

- 💼 LinkedIn: [linkedin.com/in/talhabinqasim](https://www.linkedin.com/in/talhabinqasim)


<div align="center">
</div>
