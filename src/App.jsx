import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, Users, Bookmark, Settings, Plus } from 'lucide-react';
import Tabbar from './components/Tabbar';
import ClosetPage from './components/ClosetPage';
import AddItemModal from './components/AddItemModal';
import OutfitSetupPage from './components/OutfitSetupPage';
import OutfitSaveModal from './components/OutfitSaveModal';
import OutfitsPage from './components/OutfitsPage';
import SettingsPage from './components/SettingsPage';
import { fetchGistData, updateGistData, getStorageCredentials, INITIAL_DATA_TEMPLATE, sanitizeData } from './lib/storage';
import { translations } from './lib/translations';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('closet');
  const [data, setData] = useState(INITIAL_DATA_TEMPLATE);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showOutfitSave, setShowOutfitSave] = useState(false);
  const [equippedForSave, setEquippedForSave] = useState({});

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('cootd_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [language, setLanguage] = useState(() => localStorage.getItem('cootd_lang') || 'en');

  const t = (key) => translations[language]?.[key] || translations.en?.[key] || key;

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('cootd_lang', lang);
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('cootd_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDarkMode]);

  const loadData = async () => {
    setLoading(true);
    const { gistId, token } = getStorageCredentials();
    if (!gistId || !token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    setIsAuthenticated(true);
    try {
      const remoteData = await fetchGistData();
      setData(sanitizeData(remoteData));
    } catch (e) {
      console.error('Load failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleUpdate = async (newData) => {
    setData(newData);
    try { await updateGistData(newData); } catch (e) { console.error('Sync failed', e); }
  };

  const handleSaveOutfit = (equipped) => {
    setEquippedForSave(equipped);
    setShowOutfitSave(true);
  };

  const renderContent = () => {
    if (!isAuthenticated && activeTab !== 'settings') {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 px-8">
          <Shirt size={48} className="text-neumo-subtext opacity-20" />
          <p className="text-neumo-subtext font-bold text-sm">Configure your GitHub Gist credentials to get started.</p>
          <button onClick={() => setActiveTab('settings')} className="neumo-btn px-6 py-3 text-xs font-black text-neumo-accent uppercase tracking-wider">
            Open Settings
          </button>
        </div>
      );
    }

    if (loading) {
      return <div className="flex items-center justify-center h-64 animate-pulse text-neumo-subtext font-bold uppercase tracking-widest text-xs">Loading...</div>;
    }

    switch (activeTab) {
      case 'closet':
        return <ClosetPage data={data} onUpdate={handleUpdate} t={t} language={language} onAddClick={() => setShowAddItem(true)} />;
      case 'outfit':
        return <OutfitSetupPage data={data} onUpdate={handleUpdate} t={t} language={language} onSaveOutfit={handleSaveOutfit} />;
      case 'outfits':
        return <OutfitsPage data={data} onUpdate={handleUpdate} t={t} language={language} />;
      case 'settings':
        return <SettingsPage data={data} onUpdate={handleUpdate} language={language} onLanguageChange={changeLanguage} isDarkMode={isDarkMode} toggleTheme={toggleTheme} t={t} />;
      default:
        return <ClosetPage data={data} onUpdate={handleUpdate} t={t} language={language} />;
    }
  };

  const tabs = [
    { id: 'closet', label: t('my_closet'), icon: Shirt },
    { id: 'outfit', label: t('outfit_setup'), icon: Users },
    { id: '__add__', label: '', icon: Plus },
    { id: 'outfits', label: t('my_outfits'), icon: Bookmark },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'var(--neumo-bg)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-neumo-text tracking-tighter">COOTD</h1>
          <p className="text-[8px] font-bold text-neumo-subtext uppercase tracking-[0.3em]">Closet Outfit Of The Day</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tabbar */}
      <Tabbar activeTab={activeTab} onChange={setActiveTab} tabs={tabs} onAddClick={() => setShowAddItem(true)} />

      {/* Modals */}
      <AnimatePresence>
        {showAddItem && <AddItemModal isOpen={showAddItem} onClose={() => setShowAddItem(false)} data={data} onUpdate={handleUpdate} t={t} language={language} />}
      </AnimatePresence>
      <AnimatePresence>
        {showOutfitSave && <OutfitSaveModal isOpen={showOutfitSave} onClose={() => setShowOutfitSave(false)} equippedItems={equippedForSave} data={data} onUpdate={handleUpdate} t={t} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
