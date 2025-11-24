import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}

export function Card({ className, hover = false, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl shadow-slate-200/50',
                hover && 'hover:shadow-2xl hover:-translate-y-1 transition-all duration-300',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
