# Shopisop API

A RESTful e-commerce backend built with Node.js, Express, and PostgreSQL. It supports user authentication, product and inventory management, order processing, and M-Pesa payments via the Safaricom Daraja API.

---

## Tech Stack

- **Runtime:** Node.js (ESM modules)
- **Framework:** Express 5
- **Database:** PostgreSQL via Sequelize ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Payments:** M-Pesa STK Push (Safaricom Daraja API)
- **File Storage:** AWS S3 (with pre-signed URLs via `@aws-sdk`)
- **Image Processing:** Sharp
- **Other:** bcryptjs, multer, cors, express-rate-limit, dotenv

---

## Project Structure

```
shopisop/
├── index.js                  # App entry point, DB sync, model associations
├── routes/
│   ├── user.js
│   ├── product.js
│   ├── inventory.js
│   └── orders.js
├── controllers/
│   ├── user.js
│   ├── product.js
│   ├── inventory.js
│   └── orders.js
├── models/
│   ├── user.js
│   ├── product.js
│   ├── inventory.js
│   ├── orders.js
│   └── orderItem.js
├── middlewares/
│   ├── authenticateToken.js  # JWT verification
│   └── authorize.js          # Role-based access control
├── mpesa/
│   ├── auth.js               # Daraja OAuth token fetching
│   ├── stkpush.js            # STK Push initiation
│   └── callback.js           # M-Pesa payment callback handler
└── utils/
    ├── db.js                 # Sequelize instance
    ├── daraja.js             # Axios instance for Daraja API
    └── file_upload.js        # S3 upload helper
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database
- Safaricom Daraja developer account (for M-Pesa)
- AWS S3 bucket (for image uploads)

### Installation

```bash
git clone <your-repo-url>
cd shopisop
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following:

```env
# Server
PORT=3000
NODE_ENV=development        # Set to "production" for live M-Pesa

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shopisop
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Auth
JWT_SECRET=your_jwt_secret

# M-Pesa (Safaricom Daraja)
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://yourdomain.com/orders/mpesa/callback
DARAJA_CONSUMER_KEY=your_consumer_key
DARAJA_CONSUMER_SECRET=your_consumer_secret

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
S3_BUCKET_NAME=your_bucket_name
```

### Running the Server

```bash
# Development (with auto-reload via nodemon)
npm run dev

# Production
npm start
```

The server starts on `http://localhost:3000` by default and syncs the database schema automatically on startup.

---

## API Reference

All protected routes require a `Bearer` token in the `Authorization` header.

### Users — `/users`

| Method | Endpoint     | Auth         | Role        | Description                    |
|--------|--------------|--------------|-------------|--------------------------------|
| POST   | `/`          | No           | —           | Register a new user            |
| POST   | `/login`     | No           | —           | Login and receive a JWT token  |
| GET    | `/`          | Yes          | Any         | Get all users                  |
| GET    | `/:id`       | Yes          | Any         | Get a user by ID               |
| PUT    | `/:id`       | Yes          | Any         | Update profile picture         |
| PATCH  | `/:id`       | Yes          | superAdmin  | Promote a user to admin        |
| DELETE | `/:id`       | Yes          | Any         | Delete a user account          |

> **Rate limits:** Registration and login are limited to **5 requests per hour** per IP.

---

### Products — `/products`

| Method | Endpoint     | Auth | Role               | Description                  |
|--------|--------------|------|--------------------|------------------------------|
| POST   | `/`          | Yes  | admin, superAdmin  | Create a product             |
| GET    | `/`          | Yes  | Any                | Get all products             |
| GET    | `/instock`   | Yes  | Any                | Get only in-stock products   |
| GET    | `/:id`       | Yes  | Any                | Get a product by ID          |
| PUT    | `/:id`       | Yes  | admin, superAdmin  | Update a product             |
| DELETE | `/:id`       | Yes  | admin, superAdmin  | Delete a product             |

---

### Inventory — `/inventory`

| Method | Endpoint        | Auth | Role              | Description                        |
|--------|-----------------|------|-------------------|------------------------------------|
| POST   | `/`             | Yes  | admin, superAdmin | Create an inventory record         |
| GET    | `/`             | Yes  | Any               | Get all inventory                  |
| GET    | `/:productId`   | Yes  | Any               | Get inventory for a product        |
| PUT    | `/:productId`   | Yes  | admin, superAdmin | Update inventory for a product     |

---

### Orders — `/orders`

| Method | Endpoint          | Auth | Role  | Description                          |
|--------|-------------------|------|-------|--------------------------------------|
| POST   | `/`               | Yes  | user  | Create an order (triggers STK Push)  |
| GET    | `/user`           | Yes  | Any   | Get the logged-in user's orders      |
| GET    | `/:id`            | Yes  | Any   | Get a specific order by ID           |
| POST   | `/mpesa/callback` | No   | —     | M-Pesa payment callback (Safaricom)  |

---

## Authentication & Authorization

Authentication uses **JWT Bearer tokens**. Include the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

The API has three roles:

| Role         | Permissions                                       |
|--------------|---------------------------------------------------|
| `user`       | Place orders, view products and inventory         |
| `admin`      | All user permissions + manage products/inventory  |
| `superAdmin` | All admin permissions + promote users to admin    |

---

## M-Pesa Integration

Orders trigger an **STK Push** to the customer's phone via the Safaricom Daraja API. Set `NODE_ENV=production` to switch from the sandbox to the live Daraja endpoint. The callback URL (`/orders/mpesa/callback`) must be publicly accessible for Safaricom to confirm payments.

---

## Rate Limiting

The global rate limit is **100 requests per 15 minutes** per IP. Auth endpoints have a stricter limit of **5 requests per hour** per IP.

---

## License

ISC