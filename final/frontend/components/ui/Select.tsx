import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

interface SelectProps {
    label?: string;
    error?: string;
    value?: string;
    onChange?: (e: { target: { value: string } }) => void;
    options: { value: string; label: string }[];
    className?: string;
}

export const Select = ({ className, label, error, value, onChange, options }: SelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        if (onChange) {
            onChange({ target: { value: optionValue } });
        }
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="w-full space-y-2" ref={containerRef}>
            {label && (
                <label className="text-sm font-semibold text-slate-700 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        'w-full flex items-center justify-between rounded-xl border-2 border-slate-200 bg-white/50 px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-200 text-left',
                        error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/10',
                        isOpen && 'border-primary-500 ring-4 ring-primary-500/10',
                        className
                    )}
                >
                    <span className={!selectedOption ? 'text-slate-400' : ''}>
                        {selectedOption ? selectedOption.label : 'Select...'}
                    </span>
                    <ChevronDown className={cn(
                        "h-4 w-4 text-slate-500 transition-transform duration-200",
                        isOpen && "transform rotate-180"
                    )} />
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-slate-100 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                        <div className="max-h-60 overflow-auto py-1">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-slate-50 transition-colors",
                                        value === option.value && "bg-primary-50 text-primary-700 font-medium"
                                    )}
                                >
                                    {option.label}
                                    {value === option.value && (
                                        <Check className="h-4 w-4 text-primary-600" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {error && (
                <p className="text-sm text-danger-600 ml-1 animate-slide-up">{error}</p>
            )}
        </div>
    );
};
