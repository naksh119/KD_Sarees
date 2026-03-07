# KD Sarees – Full-stack project

Modern web app structure: React (Vite) client + Node.js/Express server, ready to scale.

## Structure

```
kd_sarees/
├── client/            # React (Vite) – frontend
│   └── src/
│       ├── components/   # Reusable UI
│       ├── pages/        # Page/screen components
│       ├── services/     # API calls to server
│       ├── hooks/        # Custom React hooks
│       ├── context/      # React Context providers
│       ├── assets/       # Images, fonts
│       ├── styles/       # Global/shared styles
│       └── utils/        # Helpers
│
├── server/            # Node.js + Express – API
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

**Server**

```bash
cd server
npm install
cp .env.example .env   # optional
npm run dev
```

Runs at `http://localhost:5000`.

**Client**

```bash
cd client
npm install
npm run dev
```

Set `VITE_API_URL=http://localhost:5000` in client `.env` if the API is on another origin.

## Example flow

- **API:** `GET /api/items` → `routes/itemRoutes.js` → `controllers/itemController.getItems`
- **Client:** `ItemsPage.jsx` uses `services/itemService.getItems()` and renders the list.

See `server/README.md` and folder `README.md` files for details.
