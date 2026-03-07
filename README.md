# KD Sarees – Full-stack project

Modern web app structure: React (Vite) frontend + Node.js/Express backend, ready to scale.

## Structure

```
kd_sarees/
├── frontend/          # React (Vite) – client
│   └── src/
│       ├── components/   # Reusable UI
│       ├── pages/        # Page/screen components
│       ├── services/     # API calls to backend
│       ├── hooks/        # Custom React hooks
│       ├── context/      # React Context providers
│       ├── assets/       # Images, fonts
│       ├── styles/       # Global/shared styles
│       └── utils/        # Helpers
│
├── backend/           # Node.js + Express – server
│   ├── config/          # DB and app config
│   ├── controllers/     # Request handlers
│   ├── models/          # Mongoose models (MongoDB)
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, errors, etc.
│   ├── utils/           # Helpers
│   ├── uploads/         # Uploaded files
│   └── server.js        # Entry point
```

## Run

**Backend**

```bash
cd backend
npm install
cp .env.example .env   # optional
npm run dev
```

Runs at `http://localhost:5000`.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL=http://localhost:5000` in frontend `.env` if the API is on another origin.

## Example flow

- **API:** `GET /api/items` → `routes/itemRoutes.js` → `controllers/itemController.getItems`
- **Frontend:** `ItemsPage.jsx` uses `services/itemService.getItems()` and renders the list.

See `backend/README.md` and folder `README.md` files for details.
