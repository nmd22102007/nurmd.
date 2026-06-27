import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
          {
            "bg-white text-black shadow-sm hover:bg-white/90 active:scale-[0.98] transition-all duration-200": variant === 'default',
            "bg-[#ef4444] text-white shadow-xs hover:bg-[#ef4444]/90": variant === 'destructive',
            "border border-[#e2e8f0]/20 bg-transparent shadow-xs hover:bg-white/5 text-white": variant === 'outline',
            "bg-[#1e293b]/50 text-white shadow-xs hover:bg-[#1e293b]/70": variant === 'secondary',
            "hover:bg-white/5 hover:text-white text-gray-400": variant === 'ghost',
            "text-primary underline-offset-4 hover:underline": variant === 'link',
          },
          {
            "h-9 px-4 py-2": size === 'default',
            "h-8 rounded-md px-3 text-xs": size === 'sm',
            "h-11 rounded-md px-8 text-base": size === 'lg',
            "h-9 w-9": size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
