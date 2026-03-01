import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, X, FolderOpen, Palette, Bookmark } from 'lucide-react';
import { CATEGORIES } from '../lib/translations';

const OutfitsPage = ({ data, onUpdate, t, language }) => {
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('all');
    const [selectedOutfit, setSelectedOutfit] = useState(null);

    const outfits = data?.outfits || [];
    const closet = data?.closet || [];

    const filtered = useMemo(() => {
        let list = [...outfits];
        if (filterCat !== 'all') {
            list = list.filter(o => (o.items || []).some(id => {
                const item = closet.find(c => c.id === id);
                return item?.category === filterCat;
            }));
        }
        if (search.trim()) {
            const s = search.toLowerCase();
            list = list.filter(o =>
                (o.name || '').toLowerCase().includes(s) ||
                (o.folder || '').toLowerCase().includes(s)
            );
        }
        return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }, [outfits, filterCat, search, closet]);

    const getItemsForOutfit = (outfit) => {
        return (outfit.items || []).map(id => closet.find(c => c.id === id)).filter(Boolean);
    };

    const handleDelete = async (id) => {
        if (!confirm(t('confirm_delete'))) return;
        const newData = { ...data, outfits: outfits.filter(o => o.id !== id) };
        await onUpdate(newData);
        setSelectedOutfit(null);
    };

    const COLOR_OPTIONS = ['#8b5cf6', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6'];

    return (
        <div className="animate-fade-in pb-28 px-4 pt-2 overflow-y-auto h-full custom-scrollbar">
            {/* Search */}
            <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neumo-subtext" />
                <input className="neumo-input pl-10 h-10 text-xs" placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Category Quick Filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
                <button onClick={() => setFilterCat('all')} className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-neumo-flat ${filterCat === 'all' ? 'bg-neumo-accent text-white' : 'bg-neumo-bg text-neumo-text'}`}>
                    {t('all')}
                </button>
                {CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => setFilterCat(cat.id)} className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-neumo-flat ${filterCat === cat.id ? 'bg-neumo-accent text-white' : 'bg-neumo-bg text-neumo-text'}`}>
                        {cat[language] || cat.en}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-neumo-subtext">
                    <Bookmark size={48} className="opacity-20 mb-3" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">{t('no_outfits')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <AnimatePresence>
                        {filtered.map(outfit => {
                            const items = getItemsForOutfit(outfit);
                            return (
                                <motion.div
                                    key={outfit.id}
                                    layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                    className="neumo-card overflow-hidden cursor-pointer hover:shadow-neumo-pressed transition-all"
                                    onClick={() => setSelectedOutfit(outfit)}
                                >
                                    {/* Thumbnails grid */}
                                    <div className="aspect-square bg-neumo-bg grid grid-cols-2 gap-0.5 p-1">
                                        {items.slice(0, 4).map(item => (
                                            <div key={item.id} className="rounded-md overflow-hidden bg-neumo-card">
                                                {item.photoOriginal ? (
                                                    <img src={item.photoOriginal} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-2.5">
                                        <div className="flex items-center gap-1.5">
                                            {outfit.colorTag && <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: outfit.colorTag }} />}
                                            <p className="text-xs font-black text-neumo-text truncate">{outfit.name || 'Untitled'}</p>
                                        </div>
                                        {outfit.folder && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <FolderOpen size={9} className="text-neumo-subtext" />
                                                <span className="text-[8px] font-bold text-neumo-subtext">{outfit.folder}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedOutfit && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setSelectedOutfit(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-neumo-bg rounded-3xl shadow-neumo-floating w-full max-w-sm max-h-[85vh] overflow-y-auto custom-scrollbar p-5"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    {selectedOutfit.colorTag && <div className="w-4 h-4 rounded-full" style={{ background: selectedOutfit.colorTag }} />}
                                    <h3 className="text-lg font-black text-neumo-text">{selectedOutfit.name}</h3>
                                </div>
                                <button onClick={() => setSelectedOutfit(null)}><X size={20} className="text-neumo-subtext" /></button>
                            </div>

                            {selectedOutfit.folder && (
                                <div className="flex items-center gap-1.5 mb-3">
                                    <FolderOpen size={12} className="text-neumo-accent" />
                                    <span className="text-[10px] font-bold text-neumo-accent uppercase">{selectedOutfit.folder}</span>
                                </div>
                            )}

                            {selectedOutfit.notes && <p className="text-xs text-neumo-subtext mb-3">{selectedOutfit.notes}</p>}

                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {getItemsForOutfit(selectedOutfit).map(item => (
                                    <div key={item.id} className="neumo-card overflow-hidden rounded-xl">
                                        {item.photoOriginal && <img src={item.photoOriginal} className="w-full aspect-square object-cover" />}
                                        <p className="text-[8px] font-bold text-neumo-text truncate p-1.5">{item.name}</p>
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => handleDelete(selectedOutfit.id)} className="w-full neumo-btn py-3 text-red-500 text-xs font-black flex items-center justify-center gap-2">
                                <Trash2 size={14} /> {t('delete')}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OutfitsPage;
