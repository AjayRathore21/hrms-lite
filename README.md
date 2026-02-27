# HRMS Lite

A modern, lightweight Human Resource Management System (HRMS) built for efficient workforce tracking and attendance management.

## 🚀 Features

- **Workforce Management**: Add, view, and manage employee records with ease.
- **Attendance Tracking**: Real-time daily attendance marking.
- **Attendance History**: View and filter historical attendance records by employee, date, or status.
- **Analytics Dashboard**: Visual overview of total workforce, active employees, and daily statistics.
- **Modern UI**: Clean, premium interface built with Ant Design and custom SCSS.
- **Responsive Design**: Fully functional across mobile, tablet, and desktop.

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **State Management**: Zustand
- **UI Components**: Ant Design (v5)
- **Styling**: SCSS (Modular Architecture)
- **Build Tool**: Vite

### Backend

- **Framework**: FastAPI (Python)
- **Database ORM**: Prisma (Python Client)
- **Validation**: Pydantic v2
- **Database**: PostgreSQL (via Supabase)

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL Database

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hrms
   ```

2. **Backend Setup**

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   # Setup .env with DATABASE_URL
   prisma generate
   uvicorn app.main:app --reload
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📄 License

MIT License
