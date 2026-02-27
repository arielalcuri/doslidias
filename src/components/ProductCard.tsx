import React from 'react';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart } from 'lucide-react';
import { Product } from '../store/useProductStore';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    const [selectedVariant, setSelectedVariant] = React.useState<{ size: string, price: number } | null>(null);

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
            className="card-product flex flex-col h-full bg-white rounded-[40px] p-5 shadow-sm hover:shadow-2xl border border-gray-100 group transition-all duration-500"
        >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] mb-6 shadow-inner bg-slate-50">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                <button
                    onClick={handleAdd}
                    className="absolute bottom-6 right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl text-primary scale-0 group-hover:scale-100 transition-all duration-300 hover:bg-primary hover:text-white hover:rotate-90"
                >
                    <Plus size={28} />
                </button>
            </div>

            <div className="flex-1 flex flex-col px-1">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/60 mb-3 ml-1">
                    {product.category}
                </span>
                <h3 className="text-2xl mb-4 text-slate-800 group-hover:text-primary transition-colors leading-tight font-serif">{product.name}</h3>

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
        </motion.div>
    );
};

export default ProductCard;
