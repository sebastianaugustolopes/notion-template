# Notion OS Template

> A powerful, modern project management dashboard inspired by Notion's aesthetics, built with **Angular** and **TailwindCSS**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Angular](https://img.shields.io/badge/Angular-v18+-dd0031.svg?logo=angular)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg?logo=tailwindcss)

## 🚀 Overview

**Notion OS Template** is a high-performance, single-page application (SPA) designed to help individuals and teams manage projects and tasks with style. It features a responsive, glassmorphic UI, real-time status updates, and a modular architecture that makes it easy to extend.

### Key Features

- **📊 Interactive Dashboard:** Visual breakdown of project stats, task completion rates, and upcoming deadlines using Chart.js.
- **✅ Task Management:** Create, edit, delete, and organize tasks with priority levels and status tracking.
- **📁 Project Hub:** Centralized management for multiple projects with diverse categories (Work, Personal, etc.).
- **🎨 Modern UI/UX:**
  - Fully responsive design compatible with all devices.
  - **Dark Mode Support** out-of-the-box.
  - Beautiful glassmorphism effects and smooth transitions.
  - Custom UI components (Select, Toastr, Modals).
- **⚡ Performance First:** Optimized for speed with Angular's latest change detection strategies and lazy loading.
- **🔍 Smart Search:** Global search functionality to quickly find projects and tasks.
- **👤 User Profile:** Personalized experience with avatar caching and persistence.

---

## 🛠️ Tech Stack

This project leverages the latest web technologies to deliver a premium user experience:

- **Framework:** [Angular](https://angular.io/) (Latest Version)
- **Styling:** [TailwindCSS 4](https://tailwindcss.com/) (PostCSS)
- **Icons:** SVG Icons & Heroicons
- **Charts:** [Chart.js](https://www.chartjs.org/)
- **Notifications:** `ngx-toastr`
- **State Management:** RxJS (BehaviorSubjects for local state)

---

## ⚙️ Installation & Setup

Follow these steps to get the project running on your local machine.

### Prerequisites

- **Node.js**: v18 or higher
- **NPM**: v9 or higher

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/notion-template.git
   cd notion-template
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy the example environment file and configure your API endpoints (if applicable).
   ```bash
   cp .env.example .env
   ```

4. **Start the Development Server**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200` in your browser. The application will automatically reload if you change any source files.

---

## 🏗️ Project Structure

The project follows a modular, scalable architecture:

```
src/
├── app/
│   ├── components/       # Reusable UI components (TaskItem, Modals, Layouts)
│   ├── pages/            # Main application views (Dashboard, Projects, Login)
│   ├── services/         # Business logic and API communication
│   ├── shared/           # Generic shared components (Select, Input, Badges)
│   └── types/            # TypeScript interfaces and type definitions
├── assets/               # Static assets (Images, Icons)
├── environments/         # Environment configuration
└── styles.css            # Global styles and Tailwind imports
```

---

## 🧩 Scripts

- `npm start`: Runs the app in development mode.
- `npm run build`: Builds the app for production to the `dist/` folder.
- `npm test`: Executes unit tests via [Karma](https://karma-runner.github.io).
- `npm run lint`: Runs code linting tools.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ by the Notion OS Team</p>
