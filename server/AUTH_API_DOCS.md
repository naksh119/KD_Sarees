# KD Sarees Complete API Documentation

Base URL: `http://localhost:8000`

## Health API

- `GET http://localhost:8000/`

## Auth APIs

- `POST http://localhost:8000/api/auth/register`
- `POST http://localhost:8000/api/auth/signup`
- `POST http://localhost:8000/api/auth/login`
- `POST http://localhost:8000/api/auth/refresh-token`
- `POST http://localhost:8000/api/auth/forgot-password`
- `POST http://localhost:8000/api/auth/reset-password`
- `POST http://localhost:8000/api/auth/verify-email`
- `GET http://localhost:8000/api/auth/me` (Protected)
- `PUT http://localhost:8000/api/auth/me` (Protected)

## Products APIs

- `GET http://localhost:8000/api/products`
- `GET http://localhost:8000/api/products/:id`
- `POST http://localhost:8000/api/products` (Admin)
- `PUT http://localhost:8000/api/products/:id` (Admin)
- `DELETE http://localhost:8000/api/products/:id` (Admin)

## Categories APIs

- `GET http://localhost:8000/api/categories`
- `GET http://localhost:8000/api/categories/:id`
- `POST http://localhost:8000/api/categories` (Admin)
- `PUT http://localhost:8000/api/categories/:id` (Admin)
- `DELETE http://localhost:8000/api/categories/:id` (Admin)

## Reviews APIs

- `GET http://localhost:8000/api/reviews`
- `GET http://localhost:8000/api/reviews/product/:productId`
- `POST http://localhost:8000/api/reviews` (User/Admin)
- `DELETE http://localhost:8000/api/reviews/:id` (User/Admin)

## Cart APIs

- `GET http://localhost:8000/api/cart` (User/Admin)
- `POST http://localhost:8000/api/cart/add` (User/Admin)
- `PATCH http://localhost:8000/api/cart/item` (User/Admin)
- `DELETE http://localhost:8000/api/cart/item` (User/Admin)
- `DELETE http://localhost:8000/api/cart/clear` (User/Admin)

## Orders APIs

- `POST http://localhost:8000/api/orders` (User/Admin)
- `GET http://localhost:8000/api/orders/my` (User/Admin)
- `GET http://localhost:8000/api/orders/admin/all` (Admin)
- `GET http://localhost:8000/api/orders/:id` (User/Admin)
- `PATCH http://localhost:8000/api/orders/:id/status` (Admin)

## Payments APIs

- `GET http://localhost:8000/api/payments/my` (User/Admin)
- `POST http://localhost:8000/api/payments/order/:orderId` (User/Admin)
- `PATCH http://localhost:8000/api/payments/:id/status` (Admin)

## Offers APIs

- `GET http://localhost:8000/api/offers`
- `GET http://localhost:8000/api/offers/all` (Admin)
- `POST http://localhost:8000/api/offers` (Admin)
- `PUT http://localhost:8000/api/offers/:id` (Admin)
- `DELETE http://localhost:8000/api/offers/:id` (Admin)

## Notes

- Use `Authorization: Bearer <token>` for protected APIs.
- Use user token for User APIs and admin token for Admin APIs.
# KD Sarees Auth API Documentation

Base URL:

`http://localhost:8000`

All auth routes are under:

`/api/auth`

## 1) Signup

- **Method:** `POST`
- **URL:** `/api/auth/signup`
- **Alternative URL:** `/api/auth/register`
- **Description:** Creates a new user account and returns a JWT token.

### Request Body (JSON)

```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "password": "secret123"
}
```

### Validation Rules

- `name` is required and must be at least 2 characters.
- `email` is required and must be valid.
- `password` is required and must be at least 6 characters.
- Email must be unique.

### Success Response

- **Status:** `201 Created`

```json
{
  "message": "Signup successful",
  "user": {
    "_id": "65f0f3ce9a3f7b0012345678",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "role": "user"
  },
  "token": "JWT_TOKEN_HERE"
}
```

### Error Responses

- `400 Bad Request` (missing/invalid fields or duplicate email)
- `500 Internal Server Error`

---

## 2) Login

- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Description:** Authenticates user and returns a JWT token.

### Request Body (JSON)

```json
{
  "email": "priya@example.com",
  "password": "secret123"
}
```

### Success Response

- **Status:** `200 OK`

```json
{
  "message": "Login successful",
  "user": {
    "_id": "65f0f3ce9a3f7b0012345678",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "role": "user"
  },
  "token": "JWT_TOKEN_HERE"
}
```

### Error Responses

- `400 Bad Request` (missing/invalid fields)
- `401 Unauthorized` (wrong credentials)
- `500 Internal Server Error`

---

## 3) Get Current User (Protected)

- **Method:** `GET`
- **URL:** `/api/auth/me`
- **Description:** Returns logged-in user details.
- **Auth Required:** Yes (Bearer token)

### Required Header

`Authorization: Bearer <JWT_TOKEN>`

### Success Response

- **Status:** `200 OK`

```json
{
  "_id": "65f0f3ce9a3f7b0012345678",
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "role": "user"
}
```

---

## 4) Update Current User Profile (Protected)

- **Method:** `PUT`
- **URL:** `/api/auth/me`
- **Description:** Updates user profile fields and stores them in database.
- **Auth Required:** Yes (Bearer token)

### Request Body (JSON)

```json
{
  "name": "Priya Sharma",
  "phone": "9876543210",
  "gender": "female",
  "dateOfBirth": "1998-04-10",
  "addressLine1": "House 12, Main Road",
  "addressLine2": "Near Temple",
  "city": "Surat",
  "state": "Gujarat",
  "country": "India",
  "pincode": "395003"
}
```

### Success Response

- **Status:** `200 OK`

```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "65f0f3ce9a3f7b0012345678",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "role": "user",
    "phone": "9876543210",
    "gender": "female",
    "dateOfBirth": "1998-04-10T00:00:00.000Z",
    "addressLine1": "House 12, Main Road",
    "addressLine2": "Near Temple",
    "city": "Surat",
    "state": "Gujarat",
    "country": "India",
    "pincode": "395003"
  }
}
```

---

## Postman Quick Test

### A) Signup request

- Method: `POST`
- URL: `http://localhost:8000/api/auth/signup`
- Body -> raw -> JSON:

```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "password": "secret123"
}
```

### B) Login request

- Method: `POST`
- URL: `http://localhost:8000/api/auth/login`
- Body -> raw -> JSON:

```json
{
  "email": "priya@example.com",
  "password": "secret123"
}
```

### C) Me request

- Method: `GET`
- URL: `http://localhost:8000/api/auth/me`
- Headers:
  - Key: `Authorization`
  - Value: `Bearer <token_from_login_response>`

### D) Update profile request

- Method: `PUT`
- URL: `http://localhost:8000/api/auth/me`
- Headers:
  - Key: `Authorization`
  - Value: `Bearer <token_from_login_response>`
- Body -> raw -> JSON:

```json
{
  "name": "Priya Sharma",
  "phone": "9876543210",
  "gender": "female",
  "dateOfBirth": "1998-04-10",
  "addressLine1": "House 12, Main Road",
  "addressLine2": "Near Temple",
  "city": "Surat",
  "state": "Gujarat",
  "country": "India",
  "pincode": "395003"
}
```

