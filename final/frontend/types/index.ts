// Types for the application
export interface User {
  username: string;
  email: string;
  fullName?: string;
  currency?: string;
}

export interface UserProfile {
  username: string;
  email: string;
  fullName: string;
  currency: string;
  createdAt: string;
  savingsVault: number;
}

export interface Transaction {
  id: string;
  username: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  currency?: string;
  created_at?: string;
}

export interface MonthlyReport {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryBreakdown: Record<string, number>;
  transactionCount: number;
  savingsVault: number;
  total_income?: number;  // Backward compatibility
  total_expense?: number;  // Backward compatibility
  category_breakdown?: Record<string, number>;  // Backward compatibility
  transaction_count?: number;  // Backward compatibility
}

export interface ApiResponse<T = any> {
  message?: string;
  [key: string]: any;
}
