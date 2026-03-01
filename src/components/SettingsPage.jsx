import React, { useState } from 'react';
import { Save, Eye, EyeOff, Moon, Sun, Globe } from 'lucide-react';

const SettingsPage = ({ data, onUpdate, language, onLanguageChange, isDarkMode, toggleTheme, t }) => {
    const [gistId, setGistId] = useState(localStorage.getItem('cootd_gist_id') || '');
    const [token, setToken] = useState(localStorage.getItem('cootd_github_token') || '');
    const [showToken, setShowToken] = useState(false);

    const handleSave = () => {
        localStorage.setItem('cootd_gist_id', gistId);
        localStorage.setItem('cootd_github_token', token);
        alert(t('credentials_saved'));
        window.location.reload();
    };

    return (
        <div className="animate-fade-in pb-28 px-4 pt-2 overflow-y-auto h-full custom-scrollbar space-y-6">
            <h2 className="text-xl font-black text-neumo-text uppercase tracking-tighter">{t('settings')}</h2>

            {/* Theme */}
            <div className="neumo-card p-4 space-y-3">
                <h3 className="text-xs font-black text-neumo-subtext uppercase tracking-widest">{t('theme')}</h3>
                <div className="flex gap-2">
                    <button onClick={toggleTheme}
                        className={`flex-1 neumo-btn py-3 flex items-center justify-center gap-2 text-xs font-black ${!isDarkMode ? 'text-neumo-accent' : 'text-neumo-subtext'}`}>
                        <Sun size={16} /> {t('light')}
                    </button>
                    <button onClick={toggleTheme}
                        className={`flex-1 neumo-btn py-3 flex items-center justify-center gap-2 text-xs font-black ${isDarkMode ? 'text-neumo-accent' : 'text-neumo-subtext'}`}>
                        <Moon size={16} /> {t('dark')}
                    </button>
                </div>
            </div>

            {/* Language */}
            <div className="neumo-card p-4 space-y-3">
                <h3 className="text-xs font-black text-neumo-subtext uppercase tracking-widest flex items-center gap-2"><Globe size={14} /> {t('language')}</h3>
                <div className="flex gap-2">
                    {[{ id: 'en', label: 'English' }, { id: 'ja', label: '日本語' }, { id: 'ko', label: '한국어' }].map(lang => (
                        <button key={lang.id} onClick={() => onLanguageChange(lang.id)}
                            className={`flex-1 neumo-btn py-2 text-[10px] font-black uppercase ${language === lang.id ? 'text-neumo-accent' : 'text-neumo-subtext'}`}>
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gist Storage */}
            <div className="neumo-card p-4 space-y-3">
                <h3 className="text-xs font-black text-neumo-subtext uppercase tracking-widest">GitHub Storage (Gist)</h3>
                <input className="neumo-input" placeholder={t('gist_id')} value={gistId} onChange={e => setGistId(e.target.value)} />
                <div className="relative">
                    <input className="neumo-input pr-10" type={showToken ? 'text' : 'password'} placeholder={t('github_token')} value={token} onChange={e => setToken(e.target.value)} />
                    <button onClick={() => setShowToken(!showToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neumo-subtext">
                        {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
                <button onClick={handleSave} className="w-full neumo-btn py-3 text-neumo-accent text-xs font-black flex items-center justify-center gap-2">
                    <Save size={16} /> {t('sync_save')}
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
