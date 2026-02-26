import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminAuthStore {
    isAuthenticated: boolean;
    adminUser: string;
    adminPass: string;
    login: (user: string, pass: string) => boolean;
    logout: () => void;
    updatePassword: (newPass: string) => void;
}

export const useAdminAuthStore = create<AdminAuthStore>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            adminUser: 'doslidias',
            adminPass: 'admin123',
            login: (user, pass) => {
                const { adminUser, adminPass } = get();
                if (user === adminUser && pass === adminPass) {
                    set({ isAuthenticated: true });
                    return true;
                }
                return false;
            },
            logout: () => set({ isAuthenticated: false }),
            updatePassword: (newPass) => set({ adminPass: newPass }),
        }),
        { name: 'dos-lidias-admin-auth' }
    )
);
