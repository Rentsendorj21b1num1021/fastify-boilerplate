# Fastify MongoDB Boilerplate

Production-ready REST API boilerplate built with Fastify, MongoDB, and TypeScript. Designed for high-traffic applications.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Fastify |
| Database | MongoDB + Mongoose |
| Cache | Redis |
| Language | TypeScript |
| Validation | Zod |
| Auth | JWT + Refresh Token |
| Linting | Biome |
| Testing | Vitest |

## Features

- **Authentication** — Register, Login, Logout, Refresh Token
- **Validation** — Request validation with Zod, structured error responses
- **Caching** — Redis integration with cache utility
- **Security** — Helmet, CORS, Rate limiting (100 req/min)
- **Logging** — Pino structured logging with request ID tracking
- **API Docs** — Swagger UI at `/docs`
- **Health Check** — `/health` endpoint for load balancers
- **Graceful Shutdown** — Handles SIGTERM/SIGINT signals
- **Docker** — Multi-stage Dockerfile + Docker Compose (app + MongoDB + Redis)
- **Env Validation** — Validates all environment variables on startup

## Project Structure

```
src/
├── handlers/               # 1 file = 1 API endpoint
│   ├── auth/
│   │   ├── register.ts    POST /api/v1/auth/register
│   │   ├── login.ts       POST /api/v1/auth/login
│   │   ├── refresh.ts     POST /api/v1/auth/refresh
│   │   └── logout.ts      POST /api/v1/auth/logout
│   └── user/
│       ├── getUser.ts     GET    /api/v1/users/:id
│       ├── getAllUsers.ts  GET    /api/v1/users
│       ├── updateUser.ts  PUT    /api/v1/users/:id
│       └── deleteUser.ts  DELETE /api/v1/users/:id
├── services/               # Business logic
├── models/                 # Mongoose models
├── schemas/                # Zod validation schemas
├── plugins/                # Fastify plugins (MongoDB, JWT, Redis, Swagger)
├── routes/                 # Route registration
├── middlewares/            # Auth middleware
├── config/                 # Environment config with validation
├── utils/
│   ├── response.ts         # Unified response helper
│   ├── cache.ts            # Redis cache helper
│   └── logger.ts           # Pino logger config
├── app.ts                  # App factory
└── server.ts               # Entry point + graceful shutdown
tests/
├── helpers/
│   └── buildTestApp.ts     # Lightweight test instance (no DB/Redis)
├── auth/
│   └── register.test.ts
└── health.test.ts
scripts/
└── init.sh                 # New project bootstrap script
```

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB
- Redis

### Local Development

```bash
# 1. Clone the repo
git clone https://github.com/Rentsendorj21b1num1021/fastify-boilerplate.git
cd fastify-boilerplate

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 4. Start the server
npm run dev
```

### Docker

```bash
# Start app + MongoDB + Redis
docker compose up

# Run in background
docker compose up -d
```

## Environment Variables

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mydb
JWT_SECRET=your_jwt_secret_minimum_8_chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_secret_minimum_8_chars
REFRESH_TOKEN_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
```

> All variables are validated on startup. Missing or invalid values will cause the server to exit with a clear error message.

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login | No |
| POST | `/api/v1/auth/refresh` | Refresh access token | No |
| POST | `/api/v1/auth/logout` | Logout | Yes |

### Users

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/users` | Get all users (paginated) | Yes |
| GET | `/api/v1/users/:id` | Get user by ID | Yes |
| PUT | `/api/v1/users/:id` | Update user | Yes |
| DELETE | `/api/v1/users/:id` | Delete user | Yes |

### System

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/docs` | Swagger UI |

## Response Format

All responses follow a consistent structure:

**Success**
```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

**Error**
```json
{
  "success": false,
  "message": "Error description"
}
```

**Validation Error**
```json
{
  "success": false,
  "message": "Validation алдаа",
  "errors": [
    { "field": "email", "message": "Invalid email" }
  ]
}
```

## Authentication

The API uses JWT Bearer tokens.

```bash
# 1. Login to get tokens
curl -X POST /api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Response
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}

# 2. Use access token in requests
curl /api/v1/users \
  -H "Authorization: Bearer eyJ..."

# 3. Refresh when access token expires
curl -X POST /api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "eyJ..."}'
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run lint         # Lint source files
npm run format       # Format source files
npm run check        # Lint + format together
```

## Adding a New Module

```bash
# Example: adding a "product" module
```

**1. Create schema** — `src/schemas/product.schema.ts`
```ts
import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
})
```

**2. Create model** — `src/models/product.model.ts`

**3. Create service** — `src/services/product.service.ts`

**4. Create handlers** — `src/handlers/product/createProduct.ts`
```ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { createProductSchema } from '../../schemas/product.schema'
import * as productService from '../../services/product.service'
import { sendSuccess } from '../../utils/response'

export async function createProduct(req: FastifyRequest, reply: FastifyReply) {
  const data = createProductSchema.parse(req.body)
  const product = await productService.createProduct(data)
  sendSuccess(reply, product, { statusCode: 201 })
}
```

**5. Register route** — `src/routes/product.route.ts`
```ts
import { FastifyInstance } from 'fastify'
import { createProduct } from '../handlers/product/createProduct'
import { authenticate } from '../middlewares/auth'

export async function productRoutes(fastify: FastifyInstance) {
  fastify.post('/', { preHandler: authenticate }, createProduct)
}
```

**6. Register in app.ts**
```ts
fastify.register(productRoutes, { prefix: '/api/v1/products' })
```

## Using Redis Cache

```ts
import { createCache } from '../utils/cache'

export async function getProductById(fastify, id: string) {
  const cache = createCache(fastify)
  const cacheKey = `product:${id}`

  const cached = await cache.get(cacheKey)
  if (cached) return cached

  const product = await ProductModel.findById(id)
  await cache.set(cacheKey, product, 300) // cache for 5 minutes

  return product
}
```

## Creating a New Project from This Template

```bash
# Clone and run the init script
git clone https://github.com/Rentsendorj21b1num1021/fastify-boilerplate.git
cd fastify-boilerplate
./scripts/init.sh my-new-project

# Then
cd my-new-project
# Fill in .env values
npm run dev
```

## License

MIT
