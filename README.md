# Kompitrail 🏍️

**Plan, organize, and navigate group motorcycle rides**  
A full-featured web application for motorcyclists to create shared routes, manage group sign-ups, chat in real-time, and follow turn-by-turn navigation right from your phone.

## ✨ Key Features

### Route Planning
- Create itineraries with **start point, end point, and intermediate waypoints**
- Powered by **Mapbox** + **OpenRoute Service** for realistic motorcycle routing
- Automatic calculation of **distance, estimated time, elevation gain**
- Filters by **difficulty level**, bike type, max participants
- **Multilingual** support for place descriptions (i18n)

### Group Management & Social
- **Sign-up system** with participant limits
- **Real-time chat** per ride/event
- **Typing indicators** + Automatic system messages

### On-the-Road Navigation
- **Turn-by-turn guidance** like Google Maps (fullscreen mode)
- **Live GPS tracking** using Mapbox Directions API

### Security & System
- Full user **authentication** (register, login, password recovery)
- Multi-level **rate limiting** (API, chat, map requests)
- **Secured Mapbox tokens** with URL + scope restrictions
- Automatic place description translation via **DeepL API**

## 🛠️ Tech Stack

| Layer       | Main Technologies                                 |
|-------------|---------------------------------------------------|
| Frontend    | React • Material-UI (MUI) • Socket.io-client      |
| Backend     | Node.js • Express • Socket.io • MySQL             |
| Maps        | Mapbox GL JS • OpenRoute Service API              |
| Translations| i18next • DeepL API                               |
| Real-time   | Socket.io                                         |
| Other       | JWT authentication, rate-limiter-flexible, dotenv |

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js ≥ 18
- MySQL 8+
- Accounts & API keys: Mapbox, OpenRoute Service, DeepL

```bash
# 1. Clone the repo
git clone https://github.com/FGiannini95/Kompitrail.git
cd kompitrail

# 2. Backend
cd server
npm install
cp .env.example .env          # Fill in your API keys
npm run dev                   

# 3. Frontend 
cd client
npm install
npm run dev
```

### Environment Variables (`server/.env`)

```env
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
SECRET=
DB_PORT=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

FRONTEND_URL=

DEEPL_API_KEY=

OPENAI_API_KEY=

ORS_API_KEY=

MAPBOX_TOKEN=

VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_EMAIL=
```

## 🚀 Quick Start (Production)
- Visit the web => https://kompitrail.es/
