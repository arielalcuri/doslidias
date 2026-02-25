import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    image: string;
}

interface ProductStore {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (id: string, product: Omit<Product, 'id'>) => void;
    deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductStore>()(
    persist(
        (set) => ({
            products: [
                {
                    id: '1',
                    name: 'Maceta Nóvum 15cm',
                    price: 4500,
                    category: 'Macetas',
                    description: 'Maceta de barro intervenida con diseños geométricos en blanco y negro.',
                    image: 'https://images.unsplash.com/photo-1599599810753-480998edc414?q=80&w=1974&auto=format&fit=crop'
                },
                {
                    id: '2',
                    name: 'Azul Profundo L',
                    price: 5200,
                    category: 'Macetas',
                    description: 'Maceta grande pintada a mano con degradé azul y detalles en oro.',
                    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=1935&auto=format&fit=crop'
                },
                {
                    id: '3',
                    name: 'Combo Dúo Terra',
                    price: 8900,
                    category: 'Combos',
                    description: 'Set de dos macetas en tonos tierra, ideales para suculentas.',
                    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=2072&auto=format&fit=crop'
                }
            ],
            addProduct: (product) => set((state) => ({
                products: [...state.products, { ...product, id: Math.random().toString(36).substr(2, 9) }]
            })),
            updateProduct: (id, product) => set((state) => ({
                products: state.products.map(p => p.id === id ? { ...product, id } : p)
            })),
            deleteProduct: (id) => set((state) => ({
                products: state.products.filter(p => p.id !== id)
            })),
        }),
        { name: 'dos-lidias-products' }
    )
);
