import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jhmepsiyzpmniqnfgsek.supabase.co';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const headers = ['id', 'title', 'description', 'availability', 'condition', 'price', 'link', 'image_link', 'brand', 'google_product_category'];

        const rows = products.map(p => {
            const priceVal = p.variants && p.variants.length > 0
                ? Math.min(...p.variants.filter(v => typeof v.price === 'number').map(v => v.price))
                : (p.price || 0);

            const protocol = req.headers['x-forwarded-proto'] || 'https';
            const host = req.headers['host'];
            const origin = `${protocol}://${host}`;

            const link = `${origin}/?p=${p.id}`;
            const imageLink = p.image || '';
            const desc = (p.description || p.name || '').replace(/"/g, '""').replace(/[\b\f\n\r\t]/g, ' ').trim();

            const quote = (val) => `"${(val || '').toString().replace(/"/g, '""')}"`;

            return [
                quote(p.id),
                quote(p.name),
                quote(desc),
                quote('in stock'),
                quote('new'),
                quote(`${priceVal} ARS`),
                quote(link),
                quote(imageLink),
                quote('Dos Lidias'),
                quote('Home & Garden > Kitchen & Dining > Tableware > Planters')
            ].join(',');
        });

        const csv = [headers.join(','), ...rows].join('\n');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache for 1 hour on Vercel CDN
        res.status(200).send(csv);
    } catch (err) {
        console.error('Catalog Feed Error:', err);
        res.status(500).send(`Error generating catalog: ${err.message}`);
    }
}
