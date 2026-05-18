# AI-Based Employee Performance Analytics & Recommendation System

## Project Overview
This is a modern, production-ready full-stack MERN application designed to manage employee performance and provide AI-powered insights using OpenRouter (OpenAI-compatible APIs). It features a dark-themed, glassmorphism UI built with React and Tailwind CSS.

## Features
- **Authentication**: Secure JWT-based login and signup.
- **Dashboard Analytics**: Recharts-powered interactive charts.
- **Employee Management**: Full CRUD operations for employee data.
- **AI Recommendations**: Intelligent insights, promotion suggestions, and rankings using `gpt-4o-mini` via OpenRouter.
- **Search & Filter**: Real-time filtering by department, skills, and search terms.

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Recharts, Framer Motion, Axios, React Router.
- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose, JsonWebToken, BcryptJS, OpenAI SDK.

## Installation Steps

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd ai-based-employee-performance
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend` directory based on `.env.example`:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
\`\`\`
Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd frontend
npm install
\`\`\`
Create a `.env` file in the `frontend` directory based on `.env.example`:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`
Start the frontend development server:
\`\`\`bash
npm run dev
\`\`\`

## Deployment Steps

### Frontend (Vercel)
1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. Set the Framework Preset to Vite.
4. Set the Root Directory to `frontend`.
5. Add Environment Variable: `VITE_API_URL=https://your-backend-url.onrender.com/api`
6. Click Deploy.

### Backend (Render)
1. Go to [Render](https://render.com) and create a new Web Service.
2. Connect your GitHub repository.
3. Set the Root Directory to `backend`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add Environment Variables: `MONGO_URI`, `JWT_SECRET`, `OPENROUTER_API_KEY`.
7. Click Deploy.

### Database (MongoDB Atlas)
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Whitelist your IP (or allow all `0.0.0.0/0` for production).
3. Create a database user and password.
4. Get the connection string and place it in the `MONGO_URI` environment variable.

## API Documentation

### Auth APIs
- \`POST /api/auth/signup\` - Register admin
- \`POST /api/auth/login\` - Login admin

### Employee APIs (Requires Bearer Token)
- \`GET /api/employees\` - Get all employees
- \`GET /api/employees/search?department=HR\` - Search/Filter employees
- \`POST /api/employees\` - Add new employee
- \`PUT /api/employees/:id\` - Update employee
- \`DELETE /api/employees/:id\` - Delete employee

### AI APIs (Requires Bearer Token)
- \`POST /api/ai/recommend\` - Generate AI performance recommendations

## Live Demo
(Add links once deployed)
- Frontend: `https://frontend-url.vercel.app`
- Backend: `https://backend-url.onrender.com`
