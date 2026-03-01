import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image, X, Loader2, Save, ChevronRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { CATEGORIES } from '../lib/translations';

const AddItemModal = ({ isOpen, onClose, data, onUpdate, t, language }) => {
    const [step, setStep] = useState(1); // 1=photo, 2=processing, 3=form
    const [photo, setPhoto] = useState(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('tops');
    const [tagsInput, setTagsInput] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [size, setSize] = useState('');
    const [notes, setNotes] = useState('');
    const fileRef = useRef(null);
    const cameraRef = useRef(null);

    if (!isOpen) return null;

    const resetForm = () => {
        setStep(1); setPhoto(null); setName(''); setCategory('tops');
        setTagsInput(''); setBrand(''); setPrice(''); setSize(''); setNotes('');
    };

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setPhoto(ev.target.result);
            // Simulate AI processing
            setStep(2);
            setTimeout(() => setStep(3), 1500);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        const newItem = {
            id: uuidv4(),
            name: name || 'Untitled',
            category,
            tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
            date: new Date().toISOString().split('T')[0],
            brand,
            price: price ? Number(price) : null,
            size,
            notes,
            photoOriginal: photo,
            photoProcessed: photo, // placeholder for AI
            createdAt: new Date().toISOString(),
        };
        const newData = { ...data, closet: [...(data.closet || []), newItem] };
        await onUpdate(newData);
        resetForm();
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={() => { resetForm(); onClose(); }}
        >
            <motion.div
                initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-neumo-bg w-full sm:w-[440px] sm:rounded-3xl rounded-t-3xl shadow-neumo-floating max-h-[92vh] overflow-y-auto custom-scrollbar"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-5 pt-5 pb-3">
                    <h3 className="text-lg font-black text-neumo-text uppercase tracking-tighter">{t('add_item')}</h3>
                    <button onClick={() => { resetForm(); onClose(); }} className="neumo-icon-btn p-2 rounded-full w-9 h-9 flex items-center justify-center">
                        <X size={18} />
                    </button>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-2 px-5 mb-4">
                    <div className={`flex-1 h-1 rounded-full transition-all ${step >= 1 ? 'bg-neumo-accent' : 'bg-neumo-subtext/20'}`} />
                    <div className={`flex-1 h-1 rounded-full transition-all ${step >= 2 ? 'bg-neumo-accent' : 'bg-neumo-subtext/20'}`} />
                    <div className={`flex-1 h-1 rounded-full transition-all ${step >= 3 ? 'bg-neumo-accent' : 'bg-neumo-subtext/20'}`} />
                </div>

                <div className="px-5 pb-6">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Photo */}
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <div className="aspect-[3/4] neumo-card overflow-hidden flex items-center justify-center">
                                    {photo ? (
                                        <img src={photo} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-neumo-subtext space-y-3">
                                            <Camera size={48} className="mx-auto opacity-30" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest">{t('photo_step')}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => cameraRef.current?.click()} className="flex-1 neumo-btn py-3 flex items-center justify-center gap-2 text-neumo-accent text-xs font-black">
                                        <Camera size={16} /> {t('take_photo')}
                                    </button>
                                    <button onClick={() => fileRef.current?.click()} className="flex-1 neumo-btn py-3 flex items-center justify-center gap-2 text-neumo-accent text-xs font-black">
                                        <Image size={16} /> {t('choose_photo')}
                                    </button>
                                </div>
                                <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                            </motion.div>
                        )}

                        {/* Step 2: Processing */}
                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20 space-y-4">
                                <Loader2 size={48} className="text-neumo-accent animate-spin" />
                                <p className="text-sm font-black text-neumo-text">{t('processing')}</p>
                            </motion.div>
                        )}

                        {/* Step 3: Info Form */}
                        {step === 3 && (
                            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                                {photo && <img src={photo} className="w-full aspect-video object-cover rounded-xl mb-3" />}
                                <input className="neumo-input" placeholder={t('name')} value={name} onChange={e => setName(e.target.value)} />

                                <select className="neumo-input appearance-none" value={category} onChange={e => setCategory(e.target.value)}>
                                    {CATEGORIES.map(c => (
                                        <option key={c.id} value={c.id}>{c[language] || c.en}</option>
                                    ))}
                                </select>

                                <input className="neumo-input" placeholder={t('tags') + ' (comma separated)'} value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
                                <input className="neumo-input" placeholder={t('brand')} value={brand} onChange={e => setBrand(e.target.value)} />

                                <div className="flex gap-3">
                                    <input type="number" className="neumo-input flex-1" placeholder={t('price')} value={price} onChange={e => setPrice(e.target.value)} />
                                    <input className="neumo-input flex-1" placeholder={t('size')} value={size} onChange={e => setSize(e.target.value)} />
                                </div>

                                <textarea className="neumo-input min-h-[60px]" placeholder={t('notes')} value={notes} onChange={e => setNotes(e.target.value)} />

                                <button onClick={handleSave} className="w-full neumo-btn py-4 flex items-center justify-center gap-3 text-neumo-accent active:translate-y-0.5 mt-2">
                                    <Save size={18} />
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">{t('save')}</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AddItemModal;
