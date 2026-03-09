import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ShoppingCart, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { Product } from '../store/useProductStore';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    const [selectedVariant, setSelectedVariant] = React.useState<{ size: string, price: number } | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [isZoomOpen, setIsZoomOpen] = React.useState(false);

    const allImages = [product.image, ...(product.images || [])].filter(Boolean);
    const validVariants = (product.variants || []).filter(v => v && typeof v.price === 'number');
    const hasVariants = validVariants.length > 0;

    const priceToDisplay = selectedVariant
        ? selectedVariant.price
        : (hasVariants ? Math.min(...validVariants.map(v => v.price)) : (product.price || 0));

    if (priceToDisplay === Infinity) return null; // Safety check

    const handleAdd = () => {
        if (hasVariants && !selectedVariant) {
            alert('Por favor, selecciona un tamaño de maceta antes de añadir al carrito.');
            return;
        }
        onAddToCart({
            ...product,
            price: priceToDisplay,
            name: selectedVariant ? `${product.name} - ${selectedVariant.size}` : product.name
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-product flex flex-col h-full bg-white rounded-[40px] p-5 shadow-premium-soft shadow-premium-soft-hover border border-slate-50 group transition-all duration-700 hover:-translate-y-2"
        >
            <div
                onClick={() => setIsZoomOpen(true)}
                className="relative aspect-[4/5] overflow-hidden rounded-[32px] mb-8 shadow-inner bg-slate-50 group/carousel cursor-zoom-in"
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImageIndex}
                        src={allImages[currentImageIndex]}
                        alt={product.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>

                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-white/20 backdrop-blur-md p-2 rounded-xl text-white pointer-events-none hidden md:block">
                    <Maximize2 size={16} />
                </div>

                {allImages.length > 1 && (
                    <>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 px-3 py-2 bg-black/10 backdrop-blur-sm rounded-full">
                            {allImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${currentImageIndex === idx ? 'bg-white w-4' : 'bg-white/40'}`}
                                />
                            ))}
                        </div>
                        {/* Arrows */}
                        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between z-30 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-all duration-300">
                            <button
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length); }}
                                className="w-10 h-10 bg-white shadow-xl text-slate-900 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all pointer-events-auto"
                                title="Anterior"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev + 1) % allImages.length); }}
                                className="w-10 h-10 bg-white shadow-xl text-slate-900 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all pointer-events-auto"
                                title="Siguiente"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
                <button
                    onClick={(e) => { e.stopPropagation(); handleAdd(); }}
                    className="absolute bottom-6 right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl text-primary scale-0 group-hover:scale-100 transition-all duration-300 hover:bg-primary hover:text-white hover:rotate-90 z-20"
                >
                    <Plus size={28} />
                </button>
            </div>

            <div className="flex-1 flex flex-col px-1">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/60 ml-1">
                        {product.category}
                    </span>
                    {product.theme && (
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">
                            {product.theme}
                        </span>
                    )}
                </div>
                <h3 className="text-2xl mb-4 text-slate-800 group-hover:text-primary transition-colors leading-tight font-serif">
                    {product.subtheme || product.name}
                </h3>

                {hasVariants && (
                    <div className="mb-6 space-y-3">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Tamaño Maceta</label>
                            {!selectedVariant && (
                                <span className="text-[9px] font-black text-primary animate-pulse uppercase tracking-widest">Elegir para comprar</span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {validVariants.map((v, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedVariant(v)}
                                    className={`px-4 py-2 rounded-2xl text-[10px] font-black transition-all border-2 ${selectedVariant?.size === v.size
                                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 -translate-y-0.5'
                                        : 'bg-white text-slate-400 border-slate-50 hover:border-primary/20 hover:bg-slate-50'
                                        }`}
                                >
                                    {v.size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed italic pr-4">
                    {product.description}
                </p>

                <div className="mt-auto flex justify-between items-center bg-slate-50 p-5 -mx-1 -mb-1 rounded-[32px] border border-slate-100/50">
                    <div className="flex flex-col">
                        {!selectedVariant && hasVariants && (
                            <span className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Precio desde</span>
                        )}
                        <span className={`text-2xl font-black font-serif transition-all duration-500 ${!selectedVariant && hasVariants ? 'text-slate-300' : 'text-slate-900'}`}>
                            ${priceToDisplay.toLocaleString('es-AR')}
                        </span>
                    </div>
                    <button
                        onClick={handleAdd}
                        className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all duration-500 ${hasVariants && !selectedVariant
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-primary text-white hover:scale-110 active:scale-90 shadow-primary/20'
                            }`}
                        title={hasVariants && !selectedVariant ? 'Selecciona un tamaño' : 'Agregar al carrito'}
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>

            {/* Modal de Zoom */}
            <AnimatePresence>
                {isZoomOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
                        onClick={() => setIsZoomOpen(false)}
                    >
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full z-[1001] transition-colors"
                            onClick={(e) => { e.stopPropagation(); setIsZoomOpen(false); }}
                        >
                            <X size={24} />
                        </motion.button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-[95vw] h-[90vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={allImages[currentImageIndex]}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain shadow-2xl rounded-2xl md:rounded-[32px]"
                            />

                            {allImages.length > 1 && (
                                <>
                                    <div className="absolute inset-x-0 md:inset-x-[-80px] top-1/2 -translate-y-1/2 flex justify-between z-[1002] pointer-events-none">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length); }}
                                            className="w-14 h-14 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 pointer-events-auto"
                                        >
                                            <ChevronLeft size={32} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev + 1) % allImages.length); }}
                                            className="w-14 h-14 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 pointer-events-auto"
                                        >
                                            <ChevronRight size={32} />
                                        </button>
                                    </div>
                                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-[1002] bg-white/10 backdrop-blur-md px-4 py-3 rounded-full">
                                        {allImages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`h-1.5 rounded-full transition-all ${currentImageIndex === idx ? 'bg-white w-6' : 'bg-white/30 w-1.5'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProductCard;
