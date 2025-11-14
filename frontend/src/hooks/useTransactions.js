import { useState, useEffect, useCallback } from 'react';
import transactionService from '../services/transactionService';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});

  const loadTransactions = useCallback(async (customFilters = null) => {
    setLoading(true);
    setError('');
    try {
      const appliedFilters = customFilters !== null ? customFilters : filters;
      const response = await transactionService.getAll(appliedFilters);
      if (response.success) {
        setTransactions(response.data.transactions);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des transactions:', err);
      setError('Impossible de charger les transactions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const calculateBalance = useCallback(() => {
    return transactions.reduce((acc, transaction) => {
      return transaction.type === 'income'
        ? acc + parseFloat(transaction.amount)
        : acc - parseFloat(transaction.amount);
    }, 0);
  }, [transactions]);

  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    loadTransactions(newFilters);
  }, [loadTransactions]);

  return {
    transactions,
    loading,
    error,
    loadTransactions,
    calculateBalance,
    applyFilters,
    filters,
  };
}
