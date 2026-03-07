import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

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
    status: string;
    trackingNumber?: string;
}

interface OrderStore {
    orders: Order[];
    status: 'idle' | 'loading' | 'error';
    error: string | null;
    fetchOrders: () => Promise<void>;
    addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<string>;
    updateOrderStatus: (id: string, status: string) => Promise<void>;
    updateTrackingNumber: (id: string, trackingNumber: string) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
}

// Helper: Mapper DB -> Frontend
const mapOrderFromDB = (o: any): Order => ({
    id: o.id,
    customerName: o.customer_name,
    customerLastName: o.customer_last_name,
    customerEmail: o.customer_email,
    customerPhone: o.customer_phone,
    customerAddress: o.customer_address,
    customerDNI: o.customer_dni,
    date: o.date,
    items: o.items,
    total: o.total,
    status: o.status,
    trackingNumber: o.tracking_number
});

// Helper: Mapper Frontend -> DB
const mapOrderToDB = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => ({
    customer_name: orderData.customerName,
    customer_last_name: orderData.customerLastName,
    customer_email: orderData.customerEmail,
    customer_phone: orderData.customerPhone,
    customer_address: orderData.customerAddress,
    customer_dni: orderData.customerDNI,
    items: orderData.items,
    total: orderData.total,
    status: 'pendiente',
    tracking_number: ''
});

export const useOrderStore = create<OrderStore>()(
    persist(
        (set) => ({
            orders: [],
            status: 'idle',
            error: null,

            fetchOrders: async () => {
                set({ status: 'loading', error: null });
                try {
                    const { data, error } = await supabase
                        .from('orders')
                        .select('*')
                        .order('date', { ascending: false });

                    if (error) throw error;
                    set({ orders: (data || []).map(mapOrderFromDB), status: 'idle' });
                } catch (err: any) {
                    set({ status: 'error', error: err.message });
                }
            },

            addOrder: async (orderData) => {
                set({ status: 'loading', error: null });
                try {
                    // Generación de ID amigable (Mejorable con DB Sequence en el futuro)
                    const newId = `ORD-${Math.floor(Math.random() * 800 + 100)}`;
                    const dbOrder = {
                        id: newId,
                        ...mapOrderToDB(orderData)
                    };

                    const { data, error } = await supabase
                        .from('orders')
                        .insert([dbOrder])
                        .select();

                    if (error) throw error;

                    if (data) {
                        const mapped = mapOrderFromDB(data[0]);
                        set((state) => ({
                            orders: [mapped, ...state.orders],
                            status: 'idle'
                        }));
                    }
                    return newId;
                } catch (err: any) {
                    set({ status: 'error', error: err.message });
                    throw err;
                }
            },

            updateOrderStatus: async (id, status) => {
                set({ status: 'loading', error: null });
                try {
                    const { error } = await supabase
                        .from('orders')
                        .update({ status })
                        .eq('id', id);

                    if (error) throw error;
                    set((state) => ({
                        orders: state.orders.map(o => o.id === id ? { ...o, status } : o),
                        status: 'idle'
                    }));
                } catch (err: any) {
                    set({ status: 'error', error: err.message });
                    throw err;
                }
            },

            updateTrackingNumber: async (id, trackingNumber) => {
                set({ status: 'loading', error: null });
                try {
                    const { error } = await supabase
                        .from('orders')
                        .update({ tracking_number: trackingNumber })
                        .eq('id', id);

                    if (error) throw error;
                    set((state) => ({
                        orders: state.orders.map(o => o.id === id ? { ...o, trackingNumber } : o),
                        status: 'idle'
                    }));
                } catch (err: any) {
                    set({ status: 'error', error: err.message });
                    throw err;
                }
            },

            deleteOrder: async (id) => {
                set({ status: 'loading', error: null });
                try {
                    const { error } = await supabase
                        .from('orders')
                        .delete()
                        .eq('id', id);

                    if (error) throw error;
                    set((state) => ({
                        orders: state.orders.filter(o => o.id !== id),
                        status: 'idle'
                    }));
                } catch (err: any) {
                    set({ status: 'error', error: err.message });
                    throw err;
                }
            },
        }),
        { name: 'dos-lidias-orders-v5' }
    )
);

