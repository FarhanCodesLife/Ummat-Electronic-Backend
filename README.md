# User API

This API serves as a backend solution for managing user authentication, registration, post management, and order management. It provides features such as user login, post creation, and order management, with full API documentation available via Swagger.

---

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [API Documentation](#api-documentation)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [License](#license)
- [Contact](#contact)

---

## Features
- **User Authentication:** Register, login, logout, and refresh tokens for users.
- **Post Management:** Create, view, edit, and delete posts.
- **Order Management:** Create and fetch orders.
- **Swagger UI:** Easily test all API endpoints with Swagger.

---

## Technologies
- **Node.js:** JavaScript runtime environment.
- **Express.js:** Web framework for Node.js.
- **MongoDB:** NoSQL database for storing user, post, and order data.
- **Swagger:** OpenAPI documentation tool for interactive API testing.
- **Cors:** Middleware for enabling Cross-Origin Requests.
- **dotenv:** Module for managing environment variables.
- **cookie-parser:** Middleware for parsing cookies.

---

## API Documentation

### **Order Endpoints**

1. **Create a new order**
   - **POST** `/api/order/create`
   - Request body:
     ```json
     {
       "userId": "user_id",
       "products": [
         {
           "productId": "product_id",
           "quantity": 2
         }
       ]
     }
     ```

2. **Get all orders**
   - **GET** `/api/order/all`

---

### **Post Endpoints**

1. **Create a new post with an image**
   - **POST** `/api/post/create`
   - Request body:
     ```json
     {
       "title": "My New Post",
       "content": "This is the content of the post",
       "image": "image_url_here"
     }
     ```

2. **Get all posts**
   - **GET** `/api/post/all`

3. **Get a post by its ID**
   - **GET** `/api/post/{id}`

4. **Edit a post by its ID**
   - **PUT** `/api/post/{id}`
   - Request body:
     ```json
     {
       "title": "Updated Post Title",
       "content": "Updated content"
     }
     ```

5. **Delete a post by its ID**
   - **DELETE** `/api/post/{id}`

---

### **User Endpoints**

1. **Register a new user**
   - **POST** `/api/user/register`
   - Request body:
     ```json
     {
       "username": "user",
       "email": "user@example.com",
       "password": "password123"
     }
     ```

2. **Get all users**
   - **GET** `/api/user/all`

3. **Login an existing user**
   - **POST** `/api/user/login`
   - Request body:
     ```json
     {
       "email": "user@example.com",
       "password": "password123"
     }
     ```

4. **Logout the user**
   - **POST** `/api/user/logout`

5. **Refresh the user's token**
   - **POST** `/api/user/refresh`

---

## Installation

### Prerequisites
- **Node.js:** Download and install Node.js from [here](https://nodejs.org/).
- **MongoDB:** Set up a MongoDB database, either locally or using a cloud solution like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Steps to Install
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repository-name.git
