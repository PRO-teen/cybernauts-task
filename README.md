User Relationship & Hobby Network

Full-Stack Project – React + TypeScript (Frontend), Node.js + Express + MongoDB (Backend)

Description

Interactive network of users and friendships:

# CRUD users

Link/unlink friendships

Drag & drop hobbies onto users

Popularity score affects node size & color

Dynamic React Flow graph

# Tech Stack

Frontend: React + TS, Tailwind CSS, React Flow

Backend: Node.js + Express + TS

Database: MongoDB

State Management: React Context API


# Setup

# Backend

 cd backend

 npm install

# Create backend/.env:
# PORT=5000
# MONGO_URL=<your_mongo_connection_string>

 npm run dev

# Frontend

cd frontend

npm install

# Create frontend/.env:
# VITE_API_URL=http://localhost:5000/api

npm run dev

# Usage

Manage users via User Management Panel

Connect users by dragging nodes

Click edges to unlink friendships

Drag hobbies from sidebar onto nodes

# API Endpoints
Method	Endpoint
GET	/api/users
POST	/api/users
PUT	/api/users/:id
DELETE	/api/users/:id
POST	/api/users/:id/link
DELETE	/api/users/:id/unlink
GET	/api/graph