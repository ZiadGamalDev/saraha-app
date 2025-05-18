# Saraha App API (Node.js)

This is a simple **anonymous messaging backend** inspired by the Saraha app.  
It allows users to register, verify their accounts, and receive messages from others *without knowing the sender*.

## Features

- **User Registration, Login, Logout**  
- **Email Verification**  
- **Profile Management** (Update info, upload profile image)  
- **Anonymous Messaging System**  
- **JWT Authentication** (Access + Refresh Tokens)  
- **Multer for image uploads**  
- **Environment Config Support**  
- **Centralized Error Handling**  
- **MongoDB with Mongoose Models**  

## Folder Structure

```
src/
├── db/            # MongoDB connection & seeders
├── middlewares/   # Validation, Authentication, Multer config, etc.
├── modules/       # Modules for Auth, Profile, Message
├── templates/     # Email and error HTML templates
├── utils/         # Mail, file, crypto utilities
├── app.js         # Main express app config
uploads/           # Uploaded images
.env               # Environment variables (excluded)
server.js          # Entry point
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZiadGamalDev/saraha-app.git
   cd saraha-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**
   Rename .env.example to .env and fill in your config (MongoDB URI, JWT secrets, etc.)

4. **Run the project**
   ```bash
   npm start
   ```

## API Testing

Use Postman or any REST client.
If available, import the provided Postman collection from the public/ folder.

## Tech Stack

- **Node.js + Express.js**
- **MongoDB + Mongoose**
- **JWT for Auth**
- **Multer for file uploads**
- **Nodemailer for email handling**

## Note

This project was built as part of the ITI Node.js course to practice building REST APIs with full authentication, validation, and messaging logic.

**Frontend is not included. This project is backend-only.**