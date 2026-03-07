import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface GalleryImage {
    id: string;
    url: string;
    alt?: string;
}

interface GalleryStore {
    images: GalleryImage[];
    status: 'idle' | 'loading' | 'error';
    error: string | null;
    fetchGallery: () => Promise<void>;
    addImage: (url: string) => Promise<void>;
    deleteImage: (id: string) => Promise<void>;
}

export const useGalleryStore = create<GalleryStore>()(
    persist(
        (set) => ({
            images: [],
            status: 'idle',
            error: null,
            fetchGallery: async () => {
                set({ status: 'loading', error: null });
                try {
                    const { data, error } = await supabase
                        .from('gallery')
                        .select('*')
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    set({ images: data || [], status: 'idle' });
                } catch (err: any) {
                    set({ status: 'error', error: err.message });
                }
            },
            addImage: async (url) => {
                set({ status: 'loading', error: null });
                try {
                    const { data, error } = await supabase
                        .from('gallery')
                        .insert([{ url }])
                        .select();

                    if (error) throw error;
                    if (data) {
                        set((state) => ({ images: [data[0], ...state.images], status: 'idle' }));
                    }
                } catch (err: any) {
                    set({ status: 'error', error: err.message });
                    throw err;
                }
            },
            deleteImage: async (id) => {
                set({ status: 'loading', error: null });
                try {
                    const { error } = await supabase
                        .from('gallery')
                        .delete()
                        .eq('id', id);

                    if (error) throw error;
                    set((state) => ({ images: state.images.filter(img => img.id !== id), status: 'idle' }));
                } catch (err: any) {
                    set({ status: 'error', error: err.message });
                    throw err;
                }
            },
        }),
        { name: 'dos-lidias-gallery-v2' }
    )
);
