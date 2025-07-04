<div align="center">

# 🤖 TaskAI - AI-Powered Task Management

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
<img src="https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />

**Transform your team's productivity with intelligent task prioritization, deadline management, and AI-driven insights.**

[🚀 Live Demo](https://team-ai-focus-git-main-fredrick2216s-projects.vercel.app/) • [📖 Documentation](#-features) • [🐛 Report Bug](https://github.com/Fredrick2216/TaskAI/issues)

</div>

---

## ✨ Features

### 🧠 **AI-Powered Intelligence**
- **Smart Priority Sorting**: Advanced algorithms analyze deadlines, dependencies, and team capacity
- **Predictive Analytics**: AI-driven insights for task completion and productivity trends
- **Automated Recommendations**: Intelligent suggestions for task optimization

### 👥 **Team Collaboration**
- **Real-time Updates**: Seamless collaboration with live synchronization
- **Team Dashboard**: Comprehensive overview of team performance and progress
- **Role-based Access**: Secure permission management for team members

### 📊 **Advanced Analytics**
- **Performance Insights**: Track individual and team productivity metrics
- **Visual Dashboards**: Beautiful charts and graphs powered by Recharts
- **Trend Analysis**: Historical data visualization and pattern recognition

### 🎯 **Project Management**
- **Kanban Boards**: Drag-and-drop task management interface
- **Project Timeline**: Smart scheduling and deadline tracking
- **Progress Monitoring**: Real-time project completion tracking

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
<br>React 18
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=typescript" width="48" height="48" alt="TypeScript" />
<br>TypeScript
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=tailwindcss" width="48" height="48" alt="Tailwind" />
<br>Tailwind CSS
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=supabase" width="48" height="48" alt="Supabase" />
<br>Supabase
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=vite" width="48" height="48" alt="Vite" />
<br>Vite
</td>
</tr>
<tr>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" alt="React Query" />
<br>TanStack Query
</td>
<td align="center" width="96">
<img src="https://lucide.dev/logo.dark.svg" width="48" height="48" alt="Lucide" />
<br>Lucide Icons
</td>
<td align="center" width="96">
<img src="https://ui.shadcn.com/favicon.ico" width="48" height="48" alt="shadcn/ui" />
<br>shadcn/ui
</td>
<td align="center" width="96">
<img src="https://recharts.org/statics/logo.svg" width="48" height="48" alt="Recharts" />
<br>Recharts
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=vercel" width="48" height="48" alt="Vercel" />
<br>Vercel
</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Fredrick2216/TaskAI.git
   cd TaskAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 📱 Screenshots

<div align="center">

### 🏠 Dashboard Overview
<img src="https://via.placeholder.com/800x400/1a1a2e/ffffff?text=TaskAI+Dashboard" alt="Dashboard" width="600" />

### 📊 Analytics & Reports
<img src="https://via.placeholder.com/800x400/16213e/ffffff?text=Analytics+Dashboard" alt="Analytics" width="600" />

### 👥 Team Collaboration
<img src="https://via.placeholder.com/800x400/0f3460/ffffff?text=Team+Management" alt="Team" width="600" />

</div>

---

## 📂 Project Structure

```
TaskAI/
├── 📁 src/
│   ├── 📁 components/        # Reusable UI components
│   │   ├── 📁 analytics/     # Analytics components
│   │   ├── 📁 dashboard/     # Dashboard components
│   │   ├── 📁 projects/      # Project management
│   │   ├── 📁 tasks/         # Task components
│   │   ├── 📁 team/          # Team collaboration
│   │   └── 📁 ui/            # shadcn/ui components
│   ├── 📁 hooks/             # Custom React hooks
│   ├── 📁 integrations/      # External service integrations
│   ├── 📁 lib/               # Utility functions
│   ├── 📁 pages/             # Application pages
│   └── 📁 services/          # API services
├── 📁 supabase/              # Database migrations & functions
└── 📄 package.json
```

---

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL migrations from `/supabase/migrations/`
3. Enable Row Level Security (RLS)
4. Configure authentication providers

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


## 👨‍💻 Developer

<div align="center">

### Leonard Fredrick



[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/leonard-fredrick-8807042a5/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Fredrick2216)

*Passionate about creating intelligent solutions that enhance productivity and user experience.*

</div>

---

## 🌟 Show Your Support

If you found this project helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing to the codebase

---

