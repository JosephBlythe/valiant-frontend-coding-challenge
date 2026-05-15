<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/formatCurrency'

const props = defineProps({
  paymentPerPeriod: { type: Number, default: null },
  totalPayment: { type: Number, default: null },
  periodLabel: { type: String, default: 'Period' },
  errors: { type: Object, default: null },
})

const formattedPayment = computed(() => formatCurrency(props.paymentPerPeriod))
const formattedTotal = computed(() => formatCurrency(props.totalPayment))
const activeErrors = computed(() => Object.values(props.errors ?? {}).filter(Boolean))
</script>

<template>
  <div data-testid="calculation-results">
    <div
      class="mt-5 rounded-xl border border-primary bg-white/90 p-5 text-center sm:mt-6"
    >
      <template v-if="activeErrors.length">
        <ul
          class="space-y-1 text-sm text-danger"
          role="alert"
          data-testid="validation-errors"
        >
          <li
            v-for="(msg, i) in activeErrors"
            :key="i"
          >
            {{ msg }}
          </li>
        </ul>
      </template>
      <template v-else>
        <div
          class="text-4xl font-bold text-success sm:text-5xl"
          data-testid="payment-per-period"
        >
          {{ formattedPayment }}
        </div>
        <div
          class="mt-1 text-sm sm:text-base"
          data-testid="period-label"
        >
          {{ periodLabel }} Repayments
        </div>
        <div
          class="mt-3 text-sm"
          data-testid="total-payment"
        >
          {{ formattedTotal }} Total Repayments
        </div>
      </template>
    </div>
  </div>
</template>
