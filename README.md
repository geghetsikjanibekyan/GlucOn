# GlucOn
#### Video Demo:  <URL HERE>
#### Description:
A diabetes management mobile application built with React Native (Expo) and Flask backend API. GlucOn helps users track their blood sugar levels, manage food intake, monitor nutrition, and maintain a health diary. The application provides:

- **Blood Sugar Tracking**: Record and monitor glucose levels throughout the day
- **Food Diary**: Track meals and nutritional information
- **Diet Management**: Access and manage dietary recommendations and recipes
- **Nutritional Analysis**: Calculate and monitor daily nutritional intake
- **User Profiles**: Manage personal health information and preferences

## Architecture

1. **Hybrid Data Storage**
   - Local SQLite for diary entries and blood sugar readings (offline capability)
   - Backend SQLite for user accounts and shared recipes

2. **Token-based Authentication**: JWT tokens for secure API access

3. **React Native (Expo Framework)**: for rapid development and Cross-platform support (Android and iOS)

4. **File-based routing**: Using Expo Router for intuitive navigation structure

## Features

### Mobile Application (GlucOn)

#### Blood Sugar Monitoring
 - Log glucose readings with timestamp
 - Add notes to readings
 - View daily history
 - Track trends over time

#### Food Diary
 - Add/edit/delete food items with nutritional information
 - Track calories, carbs, protein and fat
 - Date-based meal logging

#### Nutritional Tracking 
 - Provides an easy and user-friendly interface to search and explore the nutritional information of foods based on USDA dataset

#### User Profile
 - Basic personal information
 - Login, logout, and registration functionality

### Backend API (GlucOnApi)

#### Authentication
 - User registration with secure password hashing
 - Login with JWT token generation
 - Protected endpoints with token validation
 - User profile retrieval

## Technology Stack

### Mobile Application

| Category | Technology |
|----------|-----------|
| **Framework** | React Native with Expo |
| **Language** | TypeScript |
| **Local Database** | SQLite |
| **Storage** | AsyncStorage |
| **Calendar** | react-native-calendars |

### Backend API

| Category | Technology |
|----------|-----------|
| **Framework** | Flask |
| **Language** | Python 3.x |
| **Database** | SQLite3 (for now) |
| **Authentication** | JWT |
| **Password Hashing** | Werkzeug Security |
| **Templating** | Jinja2 3.1.6 |

## Project Structure

```
GlucOn/                       # Mobile Application
├── app/                        # Application screens (file-based routing)
│   ├── _layout.tsx            # Root layout with auth provider
│   ├── login.tsx              # Login screen
│   ├── register.tsx           # Registration screen
│   └── (tabs)/                # Tab-based navigation
│       ├── _layout.tsx        # Tab layout configuration
│       ├── diary.tsx          # Food and blood sugar diary
│       ├── diets.tsx          # Diet recommendations
│       ├── nutrition.tsx      # Nutrition Search
│       └── profile.tsx        # User profile
├── assets/                    # Static assets (images, fonts)
├── components/                # Reusable UI components
│   ├── blood-sugar-section.tsx
│   ├── food-card.tsx
│   ├── food-section.tsx
│   ├── haptic-tab.tsx
│   ├── section-header.tsx
│   └── ui/                    # Generic UI components
│       └── icon-symbol.tsx
├── context/                   # React Context providers
│   └── AuthContext.tsx        # Authentication state
├── services/                  # External service integrations
│   ├── api.ts                 # Backend API client
│   └── db.ts                  # Local SQLite operations
├── app.json                   # Expo configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── eslint.config.js           # ESLint configuration

GlucOnApi/                   # Backend API
├── templates/                 # HTML templates
│   └── admin.html             # Basic admin interface to add recipes 
├── uploads/                   # Uploaded files storage
├── app.py                     # Main Flask application
├── require_auth.py            # Authentication middleware
├── requirements.txt           # Python dependencies
└── app.db                     # SQLite database
```


## API Documentation

### Base URL
```
http://YOUR_SERVER_IP:15000
```

### Endpoints

#### Authentication

##### Register User
```http
POST /register
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 201 Created
{
  "status": "created"
}
```

##### Login
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### Get Current User
```http
GET /me
Authorization: Bearer <token>

Response: 200 OK
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com"
}
```

#### Recipes

##### Create recipe
```http
POST /recipes
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
  title: "Title"
  content: "Content"
  image: <file>

Response: 201 Created
{
  "status": "created"
}
```

##### List Recipes
```http
GET /recipes
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "title": "Meal recipe",
    "content": "Content...",
    "image": "filename.jpg"
  }
]
```

##### Get Single recipe
```http
GET /recipes/<id>
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "title": "Meal recipe",
  "content": "Content...",
  "image": "filename.jpg"
}
```

##### Get Image
```http
GET /images/<filename>

Response: Image file
```

#### Admin

##### Admin Interface
```http
GET /admin

Response: HTML page for admin functions
```

##### Admin Create Recipe
```http
POST /admin/recipes
Content-Type: multipart/form-data

Form Data:
  title: "Recipe title"
  content: "Content"
  image: <file>

Response: 200 OK
"Saved"
```

## 🏃 Running the Application

### Start the Backend API

```bash
cd GlucOnApi
python app.py
```

The API will start on `http://0.0.0.0:15000`

### Start the Mobile Application

#### Development Mode (with Expo Go):

Before starting, you have to set the API_BASE constant at GlucOn/services/api.ts to your local machine's IP (you can find the IP when running the flask server, search for something like "`Running on http://192.168.10.15:15000`")

```bash
cd GlucOn
npx expo start
```

You can then:
- Press `a` to open in Android emulator or device
- Press `i` to open in iOS simulator
- Scan QR code with Expo Go app on your physical device