<script setup>
import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const inputVariants = cva(
  'w-full transition-colors placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'rounded-md border border-border bg-secondary focus:ring-2 focus:ring-primary focus:ring-offset-1',
        primary: 'rounded-md border border-primary bg-primary focus:ring-2 focus:ring-primary focus:ring-offset-1',
        ghost: 'rounded-md border border-transparent bg-transparent focus:ring-2 focus:ring-primary focus:ring-offset-1',
        underline: 'rounded-none border-0 border-b border-dotted border-current bg-transparent focus:border-current focus:ring-0 focus:ring-offset-0',
      },
      size: {
        sm: 'h-8 px-2 py-1 text-sm',
        md: 'h-10 px-3 py-2 text-base',
        lg: 'h-12 px-4 py-3 text-lg',
      },
      state: {
        default: '',
        error: 'border-danger focus:ring-danger',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'default',
    },
  }
)

const props = defineProps({
  variant: { type: String, default: 'default' },
  size: { type: String, default: 'md' },
  state: { type: String, default: 'default' },
  class: { type: String, default: '' },
})
</script>

<template>
  <input
    v-bind="$attrs"
    :class="cn(inputVariants({ variant, size, state }), props.class)"
  >
</template>
