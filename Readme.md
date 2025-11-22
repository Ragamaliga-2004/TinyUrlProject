TinyLink – URL Shortener (Node.js + Express + PostgreSQL + React + Vite + Sass)
TinyLink is a lightweight URL shortener web application built with:
    • Backend: Node.js, Express, PostgreSQL (Railway)
    • Frontend: React, Vite, Sass (SCSS)
    • Hosting: Ready for deployment to Railway + Vercel
It includes:
    • Short URL generation
    • Click tracking
    • Stats dashboard
    • CRUD operations
    • Redirect service
This README describes project setup, environment variables, API endpoints, UI behavior, and deployment workflow.

🧱 Project Architecture

tinylink/
│
├── tinylink-backend/     → Express API + Redirect Service
│   ├── src/
│   │    ├── index.js
│   │    ├── db.js
│   │    ├── routes/
│   │         ├── links.js
│   │         └── redirect.js
│   ├── package.json
│   └── README.md
│
├── tinylink-frontend/    → React + Vite + Sass UI
│   ├── src/
│   │    ├── components/
│   │    ├── pages/
│   │    ├── styles/
│   │    ├── App.jsx
│   │    └── api.js
│   ├── package.json
│   └── README.md
│
└── README.md (this file)


🚀 Features
Backend
    • Create new short URLs
    • Optional custom short code ([A-Za-z0-9]{6,8})
    • Redirect handler (GET /:code)
    • Click tracking (total_clicks, last_clicked_at)
    • RESTful CRUD endpoints
    • PostgreSQL connection pooling
    • Complete error handling
    • Environment-variable-based configuration
Frontend
    • Dashboard with:
        ○ Form to create links
        ○ Full links table (Copy, Stats, Delete)
    • Stats page:
        ○ View short URL
        ○ Copy button
        ○ Click statistics
    • Clean UI using SCSS
    • API integration with backend
    • Short URL base configurable via VITE_SHORT_BASE_URL

⚙️ Tech Stack
Backend
    • Node.js
    • Express
    • PostgreSQL
    • pg (Pool)
    • dotenv
    • CORS
Frontend
    • React (Vite)
    • react-router-dom@6
    • Sass (SCSS)
    • Fetch API integration

🔧 Environment Variables
Backend (tinylink-backend/.env)

PORT= localhost portNumber
NODE_ENV=development
DATABASE_URL=railway postgres db url 

Frontend (tinylink-frontend/.env)

VITE_API_BASE_URL=http://localhost:3000
VITE_SHORT_BASE_URL=http://localhost:3000
When deploying:

VITE_API_BASE_URL=https://your-railway-backend.app
VITE_SHORT_BASE_URL=https://your-railway-backend.app

🛠️ Backend API Documentation
Health Check

GET /healthz
Create Link

POST /api/links
{
  "targetUrl": "https://example.com",
  "customCode": "MyLink1"  // optional
}
Validations:
    • targetUrl must be http or https
    • customCode must match [A-Za-z0-9]{6,8}
Responses:
    • 201 Created
    • 400 Bad Request
    • 409 Conflict

List All Links

GET /api/links

Get Stats for One Link

GET /api/links/:code
    • Returns metadata: clicks, timestamps, URLs
    • 404 when not found

Delete Link

DELETE /api/links/:code
Returns:
    • 204 No Content
    • 404 Not Found

Redirect Handler

GET /:code
Behavior:
    • Validates code (6–8 alphanumeric)
    • Looks up target URL
    • Increments click count
    • Sets last_clicked_at
    • Redirects using 302

🎨 Frontend UI Features
Dashboard
    • Create short URLs
    • Custom code support
    • Input validation
    • Friendly error messages (400, 409)
    • Table of all links with:
        ○ Code
        ○ Short URL (Copy)
        ○ Target URL (truncated)
        ○ Total clicks
        ○ Last clicked
        ○ Actions (Copy/Stats/Delete)
    • Auto-refresh after create or delete
Stats Page
    • Displays:
        ○ Short URL + Copy
        ○ Target URL
        ○ Total clicks
        ○ Last clicked timestamp
        ○ Created timestamp
    • Error states:
        ○ Loading
        ○ 404 Not Found
        ○ General network error

🧪 Running Locally
Backend

cd tinylink-backend
npm install
npm run dev
Runs at:

http://localhost:3000

Frontend

cd tinylink-frontend
npm install
npm run dev
Runs at:

http://localhost:5173

🌐 Deployment Guide
Deploy Backend (Railway)
    1. Push repository to GitHub
    2. Create a Railway project → Deploy from GitHub
    3. Add PostgreSQL add-on
    4. Railway auto-injects PG variables
    5. Set:

PORT = 3000
    6. Deploy → receive backend URL:

https://tinylink-api.up.railway.app

Deploy Frontend (Vercel or Netlify)
For Vercel:
Set environment variables:

VITE_API_BASE_URL=https://tinylink-api.up.railway.app
VITE_SHORT_BASE_URL=https://tinylink-api.up.railway.app
Then:

npm run build
Deploy the /dist folder.

📈 Database Schema
Your PostgreSQL links table:

CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  target_url TEXT NOT NULL,
  total_clicks INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

🧰 Useful Commands
Drop table:

DROP TABLE links;
Recreate:

-- same CREATE statement as above

📄 License
MIT License – free to use, modify, and deploy.
