import React from 'react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/currency';
import { Transaction } from '@/types';
import { Trash2, ArrowUpRight, ArrowDownLeft, Calendar, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionListProps {
    transactions: Transaction[];
    onDelete: (id: string) => void;
    currency: string;
}

export default function TransactionList({ transactions, onDelete, currency }: TransactionListProps) {
    return (
        <Card className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-success-50 p-3 rounded-xl text-success-600">
                    <ArrowUpRight className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Recent Transactions</h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                        <Tag className="w-12 h-12 mb-2 opacity-20" />
                        <p>No transactions found</p>
                    </div>
                ) : (
                    transactions.map((txn) => (
                        <div
                            key={txn.id}
                            className="group flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-3 rounded-full",
                                    txn.type === 'income' ? "bg-success-100 text-success-600" : "bg-danger-50 text-danger-600"
                                )}>
                                    {txn.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{txn.description}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                        <span className="bg-slate-200 px-2 py-0.5 rounded-full">{txn.category}</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {txn.date}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={cn(
                                    "font-bold text-lg",
                                    txn.type === 'income' ? "text-success-600" : "text-danger-600"
                                )}>
                                    {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, currency)}
                                </span>
                                <button
                                    onClick={() => onDelete(txn.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-all"
                                    title="Delete Transaction"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
