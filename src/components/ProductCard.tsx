import React from 'react';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart } from 'lucide-react';
import { Product } from '../store/useProductStore';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    const [selectedVariant, setSelectedVariant] = React.useState(
        product.variants && product.variants.length > 0 ? product.variants[0] : null
    );

    const priceToDisplay = selectedVariant ? selectedVariant.price : product.price;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-product flex flex-col h-full bg-white rounded-[32px] p-4 shadow-sm hover:shadow-xl border border-gray-50 group transition-all"
        >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] mb-6 shadow-inner bg-slate-50">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <button
                    onClick={() => onAddToCart({
                        ...product,
                        price: priceToDisplay,
                        name: selectedVariant ? `${product.name} - ${selectedVariant.size}` : product.name
                    })}
                    className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-primary scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-primary hover:text-white"
                >
                    <Plus size={24} />
                </button>
            </div>

            <div className="flex-1 flex flex-col px-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">
                    {product.category}
                </span>
                <h3 className="text-xl mb-2 text-text-main group-hover:text-primary transition-colors">{product.name}</h3>

                {product.variants && product.variants.length > 0 && (
                    <div className="mb-4 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Seleccionar Tamaño</label>
                        <div className="flex flex-wrap gap-2">
                            {product.variants.map((v, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedVariant(v)}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all border ${selectedVariant?.size === v.size
                                            ? 'bg-primary text-white border-primary shadow-md'
                                            : 'bg-white text-slate-400 border-slate-100 hover:border-primary/30'
                                        }`}
                                >
                                    {v.size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <p className="text-text-muted text-sm line-clamp-2 mb-4 leading-relaxed italic">
                    {product.description}
                </p>
                <div className="mt-auto flex justify-between items-center bg-slate-50/50 p-4 -mx-2 -mb-2 rounded-2xl">
                    <span className="text-2xl font-bold font-serif text-slate-800">${priceToDisplay.toLocaleString('es-AR')}</span>
                    <button
                        onClick={() => onAddToCart({
                            ...product,
                            price: priceToDisplay,
                            name: selectedVariant ? `${product.name} - ${selectedVariant.size}` : product.name
                        })}
                        className="p-3 text-white bg-primary rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
