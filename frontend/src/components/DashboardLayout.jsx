import { useState } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import BottomNav from './BottomNav';
import TransactionModal from './TransactionModal';

function DashboardLayout({ children, onTransactionSuccess }) {
  const [showModal, setShowModal] = useState(false);

  const handleTransactionSuccess = async () => {
    if (onTransactionSuccess) {
      await onTransactionSuccess();
    }
    setShowModal(false);
  };

  return (
    <div className="dashboard">
      <Header showLogout={true} />

      <main className="dashboard-main">
        {children}
      </main>

      <TransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleTransactionSuccess}
      />

      <BottomNav onFabClick={() => setShowModal(true)} />

      {/* FAB Desktop - flottant en bas à droite */}
      <button
        className="fab fab-desktop"
        onClick={() => setShowModal(true)}
        aria-label="Ajouter une transaction"
      >
        <span className="fab-icon">+</span>
      </button>
    </div>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  onTransactionSuccess: PropTypes.func,
};

export default DashboardLayout;
