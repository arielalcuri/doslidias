import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Instagram, Truck, User as UserIcon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAuthStore } from '../store/useAuthStore';

const Navbar: React.FC<{
    cartCount: number,
    onOpenCart: () => void,
    onOpenTracking: () => void
}> = ({ cartCount, onOpenCart, onOpenTracking }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { settings } = useSettingsStore();
    const { user, logout, setAuthModalOpen } = useAuthStore();

    return (
        <nav className="glass fixed top-0 z-50 w-full px-4 py-3 flex justify-between items-center bg-white/80 backdrop-blur-md border-b">
            <div className="flex items-center gap-4">
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <Logo size="md" />
            </div>

            <div className="hidden md:flex gap-8 font-medium">
                <a href="#tienda" className="hover:text-primary transition-colors">Tienda</a>
                <button onClick={onOpenTracking} className="hover:text-primary transition-colors flex items-center gap-1.5">
                    <Truck size={18} /> Seguimiento
                </button>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                <div className="hidden sm:flex items-center border-r pr-4 mr-2">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden lg:block">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Bienvenido</p>
                                <p className="text-xs font-bold text-slate-800 leading-none">{user.name.split(' ')[0]}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                title="Cerrar Sesión"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setAuthModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-full transition-all text-slate-600 font-bold text-xs"
                        >
                            <UserIcon size={18} className="text-slate-400" />
                            Mi Cuenta
                        </button>
                    )}
                </div>

                <a
                    href={`https://instagram.com/${settings.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-[#E4405F] transition-colors"
                >
                    <Instagram size={22} />
                </a>
                <button onClick={onOpenCart} className="btn-cart-nav group relative">
                    <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline">Carrito</span>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '-100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '-100%' }}
                        className="fixed top-0 left-0 w-[80%] h-screen bg-white shadow-2xl p-8 flex flex-col gap-6 md:hidden z-[60]"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <Logo size="md" />
                            <button onClick={() => setIsOpen(false)}><X size={24} /></button>
                        </div>
                        <a href="#tienda" className="text-xl font-bold" onClick={() => setIsOpen(false)}>Tienda</a>
                        <button
                            onClick={() => { onOpenTracking(); setIsOpen(false); }}
                            className="text-xl font-bold text-left flex items-center gap-2"
                        >
                            <Truck size={20} /> Seguimiento
                        </button>

                        <div className="border-t pt-6">
                            {user ? (
                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 leading-none mb-1 uppercase tracking-widest">Cuenta Activa</p>
                                            <p className="text-sm font-bold text-slate-800 leading-none">{user.name}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { logout(); setIsOpen(false); }}
                                        className="w-full py-4 text-red-500 font-bold flex items-center justify-center gap-2 rounded-2xl bg-red-50"
                                    >
                                        <LogOut size={20} /> Cerrar Sesión
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => { setAuthModalOpen(true); setIsOpen(false); }}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                                >
                                    <UserIcon size={20} /> Mi Cuenta
                                </button>
                            )}
                        </div>

                        <div className="mt-auto border-t pt-6 flex gap-4">
                            <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-100 rounded-full">
                                <Instagram size={24} className="text-[#E4405F]" />
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
