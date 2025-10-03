# NASA VEGA - Space Habitat Design Tool Server

![NASA Space Apps Challenge](https://img.shields.io/badge/NASA-Space%20Apps%20Challenge-blue)
![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

> **VEGA Server** - A comprehensive Node.js backend for the NASA Space Apps Challenge 2025 project, providing APIs for space habitat design, gamification, and educational tools.

## 🚀 Overview

The VEGA Server is a robust backend system designed for the NASA Space Apps Challenge 2025. It powers an educational 3D space habitat design tool that combines gamification with **real NASA engineering standards**. The server provides authentication, design management, game progression, and validation systems for creating space habitats **based on official NASA Table 17: Minimum Habitable Volumes**.

## 🏛️ NASA Compliance & Educational Standards

### 📋 Official NASA Table 17 Integration
This system is built around **NASA's official Table 17: Comparison of Minimum Habitable Volumes and Case Study Habitable Volumes**, ensuring that students learn with real space engineering data:

- **NIV Standards**: 28.96 m³ minimum per crew member (115.83 m³ total for 4 crew)
- **MTH Standards**: 36.80 m³ recommended per crew member (147.19 m³ total for 4 crew)
- **Functional Spaces**: All game levels teach NASA's required functional space categories
- **Component Volumes**: Each component uses NASA's minimum habitable volume requirements

### 🎓 Educational Value
- **Real Engineering**: Students design using actual ISS-derived standards
- **Safety Critical**: Teaches NASA safety protocols and redundancy requirements
- **Mission Realistic**: Volume constraints based on real space missions
- **Professional Standards**: Prepares students for aerospace engineering careers

### 📊 NASA Table 17 Functional Spaces
The system teaches these NASA-defined functional spaces:
- **Exercise Equipment**: TREADMILL (6.12m³), RESISTIVE (3.92m³), CYCLE (3.38m³)
- **Private Habitation**: WORK (17.40m³), SLEEP (13.96m³) per crew member
- **Life Support**: Environmental control and safety systems
- **Hygiene & Waste**: CLEANSING (4.35m³), WASTE_MANAGEMENT (3.76m³)
- **Food Systems**: MEAL_PREPARATION (4.35m³), LOGISTICS_STOWAGE (6.00m³)
- **Medical**: STORAGE (5.90m³), COMPUTER (1.20m³)
- **Mission Operations**: PLANNING (3.42m³), GROUP_SOCIAL (18.20m³)

## ✨ Features

### 🔐 Authentication System
- **User Registration & Login** with JWT tokens
- **Email Verification** with OTP (One-Time Password)
- **Password Reset** functionality
- **Refresh Token** mechanism for secure sessions
- **Role-based Access Control** (Student, Professional, Admin)
- **Profile Management** with completion tracking

### 🏠 Space Habitat Design
- **3D Habitat Creation** with multiple shapes (Cylinder, Sphere, Dome)
- **Component Library** with realistic space habitat components
- **NASA-Compliant Validation** with dual validation systems:
  - **Standard Validation**: NASA Table 17 minimum volumes
  - **Enhanced NHV Validation**: Net Habitable Volume for long-duration missions
- **Design Sharing** with public/private visibility
- **Design Templates** for educational purposes
- **Collaborative Design** with sharing capabilities

### 🎮 Gamification System
- **Progressive Levels** (1-10) with increasing NASA complexity
- **3D Game Environment** with interactive components
- **NASA-Based Scoring** with realistic space engineering criteria
- **Achievement Tracking** and progress monitoring
- **Mission-Specific Challenges** (Lunar, Mars, Deep Space)
- **Real-time NASA Validation** of habitat designs

### 📊 Advanced NASA Features
- **Net Habitable Volume (NHV)** calculations for mission duration
- **System Redundancy** validation for critical life support
- **Accessibility Standards** compliance (NASA-STD-3001)
- **Mission-Specific Requirements** (radiation shielding, ISRU)
- **Crew Psychology Factors** in volume calculations
- **Environmental Control** validation

## 🛠️ Technology Stack

### Core Technologies
- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.18+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator & Joi
- **Email Service**: Nodemailer

### Security & Performance
- **Rate Limiting**: Express-rate-limit
- **Security Headers**: Helmet.js
- **CORS**: Configurable cross-origin requests
- **Compression**: Response compression
- **Logging**: Morgan middleware
- **Environment**: dotenv configuration

### Development Tools
- **Testing**: Jest framework
- **Development**: Nodemon for auto-restart
- **Code Quality**: ESLint & Prettier
- **Documentation**: Comprehensive API docs

## 📋 Prerequisites

Before running the VEGA server, ensure you have:

- **Node.js** version 16.0.0 or higher
- **MongoDB** database (local or MongoDB Atlas)
- **Email Service** (SMTP configuration)
- **Environment Variables** properly configured

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd NASA-25-VEGA/server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the server root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/vega_db
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vega_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRE=30d

# Email Configuration (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# OTP Configuration
OTP_EXPIRE_MINUTES=10

# Security Configuration
BCRYPT_ROUNDS=10
```

### 4. Start the Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

**Run Tests:**
```bash
npm test
```

## 🗄️ Database Schema

### User Schema
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  name: String (required),
  role: Enum['student', 'professional', 'admin'],
  isEmailVerified: Boolean,
  country: String,
  institution: String,
  profession: String,
  isActive: Boolean,
  lastLogin: Date,
  refreshToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}
```

### Design Schema
```javascript
{
  userId: ObjectId (ref: User),
  name: String (required),
  description: String,
  habitat: {
    shape: Enum['cylinder', 'sphere', 'dome'],
    dimensions: {
      length: Number,
      radius: Number,
      height: Number
    },
    volume: Number,
    materialType: Enum['aluminum', 'titanium', 'composite', 'inflatable'],
    wallThickness: Number
  },
  components: [{
    id: String,
    type: Enum[component_types],
    name: String,
    position: { x, y, z },
    rotation: { x, y, z },
    dimensions: { width, height, depth }
  }],
  crewSize: Number,
  missionDuration: Number,
  destination: Enum['moon', 'mars', 'asteroid', 'space_station'],
  validation: {
    isValid: Boolean,
    score: Number,
    issues: [String],
    lastValidated: Date
  }
}
```

### Game Progress Schema
```javascript
{
  userId: ObjectId (ref: User),
  currentLevel: Number (1-10),
  completedLevels: [Number],
  levelScores: Map<Number, {
    score: Number (0-1000),
    stars: Number (0-3),
    completedAt: Date,
    attempts: Number,
    bestTime: Number
  }>,
  totalScore: Number,
  currentDesign: {
    habitatShape: String,
    dimensions: Object,
    components: [Object]
  },
  achievements: [String],
  stats: Object,
  preferences: Object
}
```

### OTP Schema
```javascript
{
  email: String (required),
  otp: String (6 digits),
  purpose: Enum['email_verification', 'password_reset', 'login_verification'],
  isUsed: Boolean,
  attempts: Number (max: 3),
  expiresAt: Date
}
```

## 🌐 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for verification code.",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "isEmailVerified": false
  }
}
```

#### POST `/auth/login`
Authenticate user and return JWT tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "isEmailVerified": true,
    "profileCompletion": 75
  }
}
```

#### POST `/auth/verify-email`
Verify user email with OTP.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### POST `/auth/forgot-password`
Request password reset OTP.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

#### POST `/auth/reset-password`
Reset password with OTP.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass123"
}
```

#### GET `/auth/me`
Get current user profile (Protected).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### PUT `/auth/profile`
Update user profile (Protected).

**Request Body:**
```json
{
  "name": "John Updated",
  "country": "United States",
  "institution": "NASA",
  "profession": "Space Engineer"
}
```

### Design Management Endpoints

#### GET `/designs`
Get user's designs with pagination and filtering (Protected).

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search by name or description
- `tags`: Filter by tags (comma-separated)
- `destination`: Filter by destination

**Response:**
```json
{
  "success": true,
  "count": 5,
  "total": 25,
  "page": 1,
  "pages": 3,
  "designs": [
    {
      "id": "design_id",
      "name": "Mars Habitat Alpha",
      "description": "A cylindrical habitat for Mars missions",
      "habitat": {
        "shape": "cylinder",
        "volume": 500
      },
      "crewSize": 4,
      "missionDuration": 365,
      "destination": "mars",
      "validation": {
        "isValid": true,
        "score": 850
      },
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-02T00:00:00Z"
    }
  ]
}
```

#### POST `/designs`
Create a new design (Protected).

**Request Body:**
```json
{
  "name": "Mars Habitat Alpha",
  "description": "A cylindrical habitat for Mars missions",
  "habitat": {
    "shape": "cylinder",
    "dimensions": {
      "length": 20,
      "radius": 5
    },
    "materialType": "aluminum",
    "wallThickness": 0.1
  },
  "components": [
    {
      "id": "comp_1",
      "type": "LIFE_SUPPORT",
      "name": "Primary Life Support",
      "position": { "x": 0, "y": 0, "z": 0 },
      "dimensions": { "width": 2, "height": 2, "depth": 1 }
    }
  ],
  "crewSize": 4,
  "missionDuration": 365,
  "destination": "mars"
}
```

#### GET `/designs/:id`
Get specific design by ID (Protected).

#### PUT `/designs/:id`
Update existing design (Protected).

#### DELETE `/designs/:id`
Delete design (Protected).

#### POST `/designs/:id/validate`
Validate design against NASA constraints (Protected).

**Query Parameters:**
- `enhanced`: Set to 'true' for NASA Enhanced NHV validation

**Standard Validation Response:**
```json
{
  "success": true,
  "message": "Design validated successfully using Standard NASA Validation",
  "validation": {
    "isValid": true,
    "score": 85,
    "errors": [],
    "warnings": [
      {
        "type": "warning",
        "message": "Volume per crew member below NASA recommended: 35.2m³ (NASA recommended: 36.80m³)",
        "nasa_reference": "NASA Table 17 - MTH volume recommendations"
      }
    ],
    "metrics": {
      "volumeUtilization": 75,
      "powerBalance": 1200,
      "massTotal": 2500
    },
    "validationType": "NASA_Standard"
  },
  "nasa_info": {
    "standard": "NASA Table 17",
    "description": "Minimum Habitable Volumes"
  }
}
```

**Enhanced NHV Validation Response:**
```json
{
  "success": true,
  "message": "Design validated successfully using Enhanced NASA NHV Standards",
  "validation": {
    "isValid": true,
    "score": 92,
    "errors": [],
    "warnings": [],
    "nasaCompliance": {
      "nhvCompliant": true,
      "missionSuitability": "Long-duration missions (Mars transit)",
      "redundancyScore": 85,
      "accessibilityScore": 90
    },
    "metrics": {
      "volumeUtilization": 78,
      "nhvScore": 95,
      "environmentalScore": 88,
      "redundancy": 85,
      "accessibility": 90
    },
    "validationType": "NASA_Enhanced_NHV"
  },
  "nasa_info": {
    "standard": "NASA Technical Report 20200002973",
    "description": "Net Habitable Volume for Long-Duration Exploration Missions",
    "features": [
      "Mission-specific volume requirements",
      "Crew psychological factors",
      "System redundancy validation",
      "Accessibility standards compliance"
    ]
  }
}
```

#### POST `/designs/:id/duplicate`
Create a copy of existing design (Protected).

### Game System Endpoints

#### GET `/game/progress`
Get user's game progress and current level info (Protected).

**Response:**
```json
{
  "success": true,
  "progress": {
    "id": "progress_id",
    "currentLevel": 3,
    "completedLevels": [1, 2],
    "levelScores": {
      "1": { "score": 750, "stars": 2, "attempts": 1 },
      "2": { "score": 900, "stars": 3, "attempts": 2 }
    },
    "totalScore": 1650,
    "achievements": ["first_design", "perfect_score"],
    "currentLevelInfo": {
      "level": 3,
      "title": "Moon Base Construction",
      "description": "Design a lunar habitat",
      "constraints": {
        "maxVolume": 400,
        "requiredComponents": ["LIFE_SUPPORT", "SLEEP_QUARTERS"]
      }
    },
    "environment3D": {
      "gravity": 0.166,
      "atmosphere": "none",
      "terrain": "lunar_surface"
    },
    "availableComponents": [
      {
        "id": "life_support_1",
        "type": "LIFE_SUPPORT",
        "name": "Atmospheric Processor",
        "model3D": "life_support.glb",
        "dimensions": { "width": 2, "height": 2, "depth": 1 }
      }
    ]
  }
}
```

#### POST `/game/level/start`
Start a specific game level (Protected).

**Request Body:**
```json
{
  "level": 3
}
```

#### POST `/game/level/complete`
Complete a game level and submit score (Protected).

**Request Body:**
```json
{
  "level": 3,
  "score": 850,
  "stars": 3,
  "timeTaken": 1200,
  "design": {
    "habitatShape": "cylinder",
    "components": [...]
  }
}
```

#### PUT `/game/progress`
Update current design progress (Protected).

**Request Body:**
```json
{
  "currentDesign": {
    "habitatShape": "cylinder",
    "dimensions": {
      "length": 15,
      "radius": 4
    },
    "components": [...]
  }
}
```

#### GET `/game/levels`
Get all available levels information (Protected).

#### POST `/game/validate`
Validate current design against game constraints (Protected).

### Public Endpoints

#### GET `/`
Welcome message and server information.

#### GET `/health`
Server health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "NASA VEGA 25 Server is running!",
  "timestamp": "2025-01-01T00:00:00Z",
  "version": "1.0.0",
  "environment": "development"
}
```

## 🔒 Authentication & Authorization

### JWT Token Structure
The server uses JSON Web Tokens for authentication with the following structure:

```javascript
// Access Token (7 days expiry)
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "student",
  "iat": 1234567890,
  "exp": 1234567890
}

// Refresh Token (30 days expiry)
{
  "id": "user_id",
  "type": "refresh",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Authorization Headers
Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Role-based Access
- **Student**: Basic access to design tools and game levels
- **Professional**: Advanced features and collaboration tools
- **Admin**: Full system access and user management

## 🛡️ Security Features

### Rate Limiting
- **Authentication endpoints**: 5 requests per 15 minutes
- **Password reset**: 3 requests per hour
- **OTP requests**: 3 requests per 15 minutes
- **General API**: 100 requests per 15 minutes

### Security Headers
- **Helmet.js**: Security headers configuration
- **CORS**: Cross-origin request protection
- **Input Validation**: Express-validator for all inputs
- **Password Hashing**: bcrypt with salt rounds
- **Environment Variables**: Secure configuration management

### Data Protection
- **Password Encryption**: bcrypt hashing
- **Token Security**: Secure JWT implementation
- **Input Sanitization**: XSS protection
- **SQL Injection**: NoSQL injection prevention

## 🎮 Game Level System

### Level Progression
1. **Level 1-2**: Basic habitat shapes and essential components
2. **Level 3-4**: Advanced component placement and constraints
3. **Level 5-6**: Multi-module habitats and life support systems
4. **Level 7-8**: Complex mission scenarios and optimization
5. **Level 9-10**: Advanced challenges and realistic constraints

### Scoring System
- **Component Placement**: Efficiency and accessibility (0-300 points)
- **Space Utilization**: Volume efficiency (0-200 points)
- **Safety Compliance**: Emergency access and redundancy (0-200 points)
- **Mission Requirements**: Meeting specific criteria (0-200 points)
- **Innovation Bonus**: Creative solutions (0-100 points)

### 3D Environment Integration
- **Interactive Components**: Drag-and-drop 3D placement
- **Real-time Validation**: Immediate feedback on constraints
- **Visual Feedback**: Color-coded validity indicators
- **Environmental Factors**: Gravity, atmosphere, and terrain

## 📊 Monitoring & Logging

### Request Logging
- **Development**: Detailed request logs with Morgan
- **Production**: Combined log format
- **Error Tracking**: Comprehensive error logging

### Performance Monitoring
- **Response Compression**: Gzip compression enabled
- **Database Optimization**: Indexed queries and aggregation
- **Caching Strategy**: MongoDB connection pooling

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secrets
4. Configure SMTP email service
5. Set appropriate CORS origins

### Production Considerations
- **SSL/HTTPS**: Required for production
- **Reverse Proxy**: Nginx or similar recommended
- **Process Manager**: PM2 for process management
- **Database**: MongoDB Atlas or production MongoDB instance
- **Monitoring**: Application performance monitoring
- **Backup**: Database backup strategy

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Jest**: Unit and integration testing
- **Documentation**: Update API documentation

## 📝 API Testing

### Postman Collection
Import the provided Postman collection for comprehensive API testing:

```json
{
  "info": {
    "name": "NASA VEGA API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

### cURL Examples

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "role": "student"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

**Get Designs:**
```bash
curl -X GET http://localhost:5000/api/designs \
  -H "Authorization: Bearer <your_token>"
```

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Failed
```
Error: MongoNetworkError: failed to connect to server
```
**Solution:** Check MongoDB URI and ensure database is running.

#### Email Service Not Working
```
Error: EAUTH: Username and Password not accepted
```
**Solution:** Verify SMTP credentials and enable "Less secure app access" for Gmail.

#### JWT Token Invalid
```
Error: JsonWebTokenError: invalid token
```
**Solution:** Check JWT_SECRET environment variable and token format.

#### Rate Limit Exceeded
```
Error: Too many requests
```
**Solution:** Wait for rate limit window to reset or implement user-specific limits.


---

**Ready for NASA Space Apps Challenge 2025!** 🚀

*"Building the future of space exploration, one habitat at a time."*