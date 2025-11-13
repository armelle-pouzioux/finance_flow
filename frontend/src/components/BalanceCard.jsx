import PropTypes from 'prop-types';

function BalanceCard({ balance }) {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="balance-card">
      <div className="balance-date">{currentDate}</div>
      <div className="balance-amount">
        {balance >= 0 ? '+' : ''} {balance.toFixed(2)}€
      </div>
    </div>
  );
}

BalanceCard.propTypes = {
  balance: PropTypes.number.isRequired,
};

export default BalanceCard;
