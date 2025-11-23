// API Client
import { User, Transaction, MonthlyReport, ApiResponse, UserProfile } from '@/types';

const API_BASE_URL = 'http://localhost:8000/api';

export async function register(username: string, email: string, password: string, fullName: string, currency: string = 'PKR'): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, fullName, currency }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Registration failed');
  return data;
}

export async function login(username: string, password: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Login failed');
  return data;
}

export async function getProfile(username: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/profile/${username}`);
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
}

export async function updateName(username: string, fullName: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/profile/name`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, fullName }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to update name');
  return data;
}

export async function updatePassword(username: string, oldPassword: string, newPassword: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/profile/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, oldPassword, newPassword }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to update password');
  return data;
}

export async function updateCurrency(username: string, currency: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/profile/currency`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, currency }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to update currency');
  return data;
}

export async function getCurrencyRates(): Promise<{ rates: Record<string, number> }> {
  const response = await fetch(`${API_BASE_URL}/currency/rates`);
  if (!response.ok) throw new Error('Failed to fetch currency rates');
  return response.json();
}

export async function addTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to add transaction');
  return data;
}

export async function getTransactions(username: string): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE_URL}/transactions/${username}`);
  if (!response.ok) throw new Error('Failed to fetch transactions');
  return response.json();
}

export async function getMonthlyReport(username: string, month?: string): Promise<MonthlyReport> {
  const url = month 
    ? `${API_BASE_URL}/report/${username}?month=${month}`
    : `${API_BASE_URL}/report/${username}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch report');
  return response.json();
}

export async function deleteTransaction(id: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to delete transaction');
  return data;
}

export function downloadExcel(username: string, month?: string): void {
  const url = month
    ? `${API_BASE_URL}/export/${username}?month=${month}`
    : `${API_BASE_URL}/export/${username}`;
  window.open(url, '_blank');
}

export async function addToSavings(username: string, amount: number): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/savings/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, amount }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to add to savings');
  return data;
}

export async function withdrawFromSavings(username: string, amount: number): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/savings/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, amount }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to withdraw from savings');
  return data;
}
