# MiniWA Template (Angular + Node + Mongo + SymPy)

Template projekta "Mini Wolfram Alpha" (MiniWA).

## Struktura
- `client/` – Angular (routing + osnovni UI)
- `server/` – Node/Express API (JWT auth + skeleton)
- `sympy-service/` – Python (Flask) mikroservis za SymPy (skeleton)

## Pokretanje
### MongoDB
Pokreni lokalno ili Atlas.

### Backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### SymPy servis
```bash
cd sympy-service
python -m venv .venv
# Windows:
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd client
npm install
npm start
```

- Frontend: http://localhost:4200
- Backend: http://localhost:3000
- SymPy: http://localhost:5001
