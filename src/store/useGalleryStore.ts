import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GalleryImage {
    id: string;
    url: string;
    alt?: string;
}

interface GalleryStore {
    images: GalleryImage[];
    addImage: (url: string) => void;
    deleteImage: (id: string) => void;
}

export const useGalleryStore = create<GalleryStore>()(
    persist(
        (set) => ({
            images: [
                { id: '1', url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2070&auto=format&fit=crop' },
                { id: '2', url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=2070&auto=format&fit=crop' },
                { id: '3', url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=2070&auto=format&fit=crop' }
            ],
            addImage: (url) => set((state) => ({
                images: [...state.images, { id: Date.now().toString(), url }]
            })),
            deleteImage: (id) => set((state) => ({
                images: state.images.filter(img => img.id !== id)
            })),
        }),
        { name: 'dos-lidias-gallery' }
    )
);
