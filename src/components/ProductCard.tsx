import React from 'react';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart } from 'lucide-react';
import { Product } from '../store/useProductStore';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-product flex flex-col h-full bg-white rounded-[32px] p-4 shadow-sm hover:shadow-xl border border-gray-50 group"
        >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] mb-6">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <button
                    onClick={() => onAddToCart(product)}
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
                <p className="text-text-muted text-sm line-clamp-2 mb-4 leading-relaxed italic">
                    {product.description}
                </p>
                <div className="mt-auto flex justify-between items-center">
                    <span className="text-2xl font-bold font-serif">${product.price.toLocaleString('es-AR')}</span>
                    <button
                        onClick={() => onAddToCart(product)}
                        className="md:hidden p-2 text-primary bg-primary/10 rounded-full"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
