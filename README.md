# 🦁 Valiant Frontend Coding Challenge

Template for the completing the Valiant Frontend Coding Challenge with Vue 3. Use this as a starting point for your solution, we have included some of the tooling we use at Valiant in our day-to-day work.

Dependencies include:
- [Vue 3](https://vuejs.org/guide/introduction)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ESLint](https://eslint.org/)
- [Vitest](https://vitest.dev/)
- [Cypress](https://www.cypress.io/)

## 🚀 Getting Started

Requires Node 20 and NPM 10. A `.nvmrc` file is included — if you use [nvm](https://github.com/nvm-sh/nvm), run:

```bash
# Install and switch to the correct Node version.
nvm install
nvm use

# Install dependencies.
npm install
```

## 🏃‍♀️ Scripts

### Development
- `npm run backend` – Start the backend server.
- `npm run dev` – Start the development server.
- `npm run build` – Build for production.
- `npm run preview` – Preview the production build.

### Linting
- `npm run lint` – Lint the code.
- `npm run lint:fix` – Lint and auto-fix issues.

### Testing
- `npm run test:unit` – Run all vitest unit tests.
- `npm run test:e2e` – Open Cypress for end-to-end tests.
- `npm run test:integration` – Run backend integration tests.
- `npm run test:schema` – Run Zod schema tests.
- `npm run test:useFormValidation` – Run form validation composable tests.
- `npm run test:useLoansAPI` – Run loans API composable tests.
- `npm run test:useCalculateRepayment` – Run repayment calculation composable tests.
- `npm run test:useLoanCalculator` – Run loan calculator orchestration tests.
