import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRound, Shirt, X, Save, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../lib/translations';

const BODY_ZONES = {
    hats: { top: '2%', left: '50%', transform: 'translateX(-50%)', width: '28%' },
    glasses: { top: '12%', left: '50%', transform: 'translateX(-50%)', width: '22%' },
    masks: { top: '18%', left: '50%', transform: 'translateX(-50%)', width: '20%' },
    scarves: { top: '24%', left: '50%', transform: 'translateX(-50%)', width: '30%' },
    tops: { top: '28%', left: '50%', transform: 'translateX(-50%)', width: '40%' },
    outerwear: { top: '26%', left: '50%', transform: 'translateX(-50%)', width: '46%' },
    underwear: { top: '35%', left: '50%', transform: 'translateX(-50%)', width: '32%' },
    lingerie: { top: '33%', left: '50%', transform: 'translateX(-50%)', width: '34%' },
    belts: { top: '48%', left: '50%', transform: 'translateX(-50%)', width: '34%' },
    bottoms: { top: '50%', left: '50%', transform: 'translateX(-50%)', width: '36%' },
    skirts: { top: '50%', left: '50%', transform: 'translateX(-50%)', width: '38%' },
    socks: { top: '78%', left: '50%', transform: 'translateX(-50%)', width: '22%' },
    shoes: { top: '86%', left: '50%', transform: 'translateX(-50%)', width: '30%' },
    bags: { top: '40%', left: '82%', width: '22%' },
};

const OutfitSetupPage = ({ data, onUpdate, t, language, onSaveOutfit }) => {
    const [equipped, setEquipped] = useState({});
    const [filterCat, setFilterCat] = useState('all');
    const [showSave, setShowSave] = useState(false);
    const gender = data?.settings?.gender || 'female';

    const closet = data?.closet || [];

    const filteredItems = useMemo(() => {
        if (filterCat === 'all') return closet;
        return closet.filter(i => i.category === filterCat);
    }, [closet, filterCat]);

    const toggleEquip = (item) => {
        setEquipped(prev => {
            const copy = { ...prev };
            if (copy[item.category]?.id === item.id) {
                delete copy[item.category];
            } else {
                copy[item.category] = item;
            }
            return copy;
        });
    };

    const equippedCount = Object.keys(equipped).length;

    return (
        <div className="animate-fade-in pb-28 px-4 pt-2 overflow-y-auto h-full custom-scrollbar flex flex-col">
            {/* Gender Toggle */}
            <div className="flex justify-center mb-3 gap-2">
                {['male', 'female'].map(g => (
                    <button
                        key={g}
                        onClick={async () => {
                            const newData = { ...data, settings: { ...data.settings, gender: g } };
                            await onUpdate(newData);
                        }}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all shadow-neumo-flat ${gender === g ? 'bg-neumo-accent text-white' : 'bg-neumo-bg text-neumo-text'}`}
                    >
                        {t(g)}
                    </button>
                ))}
            </div>

            {/* Silhouette Area */}
            <div className="flex-1 relative flex items-center justify-center min-h-[320px] neumo-card mx-auto w-full max-w-[280px] mb-4 overflow-hidden">
                {/* Human silhouette SVG */}
                <svg viewBox="0 0 200 500" className="w-full h-full opacity-10 absolute inset-0 p-4">
                    {gender === 'male' ? (
                        <>
                            <circle cx="100" cy="45" r="30" fill="currentColor" />
                            <rect x="70" y="80" width="60" height="100" rx="8" fill="currentColor" />
                            <rect x="55" y="85" width="20" height="80" rx="6" fill="currentColor" />
                            <rect x="125" y="85" width="20" height="80" rx="6" fill="currentColor" />
                            <rect x="75" y="180" width="22" height="120" rx="6" fill="currentColor" />
                            <rect x="103" y="180" width="22" height="120" rx="6" fill="currentColor" />
                            <ellipse cx="86" cy="310" rx="14" ry="8" fill="currentColor" />
                            <ellipse cx="114" cy="310" rx="14" ry="8" fill="currentColor" />
                        </>
                    ) : (
                        <>
                            <circle cx="100" cy="42" r="28" fill="currentColor" />
                            <path d="M72 75 L65 170 L135 170 L128 75 Z" rx="8" fill="currentColor" />
                            <rect x="50" y="82" width="18" height="75" rx="6" fill="currentColor" />
                            <rect x="132" y="82" width="18" height="75" rx="6" fill="currentColor" />
                            <path d="M70 170 L60 180 L80 300 L98 300 L98 170 Z" fill="currentColor" />
                            <path d="M130 170 L140 180 L120 300 L102 300 L102 170 Z" fill="currentColor" />
                            <ellipse cx="88" cy="310" rx="13" ry="7" fill="currentColor" />
                            <ellipse cx="112" cy="310" rx="13" ry="7" fill="currentColor" />
                        </>
                    )}
                </svg>

                {/* Equipped items overlaid */}
                {Object.entries(equipped).map(([cat, item]) => {
                    const zone = BODY_ZONES[cat];
                    if (!zone || !item.photoOriginal) return null;
                    return (
                        <motion.div
                            key={cat}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.85 }}
                            className="absolute rounded-lg overflow-hidden shadow-lg cursor-pointer"
                            style={{ ...zone, aspectRatio: '1', position: 'absolute' }}
                            onClick={() => toggleEquip(item)}
                        >
                            <img src={item.photoOriginal} className="w-full h-full object-cover" />
                        </motion.div>
                    );
                })}

                {equippedCount === 0 && (
                    <p className="absolute bottom-4 text-[9px] font-bold text-neumo-subtext uppercase tracking-widest">{t('tap_to_equip')}</p>
                )}
            </div>

            {/* Action Bar */}
            {equippedCount > 0 && (
                <div className="flex gap-2 mb-3">
                    <button onClick={() => setEquipped({})} className="flex-1 neumo-btn py-2 text-[10px] font-black uppercase text-red-500 flex items-center justify-center gap-1">
                        <X size={14} /> {t('clear_all')}
                    </button>
                    <button onClick={() => onSaveOutfit(equipped)} className="flex-1 neumo-btn py-2 text-[10px] font-black uppercase text-neumo-accent flex items-center justify-center gap-1">
                        <Save size={14} /> {t('save_outfit')}
                    </button>
                </div>
            )}

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-2 flex-shrink-0">
                <button onClick={() => setFilterCat('all')} className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider whitespace-nowrap shadow-neumo-flat ${filterCat === 'all' ? 'bg-neumo-accent text-white' : 'bg-neumo-bg text-neumo-text'}`}>
                    {t('all')}
                </button>
                {CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => setFilterCat(cat.id)} className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider whitespace-nowrap shadow-neumo-flat ${filterCat === cat.id ? 'bg-neumo-accent text-white' : 'bg-neumo-bg text-neumo-text'}`}>
                        {cat[language] || cat.en}
                    </button>
                ))}
            </div>

            {/* Items Shelf */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 flex-shrink-0">
                {filteredItems.map(item => {
                    const isEquipped = equipped[item.category]?.id === item.id;
                    return (
                        <motion.div
                            key={item.id}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleEquip(item)}
                            className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer transition-all border-2 ${isEquipped ? 'border-neumo-accent shadow-lg' : 'border-transparent shadow-neumo-flat'}`}
                        >
                            {item.photoOriginal ? (
                                <img src={item.photoOriginal} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-neumo-bg flex items-center justify-center"><Shirt size={16} className="text-neumo-subtext" /></div>
                            )}
                        </motion.div>
                    );
                })}
                {filteredItems.length === 0 && <p className="text-[9px] text-neumo-subtext font-bold py-4">{t('no_items')}</p>}
            </div>
        </div>
    );
};

export default OutfitSetupPage;
