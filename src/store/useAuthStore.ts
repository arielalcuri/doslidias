import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    allUsers: User[];
    status: 'idle' | 'loading' | 'error';
    isAuthModalOpen: boolean;
    setAuthModalOpen: (open: boolean) => void;
    login: (email: string, pass: string) => Promise<void>;
    register: (userData: Omit<User, 'id'>, pass: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            allUsers: [
                {
                    id: 'u1',
                    name: 'Ariel',
                    lastName: 'Rodríguez',
                    email: 'ariel.dev@gmail.com',
                    birthDate: '1990-05-15',
                    docType: 'DNI',
                    docNumber: '38123456',
                    phone: '+54 11 5555 1234',
                    address: 'Calle Falsa 123, CABA'
                },
                {
                    id: 'u2',
                    name: 'Lucía',
                    lastName: 'Fernández',
                    email: 'lucia.f@hotmail.com',
                    birthDate: '1995-10-20',
                    docType: 'DNI',
                    docNumber: '40987654',
                    phone: '+54 11 2222 3333',
                    address: 'Av. Libertador 456, Olivos'
                }
            ],
            status: 'idle',
            isAuthModalOpen: false,
            setAuthModalOpen: (open: boolean) => set({ isAuthModalOpen: open }),
            login: async (email) => {
                set({ status: 'loading' });
                // Simulación de login - busca en allUsers
                setTimeout(() => {
                    const existingUser = get().allUsers.find(u => u.email === email);
                    if (existingUser) {
                        set({ user: existingUser, status: 'idle' });
                    } else {
                        // Si no existe, creamos uno temporal para la demo
                        const newUser = {
                            id: `u${Math.random()}`,
                            name: 'Usuario',
                            lastName: 'Demo',
                            email,
                            birthDate: '1990-01-01',
                            docType: 'DNI',
                            docNumber: '12345678',
                            phone: '+54 11 0000 0000',
                            address: 'Dirección Demo'
                        };
                        set({
                            user: newUser,
                            allUsers: [...get().allUsers, newUser],
                            status: 'idle'
                        });
                    }
                }, 1500);
            },
            register: async (userData) => {
                set({ status: 'loading' });
                // Simulación de registro
                setTimeout(() => {
                    const newUser = { id: `u${Math.random()}`, ...userData };
                    set((state) => ({
                        user: newUser,
                        allUsers: [...state.allUsers, newUser],
                        status: 'idle'
                    }));
                }, 1500);
            },
            logout: () => set({ user: null }),
        }),
        { name: 'dos-lidias-auth-v2' }
    )
);
