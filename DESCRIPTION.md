# Valiant Finance - Loan Repayment Calculator TODO

## 📋 Project Overview
Building a loan repayment calculator component using Vue 3 and component driven architecture. 

The calculator will integrate with backend endpoints and include comprehensive testing.

---

After reading through the challenge specification the task has been broken up into seven phases:

- 🚀 Phase 1: Project Setup & Verification
- 🏗️ Phase 2: Core Architecture & State Management
- 🎨 Phase 3: Component Architecture
- ✅ Phase 4: Integration, E2E Testing & QA Testing
- 📦 Phase 5: Polish & Finalisation

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

### Copilot Instructions & AI Tooling
- [x] Create `.github/copilot-instructions.md` with project conventions and architecture guidelines
  - [x] Class Variance Authority (CVA) for component variant management
  - [x] Define composable structure and naming conventions
  - [x] Specify component driven architecture guidelines
  - [x] Document testing patterns (unit, integration, e2e)
  - [x] Document Pinia state management patterns
  - [x] Document Zod validation schema patterns

---

## 🏗️ Phase 2: Core Architecture & State Management

### State Management Setup
- [x] Set up Pinia for state management (standard Pinia with async/await actions)
- [x] Create `stores/calculator.js` for:
  - [x] Loan calculator state (amounts, selections, results)
  - [x] API data (loan purposes, periods, terms)
  - [x] Loading/error states

### Write initial tests for Pinia store
- [x] Test initial state values
- [x] Test state updates through actions
- [x] Test loading and error states

### Zod Schema Setup
- [x] Create `schemas/calculator.ts` with Zod validation schema
  - [x] Define `loanAmountSchema` (1,000 - 20,000,000)
  - [x] Define `loanPurposeSchema` (non-empty string)
  - [x] Define `repaymentPeriodSchema` (non-empty string)
  - [x] Define `loanTermSchema` (positive number)
  - [x] Define `calculatorFormSchema` (combine all fields)
- [x] Create utility function `validateFormInput()` using Zod
- [x] Set up error message formatting for validation failures

### Unit Tests for Zod Schemas
- [x] Test `schemas/calculator.js`:
  - [x] `loanAmountSchema` accepts valid amounts (1,000, 10,000, 20,000,000)
  - [x] `loanAmountSchema` rejects invalid amounts (999, 20,000,001, -1)
  - [x] `loanAmountSchema` rejects non-numeric input
  - [x] `loanPurposeSchema` accepts non-empty strings
  - [x] `loanPurposeSchema` rejects empty strings
  - [x] `repaymentPeriodSchema` validates correctly
  - [x] `loanTermSchema` accepts positive numbers
  - [x] `calculatorFormSchema` validates complete form objects
  - [x] `calculatorFormSchema` rejects incomplete objects
  - [x] Error messages are clear and user-friendly
- [x] Ensure all Zod schema tests pass

### Composables
- [x] Create `useLoansAPI.js` - fetch loan purposes, periods, and terms
- [x] Create `useCalculateRepayment.js` - PMT calculation logic
- [x] Create `useFormValidation.js` - input validation with Zod schema
- [x] Create `useLoanCalculator.js` - orchestrate calculator logic

### Unit Tests for Composables
- [x] Test `useFormValidation.js`:
  - [x] Valid amounts (1,000 - 20,000,000)
  - [x] Invalid amounts (< 1,000, > 20,000,000)
  - [x] Uses Zod schema for validation
  - [x] Returns validation errors from Zod
  - [x] Non-numeric input rejection
- [x] Test `useLoansAPI.js`:
  - [x] Successfully fetches loan purposes, periods, terms
  - [x] Handles API errors gracefully
  - [x] Returns data in expected format
- [x] Test `useCalculateRepayment.js`:
  - [x] Correctly calculates monthly payment (PMT formula)
  - [x] Handles edge cases (zero interest, one month term)
  - [x] Returns results in expected format
- [x] Test `useLoanCalculator.js`:
  - [x] Orchestrates API calls and form validation correctly
  - [x] Updates state based on API responses and validation results
  - [x] Handles loading and error states appropriately
- [x] Ensure all composable tests pass

---

## 🎨 Phase 3: Component Architecture

### Theming 
- [x] Set up Tailwind CSS theming in config
  - [x] Setup theme colours using bootstrap style names: primary (#fffea8), secondary (ghostwhite), danger, muted etc...
- [x] Added cn utility for class variance management
- [x] Add base layer styles

### Base Components
- [x] Write required base native HTML components:
  - [x] BaseInput component (with numeric validation, CVA variants)
  - [x] BaseSelect component (CVA variants, custom chevron)
  - [x] BaseCard component (CVA variants: default, primary, secondary)
  - [x] BaseSkeleton component (animated pulse loader)

### Components
- [x] **LoanAmountInput** - text input with Zod validation (1,000 - 20,000,000)
  - [x] Numeric-only validation via Zod schema
  - [x] Min/max constraint enforcement via Zod
  - [x] Display Zod validation error messages
- [x] **LoanPurposeSelect** - dropdown with async options from API
  - [x] Loading state handling (BaseSkeleton)
  - [x] Zod validation for selected value
- [x] **RepaymentPeriodSelect** - dropdown with async options from API
  - [x] Zod validation for selected value
- [x] **LoanTermSelect** - dropdown with async options from API
  - [x] Zod validation for selected value
- [x] **CalculationResults** - display calculated repayment per period and total
  - [x] Handle negative PMT values (display as positive via Math.abs in useCalculateRepayment)
- [x] **LoanCalculatorWidget** - main container component, composes all inputs together
  - [x] Collect validated form data via Zod schema
  - [x] Show validation errors from Zod