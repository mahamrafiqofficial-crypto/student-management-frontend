# Student Management System — Frontend

A React frontend for the Student Management System, built with Vite, React Router, and Axios. Connects to the Student Management API v2 backend (Express + MongoDB + JWT).

## Tech Stack
- React 18 (Vite)
- React Router DOM
- Axios
- Context API (for auth state)

## Features
- Register / Login
- Protected Dashboard (redirects to login if not authenticated)
- Add / Edit / Delete students
- Search students by name
- Logout

## Project Structure
```
student-management-frontend/
├── src/
│   ├── api/axios.js          # Axios instance with auto token attachment
│   ├── context/AuthContext.jsx
│   ├── components/ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Register.jsx
│   │   ├── Login.jsx
│   │   └── Dashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
└── .env.example
```

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file (copy from `.env.example`) and set your backend URL:
   ```
   VITE_API_URL=http://localhost:5000
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open the app at:
   ```
   http://localhost:5173
   ```

> Make sure the backend (`student-management-api-v2`) is running at the same time on port 5000.

## Deployment
This frontend is built for deployment on **Vercel**. See the main submission notes for step-by-step deployment instructions.
