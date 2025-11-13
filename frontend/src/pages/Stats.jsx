import DashboardLayout from '../components/DashboardLayout';
import { useTransactions } from '../hooks/useTransactions';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Couleurs pour les graphiques
const COLORS = ['#2EC4B6', '#FF6B6B', '#4ECDC4', '#FFE66D', '#A8DADC', '#F1FAEE'];

function Stats() {
  const { transactions } = useTransactions();

  // Statistiques générales
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // Dépenses par catégorie
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = t.category_name || 'Non catégorisé';
      acc[category] = (acc[category] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

  const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2))
  }));

  // Revenus par catégorie
  const incomesByCategory = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      const category = t.category_name || 'Non catégorisé';
      acc[category] = (acc[category] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

  const incomeCategoryData = Object.entries(incomesByCategory).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2))
  }));

  // Évolution mensuelle
  const monthlyData = transactions.reduce((acc, t) => {
    const date = new Date(t.transaction_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, revenus: 0, depenses: 0 };
    }

    if (t.type === 'income') {
      acc[monthKey].revenus += parseFloat(t.amount);
    } else {
      acc[monthKey].depenses += parseFloat(t.amount);
    }

    return acc;
  }, {});

  const monthlyChartData = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6) // Derniers 6 mois
    .map(item => ({
      month: new Date(item.month + '-01').toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
      revenus: parseFloat(item.revenus.toFixed(2)),
      depenses: parseFloat(item.depenses.toFixed(2))
    }));

  if (transactions.length === 0) {
    return (
      <DashboardLayout>
        <div className="section-header">
          <h2 className="section-title">Statistiques</h2>
        </div>

        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p className="empty-text">Aucune donnée disponible</p>
          <p className="empty-subtext">Ajoutez des transactions pour voir vos statistiques</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="section-header">
        <h2 className="section-title">Statistiques</h2>
      </div>

      {/* Cartes récapitulatives */}
      <div className="stats-cards">
        <div className="stat-card stat-income">
          <div className="stat-label">Revenus totaux</div>
          <div className="stat-value">{totalIncome.toFixed(2)} €</div>
        </div>
        <div className="stat-card stat-expense">
          <div className="stat-label">Dépenses totales</div>
          <div className="stat-value">{totalExpense.toFixed(2)} €</div>
        </div>
        <div className={`stat-card ${balance >= 0 ? 'stat-positive' : 'stat-negative'}`}>
          <div className="stat-label">Solde</div>
          <div className="stat-value">{balance.toFixed(2)} €</div>
        </div>
      </div>

      {/* Graphique d'évolution */}
      <div className="chart-container">
        <h3 className="chart-title">Évolution des revenus et dépenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} €`} />
            <Legend />
            <Bar dataKey="revenus" fill="#2EC4B6" name="Revenus" radius={[10, 10, 0, 0]} />
            <Bar dataKey="depenses" fill="#FF6B6B" name="Dépenses" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Graphiques en camembert */}
      <div className="charts-grid">
        {categoryData.length > 0 && (
          <div className="chart-container">
            <h3 className="chart-title">Dépenses par catégorie</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {incomeCategoryData.length > 0 && (
          <div className="chart-container">
            <h3 className="chart-title">Revenus par catégorie</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomeCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top catégories */}
      <div className="chart-container">
        <h3 className="chart-title">Top 5 catégories de dépenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData.slice(0, 5)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#FF6B6B" name="Montant (€)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}

export default Stats;
