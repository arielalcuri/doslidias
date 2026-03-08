import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useSettingsStore } from './useSettingsStore';

interface StatsStore {
    totalVisits: number;
    visitsToday: number;
    visitsLast7Days: number;
    visitsByDay: { date: string; count: number }[];
    status: 'idle' | 'loading' | 'error';
    trackVisit: (path: string, isAdmin?: boolean) => Promise<void>;
    fetchStats: () => Promise<void>;
    resetStats: () => Promise<void>;
}

export const useStatsStore = create<StatsStore>((set) => ({
    totalVisits: 0,
    visitsToday: 0,
    visitsLast7Days: 0,
    visitsByDay: [],
    status: 'idle',

    trackVisit: async (path, isAdmin = false) => {
        try {
            console.log(`Tracking visit: ${path} (isAdmin: ${isAdmin})`);
            const { error } = await supabase.from('page_views').insert({
                page_path: path,
                user_agent: navigator.userAgent,
                is_admin: isAdmin
            });
            if (error) throw error;
        } catch (err) {
            console.error('Error tracking visit:', err);
        }
    },

    fetchStats: async () => {
        set({ status: 'loading' });
        try {
            const { settings } = useSettingsStore.getState();
            console.log('Fetching stats using reset date:', settings.statsResetDate);

            // Get all non-admin visits
            // Use 'or' to handle is_admin explicitly being false or null
            let query = supabase
                .from('page_views')
                .select('created_at, is_admin');

            // Filter by reset date if present - Using gte to be more inclusive
            if (settings.statsResetDate) {
                query = query.gte('created_at', settings.statsResetDate);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Manual filter for is_admin to be extra sure (handling nulls)
            const visits = (data || []).filter(v => v.is_admin !== true);
            const total = visits.length;

            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];

            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);

            let todayCount = 0;
            let last7DaysCount = 0;
            const dailyMap: Record<string, number> = {};

            // Initialize last 7 days with 0
            for (let i = 0; i < 7; i++) {
                const d = new Date();
                d.setDate(now.getDate() - i);
                dailyMap[d.toISOString().split('T')[0]] = 0;
            }

            visits.forEach(v => {
                const vDate = new Date(v.created_at);
                const vDateStr = vDate.toISOString().split('T')[0];

                if (vDateStr === todayStr) todayCount++;
                if (vDate >= sevenDaysAgo) last7DaysCount++;

                if (dailyMap[vDateStr] !== undefined) {
                    dailyMap[vDateStr]++;
                }
            });

            const visitsByDay = Object.entries(dailyMap)
                .map(([date, count]) => ({ date, count }))
                .sort((a, b) => a.date.localeCompare(b.date));

            console.log(`Fetched ${total} valid visits out of ${data?.length || 0} raw records.`);

            set({
                totalVisits: total,
                visitsToday: todayCount,
                visitsLast7Days: last7DaysCount,
                visitsByDay,
                status: 'idle'
            });
        } catch (err) {
            console.error('Error fetching stats:', err);
            set({ status: 'error' });
        }
    },

    resetStats: async () => {
        set({ status: 'loading' });
        try {
            const { settings, updateSettings } = useSettingsStore.getState();
            const now = new Date(Date.now() - 60000).toISOString(); // Buffer de 1 minuto para evitar skews de reloj

            // Guardar fecha de reseteo en ajustes (Reset Virtual)
            await updateSettings({
                ...settings,
                statsResetDate: now
            });

            // Intento de borrado real (Best effort - por si tiene permisos)
            const { error, count } = await supabase
                .from('page_views')
                .delete({ count: 'exact' })
                .neq('is_admin', true);

            // Incluso si el borrado falla o no tiene permisos, el reset virtual ya funcionó
            if (error) {
                console.warn('Real delete failed, but virtual reset is active.', error);
            }

            console.log(`Métricas reseteadas virtualmente. Borrado real afectó a ${count || 0} registros.`);

            set({
                totalVisits: 0,
                visitsToday: 0,
                visitsLast7Days: 0,
                visitsByDay: [],
                status: 'idle'
            });
            alert(`Métricas reseteadas correctamente. Se estableció la fecha de inicio a partir de ahora.`);
        } catch (err: any) {
            console.error('Error resetting stats:', err);
            set({ status: 'error' });
            alert(`Error al resetear métricas: ${err.message || 'Error de conexión'}`);
        }
    }
}));
