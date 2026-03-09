export default function handler(req, res) {
    const { products, coupon } = req.query;

    // Traducimos la lógica de Java a JavaScript para Vercel
    const productQuantities = {};

    if (products) {
        try {
            // Ejemplo de entrada: "prod123:2,prod456:1"
            const entries = products.split(',');
            entries.forEach(entry => {
                const [id, qty] = entry.split(':');
                if (id && qty) {
                    productQuantities[id] = parseInt(qty);
                }
            });
        } catch (e) {
            console.error("Error al procesar productos del checkout:", e);
        }
    }

    // Respondemos con el formato exacto que Meta espera (igual al código Java)
    res.status(200).json({
        products: productQuantities,
        coupon: coupon || "No coupon applied"
    });
}
