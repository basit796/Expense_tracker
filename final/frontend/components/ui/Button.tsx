import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'danger' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'md', isLoading, children, ...props }, ref) => {
        const variants = {
            default: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20',
            outline: 'border-2 border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300',
            ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            danger: 'bg-danger-500 text-white hover:bg-danger-600 shadow-lg shadow-danger-500/20',
            secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm',
        };

        const sizes = {
            sm: 'h-9 px-3 text-sm',
            md: 'h-11 px-6 text-base',
            lg: 'h-14 px-8 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
