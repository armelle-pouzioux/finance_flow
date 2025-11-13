import { useState } from 'react';
import PropTypes from 'prop-types';

function TransactionItem({ transaction, onClick }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="transaction-item clickable" onClick={() => onClick(transaction)}>
      <div className="transaction-info">
        <span className="transaction-date">{formatDate(transaction.transaction_date)}</span>
        <span className="transaction-category">
          {transaction.category_name} {transaction.subcategory_name && `/ ${transaction.subcategory_name}`}
        </span>
      </div>
      <span className={`transaction-amount ${transaction.type === 'income' ? 'positive' : 'negative'}`}>
        {transaction.type === 'income' ? '+' : '-'}{parseFloat(transaction.amount).toFixed(2)}€
      </span>
    </div>
  );
}

TransactionItem.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.number.isRequired,
    transaction_date: PropTypes.string.isRequired,
    category_name: PropTypes.string,
    subcategory_name: PropTypes.string,
    type: PropTypes.oneOf(['income', 'expense']).isRequired,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

function TransactionList({ transactions, limit, onTransactionClick, showPagination = false }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  if (transactions.length === 0) {
    return (
      <div className="transactions-section">
        <div className="section-header">
          <h2 className="section-title">Mes transactions</h2>
        </div>
        <div className="transactions-list">
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p className="empty-text">Aucune transaction pour le moment</p>
            <p className="empty-subtext">Cliquez sur le bouton + pour ajouter votre première transaction</p>
          </div>
        </div>
      </div>
    );
  }

  let displayedTransactions;
  let totalPages = 1;

  if (showPagination) {
    totalPages = Math.ceil(transactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    displayedTransactions = transactions.slice(startIndex, endIndex);
  } else if (limit) {
    displayedTransactions = transactions.slice(0, limit);
  } else {
    displayedTransactions = transactions;
  }

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="transactions-section">
      <div className="section-header">
        <h2 className="section-title">Mes transactions</h2>
        {showPagination && (
          <span className="pagination-info">
            Page {currentPage} sur {totalPages}
          </span>
        )}
      </div>
      <div className="transactions-list">
        {displayedTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onClick={onTransactionClick}
          />
        ))}
      </div>

      {showPagination && totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary btn-sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            ←
          </button>
          <span className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
           →
          </button>
        </div>
      )}
    </div>
  );
}

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      transaction_date: PropTypes.string.isRequired,
      category_name: PropTypes.string,
      subcategory_name: PropTypes.string,
      type: PropTypes.oneOf(['income', 'expense']).isRequired,
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  limit: PropTypes.number,
  onTransactionClick: PropTypes.func.isRequired,
  showPagination: PropTypes.bool,
};

export default TransactionList;
