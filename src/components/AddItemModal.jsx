import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image, X, Loader2, Save, ChevronRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { CATEGORIES } from '../lib/translations';

const AddItemModal = ({ isOpen, onClose, data, onUpdate, t, language }) => {
    const [step, setStep] = useState(1); // 1=photo, 2=scanning, 3=preview_extracted, 4=form
    const [photo, setPhoto] = useState(null);
    const [extractedPhoto, setExtractedPhoto] = useState(null);
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
        setStep(1); setPhoto(null); setExtractedPhoto(null); setName(''); setCategory('tops');
        setTagsInput(''); setBrand(''); setPrice(''); setSize(''); setNotes('');
    };

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const originalData = ev.target.result;
            setPhoto(originalData);
            setStep(2);

            // SIMULATE AI EXTRACTION (nano banana2)
            // In a real app, this would send 'originalData' to a background removal API.
            // For this demo, we use the original and "tell" the user it's extracted,
            // or we could apply a CSS filter/mask to simulate the effect.
            setTimeout(() => {
                // We'll use a slightly different visual state to represent "extracted" 
                // In this prototype, we'll use the same photo but set a flag for the UI.
                setExtractedPhoto(originalData);
                setStep(3);
            }, 3000);
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
            photoProcessed: extractedPhoto || photo,
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
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
            onClick={() => { resetForm(); onClose(); }}
        >
            <motion.div
                initial={{ y: 100, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 100, opacity: 0, scale: 0.95 }}
                className="bg-neumo-bg w-full sm:w-[480px] rounded-3xl shadow-neumo-floating max-h-[92vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 pt-6 pb-4">
                    <div>
                        <h3 className="text-xl font-black text-neumo-text uppercase tracking-tighter">{t('add_item')}</h3>
                        <p className="text-[10px] font-black text-neumo-subtext uppercase tracking-widest mt-0.5">Step {step} of 4</p>
                    </div>
                    <button onClick={() => { resetForm(); onClose(); }} className="neumo-icon-btn p-2 rounded-full w-10 h-10 flex items-center justify-center">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-1.5 px-6 mb-2">
                    {[1, 2, 3, 4].map(idx => (
                        <div key={idx} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= idx ? 'bg-neumo-accent shadow-[0_0_10px_rgba(124,58,237,0.5)]' : 'bg-neumo-subtext/10'}`} />
                    ))}
                </div>

                <div className="px-6 pb-8 overflow-y-auto custom-scrollbar flex-1">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Input Source */}
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 py-4">
                                <div className="aspect-[3/4] neumo-card rounded-3xl overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-neumo-subtext/20 bg-neumo-bg/50 group cursor-pointer hover:border-neumo-accent/50 transition-colors" onClick={() => fileRef.current?.click()}>
                                    <div className="text-center p-8">
                                        <div className="w-20 h-20 rounded-full bg-neumo-bg shadow-neumo-flat flex items-center justify-center mx-auto mb-6 group-hover:shadow-neumo-pressed transition-all">
                                            <Camera size={32} className="text-neumo-accent" />
                                        </div>
                                        <h4 className="text-sm font-black text-neumo-text uppercase tracking-widest mb-2">{t('photo_step')}</h4>
                                        <p className="text-[10px] font-bold text-neumo-subtext uppercase tracking-widest leading-relaxed">Tap to capture or upload <br /> your clothing photo</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => cameraRef.current?.click()} className="neumo-btn py-4 flex flex-col items-center gap-2 text-neumo-text">
                                        <Camera size={20} className="text-neumo-accent" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t('take_photo')}</span>
                                    </button>
                                    <button onClick={() => fileRef.current?.click()} className="neumo-btn py-4 flex flex-col items-center gap-2 text-neumo-text">
                                        <Image size={20} className="text-neumo-accent" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t('choose_photo')}</span>
                                    </button>
                                </div>
                                <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                            </motion.div>
                        )}

                        {/* Step 2: AI Extraction Scanning */}
                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-10 space-y-8">
                                <div className="aspect-[3/4] neumo-card rounded-3xl overflow-hidden relative">
                                    <img src={photo} className="w-full h-full object-cover opacity-60 grayscale-[0.5]" />
                                    {/* Scanner Effect */}
                                    <motion.div
                                        initial={{ top: '0%' }}
                                        animate={{ top: '100%' }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 right-0 h-1 bg-neumo-accent shadow-[0_0_15px_#7c3aed] z-10"
                                    />
                                    <div className="absolute inset-0 bg-neumo-accent/5 flex items-center justify-center">
                                        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                            <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                                                <Loader2 size={12} className="animate-spin text-neumo-accent" />
                                                nano banana2 extracting...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <h4 className="text-sm font-black text-neumo-text uppercase tracking-widest animate-pulse">Analyzing Textures & Cuts</h4>
                                    <p className="text-[10px] font-bold text-neumo-subtext uppercase tracking-widest">Converting to clean product sample...</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Extracted Preview */}
                        {step === 3 && (
                            <motion.div key="s3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 py-4">
                                <div className="aspect-[3/4] neumo-card rounded-3xl overflow-hidden bg-white/20 dark:bg-black/40 flex items-center justify-center border-4 border-neumo-accent/20">
                                    {/* We wrap the photo in a "clean" container to simulate extraction */}
                                    <div className="w-full h-full relative group p-8">
                                        <img
                                            src={extractedPhoto}
                                            className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                                            style={{ mixBlendMode: 'normal' }} // In a real app, this would be the transparent PNG
                                        />
                                        <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                                            Clean Sample
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h4 className="text-sm font-black text-neumo-text uppercase tracking-widest">Sample Extracted Successfully</h4>
                                    <p className="text-[10px] font-bold text-neumo-subtext uppercase tracking-widest mt-1">Background removed • Geometry cleaned</p>
                                </div>
                                <button onClick={() => setStep(4)} className="w-full neumo-btn py-4 flex items-center justify-center gap-3 text-neumo-accent group">
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Add Details</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {/* Step 4: Metadata Form */}
                        {step === 4 && (
                            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 py-4">
                                <div className="flex gap-4 items-center mb-2">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-neumo-flat flex-shrink-0">
                                        <img src={extractedPhoto} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <label className="text-[9px] font-black text-neumo-subtext uppercase tracking-widest">Extracted Name</label>
                                        <input className="neumo-input h-10" placeholder={t('name')} value={name} onChange={e => setName(e.target.value)} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-neumo-subtext uppercase tracking-widest ml-1">Category</label>
                                        <select className="neumo-input h-11 appearance-none" value={category} onChange={e => setCategory(e.target.value)}>
                                            {CATEGORIES.map(c => (
                                                <option key={c.id} value={c.id}>{c[language] || c.en}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-neumo-subtext uppercase tracking-widest ml-1">Brand</label>
                                        <input className="neumo-input h-11" placeholder={t('brand')} value={brand} onChange={e => setBrand(e.target.value)} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-neumo-subtext uppercase tracking-widest ml-1">Price</label>
                                        <input type="number" className="neumo-input h-11" placeholder="¥0" value={price} onChange={e => setPrice(e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-neumo-subtext uppercase tracking-widest ml-1">Size</label>
                                        <input className="neumo-input h-11" placeholder="e.g. L" value={size} onChange={e => setSize(e.target.value)} />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-neumo-subtext uppercase tracking-widest ml-1">Tags (Comma Separated)</label>
                                    <input className="neumo-input h-11" placeholder="cotton, white, summer" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-neumo-subtext uppercase tracking-widest ml-1">Notes</label>
                                    <textarea className="neumo-input min-h-[60px] py-3" placeholder={t('notes')} value={notes} onChange={e => setNotes(e.target.value)} />
                                </div>

                                <button onClick={handleSave} className="w-full neumo-btn py-5 flex items-center justify-center gap-4 text-neumo-accent active:translate-y-0.5 mt-4 bg-neumo-accent/5 border border-neumo-accent/10">
                                    <Save size={20} />
                                    <span className="text-sm font-black uppercase tracking-[0.2em]">{t('save')}</span>
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
