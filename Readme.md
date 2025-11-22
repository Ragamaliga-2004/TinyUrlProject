# 🔗 TinyLink – URL Shortener (Node.js + Express + PostgreSQL + React + Vite + Sass)

TinyLink is a lightweight URL shortener web application built with a modern, decoupled stack.

**Key Features:**

* **Short URL generation** and **Redirect service** (`GET /:code`)
* **Click tracking** and **Stats dashboard**
* **Full CRUD** operations via a RESTful API
* **Optional custom short codes**

## 🧱 Project Architecture

The project is structured as a monorepo with separate directories for the frontend and backend, enabling independent development and deployment.


```
├── tinylink-backend/ 
│   ├── .env                       // Environment variables for Node/DB connection
│   ├── package.json               // Backend dependencies and scripts
│   ├── README.md
│   └── src/
│       ├── db.js                  // PostgreSQL connection pool setup
│       ├── index.js               // Main Express server file, entry point
│       └── routes/
│           ├── links.js           // Routes for CRUD operations on links (/api/links)
│           └── redirect.js        // Route handler for redirection and click tracking (/:code)
│
├── tinylink-frontend/
│   ├── .env                       // Environment variables for VITE/API URL
│   ├── package.json               // Frontend dependencies (React, Vite)
│   ├── README.md
│   └── src/
│       ├── api.js                 // Functions for interacting with the backend API
│       ├── App.jsx                // Root React component and routing
│       ├── components/            // Reusable UI components (e.g., table rows, forms)
│       ├── pages/                 // Main views (e.g., Dashboard, StatsPage)
│       └── styles/                // Sass/SCSS files for styling
│
└── README.md                      // This file

```


---

## ⚙️ Tech Stack

### Backend (Node.js/Express)
* **Node.js**
* **Express**
* **PostgreSQL** (Hosted on **Railway**)
* `pg` (Pool for efficient database connections)
* `dotenv` (Configuration)
* `CORS` (Cross-Origin Resource Sharing)

### Frontend (React/Vite)
* **React** (Scaffolded with **Vite**)
* `react-router-dom@6`
* **Sass (SCSS)** for clean, modular styling
* Fetch API integration

---

## 🚀 Features

### Backend Capabilities
* Create new short URLs with automatic or **optional custom short codes** (matches `[A-Za-z0-9]{6,8}`).
* Dedicated **Redirect Handler** (`GET /:code`).
* **Click tracking** (`total_clicks`, `last_clicked_at`).
* **RESTful CRUD** endpoints for link management.
* Complete error handling (e.g., 400 Bad Request, 409 Conflict).

### Frontend UI Features
* **Dashboard** with:
    * Form to create new links.
    * Full links table (displaying Code, Short URL, Target URL, Clicks, Last Clicked).
    * Actions: **Copy**, **Stats**, **Delete**.
* **Stats Page** for a single link, showing detailed click statistics and timestamps.
* Clean, responsive UI styled with **SCSS**.
* Short URL base configurable via `VITE_SHORT_BASE_URL`.

---

## 🔧 Environment Variables

### Backend (`tinylink-backend/.env`)

| Variable | Description | Local Example |
| :--- | :--- | :--- |
| **`PORT`** | Localhost port for the Express server. | `PORT=3000` |
| **`NODE_ENV`** | Application environment. | `NODE_ENV=development` |
| **`DATABASE_URL`** | Connection string for the Railway PostgreSQL DB. | `DATABASE_URL=postgres://user:pass@host:port/db` |

### Frontend (`tinylink-frontend/.env`)

| Variable | Description | Local Example | Deployment Example |
| :--- | :--- | :--- | :--- |
| **`VITE_API_BASE_URL`** | The URL of the deployed Express API. | `VITE_API_BASE_URL=http://localhost:3000` | `https://your-railway-backend.app` |
| **`VITE_SHORT_BASE_URL`** | The base URL used to construct the final short link. | `VITE_SHORT_BASE_URL=http://localhost:3000` | `https://your-railway-backend.app` |

---

## 🛠️ Backend API Documentation

### Health Check
* `GET /healthz`

### Create Link
* `POST /api/links`

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `targetUrl` | String | The full URL to shorten. | `"https://example.com"` |
| `customCode` | String | **(Optional)** A custom code for the short link. | `"MyLink1"` |

**Validations:**
* `targetUrl` must be `http` or `https`.
* `customCode` must match `[A-Za-z0-9]{6,8}`.

**Responses:** `201 Created`, `400 Bad Request`, `409 Conflict` (Code already exists).

### List All Links
* `GET /api/links`

### Get Stats for One Link
* `GET /api/links/:code`
    * Returns metadata (clicks, timestamps, URLs).
    * **404** when not found.

### Delete Link
* `DELETE /api/links/:code`
    * Returns: `204 No Content`, `404 Not Found`.

### Redirect Handler
* `GET /:code`
    * **Behavior:** Validates code, looks up `target_url`, **increments `total_clicks`**, sets `last_clicked_at`, and redirects using **302 Found**.

---

## 🧪 Running Locally

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd tinylink-backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Ensure your **PostgreSQL database** is running (e.g., start your local PG instance or configure your Railway connection).
4.  Run the server:
    ```bash
    npm run dev
    ```
    The API runs at: `http://localhost:3000`

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd tinylink-frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Ensure your `tinylink-frontend/.env` variables point to the correct local backend URL (`http://localhost:3000`).
4.  Run the development server:
    ```bash
    npm run dev
    ```
    The UI runs at: `http://localhost:5173`

---

## 🌐 Deployment Guide

### Deploy Backend (Railway)

1.  Push your entire repository to **GitHub**.
2.  Create a new project on **Railway** and connect it to your GitHub repository.
3.  Add the **PostgreSQL add-on** to your Railway project.
4.  Railway will auto-inject the `DATABASE_URL` environment variable.
5.  Manually set the `PORT` variable to `3000` for the backend service.
6.  Upon deployment, you will receive the backend URL, e.g., `https://tinylink-api.up.railway.app`. This is your `API_BASE_URL`.

### Deploy Frontend (Vercel or Netlify)

1.  Connect your frontend repository (`tinylink-frontend`) to **Vercel** or **Netlify**.
2.  During configuration, set the following environment variables (Vercel/Netlify):

| Variable | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://tinylink-api.up.railway.app` |
| `VITE_SHORT_BASE_URL` | `https://tinylink-api.up.railway.app` |

3.  The service will build the project (`npm run build`) and deploy the static assets from the `/dist` folder.

---

## 📈 Database Schema

The `links` table in your PostgreSQL database is defined as follows:

```sql
CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    code VARCHAR(8) UNIQUE NOT NULL,
    target_url TEXT NOT NULL,
    total_clicks INTEGER DEFAULT 0,
    last_clicked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
🧰 Useful Database Commands
SQL

-- Drop table (use with caution)
DROP TABLE links;

-- Recreate table
-- Same CREATE statement as shown above
📄 License
This project is licensed under the MIT License. Feel free to use, modify, and deploy.
