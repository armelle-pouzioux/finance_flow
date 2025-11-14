import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import BalanceCard from '../components/BalanceCard';
import TransactionList from '../components/TransactionList';
import TransactionDetailModal from '../components/TransactionDetailModal';
import FilterBar from '../components/FilterBar';
import { useTransactions } from '../hooks/useTransactions';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#2EC4B6', '#FF6B6B', '#4ecd78ff', '#FFE66D', '#dbad2cff', '#F1FAEE'];

function Dashboard() {
  const { transactions, loadTransactions, calculateBalance, applyFilters } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Dépenses par catégorie pour le graphique
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = t.category_name || 'Non catégorisé';
      acc[category] = (acc[category] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

  const expenseChartData = Object.entries(expensesByCategory)
    .map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }))
    .slice(0, 6); // Top 6 catégories

  // Revenus par catégorie pour le graphique
  const incomesByCategory = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      const category = t.category_name || 'Non catégorisé';
      acc[category] = (acc[category] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

  const incomeChartData = Object.entries(incomesByCategory)
    .map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }))
    .slice(0, 6); // Top 6 catégories

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedTransaction(null);
  };

  const handleUpdate = () => {
    loadTransactions();
    handleCloseDetail();
  };

  const handleDelete = () => {
    loadTransactions();
    handleCloseDetail();
  };

  const handleFilterChange = (categories) => {
    setSelectedCategories(categories);

    // Si aucune catégorie n'est sélectionnée, afficher toutes les transactions
    if (categories.length === 0) {
      applyFilters({});
    } else if (categories.length === 1) {
      // Si une seule catégorie, utiliser le filtre backend
      applyFilters({ categoryId: categories[0] });
    } else {
      // Si plusieurs catégories, charger toutes les transactions et filtrer côté client
      // Note: Pour optimiser, on pourrait améliorer le backend pour accepter plusieurs IDs
      applyFilters({});
    }
  };

  // Filtrer côté client si plusieurs catégories sont sélectionnées
  const filteredTransactions = selectedCategories.length > 1
    ? transactions.filter(t => selectedCategories.includes(t.category_id))
    : transactions;

  return (
    <DashboardLayout onTransactionSuccess={loadTransactions}>
      <BalanceCard balance={calculateBalance()} />

      <FilterBar
        selectedCategories={selectedCategories}
        onFilterChange={handleFilterChange}
      />

      <TransactionList
        transactions={filteredTransactions}
        showPagination={true}
        onTransactionClick={handleTransactionClick}
      />

      {/* Section Graphiques - visible seulement s'il y a des données */}
      {(expenseChartData.length > 0 || incomeChartData.length > 0) && (
        <div className="chart-section">
          <div className="charts-grid">
            {/* Graphique des dépenses */}
            {expenseChartData.length > 0 && (
              <div className="chart-card">
                <h2 className="section-title">Répartition des dépenses</h2>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expenseChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} €`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Graphique des revenus */}
            {incomeChartData.length > 0 && (
              <div className="chart-card">
                <h2 className="section-title">Répartition des revenus</h2>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={incomeChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {incomeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} €`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de détails de transaction */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={showDetailModal}
        onClose={handleCloseDetail}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  );
}

export default Dashboard;
