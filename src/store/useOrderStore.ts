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
    fetchOrders: () => Promise<void>;
    addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<string>;
    updateOrderStatus: (id: string, status: string) => Promise<void>;
    updateTrackingNumber: (id: string, trackingNumber: string) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderStore>()(
    persist(
        (set) => ({
            orders: [],
            fetchOrders: async () => {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .order('date', { ascending: false });

                if (data && !error) {
                    const mappedOrders: Order[] = data.map(o => ({
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
                    }));
                    set({ orders: mappedOrders });
                }
            },
            addOrder: async (orderData) => {
                const newId = `ORD-${Math.floor(Math.random() * 800 + 100)}`;
                const newOrder = {
                    id: newId,
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
                };

                const { data, error } = await supabase
                    .from('orders')
                    .insert([newOrder])
                    .select();

                if (error) throw error;
                if (data) {
                    const mapped = {
                        id: data[0].id,
                        customerName: data[0].customer_name,
                        customerLastName: data[0].customer_last_name,
                        customerEmail: data[0].customer_email,
                        customerPhone: data[0].customer_phone,
                        customerAddress: data[0].customer_address,
                        customerDNI: data[0].customer_dni,
                        date: data[0].date,
                        items: data[0].items,
                        total: data[0].total,
                        status: data[0].status,
                        trackingNumber: data[0].tracking_number
                    };
                    set((state) => ({ orders: [mapped, ...state.orders] }));
                }
                return newId;
            },
            updateOrderStatus: async (id, status) => {
                const { error } = await supabase
                    .from('orders')
                    .update({ status })
                    .eq('id', id);

                if (error) throw error;
                set((state) => ({
                    orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
                }));
            },
            updateTrackingNumber: async (id, trackingNumber) => {
                const { error } = await supabase
                    .from('orders')
                    .update({ tracking_number: trackingNumber })
                    .eq('id', id);

                if (error) throw error;
                set((state) => ({
                    orders: state.orders.map(o => o.id === id ? { ...o, trackingNumber } : o)
                }));
            },
            deleteOrder: async (id) => {
                const { error } = await supabase
                    .from('orders')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                set((state) => ({
                    orders: state.orders.filter(o => o.id !== id)
                }));
            },
        }),
        { name: 'dos-lidias-orders-v4' }
    )
);
