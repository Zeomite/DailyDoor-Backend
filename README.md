# Daily Door Backend

This repository contains the backend code for the Daily Door application, a platform connecting daily wage workers with job opportunities.

### Tech Stack

- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer
- **External APIs**: Google Maps API
- **Deployment**: Vercel

### Getting Started

1. Clone the repository: `[git clone https://github.com/Zeomite/DailyDoor-Backend/)`
2. Install dependencies: `npm install`
3. Set up environment variables by creating a `.env` file and adding the necessary variables.
4. Start the server: `npm start`

### Routes

#### Customer Routes: `/customer`

- **`POST /customer/profile`**: Display customer profile data
  - Attributes Required:
    - `userid`: User's ID token

- **`POST /customer/post`**: Post a job request
  - Attributes Required:
    - `location`: Location of the job request
    - `userid`: User's ID token

- **`POST /customer/details`**: Get details of the worker who accepted the request
  - Attributes Required:
    - `postid`: ID of the job request

- **`POST /customer/cancel`**: Cancel a posted job request
  - Attributes Required:
    - `postid`: ID of the job request

#### Worker Routes: `/worker`

- **`POST /worker/scout`**: Scout for nearby job requests
  - Attributes Required:
    - `location`: Worker's current location
    - `token`: Worker's authentication token

- **`POST /worker/accept`**: Accept a job request
  - Attributes Required:
    - `jobid`: ID of the job request
    - `userid`: ID of the worker accepting the request

- **`POST /worker/upload`**: Upload files related to the job
  - Attributes Required:
    - `file`: File to be uploaded
    - `token`: Worker's authentication token

#### Home Routes: `/`

- **`GET /`**: Homepage
- **`POST /`**: Sign up as a new user
  - Attributes Required:
    - `firstname`: First name of the user
    - `lastname`: Last name of the user
    - `username`: Username chosen by the user
    - `email`: Email address of the user
    - `password`: Password for the user account
    - `emptype`: Type of employment (e.g., worker, customer)
    - `phone`: Phone number of the user

- **`POST /googleauth`**: Authenticate users via Google OAuth2
  - Attributes Required:
    - `googleToken`: Google authentication token

### Controllers

- **Customer Controller**: Handle customer-related logic
- **Worker Controller**: Handle worker-related logic

### Deployment

The backend is deployed on [Vercel](https://daily-door-backend.vercel.app/).

### Contributors

- [Varun Khanijo](https://github.com/Zeomite/)

### License

This project is licensed under the [MIT License](link-to-license).
