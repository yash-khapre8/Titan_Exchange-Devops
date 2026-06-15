# 🚀 TitanExchange – Platform and DevOps Run Guide

Welcome to the **TitanExchange** project! This repository contains a professional, enterprise-grade securities trading platform frontend, backed by simulated market data, and a complete cloud-ready DevOps infrastructure ecosystem.

This guide outlines everything included in the project and provides step-by-step instructions to run, verify, and monitor every component.

---

## 📂 What's Included in This Project

### 1. 📈 Standalone Trading Platform (`/frontend`)
Built using **React (v18), TypeScript, and Vite**, styled with a premium dark-mode custom CSS design.
*   **Market Simulation Engine**: Employs a local `Zustand` store and mathematical algorithms to generate live ticking prices, volumes, and technical indicators (SMA, EMA, RSI, Bollinger Bands).
*   **TradingView Charting**: Integrates the official `lightweight-charts` library to display historical market candles with timeframe switching and toggleable indicator overlays.
*   **Wallet & Order Matching**: Matches market and limit orders instantly, updating margin, available balance, transaction history, and calculating real-time unrealized P&L.
*   **Fintech Admin / DevOps Dashboard (`/admin`)**: A dedicated interface inside the app with animated pod CPU/RAM telemetry charts and live-scrolling stdout container logs.

### 2. 🐳 Local Containerization (`/docker-compose.prod.yml`)
*   **Multi-Stage Dockerfile**: Compiles static React assets and packages them into a production-grade Nginx server.
*   **Nginx Configuration (`nginx.conf`)**: Enables gzip compression, custom security headers (CSP, HSTS, XSS protection), SPA routing fallbacks, and health checks.

### 3. ☁️ Infrastructure-as-Code (`/terraform`)
*   **VPC & Networking**: Creates public subnets (routed to Internet Gateway), private subnets (routed via NAT Gateway), and isolated subnets across 3 Availability Zones.
*   **EKS Cluster (`titan-cluster-prod`)**: Provisions an active Kubernetes cluster with OpenID Connect (OIDC) support and KMS encryption for secrets.
*   **Worker Node Groups**: Uses Free Tier eligible `t3.small` instances separated into general compute and matcher (high-performance) node groups with custom taints.

### 4. ⚓ Kubernetes Manifests (`/kubernetes`)
*   `frontend-deployment.yaml`: Launches 3 replicas with anti-affinity constraints to distribute pods across AWS failure domains.
*   `frontend-configmap.yaml`: Mounts the custom Nginx server block directly into the containers.
*   `frontend-service.yaml`: Exposes the frontend to the public internet using an AWS Classic Load Balancer (`type: LoadBalancer`).
*   `frontend-ingress.yaml`: Configures path-based routing rules.

### 🚀 5. Automated CI/CD (`.github/workflows/deploy.yml`)
A GitHub Actions workflow that triggers on commits to `main`. It builds the frontend image, pushes it to Amazon ECR, logs into EKS, and performs a zero-downtime rolling update.

---

## 🛠️ How to Run and Verify Every Component

Follow these instructions to check each layer of the stack.

### 1. Run the Frontend Locally (Development Mode)
Run the React application directly on your machine with hot reloading.
*   **Prerequisites**: Node.js v18+ installed.
*   **Commands**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
*   **Verify**: Open `http://localhost:5173` in your browser. Navigating to `http://localhost:5173/admin` will display the DevOps dashboard.

---

### 2. Run the Containerized App Locally (Production Mode)
Test the Docker build and Nginx configuration inside a local container.
*   **Prerequisites**: Docker Desktop running.
*   **Commands**:
    ```bash
    docker-compose -f docker-compose.prod.yml up --build
    ```
*   **Verify**: Open `http://localhost` in your browser to verify the production build, SPA routing, and gzip compression.

---

### 3. Check and Manage AWS Infrastructure (Terraform)
Verify or update the cloud infrastructure resources.
*   **Prerequisites**: AWS CLI authenticated (`ap-south-1`) and Terraform CLI installed.
*   **Commands**:
    ```bash
    cd terraform
    terraform init
    terraform plan
    ```
*   **Verify**: Look at the plan output to see what resources are active or pending. (Currently, EKS VPC and Node Groups are fully provisioned).

---

### 4. Verify EKS Cluster & Kubernetes Deployments
Interact directly with the live AWS EKS cluster.
*   **Prerequisites**: AWS CLI and `kubectl` installed.
*   *   **Configure Kubectl Access**:
        ```bash
        aws eks update-kubeconfig --name titan-cluster-prod --region ap-south-1
        ```
*   *   **Check EKS Nodes**:
        ```bash
        kubectl get nodes
        ```
        *(Should show 2 active worker nodes in `Ready` status).*
*   *   **Check Live Pods**:
        ```bash
        kubectl get pods -n titan-exchange
        ```
        *(Should show 3 replicas of `titan-frontend` in `Running` status).*
*   *   **View Pod Container Logs**:
        ```bash
        kubectl logs deployment/titan-frontend -n titan-exchange -f
        ```
*   *   **Get External Access URL**:
        ```bash
        kubectl get svc titan-frontend-svc -n titan-exchange
        ```
        *(Copy the address under the `EXTERNAL-IP` column and paste it in your browser to access the live app).*

---

### 5. Check and Run the CI/CD Pipeline (GitHub Actions)
Trigger the automatic build, push, and rolling update sequence.
1.  Add repository secrets on GitHub (**Settings** -> **Secrets and variables** -> **Actions**):
    *   `AWS_ACCESS_KEY_ID`
    *   `AWS_SECRET_ACCESS_KEY`
2.  Push any change to the `main` branch:
    ```bash
    git add .
    git commit -m "docs: add comprehensive readme guide"
    git push origin main
    ```
3.  **Verify**: Open the **Actions** tab on GitHub to monitor the build. The workflow will build the Docker container, push it to ECR, and trigger EKS to fetch the new image dynamically.
