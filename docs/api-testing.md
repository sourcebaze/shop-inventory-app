# API Smoke Test Notes

Use the following sequence after setting `MONGODB_URI` and starting the backend.

```text
GET  /api/health
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
GET  /api/products
GET  /api/categories
GET  /api/suppliers
GET  /api/customers
POST /api/stock/in
POST /api/stock/out
GET  /api/stock/history
GET  /api/alerts
POST /api/sales
GET  /api/sales
GET  /api/reports/dashboard
```

Use the JWT returned from login as:

```text
Authorization: Bearer <token>
```

For destructive actions, use demo data and verify the response before repeating the request.
