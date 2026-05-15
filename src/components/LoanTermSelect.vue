<script setup>
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'

defineProps({
  modelValue: { type: Number, default: null },
  options: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
})

const emit = defineEmits(['update:modelValue'])

const onChange = (e) => {
  const val = e.target.value
  emit('update:modelValue', val === '' ? null : Number(val))
}
</script>

<template>
  <div
    class="inline-flex flex-col"
    data-testid="loan-term-select"
  >
    <BaseSkeleton
      v-if="loading"
      size="lg"
      class="w-full sm:w-48"
      data-testid="loan-term-skeleton"
    />
    <BaseSelect
      v-else
      variant="underline"
      :value="modelValue ?? ''"
      :state="error ? 'error' : 'default'"
      class="w-full sm:w-48 sm:text-xl"
      aria-label="Loan term"
      data-testid="loan-term-field"
      @change="onChange"
    >
      <option
        value=""
        disabled
      >
        Select
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
