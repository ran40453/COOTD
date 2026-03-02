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

const OutfitSetupPage = ({ data, onUpdate, t, language, globalCategory, onSaveOutfit }) => {
    const [equipped, setEquipped] = useState({});
    const gender = data?.settings?.gender || 'female';

    const closet = data?.closet || [];

    const filteredItems = useMemo(() => {
        let items = closet;
        if (globalCategory !== 'all') items = items.filter(i => i.category === globalCategory);
        return items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }, [closet, globalCategory]);

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
        <div className="animate-fade-in pb-28 px-4 pt-4 overflow-y-auto h-full custom-scrollbar flex flex-col gap-6">
            {/* Control Header */}
            <div className="flex items-center justify-between px-2">
                <div className="flex gap-2 p-1.5 neumo-card rounded-2xl bg-neumo-bg/50">
                    {['male', 'female'].map(g => (
                        <button
                            key={g}
                            onClick={async () => {
                                const newData = { ...data, settings: { ...data.settings, gender: g } };
                                await onUpdate(newData);
                            }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${gender === g ? 'bg-neumo-accent text-white shadow-lg shadow-neumo-accent/30 scale-105' : 'text-neumo-subtext hover:text-neumo-text'}`}
                        >
                            {t(g)}
                        </button>
                    ))}
                </div>

                {equippedCount > 0 && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setEquipped({})}
                        className="neumo-icon-btn p-3 rounded-2xl text-red-500/80 hover:text-red-500 transition-colors"
                    >
                        <X size={18} />
                    </motion.button>
                )}
            </div>

            {/* Premium Silhouette Display */}
            <div className="relative flex-1 min-h-[420px] neumo-card rounded-[40px] mx-auto w-full max-w-[340px] overflow-hidden bg-gradient-to-b from-neumo-bg to-neumo-bg/30 border border-white/50 dark:border-white/5 shadow-neumo-floating">
                {/* Visual Depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(124,58,237,0.05)_0%,transparent_60%)]" />

                {/* Human silhouette SVG (Refined) */}
                <svg viewBox="0 0 200 500" className="w-[85%] h-[85%] opacity-[0.08] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700">
                    {gender === 'male' ? (
                        <g fill="currentColor">
                            <circle cx="100" cy="45" r="32" />
                            <path d="M60 85h80v120c0 10-5 15-15 15H75c-10 0-15-5-15-15V85z" />
                            <path d="M55 90c-15 0-20 5-20 20v80c0 10 5 15 15 15h5V90zM145 90c15 0 20 5 20 20v80c0 10-5 15-15 15h-5V90z" />
                            <path d="M75 220h22v140c0 10-5 15-15 15s-15-5-15-15V220zM103 220h22v140c0 10-5 15-15 15s-15-5-15-15V220z" />
                            <ellipse cx="82" cy="385" rx="16" ry="10" />
                            <ellipse cx="118" cy="385" rx="16" ry="10" />
                        </g>
                    ) : (
                        <g fill="currentColor">
                            <circle cx="100" cy="45" r="30" />
                            <path d="M65 85h70l8 100c0 20-15 35-35 35h-16c-20 0-35-15-35-35l8-100z" />
                            <path d="M60 90c-12 0-18 5-18 15v70c0 8 4 12 12 12h6V90zM140 90c12 0 18 5 18 15v70c0 8-4 12-12 12h-6V90z" />
                            <path d="M72 220c0 0-12 5-12 25s8 130 8 130h24V220H72zM128 220c0 0 12 5 12 25s-8 130-8 130h-24V220H128z" />
                            <ellipse cx="85" cy="385" rx="15" ry="9" />
                            <ellipse cx="115" cy="385" rx="15" ry="9" />
                        </g>
                    )}
                </svg>

                {/* Equipped items overlaid with interactive hotspots */}
                <div className="absolute inset-0 pointer-events-none">
                    <AnimatePresence>
                        {Object.entries(equipped).map(([cat, item]) => {
                            const zone = BODY_ZONES[cat];
                            if (!zone || !item.photoProcessed) return null;
                            return (
                                <motion.div
                                    key={cat}
                                    initial={{ scale: 0.8, opacity: 0, y: 10 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.8, opacity: 0, y: 10 }}
                                    className="absolute rounded-2xl overflow-hidden shadow-2xl pointer-events-auto cursor-pointer border-2 border-white/30 dark:border-white/10"
                                    style={{ ...zone, position: 'absolute' }}
                                    onClick={() => toggleEquip(item)}
                                >
                                    <img src={item.photoProcessed} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-neumo-accent/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <X size={16} className="text-white drop-shadow-md" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Floating Save Button */}
                {equippedCount > 0 && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4/5"
                    >
                        <button
                            onClick={() => onSaveOutfit(equipped)}
                            className="w-full py-4 rounded-3xl bg-neumo-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_10px_25px_rgba(124,58,237,0.4)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                        >
                            <Sparkles size={18} />
                            Save Masterpiece
                        </button>
                    </motion.div>
                )}

                {equippedCount === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-4">
                        <div className="w-16 h-16 rounded-full bg-neumo-accent/5 flex items-center justify-center animate-bounce">
                            <Shirt size={24} className="text-neumo-accent opacity-50" />
                        </div>
                        <p className="text-[10px] font-black text-neumo-subtext uppercase tracking-[0.3em]">{t('tap_to_equip')}</p>
                    </div>
                )}
            </div>

            {/* Interactive Picker Section */}
            <div className="space-y-4">
                {/* Category Picker */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 px-1">
                    <button
                        onClick={() => setFilterCat('all')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filterCat === 'all' ? 'bg-neumo-accent text-white shadow-md' : 'neumo-card text-neumo-subtext'}`}
                    >
                        {t('all')}
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilterCat(cat.id)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filterCat === cat.id ? 'bg-neumo-accent text-white shadow-md' : 'neumo-card text-neumo-subtext'}`}
                        >
                            {cat[language] || cat.en}
                        </button>
                    ))}
                </div>

                {/* Horizontal Items Shelf */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-1 min-h-[120px] items-end">
                    {filteredItems.map(item => {
                        const isEquipped = equipped[item.category]?.id === item.id;
                        return (
                            <motion.div
                                key={item.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleEquip(item)}
                                className={`flex-shrink-0 w-24 space-y-2 cursor-pointer transition-all duration-300 ${isEquipped ? '-translate-y-4' : ''}`}
                            >
                                <div className={`aspect-square rounded-2xl overflow-hidden shadow-neumo-flat group relative ${isEquipped ? 'ring-2 ring-neumo-accent' : ''}`}>
                                    {item.photoProcessed ? (
                                        <img src={item.photoProcessed} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full bg-neumo-bg flex items-center justify-center"><Shirt size={20} className="text-neumo-subtext opacity-30" /></div>
                                    )}
                                    {isEquipped && (
                                        <div className="absolute inset-0 bg-neumo-accent/20 flex items-center justify-center">
                                            <Sparkles size={20} className="text-white drop-shadow-md" />
                                        </div>
                                    )}
                                </div>
                                <p className={`text-[9px] font-black uppercase tracking-tighter text-center truncate px-1 transition-colors ${isEquipped ? 'text-neumo-accent' : 'text-neumo-subtext'}`}>
                                    {item.name}
                                </p>
                            </motion.div>
                        );
                    })}
                    {filteredItems.length === 0 && (
                        <div className="w-full flex items-center justify-center py-8 neumo-card rounded-2xl bg-neumo-bg/30">
                            <p className="text-[10px] font-black text-neumo-subtext uppercase tracking-widest">{t('no_items')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OutfitSetupPage;
