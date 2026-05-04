# CartLabs

CartLabs is a production-style e-commerce application with a React + Vite frontend and a FastAPI + PostgreSQL backend. It includes JWT authentication, protected shopping routes, product search/filtering/pagination, cart management, addresses, checkout, order persistence, and order tracking.

## Folder Structure

```text
backend/
  app/
    main.py
    config.py
    database.py
    dependencies.py
    seed.py
    models/
    schemas/
    routes/
    services/
    utils/
  requirements.txt
  .env.example

frontend/
  src/
    pages/
    components/
    context/
    services/api.js
    routes/
  package.json
  tailwind.config.js
  vite.config.js
```

## Backend Setup

1. Create a PostgreSQL database named `cartlabs`.
2. Create and activate a virtual environment:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

3. Update `backend/.env` if your PostgreSQL credentials differ.
4. Run the API:

```bash
uvicorn app.main:app --reload
```

The backend runs at `http://localhost:8000`. Tables are created on startup and sample products are inserted when the products table is empty.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`. Set `VITE_API_BASE_URL` if the backend is not running on `http://localhost:8000`.

## Docker Compose Setup

Run the full stack with PostgreSQL, FastAPI, and the React production build:

```bash
docker compose up --build
```

Open:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API health: `http://localhost:8000/health`

Stop the stack:

```bash
docker compose down
```

Reset database data:

```bash
docker compose down -v
```

## API Summary

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /products`
- `GET /products/{id}`
- `GET /products/{id}/similar`
- `GET /cart`
- `POST /cart/add`
- `PUT /cart/update`
- `DELETE /cart/remove`
- `POST /address`
- `GET /address`
- `PUT /address/select-primary`
- `POST /orders`
- `GET /orders`
- `GET /orders/{id}`

## Sample Product Data

The backend seeds products from `backend/app/seed.py`, including electronics, fashion, home, kitchen, and travel items with Unsplash image URLs, ratings, categories, descriptions, and prices.
