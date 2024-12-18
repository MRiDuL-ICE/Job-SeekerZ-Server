# Job SeekerZ Server

Backend server for the Career-Code job portal application, built with Node.js, Express, and MongoDB. This server handles job postings, applications, and user authentication through JWT tokens.

Server Live Link: [Job-SeekerZ-Server](https://job-seekerz-server.vercel.app/)

## 🛠️ Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Others**:
  - `cors` for Cross-Origin Resource Sharing
  - `cookie-parser` for handling cookies
  - `dotenv` for environment variables

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MRiDuL-ICE/Job-SeekerZ-Server.git
   cd Job-SeekerZ-Server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```env
   DB_USER=your_mongodb_username
   DB_PASSWORD=your_mongodb_password
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   nodemon index.js
   ```

## 📡 API Endpoints

### Authentication

- `POST /jwt` - Generate JWT token
- `POST /logout` - Clear JWT cookie

### Jobs

- `GET /jobs` - Get all jobs (Query param: email for HR-specific jobs)
- `POST /jobs` - Create a new job
- `GET /jobs/:id` - Get specific job by ID

### Job Applications

- `POST /job-applications` - Submit a job application
- `GET /job-application` - Get user's applications (Protected route)
- `GET /job-applications/jobs/:job_id` - Get applications for a specific job
- `PATCH /job-applications/:id` - Update application status
- `DELETE /job-application/:id` - Delete an application

## 🔐 Security Features

1. **JWT Authentication**

   - Tokens stored in HTTP-only cookies
   - Token verification middleware
   - 3-hour token expiration

2. **CORS Configuration**

   ```javascript
   cors({
     origin: [
       "http://localhost:5173",
       "https://jobseekerz.netlify.app",
       "https://job-seekerz.firebaseapp.com",
       "https://job-seekerz.web.app",
     ],
     credentials: true,
   });
   ```

3. **Environment Variables**
   - Sensitive data stored in `.env`
   - Different configurations for production/development

## 📁 Project Structure

```
career-code-server/
├── .env
├── .gitignore
├── index.js
├── package.json
├── package-lock.json
└── vercel.json
```

## 💾 Database Collections

### Jobs Collection

- Title
- Company
- Company Logo
- HR Email
- Application Count
- Other job details

### Job Applications Collection

- Job ID
- Applicant Email
- Application Status
- Application Details

## 🔄 Middleware

1. **Logger Middleware**

   - Logs incoming requests

2. **Token Verification Middleware**
   - Validates JWT tokens
   - Handles unauthorized access
   - Attaches user data to request object

## 🚀 Deployment

The server is configured for deployment on Vercel with the following allowed origins:

- `http://localhost:5173`
- `https://jobseekerz.netlify.app`
- `https://job-seekerz.firebaseapp.com`
- `https://job-seekerz.web.app`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Your Name - abdulwahab22400@gmail.com
