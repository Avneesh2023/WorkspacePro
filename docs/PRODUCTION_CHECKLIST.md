# Production Readiness Checklist & Deployment Guide

This document outlines the final checklist and deployment instructions required to transition **WorkspacePro** safely from local development to a production environment.

---

## 📋 Production Readiness Checklist

### 1. Hosting & Server Infrastructure
- [ ] Configure production-ready Node.js process managers like **PM2** (with clustering) or deploy inside Docker containers.
- [ ] Set `NODE_ENV=production` in the environment variables to disable dev logs and activate express optimizations.
- [ ] Enable Gzip/Brotli compression at the reverse proxy (Nginx) or application level (`compression` middleware).

### 2. Database (MongoDB)
- [ ] Use MongoDB Atlas or a dedicated replica-set database instance.
- [ ] Strictly lock down network access to database clusters via IP Whitelisting (allow only the server host).
- [ ] Configure automatic daily backups and verify database connection pool sizing (`maxPoolSize=50`).

### 3. HTTPS / TLS Encryption
- [ ] Ensure all communication happens exclusively over HTTPS.
- [ ] Obtain Let's Encrypt SSL certificates or manage TLS via cloud providers (Vercel, Netlify, Render, AWS).
- [ ] Force HTTPS redirects in the reverse proxy and enable Strict Transport Security (HSTS).

### 4. Configuration & Environment Security
- [ ] Store secret keys (JWT, Cloudinary) securely in vault managers (e.g., AWS Secrets Manager, Doppler, or host dashboard environment settings). Never commit `.env` files.
- [ ] Verify that the `CLIENT_URL` CORS setting matches the actual production domain.
- [ ] Set long, secure, randomized values for `JWT_SECRET`.

### 5. API Security & Rate Limiting
- [ ] Retain and audit Helmet HTTP security headers.
- [ ] Restrict request rates across other API endpoints to protect against DoS attacks (`express-rate-limit`).
- [ ] Set reasonable payload body size limits on Express parsers (`limit: '10kb'`).

---

## 🚀 Deployment Guide

### Backend (Express)
1. **Repository Setup**: Clone your main/production branch on the host machine.
2. **Secrets Configuration**: Initialize system env variables or create an isolated production `.env` file containing:
   ```env
   PORT=5000
   NODE_ENV=production
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=production_random_jwt_key
   CLIENT_URL=https://workspacepro-client.vercel.app
   ```
3. **Install Dependencies**: Run `npm ci --production` to perform clean, deterministic package installs without development tools.
4. **Daemon Startup**: Spawn processes using PM2:
   ```bash
   pm2 start server.js --name "workspacepro-api" -i max
   ```

### Frontend (React / Vite)
1. **Compilation**: Generate optimized production bundles:
   ```bash
   npm run build
   ```
2. **Hosting**: Deploy the resulting `/dist` folder to static host providers (e.g., Vercel, Netlify, AWS S3 + CloudFront).
3. **Routing Configuration**: Ensure correct rewrite mapping so React Router's client-side paths fall back to `index.html` (e.g., `_redirects` file on Netlify or `vercel.json` rewrites on Vercel).
