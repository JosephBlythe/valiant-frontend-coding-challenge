# Loan Repayment Calculator — Notes

## Architecture Overview

### Component tree

```
App.vue
└── LoanCalculatorWidget       # orchestration layer — composes all inputs & results
    ├── LoanAmountInput        # text input with live formatting and blur clamping
    ├── LoanPurposeSelect      # dropdown seeded from GET /loan-purposes
    ├── RepaymentPeriodSelect  # dropdown seeded from GET /requested-repayment-periods
    ├── LoanTermSelect         # dropdown seeded from GET /requested-term-months
    └── CalculationResults     # displays computed payment per period and total
```

Base UI primitives (`BaseInput`, `BaseSelect`, `BaseCard`, `BaseSkeleton`) live in `src/components/ui/` and use [class-variance-authority](https://cva.style/) for variant management.

### State & logic

All calculator state lives in composables — there is no global store:

| Composable | Responsibility |
|---|---|
| `useLoansAPI` | Fetches the three option lists from the backend via VueUse `useFetch` |
| `useCalculateRepayment` | Pure PMT formula; returns `paymentPerPeriod` and `totalPayment` |
| `useFormValidation` | Field level and full form validation backed by Zod schemas |
| `useLoanCalculator` | Orchestrates the above three; exposes a single reactive interface to the widget |

`useLoanCalculator` exposes computed `formData` that applies API defaults (first option) until the user makes an explicit selection. `results` is a derived computed — it recalculates automatically whenever any input changes.

### Validation

Zod schemas are in `src/schemas/calculator.js`. `LOAN_AMOUNT_MIN` (1,000) and `LOAN_AMOUNT_MAX` (20,000,000) are exported as named constants and shared between the schema and the input component to prevent drift.

### Calculation

The PMT formula (standard amortisation) in `src/utils/PMT.js`:

```
PMT = P × r / (1 − (1 + r)^−n)
```

where `P` = principal, `r` = periodic rate (`annualRate / periodsPerYear`), `n` = total periods (`(termMonths / 12) × periodsPerYear`). Zero-interest is handled as a straight division.

---

## Testing

### Unit tests

```bash
npm run test:unit
```

Covers: Zod schemas, PMT utility, all four composables. Composable tests use `effectScope` to satisfy Vue's reactivity requirements outside a component. `useLoanCalculator` tests mock `useLoansAPI` via `vi.mock`; `useLoansAPI` tests spy on `globalThis.fetch`.

### Integration tests

```bash
npm run test:integration
```

Hits the live backend. The backend must be running (`npm run backend`) before these execute — the test suite will attempt to start it automatically if it isn't.

### End-to-end tests

```bash
npm run test:e2e
```

Cypress tests cover the full user flow: entering a loan amount, selecting purpose/period/term, and verifying the calculated repayment figures. API responses are intercepted via fixtures.

---

## Key design decisions

- **No global store.** The widget is intended to be embeddable on any page; self-contained composable state makes this straightforward without store coupling.
- **Automatic calculation.** Results are a computed property rather than being triggered by a submit button, so users see live feedback as they change inputs.
- **Blur-clamping.** Rather than blocking invalid amounts with an error, `LoanAmountInput` clamps to the valid range on blur. This prevents the results area from ever showing an error for out-of-range amounts in normal usage.
- **API error isolation.** If any of the three option endpoints fail, the widget replaces the form with a friendly error message and a retry button, rather than showing a partially-broken UI.

## Issues faced
- Port 5000 conflicted with another service on my machine, so I had to change the backend port to 5001 and update all references accordingly.
- ESlint is configured using commonjs, which seems to cause issues when adding custom tailwind config the new classes are not picked up in VSCode but running linting is fine.
- Cypress initially wasn't working I had to configure it properly with the correct base URL.

## Future improvements
- Migrate to typescript for better type safety and DX
- Add more comprehensive error handling and edge case coverage in tests
- Implement a more robust theming solution (e.g., CSS variables)
- Web component wrapper for framework agnostic embedding
- Accessibility audit and improvements (ARIA attributes, keyboard navigation, screen reader support)

