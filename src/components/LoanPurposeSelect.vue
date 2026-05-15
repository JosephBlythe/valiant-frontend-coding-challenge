<script setup>
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'

defineProps({
  modelValue: { type: String, default: null },
  options: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
})

const emit = defineEmits(['update:modelValue'])

const onChange = (e) => {
  const val = e.target.value
  emit('update:modelValue', val === '' ? null : val)
}
</script>

<template>
  <div
    class="inline-flex flex-col"
    data-testid="loan-purpose-select"
  >
    <BaseSkeleton
      v-if="loading"
      size="lg"
      class="w-full sm:w-56"
      data-testid="loan-purpose-skeleton"
    />
    <BaseSelect
      v-else
      variant="underline"
      :value="modelValue ?? ''"
      :state="error ? 'error' : 'default'"
      class="w-full sm:w-56 sm:text-xl"
      aria-label="Loan purpose"
      data-testid="loan-purpose-field"
      @change="onChange"
    >
      <option
        value=""
        disabled
      >
        Select purpose
      </option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </BaseSelect>
  </div>
</template>
