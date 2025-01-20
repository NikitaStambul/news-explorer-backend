# News Explorer Backend

The News Explorer backend is a RESTful API built with **TypeScript**, **Express**, and **Mongoose**. It provides endpoints for user authentication, article management, and news article retrieval from the [News API](https://newsapi.org/).

## Features
- **User Authentication**: Register and log in users using JSON Web Tokens (JWT).
- **Article Management**: Save and delete bookmarked articles for authenticated users.
- **News Retrieval**: Fetch news articles from an external API using user-defined keywords.

## Prerequisites
To run this project locally, you'll need:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- A MongoDB instance (local or cloud)
- An API key for the [News API](https://newsapi.org/)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/NikitaStambul/news-explorer-backend.git
cd news-explorer-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root with the following variables:
```txt
PORT=3001 # or your preferred port
DATABASE_URL="mongodb://127.0.0.1:27017/news_explorer" # MongoDB connection string
JWT_SECRET="supersecretsrting" # JWT secret key
NEWS_API_KEY="your-news-api-key" # API key for News API
NEWS_API_URL="https://newsapi.org/v2" # News API base URL
```

### 4. Start the Server
```bash
npm run dev
```
The server will start at `http://localhost:3001` by default.

## Project Structure
- **`src/`**: Contains the source code
  - **`controllers/`**: Defines business logic for various routes
  - **`models/`**: Mongoose schemas and models
  - **`routes/`**: Express route definitions
  - **`middlewares/`**: Middleware functions for authentication, error handling, etc.
  - **`utils/`**: Helper functions and constants
- **`dist/`**: Contains the compiled JavaScript files

## Available Scripts
- `npm run dev`: Starts the development server with hot reloading
- `npm run build`: Compiles TypeScript to JavaScript
- `npm run start`: Starts the compiled production server
- `npm run build-start`: Builds and starts the compiled production server

## API Endpoints
### **Authentication**
- `POST /signup`: Register a new user
- `POST /signin`: Log in and receive a JWT token

### **Articles**
- `GET /articles?query=[yourQuery]`: Get all saved articles for the authenticated user
- `POST /articles`: Save a new article
- `DELETE /articles?url=[articleUrl]`: Delete a saved article by ID

### **Users**
- `GET /users/me`: Get user info
- `PATCH /users/me`: Update

## Technologies Used
- **Backend Framework**: Express
- **Database**: MongoDB (Mongoose)
- **Language**: TypeScript
- **Authentication**: JWT
- **External API**: [News API](https://newsapi.org/)

## Contributing
If you'd like to contribute to the project, feel free to fork the repository and submit a pull request.

### [Frontend Repository](https://github.com/NikitaStambul/news-explorer-frontend)

### [Deployed Frontend Project](https://news.explorer.strangled.net/)
### [Deployed Backend Project](https://api.news.explorer.strangled.net/)
