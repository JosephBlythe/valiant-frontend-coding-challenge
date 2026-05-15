<script setup>
import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const skeletonVariants = cva(
  'animate-pulse rounded-md bg-muted',
  {
    variants: {
      size: {
        sm: 'h-4',
        md: 'h-6',
        lg: 'h-10',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const props = defineProps({
  size: { type: String, default: 'md' },
  class: { type: String, default: '' },
})
</script>

<template>
  <div :class="cn(skeletonVariants({ size }), props.class)" />
</template>
