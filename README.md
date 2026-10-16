# NoteKeeper — Personal Notes App

A secure full-stack note-taking app with MongoDB, Express, React, and JWT auth.

## Features
- Register / Login with JWT auth
- Create, Edit, Delete notes
- Search notes (title, content, tags)
- Tag notes (click tag to filter)
- Pin important notes
- User-specific data isolation

## REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/notes?search=&tag=` | Get all notes |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

## JSON Schema

```json
{
  "title": "My Note",
  "content": "Note body text",
  "tags": ["work", "idea"],
  "pinned": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally on `mongodb://localhost:27017`

### Server
```bash
cd server
npm install
npm run dev   # runs on port 5000
```

### Client
```bash
cd client
npm install
npm run dev   # runs on port 3000
```

Open http://localhost:3000
