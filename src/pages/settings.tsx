import ChangeName from '@/components/change_name';

interface SettingsProps {
  onNavigate: (page: 'dashboard' | 'settings' | 'login') => void;
}

function Settings({ onNavigate }: SettingsProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p>Manage your preferences here.</p>
      <button
        className="mt-4 p-2 bg-gray-800 text-white rounded"
        onClick={() => onNavigate('dashboard')}
      >
        Go Back to Dashboard
      </button>
      <ChangeName></ChangeName>
    </div>
  );
}

export default Settings;
