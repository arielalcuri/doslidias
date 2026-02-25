import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();
app.use(express.json());
app.use(cors());

// Token de producción de Julieta
const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-4107290095594184-022512-216a5bee7c2d47d3b2c30940582f8639-113239309'
});

app.post('/create_preference', async (req, res) => {
    try {
        const { items, orderId, rootUrl } = req.body;

        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: items.map(item => ({
                    title: item.productName,
                    quantity: item.quantity,
                    unit_price: Number(item.price),
                    currency_id: 'ARS'
                })),
                back_urls: {
                    success: `${rootUrl}?status=success&orderId=${orderId}`,
                    failure: `${rootUrl}?status=failure`,
                    pending: `${rootUrl}?status=pending`,
                },
                auto_return: 'approved',
                notification_url: 'https://webhook.site/placeholder', // Opcional para IPN
                external_reference: orderId,
            }
        });

        res.json({ init_point: result.init_point });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la preferencia' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor de pagos corriendo en http://localhost:${PORT}`);
});
