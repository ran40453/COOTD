import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit2, Trash2, X, Shirt } from 'lucide-react';
import { CATEGORIES } from '../lib/translations';

const ClosetPage = ({ data, onUpdate, t, language, globalCategory, onAddClick }) => {
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    const closet = data?.closet || [];

    const getCatLabel = (catId) => {
        const cat = CATEGORIES.find(c => c.id === catId);
        if (!cat) return catId;
        return cat[language] || cat.en;
    };

    const filtered = useMemo(() => {
        let list = [...closet].filter(Boolean); // Safety filter
        if (globalCategory !== 'all') {
            list = list.filter(i => i?.category === globalCategory);
        }
        if (search.trim()) {
            const s = search.toLowerCase();
            list = list.filter(i =>
                (i?.name || '').toLowerCase().includes(s) ||
                (i?.brand || '').toLowerCase().includes(s) ||
                (i?.notes || '').toLowerCase().includes(s)
            );
        }
        return list.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
    }, [closet, globalCategory, search]);

    const groups = useMemo(() => {
        const g = {};
        filtered.forEach(item => {
            if (!item || !item.category) return;
            if (!g[item.category]) g[item.category] = [];
            g[item.category].push(item);
        });
        return g;
    }, [filtered]);

    return (
        <div className="animate-fade-in pb-28 px-4 pt-2 overflow-y-auto h-full custom-scrollbar">
            {/* Search */}
            <div className="relative mb-6">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neumo-subtext" />
                <input
                    className="neumo-input pl-12 h-12 text-sm"
                    placeholder={t('search')}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Categorized Sections */}
            {Object.keys(groups).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-neumo-subtext">
                    <div className="w-20 h-20 rounded-3xl neumo-card flex items-center justify-center mb-4 opacity-50">
                        <Shirt size={40} className="text-neumo-accent" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-widest">{t('no_items')}</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {CATEGORIES.filter(cat => groups[cat.id]).map(cat => (
                        <div key={cat.id} className="space-y-4">
                            <div className="flex items-center gap-3 ml-1">
                                <div className="w-2 h-2 rounded-full bg-neumo-accent" />
                                <h3 className="text-xs font-black text-neumo-text uppercase tracking-widest">{cat[language] || cat.en}</h3>
                                <span className="text-[10px] font-black text-neumo-accent/60">{groups[cat.id].length}</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <AnimatePresence mode="popLayout">
                                    {groups[cat.id].map(item => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="neumo-card p-2 group cursor-pointer hover:shadow-neumo-pressed transition-all active:scale-[0.98]"
                                            onClick={() => setSelectedItem(item)}
                                        >
                                            <div className="aspect-[3/4] bg-neumo-bg/50 rounded-xl overflow-hidden relative">
                                                {item.photoOriginal ? (
                                                    <img src={item.photoOriginal} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Shirt size={28} className="text-neumo-subtext opacity-20" />
                                                    </div>
                                                )}
                                                {/* Premium Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="px-1 py-2">
                                                <div className="flex items-start justify-between gap-1">
                                                    <p className="text-[11px] font-black text-neumo-text truncate leading-tight flex-1">{item.name}</p>
                                                    {item.brand && <span className="text-[8px] font-black text-neumo-accent uppercase opacity-70 flex-shrink-0">{item.brand}</span>}
                                                </div>
                                                <p className="text-[9px] font-bold text-neumo-subtext mt-0.5 truncate">{item.notes || '-'}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-neumo-bg rounded-3xl shadow-neumo-floating w-full max-w-sm max-h-[85vh] overflow-y-auto custom-scrollbar"
                            onClick={e => e.stopPropagation()}
                        >
                            {selectedItem.photoOriginal && (
                                <img src={selectedItem.photoOriginal} alt={selectedItem.name} className="w-full aspect-[3/4] object-cover rounded-t-3xl" />
                            )}
                            <div className="p-5 space-y-3">
                                <h3 className="text-lg font-black text-neumo-text">{selectedItem.name}</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2.5 py-1 rounded-full bg-neumo-accent/10 text-neumo-accent text-[9px] font-black uppercase">{getCatLabel(selectedItem.category)}</span>
                                    {selectedItem.brand && <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase">{selectedItem.brand}</span>}
                                    {selectedItem.size && <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase">{selectedItem.size}</span>}
                                </div>
                                {selectedItem.price && <p className="text-sm font-bold text-neumo-text">¥{selectedItem.price}</p>}
                                {selectedItem.notes && <p className="text-xs text-neumo-subtext">{selectedItem.notes}</p>}
                                {selectedItem.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedItem.tags.map((tag, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded-full bg-neumo-subtext/10 text-neumo-subtext text-[8px] font-bold">#{tag}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-2 pt-2">
                                    <button onClick={() => {
                                        if (window.confirm(t('confirm_delete'))) {
                                            const newData = { ...data, closet: closet.filter(i => i.id !== selectedItem.id) };
                                            onUpdate(newData);
                                            setSelectedItem(null);
                                        }
                                    }} className="flex-1 neumo-btn py-3 text-red-500 text-xs font-black flex items-center justify-center gap-2">
                                        <Trash2 size={14} /> {t('delete')}
                                    </button>
                                    <button onClick={() => setSelectedItem(null)} className="flex-1 neumo-btn py-3 text-neumo-subtext text-xs font-black flex items-center justify-center gap-2">
                                        <X size={14} /> {t('cancel')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClosetPage;
