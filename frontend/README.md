# Student Management Frontend

Angular frontend application for the Student Management System.

## Prerequisites

- Node.js 20+ and npm
- Angular CLI 17+

## Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200`

### Build for Production

```bash
npm run build:prod
```

The production build will be in the `dist/student-management-frontend` directory.

## Docker Build

### Build Docker Image

```bash
docker build -t student-management-frontend:latest .
```

### Run Docker Container

```bash
docker run -p 8080:80 student-management-frontend:latest
```

## Kubernetes Deployment

### Build and Push Image

```bash
# Build the Docker image
docker build -t redfox4ever/student-management-frontend:latest ./frontend

# Push to Docker Hub (or your registry)
docker push redfox4ever/student-management-frontend:latest
```

### Deploy to Kubernetes

The frontend deployment is configured to:
- Use namespace: `devops`
- Connect to backend service: `spring-service` on port 8089
- Expose via NodePort: 30081

```bash
# Deploy the frontend
kubectl apply -f frontend-deployment.yaml

# Check deployment status
kubectl get pods -n devops -l app=frontend-app

# Get the service URL (if using minikube)
minikube service frontend-service -n devops --url
```

### Configuration

The frontend uses a runtime configuration approach:
- `src/assets/config.json` contains the default API URL
- The Docker entrypoint script (`entrypoint.sh`) replaces the API URL at runtime based on the `API_URL` environment variable
- The `ConfigService` loads the configuration on app startup

For local development, the API URL is configured in `src/environments/environment.ts` as `http://localhost:8089/student`.

For Kubernetes deployment, the `API_URL` environment variable in `frontend-deployment.yaml` is automatically injected into the config.json file at container startup.

## Features

- **Students Management**: Create, read, update, and delete students
- **Departments Management**: Manage departments
- **Enrollments Management**: Handle student enrollments

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── student-list/
│   │   │   ├── department-list/
│   │   │   └── enrollment-list/
│   │   ├── services/
│   │   │   ├── student.service.ts
│   │   │   ├── department.service.ts
│   │   │   └── enrollment.service.ts
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── models/
│   │   ├── student.model.ts
│   │   ├── department.model.ts
│   │   ├── enrollment.model.ts
│   │   ├── course.model.ts
│   │   └── status.enum.ts
│   └── environments/
│       ├── environment.ts
│       └── environment.prod.ts
├── Dockerfile
├── nginx.conf
└── package.json
```

