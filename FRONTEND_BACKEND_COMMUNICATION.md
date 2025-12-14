# Frontend to Backend Communication Flow

## Overview

This document explains how the Angular frontend communicates with the Spring Boot backend in both local development and Kubernetes environments.

## Architecture Flow

```
Browser → Frontend (Angular) → HTTP Request → Backend (Spring Boot) → Database (MySQL)
```

## How It Works

### 1. **Frontend Configuration (Runtime)**

The frontend uses a **runtime configuration** approach:

1. **Config File**: `frontend/src/assets/config.json` contains the default API URL
   ```json
   {
     "apiUrl": "http://localhost:8089/student"
   }
   ```

2. **ConfigService**: Loads the config on app startup
   - Location: `frontend/src/app/services/config.service.ts`
   - Reads `/assets/config.json` at runtime
   - Falls back to environment config if file not found

3. **Entrypoint Script**: Updates config at container startup
   - Location: `frontend/entrypoint.sh`
   - Replaces API URL in `config.json` based on `API_URL` environment variable
   - Runs before nginx starts

### 2. **Kubernetes Configuration**

**Important**: Since Angular runs in the browser, requests come from the user's browser, not from the pod. Therefore, we need the **external** NodePort URL, not the internal service DNS.

In Kubernetes, the API URL is set via environment variable:

```yaml
env:
- name: API_URL
  value: "http://192.168.49.2:30080/student"
```

**URL Breakdown**:
- `192.168.49.2` = Minikube IP (get via `minikube ip`)
- `30080` = Backend NodePort (from `spring-deployment.yaml`)
- `/student` = Context path

**Note**: The ConfigService also auto-detects the backend URL from `window.location`:
- If frontend is accessed via `http://<ip>:30081`, it constructs backend URL as `http://<ip>:30080/student`
- This handles cases where minikube IP changes

### 3. **Request Flow in Kubernetes**

```
1. User accesses frontend via NodePort (e.g., http://192.168.49.2:30081)
2. Browser loads Angular app (HTML/JS) from frontend pod
3. Angular app loads and ConfigService:
   - Reads config.json (with API_URL replaced by entrypoint.sh)
   - OR auto-detects backend URL from window.location (same host, port 30080)
4. User action triggers HTTP request (e.g., get all students)
5. Angular service makes request from browser to: http://192.168.49.2:30080/student/students/getAllStudents
6. Request goes directly from browser to backend NodePort (30080)
7. Backend processes request and returns JSON response
8. Frontend displays data
```

**Key Point**: Requests go **directly from browser to backend**, not through the frontend pod!

### 4. **CORS Configuration**

**Problem**: Browsers enforce CORS (Cross-Origin Resource Sharing) policy.

**Solution**: Global CORS configuration in Spring Boot
- Location: `src/main/java/tn/esprit/studentmanagement/config/CorsConfig.java`
- Allows all origins (configurable for production)
- Removed per-controller `@CrossOrigin` annotations

### 5. **Service Communication**

**Frontend Services** (all use ConfigService):
- `StudentService` → `/students/*`
- `DepartmentService` → `/Depatment/*`
- `EnrollmentService` → `/Enrollment/*`

**Backend Endpoints**:
- Base URL: `http://spring-service.devops.svc.cluster.local:8089/student`
- Students: `/students/getAllStudents`, `/students/createStudent`, etc.
- Departments: `/Depatment/getAllDepartment`, etc.
- Enrollments: `/Enrollment/getAllEnrollment`, etc.

## Local Development

**Frontend**: `http://localhost:4200`
**Backend**: `http://localhost:8089/student`

Config: Uses `environment.ts` with `apiUrl: 'http://localhost:8089/student'`

## Kubernetes Deployment

**Frontend**: Accessible via NodePort `30081`
**Backend**: Accessible via NodePort `30080` (or via service DNS)

Config: Uses `API_URL` environment variable injected at container startup

## Troubleshooting

### Frontend can't reach backend:

1. **Check service name**: Ensure `spring-service` exists in `devops` namespace
   ```bash
   kubectl get svc -n devops spring-service
   ```

2. **Check API URL**: Verify environment variable in frontend pod
   ```bash
   kubectl exec -n devops <frontend-pod> -- env | grep API_URL
   ```

3. **Check config.json**: Verify it was updated by entrypoint script
   ```bash
   kubectl exec -n devops <frontend-pod> -- cat /usr/share/nginx/html/assets/config.json
   ```

4. **Check minikube IP**: Get current minikube IP (it might have changed)
   ```bash
   minikube ip
   ```
   Update the `API_URL` in `frontend-deployment.yaml` if IP changed, then redeploy.

4. **Check CORS**: Verify backend allows requests (check logs)
   ```bash
   kubectl logs -n devops <backend-pod>
   ```

5. **Test connectivity**: From frontend pod, test backend connection
   ```bash
   kubectl exec -n devops <frontend-pod> -- wget -O- http://spring-service.devops.svc.cluster.local:8089/student/actuator/health
   ```

## Key Points

✅ **Runtime Configuration**: API URL is set at container startup, not build time
✅ **Service Discovery**: Uses Kubernetes DNS for service-to-service communication
✅ **CORS**: Global configuration allows all origins (adjust for production)
✅ **Environment Variables**: `API_URL` is injected via Kubernetes deployment
✅ **Fallback**: ConfigService falls back to environment config if config.json fails

