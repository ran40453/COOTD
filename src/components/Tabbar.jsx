import React from 'react';
import { motion } from 'framer-motion';

const Tabbar = ({ activeTab, onChange, tabs, onAddClick }) => {
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
            <div className="glass rounded-2xl shadow-neumo-floating flex items-center justify-around px-2 py-2 relative">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;

                    if (tab.id === '__add__') {
                        return (
                            <button
                                key={tab.id}
                                onClick={onAddClick}
                                className="relative -mt-8 z-20 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-90"
                                style={{ background: `linear-gradient(135deg, var(--accent-color), #6d28d9)` }}
                            >
                                <Icon size={26} />
                            </button>
                        );
                    }

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            className="relative flex flex-col items-center justify-center py-1 px-2 transition-all"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="cootd-tab-active"
                                    className="absolute -top-5 w-12 h-12 rounded-full flex items-center justify-center shadow-neumo-floating"
                                    style={{ background: 'var(--accent-color)' }}
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                />
                            )}
                            <div className={`relative z-10 transition-all ${isActive ? 'text-white -mt-3' : 'text-neumo-subtext'}`}>
                                <Icon size={isActive ? 22 : 20} />
                            </div>
                            {isActive && (
                                <motion.span
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[8px] font-black uppercase tracking-wider mt-1 relative z-10"
                                    style={{ color: 'var(--accent-color)' }}
                                >
                                    {tab.label}
                                </motion.span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Tabbar;
