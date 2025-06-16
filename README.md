# Secure File Upload API

A modern web application for secure file uploads with user authentication.

## Features

- User authentication (signup/login)
- JWT-based authorization
- Secure file uploads to Cloudinary
- Modern, responsive UI
- Image preview functionality

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

### Backend
- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- JWT for authentication
- Cloudinary for file storage

## Project Structure

```
├── frontend/              # Frontend files
│   ├── index.html         # Main HTML file
│   ├── style.css          # CSS styles
│   └── script.js          # Frontend JavaScript
├── utils/                 # Utility files
│   └── cloudinary.js      # Cloudinary configuration
├── Dockerfile             # Docker configuration file
├── docker-compose.yml     # Docker Compose configuration
├── .dockerignore          # Files to exclude from Docker image
├── server.js              # Express server setup
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js
- MongoDB Atlas account
- Cloudinary account
- Docker and Docker Compose (for containerized setup)

### Standard Installation

1. Clone the repository
   ```
   git clone https://github.com/Farru049/Auth_api.git
   cd Auth_api
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_KEY=your_jwt_secret_key
   PORT=3000
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the server
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Docker Installation

1. Clone the repository
   ```
   git clone https://github.com/Farru049/Auth_api.git
   cd Auth_api
   ```

2. Create a `.env` file with the same variables as above

3. Build and run with Docker Compose
   ```
   docker-compose up --build
   ```

4. For subsequent runs, you can simply use
   ```
   docker-compose up
   ```

5. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /signup` - Create a new user account
- `POST /login` - User login

### File Upload

- `POST /upload` - Upload a file (requires authentication)

## Screenshots

(Add screenshots of your application here)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
