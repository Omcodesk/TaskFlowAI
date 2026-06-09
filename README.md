# TaskFlow - Enterprise Employee Management System

![TaskFlow Header](https://via.placeholder.com/1200x400?text=TaskFlow+Enterprise)

TaskFlow is a modern, real-time Employee Management and Task Workflow platform built with the MERN stack (MongoDB, Express, React, Node.js). It transforms traditional task tracking into a fully collaborative, live workspace.

## 🌟 Core Features

- **Drag-and-Drop Kanban Board:** Effortlessly manage project lifecycles with a fluid, tactile Kanban interface built on `@hello-pangea/dnd`.
- **Real-Time Collaboration (WebSockets):** Powered by `socket.io`. When a teammate updates a task, adds a comment, or changes a status, your screen updates instantly without refreshing.
- **AI Project Assistant:** Built-in OpenAI integration. Type a simple title, and the AI automatically generates a markdown-formatted subtask checklist and suggests priority levels based on context.
- **Advanced Analytics Dashboard:** Deep insights into team productivity using `Recharts`. Visualizes completion trends over time, current status distributions, and individual employee workloads.
- **Live Notifications & Presence:** Targeted real-time notifications for task assignments and mentions. A live "Online Presence" indicator in the navigation bar shows exactly who is actively using the app.
- **File Attachments:** Integrated `multer` allowing users to securely upload and preview images, PDFs, and documents directly within task cards.
- **Role-Based Access Control (RBAC):** Strict JWT-based authentication delineating between `Admin` (oversight and creation) and `Employee` (task execution).

## 🚀 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion (Animations), React Query (State Management), React Router, Lucide Icons, Recharts.
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io, Multer (File Uploads), OpenAI API.
- **Authentication:** JSON Web Tokens (JWT), bcryptjs.

## 🛠️ Installation & Setup

Follow these instructions to get TaskFlow running on your local machine.

### Prerequisites
- Node.js (v16+)
- MongoDB (Local instance or MongoDB Atlas cluster)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (use `.env.example` as a template):
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key_here # Optional (Falls back to simulation mode if omitted)
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd ../ems # or the frontend root directory
npm install
```

Start the Vite development server:
```bash
npm run dev
```

### 4. Access the App
Open your browser and navigate to `http://localhost:5173`. 

## Demo Credentials (If using seeded database)

### Admin
- Email: admin@demo.com
- Password: demo123

### Employee
- Email: employee@demo.com
- Password: demo123

*(To test the full suite, register a new account and approve it from the Admin dashboard!)*

## 📦 Production Build
To prepare the frontend for deployment:
```bash
npm run build
```
This generates an optimized static bundle in the `dist/` directory, ready to be hosted on Vercel, Netlify, or served via Express.

---
*TaskFlow - Built with modern web standards.*
