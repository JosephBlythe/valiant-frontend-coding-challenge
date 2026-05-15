<script setup>
import { computed, nextTick, ref } from 'vue'
import { useVModel } from '@vueuse/core'
import BaseInput from '@/components/ui/BaseInput.vue'

const props = defineProps({
  modelValue: { type: Number, default: null },
  error: { type: String, default: null },
})

const emit = defineEmits(['update:modelValue'])

const model = useVModel(props, 'modelValue', emit, { passive: true })

const touched = ref(false)

const displayValue = computed(() =>
  model.value != null ? model.value.toLocaleString('en-AU') : ''
)

const showError = computed(() => touched.value && !!props.error)

const onFocus = () => {
  touched.value = false
}

const onBlur = () => {
  touched.value = true
  if (model.value == null || isNaN(model.value) || model.value < 1000) {
    model.value = 1000
  } else if (model.value > 20000000) {
    model.value = 20000000
  }
}

const onInput = (e) => {
  const input = e.target
  const digitsBeforeCursor = (input.value.slice(0, input.selectionStart).match(/\d/g) ?? []).length

  const raw = input.value.replace(/[^0-9]/g, '')
  model.value = raw === '' ? null : Number(raw)

  nextTick(() => {
    const formatted = input.value
    let newCursorPos = 0
    if (digitsBeforeCursor > 0) {
      let digitCount = 0
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) digitCount++
        if (digitCount === digitsBeforeCursor) { newCursorPos = i + 1; break }
      }
      if (digitCount < digitsBeforeCursor) newCursorPos = formatted.length
    }
    input.setSelectionRange(newCursorPos, newCursorPos)
  })
}
</script>

<template>
  <div
    class="inline-flex flex-col gap-1"
    data-testid="loan-amount-input"
  >
    <div class="relative flex items-center">
      <span class="pointer-events-none absolute left-3 font-bold">$</span>
      <BaseInput
        type="text"
        inputmode="numeric"
        :value="displayValue"
        :state="showError ? 'error' : 'default'"
        class="w-full pl-6 font-bold sm:w-44 sm:text-xl"
        placeholder="30,000"
        aria-label="Loan amount in dollars"
        data-testid="loan-amount-field"
        @focus="onFocus"
        @input="onInput"
        @blur="onBlur"
      />
    </div>
    <p
      v-if="showError"
      class="text-xs text-danger"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>
