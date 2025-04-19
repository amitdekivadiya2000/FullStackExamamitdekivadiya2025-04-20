# Full-Stack E-Commerce Application

A full-stack e-commerce application built with Node.js (Express) backend and Next.js frontend, utilizing both SQL (PostgreSQL) and MongoDB databases.

## Project Structure

```
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/        # Database models (SQL & MongoDB)
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── config/       # Configuration files
│   │   ├── utils/        # Utility functions
│   │   └── views/        # View templates (if needed)
│   ├── tests/            # Backend tests
│   └── package.json
│
├── frontend/              # Next.js frontend
│   ├── src/
│   │   ├── app/         # Next.js 13+ app directory
│   │   ├── components/  # React components
│   │   ├── lib/        # Utility functions
│   │   └── types/      # TypeScript types
│   └── package.json
│
└── README.md
```

## Features

- User authentication (JWT-based)
- Product catalog with search and filters
- Shopping cart functionality
- Order processing
- Admin dashboard with reports
- Server-side rendering for product pages
- Responsive design

## Tech Stack

### Backend
- Node.js with Express
- PostgreSQL (for users and orders)
- MongoDB (for products and cart)
- TypeScript
- JWT for authentication

### Frontend
- Next.js 13+
- TypeScript
- Tailwind CSS
- React Query for data fetching

## Prerequisites

- Node.js (v18+)
- PostgreSQL
- MongoDB
- npm or yarn

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
POSTGRES_URI=postgresql://user:password@localhost:5432/ecommerce
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
cd <repository-name>
```

2. Setup Backend
```bash
cd backend
npm install
# Setup PostgreSQL database
npm run db:migrate
# Start the server
npm run dev
```

3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

4. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Database Setup

### PostgreSQL

1. Create database:
```sql
CREATE DATABASE ecommerce;
```

2. Tables will be created automatically through migrations

### MongoDB

1. Make sure MongoDB is running
2. Database and collections will be created automatically when the application starts

## API Documentation

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user

### Products
- GET /api/products - List all products
- GET /api/products/:id - Get single product
- POST /api/products - Create product (admin)
- PUT /api/products/:id - Update product (admin)
- DELETE /api/products/:id - Delete product (admin)

### Cart
- GET /api/cart - Get user's cart
- POST /api/cart - Add item to cart
- PUT /api/cart/:itemId - Update cart item
- DELETE /api/cart/:itemId - Remove item from cart

### Orders
- GET /api/orders - Get user's orders
- POST /api/orders - Create new order
- GET /api/orders/:id - Get order details

### Reports
- GET /api/reports/revenue - Get revenue reports
- GET /api/reports/top-products - Get top selling products

## Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend tests:
```bash
cd frontend
npm test
```

## Security Measures

- Password hashing using bcrypt
- JWT authentication
- Input validation
- XSS protection
- CORS configuration
- Rate limiting
- SQL injection prevention

## Performance Optimizations

- Database indexing
- Query optimization
- Server-side rendering for SEO
- Image optimization
- Caching strategies
- Pagination implementation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 