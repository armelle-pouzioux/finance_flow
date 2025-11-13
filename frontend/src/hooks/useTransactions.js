import { useState, useEffect, useCallback } from 'react';
import transactionService from '../services/transactionService';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await transactionService.getAll();
      if (response.success) {
        setTransactions(response.data.transactions);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des transactions:', err);
      setError('Impossible de charger les transactions');
    } finally {
      setLoading(false);
    }
  }, []);

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

  return {
    transactions,
    loading,
    error,
    loadTransactions,
    calculateBalance,
  };
}
