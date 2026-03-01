import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Palette, FolderOpen } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const COLOR_OPTIONS = ['#8b5cf6', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6', '#64748b'];

const OutfitSaveModal = ({ isOpen, onClose, equippedItems, data, onUpdate, t }) => {
    const [name, setName] = useState('');
    const [colorTag, setColorTag] = useState(COLOR_OPTIONS[0]);
    const [folder, setFolder] = useState('');
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const handleSave = async () => {
        const itemIds = Object.values(equippedItems || {}).map(i => i.id);
        const newOutfit = {
            id: uuidv4(),
            name: name || 'Untitled',
            colorTag,
            folder,
            notes,
            icon: '',
            items: itemIds,
            createdAt: new Date().toISOString(),
        };
        const newData = { ...data, outfits: [...(data.outfits || []), newOutfit] };
        await onUpdate(newData);
        setName(''); setColorTag(COLOR_OPTIONS[0]); setFolder(''); setNotes('');
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                className="bg-neumo-bg rounded-3xl shadow-neumo-floating w-full max-w-sm p-5"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-black text-neumo-text uppercase tracking-tighter">{t('save_outfit')}</h3>
                    <button onClick={onClose} className="neumo-icon-btn p-2 rounded-full"><X size={18} /></button>
                </div>

                <div className="space-y-3">
                    <input className="neumo-input" placeholder={t('outfit_name')} value={name} onChange={e => setName(e.target.value)} />

                    {/* Color Tag */}
                    <div>
                        <p className="text-[9px] font-black text-neumo-subtext uppercase tracking-wider mb-2 flex items-center gap-1"><Palette size={12} /> {t('color_tag')}</p>
                        <div className="flex gap-2 flex-wrap">
                            {COLOR_OPTIONS.map(c => (
                                <button key={c} onClick={() => setColorTag(c)}
                                    className={`w-7 h-7 rounded-full transition-all ${colorTag === c ? 'ring-2 ring-offset-2 ring-neumo-accent scale-110' : 'opacity-60 hover:opacity-100'}`}
                                    style={{ background: c }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <FolderOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neumo-subtext" />
                        <input className="neumo-input pl-9" placeholder={t('folder')} value={folder} onChange={e => setFolder(e.target.value)} />
                    </div>

                    <textarea className="neumo-input min-h-[60px]" placeholder={t('notes')} value={notes} onChange={e => setNotes(e.target.value)} />

                    {/* Preview of equipped items */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {Object.values(equippedItems || {}).map(item => (
                            <div key={item.id} className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-neumo-flat">
                                {item.photoOriginal ? <img src={item.photoOriginal} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-neumo-card" />}
                            </div>
                        ))}
                    </div>

                    <button onClick={handleSave} className="w-full neumo-btn py-4 text-neumo-accent text-xs font-black flex items-center justify-center gap-3 mt-2 active:translate-y-0.5">
                        <Save size={18} />
                        <span className="uppercase tracking-[0.2em]">{t('save')}</span>
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default OutfitSaveModal;
