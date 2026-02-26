import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

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
    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, product: Omit<Product, 'id'>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>()(
    persist(
        (set) => ({
            products: [],
            fetchProducts: async () => {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (data && !error) {
                    set({ products: data });
                }
            },
            addProduct: async (product) => {
                const { data, error } = await supabase
                    .from('products')
                    .insert([product])
                    .select();

                if (data && !error) {
                    set((state) => ({ products: [data[0], ...state.products] }));
                }
            },
            updateProduct: async (id, product) => {
                const { error } = await supabase
                    .from('products')
                    .update(product)
                    .eq('id', id);

                if (!error) {
                    set((state) => ({
                        products: state.products.map(p => p.id === id ? { ...product, id } : p)
                    }));
                }
            },
            deleteProduct: async (id) => {
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', id);

                if (!error) {
                    set((state) => ({
                        products: state.products.filter(p => p.id !== id)
                    }));
                }
            },
        }),
        { name: 'dos-lidias-products-v2' }
    )
);
