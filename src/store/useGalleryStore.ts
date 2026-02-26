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
    fetchGallery: () => Promise<void>;
    addImage: (url: string) => Promise<void>;
    deleteImage: (id: string) => Promise<void>;
}

export const useGalleryStore = create<GalleryStore>()(
    persist(
        (set) => ({
            images: [],
            fetchGallery: async () => {
                const { data, error } = await supabase
                    .from('gallery')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (data && !error) {
                    set({ images: data });
                }
            },
            addImage: async (url) => {
                const { data, error } = await supabase
                    .from('gallery')
                    .insert([{ url }])
                    .select();

                if (data && !error) {
                    set((state) => ({ images: [data[0], ...state.images] }));
                }
            },
            deleteImage: async (id) => {
                const { error } = await supabase
                    .from('gallery')
                    .delete()
                    .eq('id', id);

                if (!error) {
                    set((state) => ({ images: state.images.filter(img => img.id !== id) }));
                }
            },
        }),
        { name: 'dos-lidias-gallery-v2' }
    )
);
