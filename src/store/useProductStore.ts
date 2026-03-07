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
    images?: string[];
    theme?: string;
    subtheme?: string;
    variants?: { size: string, price: number }[];
}

interface ProductStore {
    products: Product[];
    status: 'idle' | 'loading' | 'error';
    error: string | null;
    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, product: Omit<Product, 'id'>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>()(
    persist(
        (set) => ({
            products: [],
            status: 'idle',
            error: null,

            fetchProducts: async () => {
                set({ status: 'loading', error: null });
                try {
                    const { data, error } = await supabase
                        .from('products')
                        .select('*')
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    set({ products: data || [], status: 'idle' });
                } catch (err: any) {
                    set({ status: 'error', error: err.message });
                }
            },

            addProduct: async (product) => {
                set({ status: 'loading', error: null });
                try {
                    const { data, error } = await supabase
                        .from('products')
                        .insert([product])
                        .select();

                    if (error) throw error;
                    if (data) {
                        set((state) => ({
                            products: [data[0], ...state.products],
                            status: 'idle'
                        }));
                    }
                } catch (err: any) {
                    set({ status: 'error', error: err.message });
                    throw err;
                }
            },

            updateProduct: async (id, product) => {
                set({ status: 'loading', error: null });
                try {
                    const { error } = await supabase
                        .from('products')
                        .update(product)
                        .eq('id', id);

                    if (error) throw error;
                    set((state) => ({
                        products: state.products.map(p => p.id === id ? { ...product, id } : p),
                        status: 'idle'
                    }));
                } catch (err: any) {
                    set({ status: 'error', error: err.message });
                    throw err;
                }
            },

            deleteProduct: async (id) => {
                set({ status: 'loading', error: null });
                try {
                    const { error } = await supabase
                        .from('products')
                        .delete()
                        .eq('id', id);

                    if (error) throw error;
                    set((state) => ({
                        products: state.products.filter(p => p.id !== id),
                        status: 'idle'
                    }));
                } catch (err: any) {
                    set({ status: 'error', error: err.message });
                    throw err;
                }
            },
        }),
        { name: 'dos-lidias-products-v3' }
    )
);

