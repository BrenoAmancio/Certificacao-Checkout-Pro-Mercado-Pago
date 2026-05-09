import { MercadoPagoConfig, Preference } from "mercadopago";
import express from "express";
import path from "path";
import dotenv from "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;

const client = new MercadoPagoConfig({
    sandbox: true,
    accessToken: process.env.ACCESS_TOKEN,
    integratorId: "dev_24c65fb163bf11ea96500242ac130004"
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("client/"));

app.get('/', (req, res) => {
res.sendFile(path.join(__dirname + '/index.html'))
});

app.get('/feedback-pending', (req, res) => {
    res.json({
        status: "pending",
        payment_id: req.query.payment_id,
        status: req.query.status,
        external_reference: req.query.external_reference,
        merchant_order_id: req.query.merchant_order_id
    })
})

app.get('/feedback-failure', (req, res) => {
    res.json({
        status: "failure",
        payment_id: req.query.payment_id,
        status: req.query.status,
        external_reference: req.query.external_reference,
        merchant_order_id: req.query.merchant_order_id
    })
})

app.get('/feedback-success', (req, res) => {
    res.json({
        status: "success",
        payment_id: req.query.payment_id,
        status: req.query.status,
        external_reference: req.query.external_reference,
        merchant_order_id: req.query.merchant_order_id
    })
})

app.post("/create-preference", (req, res) => {
    const preference = new Preference(client);

    preference.create({
            body: {
                external_reference: "brenoaaffonso@gmail.com",
                items: [
                    {
                        id: 1234,
                        title: "Produto de teste",
                        description: "Dispositivo de loja de comércio eletrônico móvel",
                        quantity: 1,
                        currency_id: "BRL",
                        unit_price: 10.00,
                        picture_url: 'https://img.quizur.com/f/img5f8e5b745bd285.10956982.jpg?lastEdited=1603165046'
                    }
                ],
                payment_methods: {
                    excluded_payment_methods: [
                        {
                            id: "visa"
                        }
                    ],
                    installments: 6
                },
                notification_url: "https://certificacao-checkout-pro-mercado-pago.onrender.com/feedback",
                back_urls: {
                    success: "https://certificacao-checkout-pro-mercado-pago.onrender.com/feedback-success",
                    failure: "https://certificacao-checkout-pro-mercado-pago.onrender.com/feedback-failure",
                    pending: "https://certificacao-checkout-pro-mercado-pago.onrender.com/feedback-pending"
                },
                auto_return: "approved"
            }
        })
        .then((data) => {
            console.log(data);
            res.status(200).json({
                preferenceId: data.id,
                preferenceUrl: data.init_point,
                preferenceData: data
            })
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: error.message });
        })
})

app.listen(port, () => {
    console.log('API MercadoPago rodando na porta ' + port);
})