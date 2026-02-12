# Product Review System

A full-stack application for users to review products. The system consists of a React frontend and a Node.js/Express backend.

## Tech Stack

**Frontend:**
- React
- Vite
- React Router DOM
- Lucide React (Icons)

**Backend:**
- Node.js
- Express
- MongoDB (Mongoose)
- JSON Web Token (JWT) for authentication
- Bcryptjs for password hashing

## Project Structure

```
Product_Review_System/
├── client/     # Frontend React application
└── server/     # Backend Node.js/Express application
```

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running locally, or a MongoDB Atlas connection string

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Product_Review_System
    ```

2.  **Setup Backend:**
    ```bash
    cd server
    npm install
    ```
    *Note: You may need to create a `.env` file in the `server` directory with your environment variables (e.g., `MONGO_URI`, `JWT_SECRET`, `PORT`).*

3.  **Setup Frontend:**
    ```bash
    cd ../client
    npm install
    ```

## Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd server
    npm run dev
    # The server typically runs on port 5000 or 3000 depending on configuration
    ```

2.  **Start the Frontend Development Server:**
    open a new terminal
    ```bash
    cd client
    npm run dev
    # The frontend will typically run on http://localhost:5173
    ```

## Features

- User Authentication (Login/Register)
- View Products
- Write Reviews for Products
- (Add more features here as you identify them)


