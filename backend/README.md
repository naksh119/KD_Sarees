# Backend (Node.js + Express)

Main entry: **server.js**

## Folder structure

| Folder       | Purpose |
|-------------|---------|
| **config**  | Database and app config (e.g. `db.js` for MongoDB) |
| **controllers** | Request handlers / business logic |
| **models**  | Mongoose schemas (for MongoDB when added) |
| **routes**  | API route definitions → controllers |
| **middleware** | Auth, validation, error handling |
| **utils**   | Shared helpers |
| **uploads** | Static files (e.g. uploaded images) |

## Example API

- `GET /api/health` – health check  
- `GET /api/items` – list items (example)  
- `GET /api/items/:id` – get one item (example)

## Run

```bash
npm install
npm run dev
```

Server runs at `http://localhost:5000` (or set `PORT` in `.env`).

## MongoDB (future)

1. Add `MONGODB_URI` to `.env`.
2. In `server.js`, require and run `connectDB()` before `app.listen`.
3. In controllers, use the Mongoose models from `models/`.
