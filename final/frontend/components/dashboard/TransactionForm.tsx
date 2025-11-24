import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { PlusCircle, DollarSign, Calendar, FileText, Tag } from 'lucide-react';

interface TransactionFormProps {
    onSubmit: (data: any) => Promise<void>;
    categories: { [key: string]: string[] };
    currencies: string[];
}

export default function TransactionForm({ onSubmit, categories, currencies }: TransactionFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'expense',
        category: 'Food',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        currency: 'PKR'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            // Reset form (except currency and date usually stays)
            setFormData(prev => ({
                ...prev,
                amount: '',
                description: '',
                category: categories[prev.type][0]
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const currentCategories = categories[formData.type as keyof typeof categories] || [];

    return (
        <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-100 p-3 rounded-xl text-primary-600">
                    <PlusCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Add Transaction</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Type"
                        value={formData.type}
                        onChange={(e) => setFormData({
                            ...formData,
                            type: e.target.value,
                            category: categories[e.target.value as keyof typeof categories][0]
                        })}
                        options={[
                            { value: 'expense', label: '💸 Expense' },
                            { value: 'income', label: '💰 Income' }
                        ]}
                    />

                    <Select
                        label="Category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        options={currentCategories.map(c => ({ value: c, label: c }))}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Amount"
                        type="number"
                        step="0.01"
                        required
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        icon={<DollarSign className="w-4 h-4" />}
                    />

                    <Select
                        label="Currency"
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        options={currencies.map(c => ({ value: c, label: c }))}
                    />
                </div>

                <Input
                    label="Description"
                    required
                    placeholder="What was this for?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    icon={<FileText className="w-4 h-4" />}
                />

                <Input
                    label="Date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    icon={<Calendar className="w-4 h-4" />}
                />

                <Button
                    type="submit"
                    className="w-full mt-2"
                    size="lg"
                    isLoading={loading}
                >
                    Add Transaction
                </Button>
            </form>
        </Card>
    );
}
