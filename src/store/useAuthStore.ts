import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface User {
    id: string;
    name: string;
    lastName: string;
    email: string;
    birthDate: string;
    docType: string;
    docNumber: string;
    otherDocType?: string;
    phone?: string;
    address?: string;
}

interface AuthStore {
    user: User | null;
    profiles: User[];
    status: 'idle' | 'loading' | 'error';
    error: string | null;
    isAuthModalOpen: boolean;
    setAuthModalOpen: (open: boolean) => void;
    login: (email: string, pass: string) => Promise<void>;
    register: (userData: Omit<User, 'id'>, pass: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
    checkUser: () => Promise<void>;
    fetchProfiles: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            profiles: [],
            status: 'idle',
            error: null,
            isAuthModalOpen: false,
            setAuthModalOpen: (open: boolean) => set({ isAuthModalOpen: open, error: null }),
            setUser: (user) => set({ user }),

            checkUser: async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    set({
                        user: {
                            id: user.id,
                            email: user.email || '',
                            name: user.user_metadata.name || '',
                            lastName: user.user_metadata.last_name || '',
                            birthDate: user.user_metadata.birth_date || '',
                            docType: user.user_metadata.doc_type || 'DNI',
                            docNumber: user.user_metadata.doc_number || '',
                            phone: user.user_metadata.phone || '',
                            address: user.user_metadata.address || '',
                        }
                    });
                } else {
                    set({ user: null });
                }
            },

            fetchProfiles: async () => {
                set({ status: 'loading', error: null });
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    console.log(`Fetched ${data?.length || 0} profiles from Supabase.`);
                    set({
                        profiles: (data || []).map(p => ({
                            id: p.id,
                            name: p.name,
                            lastName: p.last_name,
                            email: p.email,
                            birthDate: p.birth_date,
                            docType: p.doc_type,
                            docNumber: p.doc_number,
                            phone: p.phone,
                            address: p.address
                        })),
                        status: 'idle'
                    });
                } catch (err: any) {
                    console.error("Error fetching profiles:", err);
                    set({ status: 'error', error: err.message });
                }
            },

            login: async (email, pass) => {
                set({ status: 'loading', error: null });
                try {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password: pass,
                    });

                    if (error) throw error;

                    if (data.user) {
                        set({
                            user: {
                                id: data.user.id,
                                email: data.user.email || '',
                                name: data.user.user_metadata.name || '',
                                lastName: data.user.user_metadata.last_name || '',
                                birthDate: data.user.user_metadata.birth_date || '',
                                docType: data.user.user_metadata.doc_type || 'DNI',
                                docNumber: data.user.user_metadata.doc_number || '',
                                phone: data.user.user_metadata.phone || '',
                                address: data.user.user_metadata.address || '',
                            },
                            status: 'idle'
                        });
                    }
                } catch (err: any) {
                    set({ status: 'error', error: err.message });
                    throw err;
                }
            },

            register: async (userData, pass) => {
                set({ status: 'loading', error: null });
                try {
                    const { data, error } = await supabase.auth.signUp({
                        email: userData.email,
                        password: pass,
                        options: {
                            data: {
                                name: userData.name,
                                last_name: userData.lastName,
                                birth_date: userData.birthDate,
                                doc_type: userData.docType,
                                doc_number: userData.docNumber,
                                phone: userData.phone,
                                address: userData.address,
                            }
                        }
                    });

                    if (error) throw error;

                    if (data.user) {
                        // Guardar en tabla profiles para visibilidad administrativa
                        try {
                            await supabase.from('profiles').insert({
                                id: data.user.id,
                                name: userData.name,
                                last_name: userData.lastName,
                                email: userData.email,
                                birth_date: userData.birthDate,
                                doc_type: userData.docType,
                                doc_number: userData.docNumber,
                                phone: userData.phone,
                                address: userData.address
                            });
                        } catch (pErr) {
                            console.error("Error saving profile:", pErr);
                        }

                        set({
                            user: {
                                id: data.user.id,
                                ...userData
                            },
                            status: 'idle'
                        });
                    }
                } catch (err: any) {
                    const message = (err.message || '').includes('fetch') || err.name === 'TypeError'
                        ? 'Error de conexión: Revisa tu internet para registrarte.'
                        : err.message;
                    set({ status: 'error', error: message });
                    throw new Error(message);
                }
            },

            logout: async () => {
                await supabase.auth.signOut();
                set({ user: null, status: 'idle', error: null });
            },
        }),
        {
            name: 'dos-lidias-auth-v3',
            partialize: (state) => ({ user: state.user }) // Solo persistimos el usuario
        }
    )
);

