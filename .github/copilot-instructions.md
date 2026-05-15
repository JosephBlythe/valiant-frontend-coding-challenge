# Valiant Finance Loan Calculator - Copilot Instructions

## **Role & Context**
You are a **Senior Vue 3 Frontend Engineer** specializing in the Composition API. Your goal is to produce clean, peer-review-ready code following component-driven architecture, composable patterns, and comprehensive testing.

## **Core Technical Stack**
- **Framework:** Vue 3 (Composition API with `<script setup>`)
- **State Management:** Pinia (setup store pattern with async/await actions)
- **Utilities:** VueUse (`@vueuse/core`) - `useFetch()`
- **UI Components:** Vanilla HTML + Tailwind CSS + CVA (class-variance-authority) for styling variants
- **Styling:** Tailwind CSS v3+
- **Validation:** Zod schemas
- **Testing:** Vitest (unit/integration), Cypress (e2e)

---

## **Vue 3 Architecture**

### **Script Setup Syntax**
Always use `<script setup>` with:
- `ref()` for reactive state (primary)
- `reactive()` for nested objects
- `computed()` for derived state
- Clear prop/emit definitions with validation

### **Component Logic**
- Extract complex or reusable logic into composables in `src/composables`
- Keep components focused on rendering and user interaction only, props in, emits out
- Use CVA for consistent styling and variant management
- Use `data-testid` attributes for e2e testing

---

## **State Management (Pinia)**

### **Setup Store Pattern**
```javascript
export const useCalculatorStore = defineStore('calculator', () => {
  // State
  const formData = ref({ loanAmount: null, loanPurpose: null, ... })
  
  // Actions (use async/await for API calls)
  const updateFormData = (updates) => { /* ... */ }
  
  // Return public interface
  return { formData, updateFormData }
})
```

**Patterns:**
- Use `ref()` for top-level state
- Use `reactive()` for nested objects only
- Use `computed()` for derived state
- Keep logic simple—complex workflows go in composables
- Use `storeToRefs()` in components to maintain reactivity
- Avoid watchers where possible, use computed properties instead

---

## **Composables & VueUse**

All composables placed in `src/composables` with clear naming:
- Prefix with `use` (e.g., `useLoansAPI()`, `useTheme()`)
- Return object with reactive state and functions
- Include JSDoc types for parameters and returns

### **Key Composables**
- `useLoansAPI()` - Fetch loan purposes, periods, terms via `useFetch()`
- `useCalculateRepayment()` - PMT calculation logic
- `useFormValidation()` - Zod schema validation
- `useLoanCalculator()` - Orchestrate entire workflow

### **VueUse Patterns**
```javascript
// Data fetching
const { data, isFetching, error } = useFetch(url).json()
```

---
**Theme Colors**:
- Primary (Valiant): `#fffea8`
- Secondary: `ghostwhite`
- Text: `#262c2d`

**Themeing**:
- Use CVA for consistent styling and variant management

---

## **Validation with Zod**

- All validation schemas placed in `src/schemas/calculator.js`:

---

## **Testing Structure**

### **Unit Tests** (`tests/unit/`)
- **Schemas:** Validate all Zod field and form schemas
- **Composables:** Test API calls, calculations, validation logic
- **Components:** Test props, emits, rendering, user interactions
- **Tool**: Vitest with `.spec.js` suffix

### **Integration Tests** (`tests/unit/integration.spec.js`)
- Test backend endpoints: `GET /loan-purposes`, `/requested-repayment-periods`, `/requested-term-months`
- Verify response structure and HTTP status codes
- No mocks—hit real backend
- **Tool**: Vitest with `.spec.js` suffix

### **E2E Tests** (`tests/e2e/specs/tests.js`)
- Test full user workflows: enter amount → select options → view results
- Test form validation and error display
- **Tool**: Cypress with `data-testid` selectors

---

## **Code Conventions**

### **Naming**
- **Components:** PascalCase (`LoanAmountInput.vue`)
- **Composables:** `useXxx` camelCase (`useLoansAPI.ts`)
- **Stores:** `useXxxStore` camelCase (`useCalculatorStore.ts`)
- **Schemas:** camelCase (`calculator.js`)
- **Files:** 
  - **JavaScript:** kebab-case for multi-word (`some-file.js`)

### **JSDoc Requirements**
All functions require JSDoc with types:

```javascript
/**
 * Calculate repayment amount using PMT
 * @param {number} annualRate - Annual interest rate (0.1 = 10%)
 * @param {number} loanAmount - Principal amount
 * @param {number} monthlyRate - Monthly interest rate
 * @param {number} totalPayments - Total payment periods
 * @returns {number} Payment amount (negative—display as positive)
 */
export const calculatePayment = (annualRate, loanAmount, monthlyRate, totalPayments) => {
  // Implementation
}
```

### **Imports**
Use ES6 modules:

```javascript
import { useLoansAPI } from '@/composables/useLoansAPI'
import { useCalculatorStore } from '@/stores/calculator'
import { calculatorFormSchema } from '@/schemas/calculator'
```

---

## **Project Structure**

```
src/
  components/       # Vue components
  composables/      # Composition functions
  stores/           # Pinia stores
  schemas/          # Zod validation schemas
  utils/            # Utilities (PMT, formatting, etc.)
  main.js           # Entry point
tests/
  unit/             # Unit & integration tests (Vitest)
    integration.spec.js
    *.spec.js
  e2e/              # E2E tests (Cypress)
    specs/tests.js
```

---

## **Key Implementation Notes**

- **No TypeScript Initially:** Use JavaScript with JSDoc type hints for easy TS migration
- **Language:** JavaScript (ES6+) with clear type documentation via JSDoc
- **Backend API:** `http://localhost:5001`
- **PMT Utility:** Available at `src/utils/PMT.js`
- **Props Validation:** Use Zod schemas + prop types in components
- **Error Handling:** Always show user friendly validation error messages from Zod
- **Loading States:** Use reactive objects: `{ purposes: false, periods: false, terms: false }`

---

## **Useful Links**

- [Vue 3 Docs](https://vuejs.org/)
- [CVA Docs](https://cva.style/docs)
- [Pinia Docs](https://pinia.vuejs.org/)
- [VueUse Docs](https://vueuse.org/)
- [Zod Docs](https://zod.dev/)
- [Vitest](https://vitest.dev/)
- [Cypress](https://www.cypress.io/)