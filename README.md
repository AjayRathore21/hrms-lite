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
   # Setup .env with DATABASE_URL (See Note Below)
   prisma generate
   uvicorn app.main:app --reload
   ```

   > **⚠️ Note for Developers in India**:
   > Some Indian ISPs currently block direct access to Supabase. If you face connection issues (`P1001`), try switching between the **Direct** and **Pooler** URLs in your `.env` file or use a VPN.

   **Database URLs for Local Testing:**
   - **Direct Connection (Default)**:
     `DATABASE_URL=postgresql://postgres:wP2VMTrlhsQ9kvnj@db.tcialorjntdxqyltneol.supabase.co:5432/postgres`
   - **Connection Pooler (Backup)**:
     `DATABASE_URL=postgresql://postgres.tcialorjntdxqyltneol:wP2VMTrlhsQ9kvnj@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true`

   > **📢 Important Security Note**: The credentials above are provided strictly for evaluation and testing. This database and project will be deleted immediately following the evaluation period.

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📄 License

MIT License
