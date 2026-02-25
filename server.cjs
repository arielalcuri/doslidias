const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors());

// Token de producción de Julieta
const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-4107290095594184-022512-216a5bee7c2d47d3b2c30940582f8639-113239309'
});

app.post('/create_preference', async (req, res) => {
    try {
        console.log("Cuerpo recibido:", req.body);
        const { items, orderId, rootUrl = 'http://localhost:5173' } = req.body;

        const preference = new Preference(client);
        const preferenceData = {
            body: {
                items: items.map(item => ({
                    title: item.productName,
                    quantity: parseInt(item.quantity),
                    unit_price: Number(Number(item.price).toFixed(2)),
                    currency_id: 'ARS'
                })),
                back_urls: {
                    success: rootUrl,
                    failure: rootUrl,
                    pending: rootUrl,
                },
                external_reference: orderId,
            }
        };
        console.log("Enviando a MP:", JSON.stringify(preferenceData, null, 2));
        const result = await preference.create(preferenceData);

        res.json({ init_point: result.init_point });
    } catch (error) {
        console.error("Error completo de MP:", JSON.stringify(error, null, 2));
        res.status(500).json({ error: 'Error al crear la preferencia', details: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor de pagos corriendo en http://localhost:${PORT}`);
});
