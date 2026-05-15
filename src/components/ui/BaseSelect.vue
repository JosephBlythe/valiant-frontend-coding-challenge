<script setup>
import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const selectVariants = cva(
  'w-full appearance-none bg-no-repeat transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'rounded-md border border-border focus:ring-2 focus:ring-primary focus:ring-offset-1',
        primary: 'rounded-md border border-primary bg-primary text-primary-foreground focus:ring-2 focus:ring-primary focus:ring-offset-1',
        ghost: 'rounded-md border border-transparent bg-transparent focus:ring-2 focus:ring-primary focus:ring-offset-1',
        underline: 'rounded-none border-0 border-b border-dotted border-current bg-transparent focus:border-current focus:ring-0 focus:ring-offset-0',
      },
      size: {
        sm: 'h-8 py-1 pl-2 pr-7 text-sm',
        md: 'h-10 py-2 pl-3 pr-8 text-base',
        lg: 'h-12 py-3 pl-4 pr-10 text-lg',
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
    compoundVariants: [
      { variant: 'underline', class: 'h-auto' },
    ],
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
  <div class="relative">
    <select
      v-bind="$attrs"
      :class="cn(selectVariants({ variant, size, state }), props.class)"
    >
      <slot />
    </select>
    <span class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted-foreground">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="size-4"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </span>
  </div>
</template>
