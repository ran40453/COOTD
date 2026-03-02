import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, X, FolderOpen, Palette, Bookmark } from 'lucide-react';
import { CATEGORIES } from '../lib/translations';

const OutfitsPage = ({ data, onUpdate, t, language, globalCategory }) => {
    const [search, setSearch] = useState('');
    const [selectedOutfit, setSelectedOutfit] = useState(null);

    const outfits = data?.outfits || [];
    const closet = data?.closet || [];

    const filteredOutfits = useMemo(() => {
        let list = [...outfits];
        if (globalCategory !== 'all') {
            list = list.filter(o => (o.items || []).some(id => {
                const item = closet.find(c => c.id === id);
                return item?.category === globalCategory;
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
    }, [outfits, globalCategory, search, closet]);

    const groups = useMemo(() => {
        const g = { today: [], thisWeek: [], thisMonth: [], older: [] };
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        filteredOutfits.forEach(o => {
            const d = new Date(o.createdAt || o.date || 0);
            if (d >= startOfDay) g.today.push(o);
            else if (d >= startOfWeek) g.thisWeek.push(o);
            else if (d >= startOfMonth) g.thisMonth.push(o);
            else g.older.push(o);
        });
        return g;
    }, [filteredOutfits]);

    return (
        <div className="animate-fade-in pb-28 px-4 pt-2 overflow-y-auto h-full custom-scrollbar">
            {/* Search */}
            <div className="relative mb-6">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neumo-subtext" />
                <input className="neumo-input pl-12 h-12 text-sm" placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Grouped Sections */}
            {filteredOutfits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-neumo-subtext">
                    <div className="w-20 h-20 rounded-3xl neumo-card flex items-center justify-center mb-4 opacity-50">
                        <Bookmark size={40} className="text-neumo-accent" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-widest">{t('no_outfits')}</p>
                </div>
            ) : (
                <div className="space-y-10">
                    {Object.entries(groups).map(([key, list]) => {
                        if (list.length === 0) return null;
                        return (
                            <div key={key} className="space-y-5">
                                <div className="flex items-center gap-3 ml-1">
                                    <h3 className="text-[10px] font-black text-neumo-accent uppercase tracking-[0.3em]">{t(key) || key}</h3>
                                    <div className="h-[1px] flex-1 bg-neumo-subtext/10" />
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                                    <AnimatePresence mode="popLayout">
                                        {list.map(outfit => {
                                            const items = getItemsForOutfit(outfit);
                                            return (
                                                <motion.div
                                                    key={outfit.id}
                                                    layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                                    className="neumo-card p-2 group cursor-pointer hover:shadow-neumo-pressed transition-all active:scale-[0.98]"
                                                    onClick={() => setSelectedOutfit(outfit)}
                                                >
                                                    {/* Collated Thumbnails */}
                                                    <div className="aspect-[4/5] bg-neumo-bg/50 rounded-2xl overflow-hidden grid grid-cols-2 grid-rows-2 gap-[2px] p-[2px] relative">
                                                        {items.slice(0, 4).map((item, idx) => (
                                                            <div key={item.id} className="w-full h-full overflow-hidden bg-neumo-card/30">
                                                                {item.photoProcessed ? (
                                                                    <img src={item.photoProcessed} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center"><Shirt size={14} className="opacity-10" /></div>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {items.length === 0 && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <Shirt size={28} className="text-neumo-subtext opacity-10" />
                                                            </div>
                                                        )}
                                                        {/* Premium Badge */}
                                                        {outfit.colorTag && (
                                                            <div className="absolute top-2 left-2 w-3 h-3 rounded-full border-2 border-white/50 shadow-sm" style={{ backgroundColor: outfit.colorTag }} />
                                                        )}
                                                    </div>

                                                    <div className="px-1 py-3 space-y-1">
                                                        <p className="text-[11px] font-black text-neumo-text truncate tracking-tight">{outfit.name || 'Untitled Piece'}</p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1 opacity-60">
                                                                <FolderOpen size={10} className="text-neumo-accent" />
                                                                <span className="text-[8px] font-black uppercase tracking-tighter text-neumo-subtext">{outfit.folder || 'Default'}</span>
                                                            </div>
                                                            <span className="text-[8px] font-black text-neumo-accent/60">{items.length} PCS</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            </div>
                        );
                    })}
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
