import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface StatsStore {
    totalVisits: number;
    visitsToday: number;
    visitsLast7Days: number;
    visitsByDay: { date: string; count: number }[];
    status: 'idle' | 'loading' | 'error';
    trackVisit: (path: string, isAdmin?: boolean) => Promise<void>;
    fetchStats: () => Promise<void>;
}

export const useStatsStore = create<StatsStore>((set) => ({
    totalVisits: 0,
    visitsToday: 0,
    visitsLast7Days: 0,
    visitsByDay: [],
    status: 'idle',

    trackVisit: async (path, isAdmin = false) => {
        try {
            await supabase.from('page_views').insert({
                page_path: path,
                user_agent: navigator.userAgent,
                is_admin: isAdmin
            });
        } catch (err) {
            console.error('Error tracking visit:', err);
        }
    },

    fetchStats: async () => {
        set({ status: 'loading' });
        try {
            // Get all non-admin visits
            const { data, error } = await supabase
                .from('page_views')
                .select('created_at')
                .eq('is_admin', false);

            if (error) throw error;

            const visits = data || [];
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
    }
}));
