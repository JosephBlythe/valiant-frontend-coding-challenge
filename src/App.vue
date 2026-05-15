<script setup>
import LoanCalculatorWidget from '@/components/LoanCalculatorWidget.vue'

defineOptions({
  name: 'App',
})
</script>

<template>
  <main class="flex min-h-screen justify-center bg-gradient-brand p-4 sm:items-center sm:p-8">
    <LoanCalculatorWidget />
  </main>
</template>
