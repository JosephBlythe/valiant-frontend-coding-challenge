# Valiant Finance - Loan Repayment Calculator TODO

## 📋 Project Overview
Building a loan repayment calculator component using Vue 3 and component driven architecture. 

The calculator will integrate with backend endpoints and include comprehensive testing.

---

After reading through the challenge specification the task has been broken up into seven phases:

- 🚀 Phase 1: Project Setup & Verification
- 🏗️ Phase 2: Core Architecture & State Management
- 🎨 Phase 3: Component Architecture
- 🎯 Phase 4: Styling & UX
- 🧮 Phase 5: Calculation & Business Logic
- ✅ Phase 6: Integration, E2E Testing & QA Testing
- 📦 Phase 7: Polish & Finalisation

## 🚀 Phase 1: Project Setup & Foundation

### Initial Setup
- [x] Fork and clone the starter repository from `https://github.com/valiantfinance/valiant-frontend-coding-challenge`
- [x] **Dependency Version Verification:**
  - [x] Verify Tailwind CSS v3+ installed (`npm list tailwindcss`) - 3.4.1
  - [x] Verify Node 20x installed (`node -v`) - v20.20.2, Added .nvmrc for version management
  - [x] Verify Npm 10x installed (`npm -v`) - 10.8.2
- [x] **Dependency Installation:**
  - [x] Install dependencies and verify project structure (`npm install`) - 30 vulnerabilities (4 low, 10 moderate, 13 high, 3 critical) - Address Later
  - [x] Install class-variance-authority (CVA) is installed for component variant support (`npm install class-variance-authority`)
  - [x] Install VueUse for core composables (`npm install @vueuse/core`)
  - [x] Install pinia for state management (`npm install pinia`)
  - [x] Install Zod for validation (`npm install zod`)
- [x] Start backend server (`npm run backend`), Port 5000 in use, hardcoded to 5001, Future use dotenv
- [x] Start frontend server (`npm run dev`)

### Backend Endpoint Verification
- [x] Write integration tests for backend endpoints
  - [x] Test `GET /loan-purposes` returns array with annualRate
  - [x] Test `GET /requested-repayment-periods` returns valid options
  - [x] Test `GET /requested-term-months` returns valid options
  - [x] Verify endpoints respond correctly with proper status codes
- [x] Ensure all endpoint tests pass
- [x] Document API endpoint URLs and expected response formats