import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieChartIcon, BarChart as BarChartIcon, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getGoals } from '@/lib/api';

interface AnalyticsChartsProps {
    report: any;
    showCharts: boolean;
    setShowCharts: (show: boolean) => void;
    username: string;
    selectedMonth?: string;
    viewAllTime?: boolean;
    loading?: boolean;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#6366F1'];

export default function AnalyticsCharts({ report, showCharts, setShowCharts, username, selectedMonth, viewAllTime, loading }: AnalyticsChartsProps) {
    const [goals, setGoals] = useState<any[]>([]);

    useEffect(() => {
        if (username) {
            loadGoals();
        }
    }, [username]);

    const loadGoals = async () => {
        try {
            const data = await getGoals(username);
            setGoals(data);
        } catch (error) {
            console.error('Failed to load goals:', error);
        }
    };

    const monthName = viewAllTime
        ? 'All Time'
        : selectedMonth 
        ? new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Current Period';

    const chartData = report?.categoryBreakdown || report?.category_breakdown
        ? Object.entries(report?.categoryBreakdown || report?.category_breakdown || {}).map(([name, value]) => ({
            name,
            value: Number(value)
        }))
        : [];

    // Calculate total financial goals contribution
    const totalGoalsAmount = goals.reduce((sum, goal) => sum + (goal.current_amount || 0), 0);

    // Add financial goals to chart data if there are any
    const chartDataWithGoals = totalGoalsAmount > 0 
        ? [...chartData, { name: 'Financial Goals', value: totalGoalsAmount }]
        : chartData;

    const monthlyData = [
        { name: 'Income', value: report?.totalIncome || report?.total_income || 0, fill: '#10B981' },
        { name: 'Expense', value: report?.totalExpense || report?.total_expense || 0, fill: '#EF4444' },
        { name: 'Savings', value: report?.savingsVault || 0, fill: '#8B5CF6' },
        { name: 'Goals', value: totalGoalsAmount, fill: '#F59E0B' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                        <PieChartIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Analytics Overview</h2>
                        <p className="text-sm text-slate-500">{monthName}</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCharts(!showCharts)}
                    className="gap-2"
                >
                    {showCharts ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showCharts ? 'Hide Charts' : 'Show Charts'}
                </Button>
            </div>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showCharts ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 mx-auto border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-medium">Loading analytics...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Expense Breakdown */}
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-primary-500 rounded-full"></span>
                            Expense Breakdown
                        </h3>
                        {chartDataWithGoals.length > 0 ? (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartDataWithGoals}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {chartDataWithGoals.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-slate-400">
                                No expense data available
                            </div>
                        )}
                    </Card>

                    {/* Income vs Expense */}
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-success-500 rounded-full"></span>
                            Financial Overview
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                        {monthlyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
                )}
            </div>
        </div>
    );
}
