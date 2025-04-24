
# SecretEcho Project with Docker

This repository contains the code for a SecretEcho application consisting of a backend (Node.js) and a frontend (React/Next.js). Below are the steps to run and deploy the application using Docker.

## Prerequisites

Ensure you have the following installed:

- Docker: [Install Docker](https://www.docker.com/get-started)
- Docker Compose (if you want to run both services together): [Install Docker Compose](https://docs.docker.com/compose/install/)

## Steps to Run the Project Locally

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/kishan-ghetiya/secret-echo
cd secret-echo
```

### 2. Running Backend and Frontend Separately (If needed)

If you want to run the backend and frontend separately, follow these steps:

#### 2.1. Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the backend application in development mode:
   ```bash
   npm run dev
   ```

   This will start the backend service at `http://localhost:5000` (make sure you have a `.env` file with the necessary environment variables if needed).

#### 2.2. Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the frontend application in development mode:
   ```bash
   npm run dev
   ```

   This will start the frontend service at `http://localhost:3000`.

### 3. Accessing the Application

- The frontend will be available at `http://localhost:3000`
- The backend will be available at `http://localhost:5000`

## Author

Kishan Ghetiya - [GitHub](https://github.com/KishanGhetiya)
