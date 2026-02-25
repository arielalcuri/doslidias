import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    items: { product: any; quantity: number }[];
    onUpdateQuantity: (id: string, delta: number) => void;
    onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onUpdateQuantity, onCheckout }) => {
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-md z-[150]"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[151] flex flex-col"
                    >
                        <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <ShoppingBag size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Carrito</h2>
                                    <p className="text-[10px] text-text-muted uppercase tracking-widest">{items.length} productos</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                    <div className="w-20 h-20 bg-[#fdfaf6] rounded-full flex items-center justify-center mb-6 border-2 border-dashed">
                                        <ShoppingBag size={32} className="text-text-muted" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Tu carrito está vacío</h3>
                                    <p className="text-text-muted mb-8 max-w-[200px] mx-auto text-sm italic">¡No esperes más para darle vida a tus espacios!</p>
                                    <button onClick={onClose} className="btn-primary">Explorar Tienda</button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.product.id} className="flex gap-4 group">
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm border">
                                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between mb-1">
                                                <h4 className="font-bold text-sm text-text-main">{item.product.name}</h4>
                                                <button
                                                    onClick={() => onUpdateQuantity(item.product.id, -item.quantity)}
                                                    className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-text-muted mb-3 font-serif">${item.product.price.toLocaleString('es-AR')}</p>

                                            <div className="mt-auto flex justify-between items-center">
                                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border">
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <span className="font-bold text-sm font-serif">
                                                    ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-6 border-t bg-gray-50/50 space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-text-muted font-bold uppercase text-[10px] tracking-widest">Subtotal</span>
                                    <span className="text-2xl font-bold font-serif">${total.toLocaleString('es-AR')}</span>
                                </div>
                                <button
                                    onClick={onCheckout}
                                    className="w-full btn-primary flex items-center justify-center gap-2 py-4 shadow-xl"
                                >
                                    Finalizar Compra <ArrowRight size={20} />
                                </button>
                                <p className="text-[10px] text-center text-text-muted italic">Taxas y envío calculados al finalizar.</p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Cart;
