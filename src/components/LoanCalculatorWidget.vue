<script setup>
import { computed } from 'vue'
import { useLoanCalculator } from '@/composables/useLoanCalculator'
import BaseCard from '@/components/ui/BaseCard.vue'
import LoanAmountInput from '@/components/LoanAmountInput.vue'
import LoanPurposeSelect from '@/components/LoanPurposeSelect.vue'
import RepaymentPeriodSelect from '@/components/RepaymentPeriodSelect.vue'
import LoanTermSelect from '@/components/LoanTermSelect.vue'
import CalculationResults from '@/components/CalculationResults.vue'

const {
  formData,
  results,
  apiData,
  loading,
  validationErrors,
  updateField,
} = useLoanCalculator()

const selectedPeriodLabel = computed(() => {
  const period = apiData.value.repaymentPeriods.find(
    (p) => p.value === formData.value.repaymentPeriod
  )
  return period?.label ?? 'Period'
})
</script>

<template>
  <BaseCard
    variant="default"
    padding="none"
    class="w-full max-w-xl p-5 sm:p-8"
    data-testid="loan-calculator-widget"
  >
    <h2 class="mb-5 font-serif text-2xl font-semibold sm:mb-6 sm:text-center sm:text-3xl">
      Tell us about your ideal loan
    </h2>

    <div class="flex flex-col gap-3 text-base sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-2 sm:gap-y-4 sm:text-xl">
      <div class="flex items-center gap-2">
        <span class="shrink-0">I need</span>
        <LoanAmountInput
          class="flex-1 sm:flex-none"
          :model-value="formData.loanAmount"
          :error="validationErrors.loanAmount"
          @update:model-value="updateField('loanAmount', $event)"
        />
      </div>

      <div class="flex items-center gap-2">
        <span class="shrink-0">for</span>
        <LoanPurposeSelect
          class="flex-1 sm:flex-none"
          :model-value="formData.loanPurpose"
          :options="apiData.loanPurposes"
          :loading="loading.purposes"
          :error="validationErrors.loanPurpose"
          @update:model-value="updateField('loanPurpose', $event)"
        />
      </div>

      <div class="flex items-center gap-2">
        <span class="shrink-0">repaid</span>
        <RepaymentPeriodSelect
          class="flex-1 sm:flex-none"
          :model-value="formData.repaymentPeriod"
          :options="apiData.repaymentPeriods"
          :loading="loading.periods"
          :error="validationErrors.repaymentPeriod"
          @update:model-value="updateField('repaymentPeriod', $event)"
        />
      </div>

      <div class="flex items-center gap-2">
        <span class="shrink-0">over</span>
        <LoanTermSelect
          class="flex-1 sm:flex-none"
          :model-value="formData.loanTerm"
          :options="apiData.loanTerms"
          :loading="loading.terms"
          :error="validationErrors.loanTerm"
          @update:model-value="updateField('loanTerm', $event)"
        />
      </div>
    </div>

    <CalculationResults
      :payment-per-period="results.paymentPerPeriod"
      :total-payment="results.totalPayment"
      :period-label="selectedPeriodLabel"
      :errors="validationErrors"
    />

    <p class="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
      <span class="mt-1">Powered by</span>
      <a
        href="https://www.valiantfinance.com/"
        target="_blank"
        rel="noopener"
      >
        <img
          :src="'/valiant-logo.svg'"
          alt="Valiant Finance"
          class="h-4"
        >
      </a>
    </p>
  </BaseCard>
</template>
