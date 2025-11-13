import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useTheme } from '../context/ThemeContext';

function Settings() {
  const { theme, setThemeMode } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [language, setLanguage] = useState('fr');
  const [currency, setCurrency] = useState('EUR');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Appliquer le thème sélectionné
    setThemeMode(selectedTheme);

    // Afficher le message de confirmation
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="section-header">
        <h2 className="section-title">Paramètres</h2>
      </div>

      <div className="transactions-section">
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Préférences</h3>

        <div className="form-group">
          <label className="form-label">Langue</label>
          <select
            className="form-input"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Devise</label>
          <select
            className="form-input"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Thème</label>
          <select
            className="form-input"
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
          >
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
        </div>

        {saved && (
          <div style={{
            padding: '12px',
            marginBottom: '16px',
            background: 'var(--success)',
            color: 'white',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'center'
          }}>
            Paramètres enregistrés avec succès !
          </div>
        )}

        <button className="btn btn-primary" onClick={handleSave}>
          Enregistrer les modifications
        </button>
      </div>

      <div className="transactions-section" style={{ marginTop: '24px' }}>

        <p style={{ marginBottom: '16px', color: 'var(--text-light)', fontSize: '14px' }}>
          Attention : cette action est irréversible
        </p>

        <button className="btn btn-danger">
          Supprimer mon compte
        </button>
      </div>
    </DashboardLayout>
  );
}

export default Settings;
