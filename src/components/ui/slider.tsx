import * as SliderPrimitive from '@radix-ui/react-slider'
import type * as React from 'react'
import { cn } from '@/lib/utils'

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  formatValue?: (value: number) => string
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step,
  formatValue,
  ...props
}: SliderProps) {
  const values = value ?? defaultValue ?? [min, max]
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      step={step}
      className={cn(
        'relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            'bg-primary dark:bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
          )}
        />
      </SliderPrimitive.Track>
      {values.map((currentValue, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="group relative block size-4 shrink-0 rounded-full border-primary bg-primary shadow-sm ring-ring/50 transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:border-primary dark:bg-primary"
        >
          {formatValue ? (
            <span className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 rounded-md bg-primary px-2 py-1 text-xs whitespace-nowrap text-primary-foreground shadow-sm group-hover:block group-focus-visible:block">
              {formatValue(currentValue)}
            </span>
          ) : null}
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
