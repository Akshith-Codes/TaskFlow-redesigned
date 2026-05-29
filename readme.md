# TaskFlow

A full-stack project management app built with React, Node.js, MongoDB, and Socket.io — featuring real-time collaboration, drag-and-drop cards, board health tracking, and more.

**Live Demo → [task-flow-redesigned.vercel.app](https://task-flow-redesigned.vercel.app)**

---

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router DOM v7
- Axios
- Socket.io Client
- Tailwind CSS v4
- DnD Kit (drag and drop)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Socket.io
- JWT (auth via HTTP-only cookies)
- Nodemailer (email verification)
- Multer (file uploads)
- bcryptjs

**Deployed on**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## Features

- **Authentication** — Register, login, email verification, JWT via HTTP-only cookies
- **Boards** — Create, delete, and customize project boards with background colors
- **Lists** — Create and delete lists within boards (Today / This Week / Later defaults protected)
- **Cards** — Create cards with title, description, priority (low / medium / high), and status (todo / in progress / done)
- **Drag & Drop** — Move cards between lists with DnD Kit
- **Unassigned Cards** — Global card pool in the sidebar, drag into any list
- **Real-time** — Socket.io syncs card creates, updates, moves, and deletes across all connected clients
- **Activity Log** — Every board action is tracked and viewable in a slide-out panel
- **Board Invites** — Invite members to boards, accept or decline invites
- **Members** — View and manage board members
- **Board Settings** — Update board title and background color
- **File Attachments** — Attach files to cards via Multer upload
- **Search** — Filter cards and lists in real time with match highlighting
- **Board Progress Bar** — Visual progress tracker across all cards on the board
- **Board Health Score** — Calculated score (0–100) based on completion rate and overdue cards
- **Focus Mode** — Hide the sidebar to maximise the board view
- **Keyboard Shortcuts** — `/` search · `M` members · `A` activity · `F` focus · `Esc` close
- **Card Timer** — Session-based elapsed timer on every card
- **Card Age Indicator** — Shows how old a card is; highlights red if overdue (7+ days)
- **Confetti** — Fires when a board reaches 100% completion
- **Dark / Light Mode** — Toggle from the board navbar

---

## Project Structure

```
TaskFlow/
├── backend/
│   ├── controllers/
│   │   ├── ActivityController.js
│   │   ├── AuthController.js
│   │   ├── BoardController.js
│   │   ├── CardController.js
│   │   ├── ListController.js
│   │   └── UploadController.js
│   ├── middlewares/
│   │   ├── AuthMiddleware.js
│   │   ├── ErrorMiddleware.js
│   │   └── UploadMiddleware.js
│   ├── models/
│   │   ├── ActivityModel.js
│   │   ├── boardModel.js
│   │   ├── cardModel.js
│   │   ├── ListModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── ActivityRoutes.js
│   │   ├── AuthRoutes.js
│   │   ├── BoardRoutes.js
│   │   ├── CardRoutes.js
│   │   ├── ListRoutes.js
│   │   └── UploadRoutes.js
│   ├── sockets/
│   │   └── socket.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/
        │   └── api.js
        ├── components/board/
        │   ├── ActivityPopup.jsx
        │   ├── BoardNavbar.jsx
        │   ├── CardItem.jsx
        │   ├── ListColumn.jsx
        │   ├── MembersPopup.jsx
        │   ├── SettingsPopup.jsx
        │   └── Sidebar.jsx
        ├── pages/
        │   ├── BoardPage.jsx
        │   ├── Dashboard.jsx
        │   ├── login.jsx
        │   ├── Register.jsx
        │   └── VerifyEmail.jsx
        ├── index.css
        └── routes.jsx
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- A Gmail account for Nodemailer (or any SMTP provider)

---

### 1. Clone the repo

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
PORT=5000
DB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/taskflow
JWT_SECRET=your_jwt_secret
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
# development
npx nodemon server.js

# production
npm start
```

---

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in `/frontend`:

```env
VITE_API_URL=http://localhost:5000/api
```

Update `src/api/api.js` to use the env var if running locally:

```js
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
```

Start the frontend:

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

### 4. CORS

For local development, make sure `backend/server.js` includes `localhost:5173` as an allowed origin:

```js
app.use(cors({
  origin: [
    "https://task-flow-redesigned.vercel.app",
    "http://localhost:5173",
  ],
  credentials: true,
}));
```

And update the Socket.io CORS in `backend/sockets/socket.js` the same way.

---

## Deployment

| Service | Config |
|---|---|
| **Vercel** (frontend) | Root: `frontend/`, Build: `npm run build`, Output: `dist` |
| **Render** (backend) | Root: `backend/`, Start: `node server.js`, add all `.env` vars in dashboard |
| **MongoDB Atlas** | Whitelist `0.0.0.0/0` for Render's dynamic IPs |

---

## Environment Variables Summary

| Variable | Where | Description |
|---|---|---|
| `DB_URL` | backend | MongoDB connection string |
| `JWT_SECRET` | backend | Secret for signing JWTs |
| `EMAIL_USER` | backend | SMTP email address |
| `EMAIL_PASS` | backend | SMTP app password |
| `CLIENT_URL` | backend | Frontend URL for email links |
| `PORT` | backend | Server port (default 5000) |
| `VITE_API_URL` | frontend | Backend API base URL |

---
