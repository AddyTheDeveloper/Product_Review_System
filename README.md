# Product Review System

A comprehensive, full-stack web application designed for users to browse products, read authentic reviews, and share their own experiences. Built with a modern **MERN stack** (MongoDB, Express.js, React, Node.js), this system features secure authentication, a dynamic user interface, and an administrative dashboard.

## 🚀 Features

### User Features
- **User Authentication**: Secure Sign Up and Login using JWT and Bcrypt.
- **Product Browsing**: View a list of products with filtering options by category.
- **Product Details**: Deep dive into product specifications, average ratings, and individual user reviews.
- **Write Reviews**: Authenticated users can submit reviews with ratings and text.
- **User Profile**: Manage your profile and view your submitted reviews.
- **Refined UI**: A modern, glassmorphism-inspired interface with responsive design.

### Admin Features
- **Admin Dashboard**: A protected route for administrators to manage the platform.
- **Content Management**: (Future scope) Ability to moderate reviews and products.

### General
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.
- **SEO Friendly**: Basic SEO practices implemented for better visibility.

## 🛠️ Tech Stack

### Frontend
- **React 19**: Library for building user interfaces.
- **Vite**: Next-generation frontend tooling for fast builds.
- **React Router DOM**: For seamless client-side navigation.
- **Axios**: For making HTTP requests to the backend.
- **Lucide React**: Beautiful and consistent icons.
- **CSS Modules**: For modular and scoped styling.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for flexible data storage.
- **Mongoose**: ODM library for MongoDB and Node.js.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **Bcryptjs**: For hashing passwords.
- **Cors**: Middleware to enable Cross-Origin Resource Sharing.

## 📂 Project Structure

```bash
Product_Review_System/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components (Footer, Navbar, etc.)
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── pages/          # Page components (Home, Products, Login, etc.)
│   │   ├── styles/         # Global styles and themes
│   │   ├── App.jsx         # Main application component & routing
│   │   └── main.jsx        # Entry point
│   ├── index.html          # HTML template
│   └── vite.config.js      # Vite configuration
│
└── server/                 # Backend Node.js application
    ├── src/
    │   ├── config/         # Database configuration
    │   ├── controllers/    # Route controllers
    │   ├── middleware/     # Custom middleware (auth, error handling)
    │   ├── models/         # Mongoose models (User, Product, Review)
    │   └── routes/         # API routes
    ├── server.js           # Server entry point
    └── package.json        # Backend dependencies
```

## ⚙️ Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- **Node.js** (v16 or greater)
- **MongoDB** (Local instance or Atlas connection string)
- **Git**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/AddyTheDeveloper/Product_Review_System.git
    cd Product_Review_System
    ```

2.  **Backend Setup**
    ```bash
    cd server
    npm install
    ```

3.  **Frontend Setup**
    ```bash
    cd ../client
    npm install
    ```

### Configuration

Create a `.env` file in the `server` directory and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Running the Application

1.  **Start the Backend Server**
    ```bash
    # From the server directory
    npm run dev
    ```
    The server will run on `http://localhost:5000`.

2.  **Start the Frontend Client**
    ```bash
    # From the client directory (open a new terminal)
    npm run dev
    ```
    The client will run on `http://localhost:5173`.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product details

### Reviews
- `GET /api/reviews` - Get reviews (with filters)
- `POST /api/reviews` - Submit a review (Auth required)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (Admin only)

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---
© 2026 Product Review System. All rights reserved.
