
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

### 2. Running with Docker Compose (Recommended)

Use Docker Compose to build and run both the frontend and backend services together.

1. In the root directory of the project (where the `docker-compose.yml` file is located), run the following command:

   ```bash
   docker-compose up --build
   ```

   This command will:
   - Build the Docker images for the frontend and backend.
   - Start the backend service on port `5000` and the frontend service on port `3000`.

### 3. Running Backend and Frontend Separately (If needed)

If you want to run the backend and frontend separately, follow these steps:

#### 3.1. Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build the Docker image for the backend:
   ```bash
   docker build -t backend .
   ```

3. Run the backend container:
   ```bash
   docker run -p 5000:5000 backend
   ```

#### 3.2. Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Build the Docker image for the frontend:
   ```bash
   docker build -t frontend .
   ```

3. Run the frontend container:
   ```bash
   docker run -p 3000:3000 frontend
   ```

### 4. Accessing the Application

- The frontend will be available at `http://localhost:3000`
- The backend will be available at `http://localhost:5000`

## Author

Kishan Ghetiya - [GitHub](https://github.com/KishanGhetiya)
