import PropTypes from 'prop-types';

function FAB({ onClick }) {
  return (
    <button className="fab" onClick={onClick} aria-label="Ajouter une transaction">
      <span className="fab-icon">+</span>
    </button>
  );
}

FAB.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default FAB;
