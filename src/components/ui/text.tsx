import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

interface TextProps extends React.ComponentProps<'p'> {
  asChild?: boolean;
}

export function Text({ asChild, className, ...props }: TextProps) {
  const Component = asChild ? Slot : 'p';

  return (
    <Component
      className={cn(
        'text-[0.8125rem] leading-[15px] font-medium -tracking-[0.1px] text-[#858BB2] dark:text-[#DFE3FA]',
        className
      )}
      {...props}
    />
  );
}
