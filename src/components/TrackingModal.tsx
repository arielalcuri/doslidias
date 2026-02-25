import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Truck, Box, CheckCircle2, Clock, ExternalLink, Package, MapPin } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { useSettingsStore } from '../store/useSettingsStore';

interface TrackingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TrackingModal: React.FC<TrackingModalProps> = ({ isOpen, onClose }) => {
    const [orderId, setOrderId] = useState('');
    const [foundOrder, setFoundOrder] = useState<any>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const { orders } = useOrderStore();
    const { settings } = useSettingsStore();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const order = orders.find(o => o.id.toLowerCase() === orderId.toLowerCase());
        setFoundOrder(order || null);
        setHasSearched(true);
    };

    const getStatusIcon = (statusId: string) => {
        const id = statusId.toLowerCase();
        if (id.includes('pendiente')) return Clock;
        if (id.includes('embalado')) return Box;
        if (id.includes('camino')) return Truck;
        if (id.includes('entregado')) return CheckCircle2;
        return Package;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg bg-white rounded-[32px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] z-[201] overflow-y-auto max-h-[90vh]"
                    >
                        <div className="p-6 md:p-10">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                        <MapPin size={22} />
                                    </div>
                                    <h2 className="text-2xl font-bold italic tracking-tight">Rastreo</h2>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Identificador de Compra</label>
                                    <div className="flex gap-2 p-1.5 bg-gray-50 border border-gray-100 rounded-2xl focus-within:border-primary transition-all">
                                        <input
                                            required
                                            placeholder="Ej: ORD-XXX"
                                            className="flex-1 bg-transparent px-3 py-2 outline-none font-bold placeholder:font-normal placeholder:text-gray-300 text-sm"
                                            value={orderId}
                                            onChange={e => setOrderId(e.target.value)}
                                        />
                                        <button className="bg-primary text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 leading-none">
                                            <Search size={18} />
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="min-h-[180px] flex flex-col items-center justify-center">
                                {!hasSearched ? (
                                    <div className="text-center opacity-40 py-10">
                                        <Package size={48} className="mx-auto mb-4 stroke-1" />
                                        <p className="text-sm italic">Ingresa tu código para ver el estado de tu envío.</p>
                                    </div>
                                ) : foundOrder ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-8">
                                        {foundOrder.status === 'cancelado' ? (
                                            <div className="bg-red-50 p-6 rounded-2xl text-center border border-red-100">
                                                <X className="text-red-400 mx-auto mb-2" size={32} />
                                                <h3 className="text-red-700 font-bold uppercase tracking-wider">Pedido Cancelado</h3>
                                                <p className="text-red-600/70 text-xs mt-1">Por favor, contáctanos por WhatsApp para más información.</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex justify-between items-center px-2">
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">En este momento</p>
                                                        <p className="text-lg font-black text-primary capitalize">
                                                            {settings?.shippingStatuses?.find(s => s.id === foundOrder.status)?.label || foundOrder.status.replace('_', ' ')}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Orden</p>
                                                        <p className="text-lg font-mono font-black">{foundOrder.id}</p>
                                                    </div>
                                                </div>

                                                {/* DYNAMIC TIMELINE BASED ON SETTINGS */}
                                                <div className="flex justify-between relative py-6 gap-2">
                                                    {(settings?.shippingStatuses || []).filter(s => s.id !== 'cancelado').map((status, idx, arr) => {
                                                        const statusIdx = arr.findIndex(s => s.id === foundOrder.status);
                                                        const isCompleted = statusIdx >= idx;
                                                        const isActive = foundOrder.status === status.id;
                                                        const Icon = getStatusIcon(status.id);

                                                        return (
                                                            <div key={status.id} className="flex flex-col items-center gap-2 flex-1 relative">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-700 z-10 ${isCompleted ? (status.color || '') + ' border-transparent' : 'bg-white border-gray-100 text-gray-200'}`}>
                                                                    <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
                                                                </div>
                                                                <p className={`text-[8px] font-black uppercase text-center leading-tight ${isCompleted ? 'text-gray-800' : 'text-gray-300'}`}>{status.label}</p>

                                                                {idx < arr.length - 1 && (
                                                                    <div className={`absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-[3px] rounded-full ${statusIdx > idx ? 'bg-primary' : 'bg-gray-100'}`} />
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {foundOrder.trackingNumber && (
                                                    <div className="bg-[#f8fafc] border border-gray-100 p-6 rounded-3xl flex flex-col gap-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-50 flex items-center justify-center text-primary">
                                                                <Truck size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Nro de Seguimiento</p>
                                                                <p className="font-mono font-black text-gray-800 tracking-widest">{foundOrder.trackingNumber}</p>
                                                            </div>
                                                        </div>
                                                        <a
                                                            href={`https://www.correoargentino.com.ar/formularios/e-commerce?nro_seguimiento=${foundOrder.trackingNumber}`}
                                                            target="_blank"
                                                            className="w-full bg-primary text-white py-4 rounded-2xl text-center font-black text-xs flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-xl shadow-primary/20"
                                                        >
                                                            Rastrear en Correo Argentino <ExternalLink size={16} />
                                                        </a>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </motion.div>
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-red-50 text-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <X size={32} />
                                        </div>
                                        <h3 className="font-black text-gray-800">Pedido no encontrado</h3>
                                        <p className="text-xs text-gray-400 mt-1 px-10 italic">Verifica los datos e intenta nuevamente.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TrackingModal;
