import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit2, Trash2, X, Shirt } from 'lucide-react';
import { CATEGORIES } from '../lib/translations';

const ClosetPage = ({ data, onUpdate, t, language, onAddClick }) => {
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('all');
    const [selectedItem, setSelectedItem] = useState(null);

    const closet = data?.closet || [];

    const getCatLabel = (catId) => {
        const cat = CATEGORIES.find(c => c.id === catId);
        if (!cat) return catId;
        return cat[language] || cat.en;
    };

    const filtered = useMemo(() => {
        let list = [...closet];
        if (filterCat !== 'all') list = list.filter(i => i.category === filterCat);
        if (search.trim()) {
            const s = search.toLowerCase();
            list = list.filter(i =>
                (i.name || '').toLowerCase().includes(s) ||
                (i.brand || '').toLowerCase().includes(s) ||
                (i.tags || []).some(t => t.toLowerCase().includes(s))
            );
        }
        return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }, [closet, filterCat, search]);

    const handleDelete = async (id) => {
        if (!confirm(t('confirm_delete'))) return;
        const newData = { ...data, closet: closet.filter(i => i.id !== id) };
        await onUpdate(newData);
        setSelectedItem(null);
    };

    return (
        <div className="animate-fade-in pb-28 px-4 pt-2 overflow-y-auto h-full custom-scrollbar">
            {/* Search */}
            <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neumo-subtext" />
                <input
                    className="neumo-input pl-10 h-10 text-xs"
                    placeholder={t('search')}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
                <button
                    onClick={() => setFilterCat('all')}
                    className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all shadow-neumo-flat active:shadow-neumo-pressed ${filterCat === 'all' ? 'bg-neumo-accent text-white' : 'bg-neumo-bg text-neumo-text'}`}
                >
                    {t('all')}
                </button>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setFilterCat(cat.id)}
                        className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all shadow-neumo-flat active:shadow-neumo-pressed ${filterCat === cat.id ? 'bg-neumo-accent text-white' : 'bg-neumo-bg text-neumo-text'}`}
                    >
                        {cat[language] || cat.en}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-neumo-subtext">
                    <Shirt size={48} className="opacity-20 mb-3" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">{t('no_items')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    <AnimatePresence>
                        {filtered.map(item => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="neumo-card overflow-hidden cursor-pointer group hover:shadow-neumo-pressed transition-all"
                                onClick={() => setSelectedItem(item)}
                            >
                                <div className="aspect-[3/4] bg-neumo-bg overflow-hidden">
                                    {item.photoOriginal ? (
                                        <img src={item.photoOriginal} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Shirt size={32} className="text-neumo-subtext opacity-30" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-2.5">
                                    <p className="text-xs font-black text-neumo-text truncate">{item.name}</p>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[8px] font-bold uppercase tracking-wider text-neumo-accent">{getCatLabel(item.category)}</span>
                                        {item.brand && <span className="text-[8px] font-bold text-neumo-subtext truncate ml-1">{item.brand}</span>}
                                    </div>
                                    {item.price && <p className="text-[9px] font-bold text-neumo-subtext mt-0.5">¥{item.price}</p>}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
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
                                    <button onClick={() => handleDelete(selectedItem.id)} className="flex-1 neumo-btn py-3 text-red-500 text-xs font-black flex items-center justify-center gap-2">
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
