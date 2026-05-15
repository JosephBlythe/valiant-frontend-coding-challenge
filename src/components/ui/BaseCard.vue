<script setup>
import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const cardVariants = cva(
  'rounded-2xl',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        primary: 'bg-primary shadow-md',
        secondary: 'bg-secondary shadow-md',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
)

const props = defineProps({
  variant: { type: String, default: 'default' },
  padding: { type: String, default: 'md' },
  class: { type: String, default: '' },
})
</script>

<template>
  <div :class="cn(cardVariants({ variant, padding }), props.class)">
    <slot />
  </div>
</template>
