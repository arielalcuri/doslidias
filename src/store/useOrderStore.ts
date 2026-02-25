import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 'pendiente' | 'embalado' | 'en_camino' | 'entregado' | 'cancelado';

export interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerLastName?: string;
    customerPhone?: string;
    customerAddress?: string;
    customerDNI?: string;
    date: string;
    items: { productName: string, quantity: number, price: number }[];
    total: number;
    status: string; // Changed to string to allow dynamic statuses from settings
    trackingNumber?: string;
}

interface OrderStore {
    orders: Order[];
    addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
    updateOrderStatus: (id: string, status: string) => void;
    updateTrackingNumber: (id: string, trackingNumber: string) => void;
    deleteOrder: (id: string) => void;
}

export const useOrderStore = create<OrderStore>()(
    persist(
        (set) => ({
            orders: [
                {
                    id: 'ORD-742',
                    customerName: 'Ariel',
                    customerLastName: 'Rodríguez',
                    customerEmail: 'ariel.dev@gmail.com',
                    customerPhone: '+54 11 5555 1234',
                    customerAddress: 'Calle Falsa 123, CABA',
                    customerDNI: '38123456',
                    date: new Date(Date.now() - 3600000 * 24).toISOString(),
                    items: [
                        { productName: 'Maceta Nóvum 15cm', quantity: 2, price: 4500 },
                        { productName: 'Azul Profundo L', quantity: 1, price: 5200 }
                    ],
                    total: 14200,
                    status: 'pendiente',
                    trackingNumber: ''
                },
                {
                    id: 'ORD-815',
                    customerName: 'Lucía Fernández',
                    customerEmail: 'lucia.f@hotmail.com',
                    customerDNI: '40987654',
                    date: new Date(Date.now() - 3600000 * 48).toISOString(),
                    items: [
                        { productName: 'Combo Dúo Terra', quantity: 1, price: 8900 }
                    ],
                    total: 8900,
                    status: 'en_camino',
                    trackingNumber: 'AR9876543210'
                },
                {
                    id: 'ORD-001',
                    customerName: 'Juan Pérez',
                    customerEmail: 'juan.perez@email.com',
                    customerDNI: '32456789',
                    date: new Date(Date.now() - 3600000 * 12).toISOString(),
                    items: [
                        { productName: 'Maceta Nóvum 15cm', quantity: 1, price: 4500 }
                    ],
                    total: 4500,
                    status: 'pendiente',
                    trackingNumber: ''
                }
            ],
            addOrder: (orderData) => set((state) => ({
                orders: [
                    ...state.orders,
                    {
                        ...orderData,
                        id: `ORD-${Math.floor(Math.random() * 800 + 100)}`,
                        date: new Date().toISOString(),
                        status: 'pendiente'
                    }
                ]
            })),
            updateOrderStatus: (id, status) => set((state) => ({
                orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
            })),
            updateTrackingNumber: (id, trackingNumber) => set((state) => ({
                orders: state.orders.map(o => o.id === id ? { ...o, trackingNumber } : o)
            })),
            deleteOrder: (id) => set((state) => ({
                orders: state.orders.filter(o => o.id !== id)
            })),
        }),
        { name: 'dos-lidias-orders-v3' }
    )
);
