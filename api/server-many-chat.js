const express = require('express');
const axios = require('axios');
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const API_TOKEN = "2489155:2716:51925ad64eb9c3bf510d3aa3beb87fe2061f7cc9";


const createSubscriber = async (phone, name) => {
    try {

        const response = await axios.post(
            "https://api.manychat.com/fb/subscriber/createSubscriber",
            {
                whatsapp_phone: phone,
                first_name: name,
                consent_phrase: "O usuário consentiu em receber mensagens pelo WhatsApp através do formulário."
            },
            {
                headers: {
                    "Authorization": `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data.data.id;
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error.response?.data || error.message);
        return null;
    }
};

const sendMessage = async (subscriberId, message) => {
    try {
        if (!subscriberId) throw new Error("Subscriber ID inválido.");

        await axios.post(
            "https://api.manychat.com/fb/sending/sendContent",
            {
                "subscriber_id": subscriberId,
                "data": {
                    "version": "v2",
                    "content": {
                        "type": "whatsapp_template",
                        "template_name": "welcome_message",
                        "language": {
                            "policy": "deterministic",
                            "code": "pt_BR"
                        },
                        "components": [
                            {
                                "type": "body",
                                "parameters": [
                                    {
                                        "type": "text",
                                        // nome
                                        "text": "João" 
                                    }
                                ]
                            }
                        ]
                    }
                }
            },
            {
                headers: {
                    "Authorization": `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
    }
};

app.post('/webhook', async (req, res) => {
    const { phone, name } = req.body;

    try {
        const subscriberId = await createSubscriber(phone, name);

        if (subscriberId) {
            await sendMessage(subscriberId, "Testando.");
            return res.status(200).send({ success: true, message: "Mensagem enviada com sucesso!" });
        } else {
            return res.status(500).send({ success: false, message: "Erro ao criar o usuário." });
        }

    } catch (error) {
        console.error("Erro no Webhook:", error);
        res.status(500).send({ success: false, message: "Erro ao processar o formulário." });
    }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
