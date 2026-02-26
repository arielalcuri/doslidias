import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
    heroTitle: string;
    heroSubtitle: string;
    heroImages: string[];
    whatsapp: string;
    instagram: string;
    storeSubtitle: string;
    isVacationMode: boolean;
    shippingInfo: string;
    shippingStatuses: { id: string, label: string, color: string }[];
    mercadoPagoToken: string;
    mercadoPagoPublicKey: string;
    mercadoPagoDiscount: number;
    bankName: string;
    bankHolder: string;
    bankCBU: string;
    bankAlias: string;
    bankDiscount: number;
}

interface SettingsStore {
    settings: Settings;
    updateSettings: (newSettings: Settings) => void;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            settings: {
                heroTitle: 'Arte sobre macetas',
                heroSubtitle: 'Macetas de barro con diseños exclusivos para cada rincón de tu hogar',
                heroImages: [
                    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2070&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=2070&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=2070&auto=format&fit=crop'
                ],
                whatsapp: '54116543210',
                instagram: 'doslidias.arte',
                storeSubtitle: 'Macetas y objetos de autor. Envíos a todo el país.',
                isVacationMode: false,
                shippingInfo: 'Punto de retiro en Ramos Mejía, Zona Oeste. Para envíos coordinar',
                shippingStatuses: [
                    { id: 'pendiente', label: 'Pendiente', color: 'bg-amber-100 text-amber-700 border-amber-200' },
                    { id: 'embalado', label: 'Pedido Embalado', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                    { id: 'en_camino', label: 'En viaje (En camino)', color: 'bg-primary/20 text-primary border-primary/30' },
                    { id: 'entregado', label: 'Entregado', color: 'bg-green-100 text-green-700 border-green-200' },
                    { id: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-700 border-red-200' }
                ],
                mercadoPagoToken: 'APP_USR-4107290095594184-022512-216a5bee7c2d47d3b2c30940582f8639-113239309',
                mercadoPagoPublicKey: 'APP_USR-1e0680bd-39c1-48e7-b085-be235ccc0330',
                mercadoPagoDiscount: 0,
                bankName: '',
                bankHolder: '',
                bankCBU: '',
                bankAlias: '',
                bankDiscount: 10
            },
            updateSettings: (newSettings) => set({ settings: newSettings }),
        }),
        { name: 'dos-lidias-settings-v5' }
    )
);
