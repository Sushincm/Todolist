# Everyday Focus 🐸⚡
> **Ultra-Minimalist Everyday Todolist & Anti-Procrastination Daily Planner PWA**

Everyday Focus is a modern, lightweight, cross-platform Progressive Web App (PWA) designed to eliminate procrastination, prevent decision fatigue, and build focus momentum across Mobile, Tablet, and Desktop.

---

## 🌟 Key Features

### 🐸 1. "Eat the Frog" Daily Priority Focus
Highlights your single most non-negotiable critical task at the top of your planner each morning, ensuring you tackle your hardest priority before willpower drains.

### 🧠 2. Smart Micro-Task Decomposer (Anti-Paralysis Button)
Staring at a big, vague task like *"Prepare presentation"* triggers brain paralysis. Click the **"Break Down"** button on any task to instantly split it into 3–4 non-threatening 5-minute micro-subtasks.

### 📊 3. Eisenhower Priority Decision Matrix
Organize tasks effortlessly into 4 quadrants (*Do First*, *Schedule*, *Delegate*, *Eliminate*) to maintain visual clarity and eliminate decision fatigue.

### 🍅 4. Integrated Pomodoro Focus Timer & Fullscreen Shield
Built-in 25-minute Focus / 5-minute Rest timer linked directly to your active task. Features Web Audio synthesized focus chimes, native OS lock-screen notifications, and a fullscreen distraction shield.

### ⚡ 5. "Low Energy / Quick Wins" Filter
Feeling tired or unmotivated? Click **"⚡ Low Energy Filter"** to surface sub-15-minute quick win tasks to gain instant dopamine momentum.

### 🌅 6. Guided 60-Second Morning Planning Ritual
A 60-second morning planning wizard that prompts you to select today's #1 Frog priority task before starting your work session.

### 🔄 7. 1-Click Google Account Cross-Device Sync ($0.00 Cost)
Sign in with your Google account on any phone, tablet, or PC to automatically sync tasks, subtasks, habits, and focus stats in real-time (< 0.5s) via Firebase Realtime Database. Zero manual JSON exporting needed.

### 📱 8. Offline-First PWA (iOS, Android, Windows, macOS)
Installable directly onto iPhone/Android Home Screens and Windows/macOS Desktops as a standalone native app with zero setup required.

---

## 🛠️ Tech Stack

* **Frontend Framework**: React 18
* **Build Tool & Bundler**: Vite 6
* **Styling & UI**: Tailwind CSS v3 (Minimalist Alabaster & Crisp Slate Theme)
* **Icons**: Lucide React
* **Micro-Interactions**: Canvas-Confetti
* **Cloud Database & Auth**: Firebase SDK v10 (Realtime Database & Google Authentication)
* **Audio Synthesizer**: Web Audio API (Native chimes without external MP3 files)
* **OS Notifications**: Native Web Notifications API
* **PWA & Offline Support**: `vite-plugin-pwa` with Workbox Service Worker

---

## 🚀 Quick Start Guide

### Prerequisites
* [Node.js](https://nodejs.org/) v18 or higher
* npm v9 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sushincm/Todolist.git
   cd Todolist
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🎨 Color Palette (Minimalist Light Theme)

| Color Code | Name | Purpose |
|---|---|---|
| `#FAF9F6` | Alabaster Canvas | Pristine, non-glare off-white background |
| `#FFFFFF` | Pure White | Elevated card containers and modal surfaces |
| `#0F172A` | Deep Slate Graphite | Primary typography, headers, and action buttons |
| `#10B981` | Emerald Green | Achievement indicators, progress bars & focus status |

---

## 📜 License
Licensed under the [MIT License](LICENSE).
